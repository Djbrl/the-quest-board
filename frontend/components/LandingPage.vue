<template>
<div class="min-h-screen min-w-[500px] bg-red-400">
    <LandingHeaderBox/>
    <div class="min-h-[120vh] bg-pink-500 flex flex-col justify-center items-center">
        <div class="sm:w-1/12"></div>
        <!-- main landing container -->
        <div class="w-full sm:w-10/12 bg-white">
            <!-- hero -->
            <div class="bg-yellow-500 h-2/3">
                <LandingHeroBlock class="flex justify-center lg:ml-20"/>
            </div>
            <!-- results -->
            <div class="h-1/3">
                <div class="inline-block mt-4 w-full">
                    <p class="text-xl bg-white text-center font-bold">Recent Quests</p>
                </div>
                <div class="bg-white m-4">
                    <ResultsResultLoader v-if="showLoader"/>
                    <ResultBox v-if="sortEngine.getResultsCount()" :keywords="props.keywords"/>
                </div>
            </div>
        </div>
        <div class="sm:w-1/12"></div>
    </div>
    <LandingMailBox class="sm:p-10 sm:mt-10" />
    <LandingFooterBox />
</div>
</template>

<script setup lang="ts">
import { useResults } from '~/stores/resultsState';

const sortEngine = useResults()
const showLoader = ref(false)
const props = defineProps<{
    keywords: string [];
}>()

const fetchQuests = async () => {
    showLoader.value = true;
    await new Promise(resolve => setTimeout(resolve, 1000));
    try {
        const res:any = await fetch("http://localhost:3001/getQuests")
        showLoader.value = false;
        const data = await res.json()
        if (data.length > 0){
            sortEngine.setResults(data)
        }
    } catch (error) {
        console.log("fetch failed")
        showLoader.value = false
    }
}

onMounted(async () => {
    await fetchQuests()
})
</script>

<style>
    .animate-gradientShift {
        animation: gradientShift 1s infinite;
        background-size: 200% 200%;
    }
</style>