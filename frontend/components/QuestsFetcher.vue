<template>
    <div class="rounded-lg px-2 py-1 bg-black text-purple-500 font-bold m-3 hover:cursor-pointer" @click="fetchQuest">
        hi im the quests fetcher
    </div>
    <p v-if="showLoader" class="bg-purple-500 text-black font-bold px-2 py-1 rounded-lg">fetching...</p>
</template>

<script setup lang="ts">

    const showLoader = ref(false)
    const fetchQuest = async () => {
        showLoader.value = true;
        const res:any = await fetch("http://localhost:3001/getQuests")
        showLoader.value = false;
        console.log(await res.json())
    }

</script>