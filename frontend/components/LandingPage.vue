<template>
<div class="min-h-screen min-w-[550px] bg-stone-900 ">
    <LandingHeaderBox/>
    <div class="min-h-[90vh] justify-center mb-40 items-center">
        <!-- main landing container -->
        <div class="w-[90vw] mx-auto sm:border-x sm:border-b border-stone-700 p-4">
            <!-- hero -->
            <div class="w-full h-2/3">
                <LandingHeroBlock class="flex justify-center"/>
            </div>
            <!-- results -->
            <div class="h-1/3 w-10/12 mx-auto">
                <ResultsResultLoader v-show="showLoader"/>
                <div v-if="showNoResults" class="inline-block flex flex-col justify-center">
                    <p class="mt-4 text-center px-2 py-1 text-stone-300 font-pixel text-3xl">No results.</p>
                    <p class="text-center px-2 py-1 text-stone-300 text">There might be an issue in the back, try <span class="italic">refreshing</span> or come back in a bit.</p>
                </div>
                <div v-if="sortEngine.getResultsCount()" class="sm:border sm:border-stone-700 m-4">
                    <ResultBox :keywords="props.keywords"/>
                </div>
            </div>
        </div>
    </div>
    <LandingMailBox class=" sm:mt-10" />
    <LandingFooterBox />
</div>
</template>

<script setup lang="ts">
import { useResults } from '~/stores/resultsState';

const sortEngine = useResults()
const showLoader = ref(false)
const showNoResults = ref(false)
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
        console.log(data)
        if (data.length > 0){
            sortEngine.setResults(data)
        } else {
            showNoResults.value = true
            showLoader.value = false
        }
    } catch (error) {
        console.log("fetch failed")
        showNoResults.value = true
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