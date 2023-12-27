<template>
<div class="min-h-screen min-w-[500px] bg-red-400">
    <HeaderBox />
    <div class="min-h-[80vh] flex flex-col justify-center items-center">
        <div class="sm:w-1/12"></div>
        <!-- main landing container -->
        <div class="w-full sm:w-10/12 bg-white">
            <!-- hero -->
            <div class="bg-yellow-500 h-2/3">
                <HeroBlock class="flex justify-center lg:ml-20"/>
            </div>
            <!-- results -->
            <div class="h-1/3">
                <div class="inline-block mt-4 w-full">
                    <p class="text-xl bg-white text-center font-bold">Recent Quests</p>
                </div>
                <div class="bg-white m-4">
                    <ResultLoader v-if="showLoader"/>
                    <ResultBox v-if="results.length" :keywords="props.keywords" :results="sortedResults" :fetchQuests="fetchQuests"/>
                </div>
            </div>
        </div>
        <div class="sm:w-1/12"></div>
    </div>
    <MailBox class="sm:p-10 sm:mt-10" />
    <FooterBox />
</div>
</template>

<script setup lang="ts">

const props = defineProps<{
keywords: string [];
}>()

const showLoader = ref(false)
const results = ref([])
const sortedResults = ref([])

const fetchQuests = async () => {
    showLoader.value = true;
    await new Promise(resolve => setTimeout(resolve, 1000));
    try {
        const res:any = await fetch("http://localhost:3001/getQuests")
        showLoader.value = false;
        const data = await res.json()
        if (data.length > 0){
            sortedResults.value = data;
            results.value = data;
        }
    } catch (error) {
        console.log("fetch failed")
        showLoader.value = false
    }
}

onMounted(async () => {
    console.log("fetching results...")
    await fetchQuests()
    console.log("jobs done")
})

</script>

<style>
/* YourComponent.vue or global stylesheet */
.animate-gradientShift {
  animation: gradientShift 1s infinite;
  background-size: 200% 200%;
}

</style>