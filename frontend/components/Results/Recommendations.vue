<template>
    <div class="flex justify-center text-stone-300 mt-5 text-xs my-auto">
        <p @click="pickCurrentSort('today')" :class="{ 'px-2 py-1 text-stone-200 mx-1 border border-stone-700 hover:cursor-pointer': currentSort === 'today', 'px-2 py-1 mx-1 hover:text-stone-400 border border-stone-700/10 hover:cursor-pointer': currentSort !== 'today'}">Today</p>
        <p @click="pickCurrentSort('trending')" :class="{ 'px-2 py-1 mx-1 text-stone-200 border border-stone-700 hover:cursor-pointer': currentSort === 'trending', 'px-2 py-1 mx-1 hover:text-stone-400 border border-stone-700/10 hover:cursor-pointer': currentSort !== 'trending' }">Trending</p>
        <p @click="pickCurrentSort('lastHour')" :class="{ 'px-2 py-1 mx-1 text-stone-200 border border-stone-700 hover:cursor-pointer': currentSort === 'lastHour', 'px-2 py-1 mx-1 hover:text-stone-400 border border-stone-700/10 hover:cursor-pointer': currentSort !== 'lastHour' }">Last hour</p>
        <p @click="pickCurrentSort('all')" :class="{ 'px-2 py-1 mx-1 text-stone-200 border border-stone-700 hover:cursor-pointer': currentSort === 'all', 'px-2 py-1 mx-1 hover:text-stone-400 border border-stone-700/10 hover:cursor-pointer': currentSort !== 'all' }">All</p>
    </div>
    <input v-model="searchQuery" ref="searchInput" @keyup.enter="updateResults(searchQuery)" class="my-4 px-4 py-2 flex inline-block text-sm bg-stone-900 w-80 border border-stone-700 outline-none placeholder-stone-500 text-stone-400 mx-auto" placeholder="Search by keyword" />
    <div v-if="showNoResults" class="inline-block flex flex-col justify-center">
        <p class="text-center px-2 py-1 text-stone-300 font-pixel text-3xl">No results.</p>
        <p class="text-center px-2 py-1 text-stone-300 text">There might be an issue in the back, try <span class="italic">refreshing</span> or come back in a bit.</p>
    </div>
    <div class="flex justify-center inline-block">
        <p class="text-xs text-stone-500 px-4 py-1 text-center hover:cursor-pointer hover:text-stone-300 underline"
           @mouseover="showTooltip = true"
           @mouseout="showTooltip = false">
          Why are you some results missing?
        </p>
    </div>
    <div class="relative bg-red-500 inline-block flex justify-center max-w-[300px] mx-auto">
        <div v-show="showTooltip" class="absolute bottom-[-170px] left-[100px] bg-stone-900 border border-stone-700 text-stone-300 p-3">
          <!-- Tooltip content goes here -->
        <p class="text-xs"><span class="font-bold">thequestboard</span> only displays SFW results that are relevant to digital and traditional artists. Posts that pertain to graphic design, UX/UI, writing and that are tagged as NSFW aren't included. Additionally incorrectly titled posts cannot be detected by our algorithm.</p>
        </div>
    </div>
    <!-- <div class="flex justify-center">
        <div v-for="keyword in sortEngine.getTop5KeywordMatches(props.keywords)" class="">
            <p @click="updateResults(keyword)" class="px-2 py-1 mx-1 hover:cursor-pointer text-stone-300 hover:text-stone-400 inline-block text-xs"> {{ keyword }}</p>
        </div>
    </div> -->
    <!-- <p class="text-xs text-zinc-500 text-center my-2">Suggestions based on your profile</p> -->
</template>

<script setup lang="ts">
import { useResults } from '#imports';
const currentSort = ref('all')
const searchQuery = ref('')
const showNoResults = ref(false)
const showTooltip = ref(false)
const props = defineProps<{
    keywords: Array<string>,
}>()

const sortEngine = useResults()

const updateResults = (query:string) => {
    if (query === ''){
        return ;
    }
    currentSort.value = ''
    const res = sortEngine.getKeywordOccurence(query)
    if (res.length === 0) {
        showNoResults.value = true;
        sortEngine.setVisibleResults(res)
        return ;
    }
    showNoResults.value = false;
    sortEngine.setVisibleResults(res)
    searchQuery.value = ''
}

const pickCurrentSort = (sort:string) => {
    if (sort === 'all'){
        currentSort.value = 'all'
        sortEngine.getAll()
    } else if (sort === 'today') {
        currentSort.value = 'today'
        sortEngine.getToday()
    } else if (sort === 'trending') {
        currentSort.value = 'trending'
        sortEngine.getTrending()
    } else if (sort === 'lastHour') {
        currentSort.value = 'lastHour'
        sortEngine.getLastHour()
    }
}

</script>