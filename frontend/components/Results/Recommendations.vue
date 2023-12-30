<template>
    <div class="flex justify-center mb-4 text-xs my-auto">
        <p @click="pickCurrentSort('today')" :class="{ 'bg-zinc-300 rounded-full px-2 py-1 mx-1 hover:cursor-pointer hover:bg-zinc-300': currentSort === 'today' }" class="bg-zinc-200 rounded-full px-2 py-1 mx-1 hover:cursor-pointer hover:bg-zinc-300">Today</p>
        <p @click="pickCurrentSort('trending')" :class="{ 'bg-zinc-300 rounded-full px-2 py-1 mx-1 hover:cursor-pointer hover:bg-zinc-300': currentSort === 'trending' }" class="bg-zinc-200 rounded-full px-2 py-1 mx-1 hover:cursor-pointer hover:bg-zinc-300">Trending</p>
        <p @click="pickCurrentSort('lastHour')" :class="{ 'bg-zinc-300 rounded-full px-2 py-1 mx-1 hover:cursor-pointer hover:bg-zinc-300': currentSort === 'lastHour' }" class="bg-zinc-200 rounded-full px-2 py-1 mx-1 hover:cursor-pointer hover:bg-zinc-300">Last hour</p>
        <p @click="pickCurrentSort('all')" :class="{ 'bg-zinc-300 rounded-full px-2 py-1 mx-1 hover:cursor-pointer hover:bg-zinc-300': currentSort === 'all' }" class="bg-zinc-200 rounded-full px-2 py-1 mx-1 hover:cursor-pointer hover:bg-zinc-300">All</p>
    </div>
    <input v-model="searchQuery" ref="searchInput" @keyup.enter="updateResults(searchQuery)" class="my-4 px-4 py-2 autofocus flex inline-block text-sm bg-stone-200 rounded-full outline-none placeholder-stone-500 mx-auto" placeholder="Search by keyword" />
    <div class="flex justify-center">
        <div v-for="keyword in sortEngine.getTop5KeywordMatches(props.keywords)" class="">
            <p @click="updateResults(keyword)" class="bg-zinc-200 rounded-full px-2 py-1 mx-1 hover:cursor-pointer hover:bg-zinc-300 inline-block text-xs"> {{ keyword }}</p>
        </div>
    </div>
    <p class="text-xs text-zinc-500 text-center my-2">Suggestions based on your profile</p>
</template>

<script setup lang="ts">
import { useResults } from '#imports';
const currentSort = ref('all')
const searchQuery = ref('')
const props = defineProps<{
    keywords: Array<string>,
}>()

const sortEngine = useResults()

const updateResults = (searchQuery:string) => {
    if (searchQuery === ''){
        return ;
    }
    sortEngine.setVisibleResults([])
    sortEngine.setVisibleResults(sortEngine.getKeywordOccurence(searchQuery))
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