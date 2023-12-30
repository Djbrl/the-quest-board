<template>
    <!-- Recoommendations engine -->
    <div @click="resetVisibleResults">
        <ResultsRecommendations :keywords="props.keywords"/>
    </div>
    <div class="rounded-lg p-2 bg-blue-400/10">
        <div v-for="result in sortEngine.getVisibleResults()">
            <ResultsJobCard :result="result"/>
        </div>
        <ResultsResultLoader v-if="showLoader"/>
        <ResultsMoreResultsLoader v-if="showMoreLoader" />
    </div>
</template>
<!-- look into having a stylish scroller and a -->
<script setup lang="ts">
import { useResults } from '~/stores/resultsState';

const props = defineProps<{ keywords: string[]; }>()
const sortEngine = useResults()

const searchInput = ref<HTMLInputElement | null>(null);

const showMoreLoader = ref(false)
const showLoader = ref(false)
const lastScrollY = ref(0);

let startIndex = 0;

const resetVisibleResults = () => {
    const sortedResults = sortEngine.getSortedResults()
    sortEngine.setVisibleResults([])
    if (sortedResults.length > 10){
        sortEngine.setVisibleResults(sortEngine.getSortedResults().slice(0, 10));
    } else {
        sortEngine.setVisibleResults(sortEngine.getSortedResults());
    }
    startIndex = 10;
}

onMounted(() => {
    showMoreResults();
    window.addEventListener('scroll', handleScroll);
    if (searchInput.value !== null){
        searchInput.value.focus()
    }
});

onBeforeUnmount(() => {
    window.removeEventListener('scroll', handleScroll);
});

const showMoreResults = () => {
    const endIndex = startIndex + 10;
    const currentVisibleResults = sortEngine.getVisibleResults()
    sortEngine.setVisibleResults([...currentVisibleResults, ...sortEngine.getSortedResults().slice(startIndex, endIndex)]);
    startIndex = endIndex;
}

const handleScroll = async () => {
    const scrollY = window.scrollY;
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;
    const scrollingDown = scrollY > lastScrollY.value;
    const currentVisibleResults = sortEngine.getVisibleResults()

    lastScrollY.value = scrollY;
    if ((scrollingDown && scrollY + windowHeight >= documentHeight) || (!scrollingDown && scrollY <= 200)) {
        if (currentVisibleResults.length < sortEngine.getSortedResults().length) {
            showMoreLoader.value = true;
            await new Promise((resolve) => setTimeout(resolve, 1000));
            showMoreLoader.value = false;
            showMoreResults();
        }
    }
};


</script>
