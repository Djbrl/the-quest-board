<template>
<div class="flex justify-center mb-4 text-xs my-auto">
    <p @click="sortBy('Today')" class="bg-zinc-200 rounded-full px-2 py-1 mx-1 hover:cursor-pointer hover:bg-zinc-300">Today</p>
    <p @click="sortBy('Trending')" class="bg-zinc-200 rounded-full px-2 py-1 mx-1 hover:cursor-pointer hover:bg-zinc-300">Trending</p>
    <p @click="sortBy('Recent')" class="bg-zinc-200 rounded-full px-2 py-1 mx-1 hover:cursor-pointer hover:bg-zinc-300">Last hour</p>
    <p @click="sortBy('Default')" class="bg-zinc-200 rounded-full px-2 py-1 mx-1 hover:cursor-pointer hover:bg-zinc-300">All</p>
</div>

<input
    v-model="searchQuery"
    ref="searchInput"
    @keyup.enter="findMatchesForKeyword(searchQuery)"
    class="my-4 px-4 py-2 autofocus flex inline-block text-sm bg-stone-200 rounded-full outline-none placeholder-stone-500 mx-auto"
    placeholder="Search by keyword"
/>

<div class="flex justify-center">
    <div v-for="keyword in getTopArtFreelancerKeywords()" class="">
        <p class="bg-zinc-200 rounded-full px-2 py-1 mx-1 hover:cursor-pointer hover:bg-zinc-300 inline-block text-xs"> {{ keyword }}</p>
    </div>
</div>

<p class="text-xs text-zinc-500 text-center my-2">Suggestions based on your profile</p>
<div v-for="(result, index) in visibleResults" :key="index">
    <div class="bg-white px-2 py-2 m-2 flex rounded-lg border-4 border-zinc-200">
        <div class="my-auto w-4/5">
            <p @click="goToPost(result.url)" class="font-semibold hover:underline text-xl hover:cursor-pointer">{{ result.title }}</p>
            <p class="text-xs">{{ result.subreddit }}</p>
            <div class="flex text-sm my-2">
                <p>{{ result.comments }} comments</p>
                <p class="mx-2">{{ result.upvotes }} upvotes</p>
            </div>
        </div>
        <div class="inline-block ml-auto">
            <p class="text-xs text-white font-semibold bg-violet-600/80 my-auto mr-auto rounded-full px-2 py-1">{{ result.date }}</p>
            <p v-if="isHotGig(result.timestamp, result.comments)" class="text-xs text-white font-semibold inline-block bg-pink-500 my-auto mr-auto rounded-full px-2 py-1">Hot Gig</p>
        </div>
    </div>
</div>
<ResultLoader v-if="showLoader"/>
</template>

<script setup lang="ts">

const props = defineProps<{
results: any[];
fetchQuests: Function;
keywords: string[];
}>()

const searchInput = ref<HTMLInputElement | null>(null);
const searchQuery = ref('');
const visibleResults = ref<any[]>([]);
const resultsPerPage = 10;
const showLoader = ref(false)
const currentSelection = ref<any[]>([]);
const lastScrollY = ref(0);

let startIndex = 0;

onMounted(() => {
currentSelection.value = props.results;
showMore(); // Initial load
window.addEventListener('scroll', handleScroll);
if (searchInput.value !== null){
    searchInput.value.focus()
}
});

onBeforeUnmount(() => {
// Remove scroll event listener when the component is unmounted
window.removeEventListener('scroll', handleScroll);
});

const showMore = () => {
    console.log("value of strat", startIndex)
const endIndex = startIndex + resultsPerPage;
visibleResults.value = [...visibleResults.value, ...currentSelection.value.slice(startIndex, endIndex)];
startIndex = endIndex;
}

const goToPost = (url: string) => {
window.open(`https://reddit.com${url}`, '_blank');
}

const isHotGig = (timestamp: string, comments: string) => {
const now = Date.now();
const seconds = Math.floor((now - parseInt(timestamp)) / 1000);
if (seconds < 3600 && parseInt(comments) >= 15) return true;
if (seconds >= 3600 && seconds < 3600 * 4 && parseInt(comments) >= 50) return true;
return false;
}

const handleScroll = async () => {
  const scrollY = window.scrollY;
  const windowHeight = window.innerHeight;
  const documentHeight = document.documentElement.scrollHeight;

  // Determine scrolling direction
  const scrollingDown = scrollY > lastScrollY.value;
  lastScrollY.value = scrollY;

  // Load more results when the user is near the bottom or top of the page
  if (
    (scrollingDown && scrollY + windowHeight >= documentHeight) ||
    (!scrollingDown && scrollY <= 20)
  ) {
    if (visibleResults.value.length < currentSelection.value.length) {
      // Only show the loader if there are more results to load
      showLoader.value = true;
      await new Promise((resolve) => setTimeout(resolve, 1000));
      showLoader.value = false;
      showMore();
    }
  }
};


const sortBy = (time:string) => {
    startIndex = 0
    if (time === 'Today') {
        const res = props.results.filter((job:any) => job.date.includes('hours'||'hour'||'minutes'))
        visibleResults.value = res.slice(0,10)
        currentSelection.value = res
    } else if (time === 'Recent') {
        const res = props.results.filter((job:any) => job.date.includes('minutes'||'hour'))
        visibleResults.value = res.slice(0,10)
        currentSelection.value = res
    } else if (time === 'Trending') {
        const res = props.results.filter((job:any) => job.comments > 20 && job.date.includes('hour'||'minutes'||'hours'||'day'))
        visibleResults.value = res.slice(0,10)
        currentSelection.value = res
    } else if (time === 'Default') {
        visibleResults.value = props.results.slice(0, 10)
        currentSelection.value = props.results
    }
}

const findMatchesForKeyword = (keyword:string) => {
    if (keyword === ''){
        return ;
    }
    const res = props.results.filter(result => result.title.includes(keyword))
    if (res.length > 0){
        visibleResults.value = res;
    }
    else {
        //no results div
    }
    return ;
}

const getTopArtFreelancerKeywords = () => {
  const keywordCounts: Record<string, number> = {};

  // Count the occurrences of each keyword in titles
  props.results.forEach((result) => {
    const title = result.title.toLowerCase(); // Convert to lowercase for case-insensitive comparison
    props.keywords.forEach((keyword) => {
      if (title.includes(keyword.toLowerCase())) {
        keywordCounts[keyword] = (keywordCounts[keyword] || 0) + 1;
      }
    });
  });

  // Sort keywords by count in descending order
  const sortedKeywords = Object.keys(keywordCounts).sort(
    (a, b) => keywordCounts[b] - keywordCounts[a]
  );

  // Return the top 5 keywords
  return sortedKeywords.slice(0, 5);
}

</script>
