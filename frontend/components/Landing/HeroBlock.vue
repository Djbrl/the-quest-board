<template>
<div class="mt-10 mx-20 mx-auto">
    <p class="font-bold text-3xl mx-4 my-5 text-zinc-300">Quests Available<span class="font-bold mx-2 text-4xl border-2 border-zinc-300 py-1 px-2 rounded-lg inline-block text-zinc-300">{{sortEngine.getResultsCount() }}</span></p>
    <div class="p-5 border rounded-[40px] border-stone-700 ">
        <LandingAnimatedSubList class="my-auto ml-10 md:ml-5 hidden md:flex"/>
    </div>
</div>
</template>

<script setup lang="ts">
const sortEngine = useResults()

</script>

