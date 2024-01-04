<template>
    <!-- Recoommendations engine -->
    <div @click="resetVisibleResults">
        <ResultsRecommendations :keywords="props.keywords"/>
    </div>
    <div class="p-2">
        <div v-for="result in sortEngine.getVisibleResults()">
            <ResultsJobCard :result="result"/>
        </div>
        <ResultsResultLoader class="mb-3 mt-5" v-if="showLoader"/>
        <div class="flex justify-center">
            <p @click="loadMoreResults()" v-if="showMore" class="text-stone-300 border hover:cursor-pointer hover:bg-stone-800 border-stone-700 px-2 py-1 mx-auto inline-block">More Results</p>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useResults } from '~/stores/resultsState';

const props = defineProps<{ keywords: string[]; }>()
const sortEngine = useResults()

const searchInput = ref<HTMLInputElement | null>(null);

const showMore = ref(false)
const showLoader = ref(false)

let startIndex = 0;

const resetVisibleResults = () => {
    const sortedResults = sortEngine.getSortedResults()
    sortEngine.setVisibleResults([])
    if (sortedResults.length > 10){
        sortEngine.setVisibleResults(sortedResults.slice(0, 10));
    } else {
        sortEngine.setVisibleResults(sortedResults);
    }
    if (sortEngine.getVisibleResults().length >= sortedResults.length) {
        showMore.value = false
     } else showMore.value = true;
    startIndex = 10;
}

onMounted(() => {
    showMoreResults();
    if (searchInput.value !== null){
        searchInput.value.focus()
    }
});

onBeforeUnmount(() => {
});

const showMoreResults = () => {
    const endIndex = startIndex + 15;
    const currentVisibleResults = sortEngine.getVisibleResults()
    sortEngine.setVisibleResults([...currentVisibleResults, ...sortEngine.getSortedResults().slice(startIndex, endIndex)]);
    startIndex = endIndex;
    if (endIndex > sortEngine.getSortedResults().length){
        showMore.value = false
    } else {
        showMore.value = true
    }
}

const loadMoreResults = async () => {
    showMore.value = false;
    showLoader.value = true;
    await new Promise((resolve) => setTimeout(resolve, 1000));
    showLoader.value = false;
    showMoreResults();
}


</script>
