<template>
    <div class="flex justify-center mb-4 text-xs my-auto">
        <p @click="sortEngine.getToday()" class="bg-zinc-200 rounded-full px-2 py-1 mx-1 hover:cursor-pointer hover:bg-zinc-300">Today</p>
        <p @click="sortEngine.getTrending()" class="bg-zinc-200 rounded-full px-2 py-1 mx-1 hover:cursor-pointer hover:bg-zinc-300">Trending</p>
        <p @click="sortEngine.getLastHour() " class="bg-zinc-200 rounded-full px-2 py-1 mx-1 hover:cursor-pointer hover:bg-zinc-300">Last hour</p>
        <p @click="sortEngine.getAll()" class="bg-zinc-200 rounded-full px-2 py-1 mx-1 hover:cursor-pointer hover:bg-zinc-300">All</p>
    </div>
    <input v-model="searchQuery" ref="searchInput" @keyup.enter="sortEngine.getKeywordOccurence(searchQuery)" class="my-4 px-4 py-2 autofocus flex inline-block text-sm bg-stone-200 rounded-full outline-none placeholder-stone-500 mx-auto" placeholder="Search by keyword" />
    <div class="flex justify-center">
        <div v-for="keyword in sortEngine.getTop5KeywordMatches(props.keywords)" class="">
            <p class="bg-zinc-200 rounded-full px-2 py-1 mx-1 hover:cursor-pointer hover:bg-zinc-300 inline-block text-xs"> {{ keyword }}</p>
        </div>
    </div>
    <p class="text-xs text-zinc-500 text-center my-2">Suggestions based on your profile</p>
</template>

<script setup lang="ts">
import { useResults } from '#imports';

const searchQuery = ref('')
const props = defineProps<{
    keywords: Array<string>
}>()

const sortEngine = useResults()

</script>