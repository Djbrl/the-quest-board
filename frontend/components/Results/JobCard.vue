<template>
    <div @click="goToPost(props.result.url)" class="group px-2 py-2 m-2 hover:bg-stone-800 hover:cursor-pointer flex border border-stone-700">
        <div class="min-w-2 bg-stone-300 mr-3 opacity-0 group-hover:opacity-100 transition-opacity"></div>
        <div class="my-auto w-3/5">
            <p @click="goToPost(props.result.url)" class="font-semibold text-stone-300 hover:text-stone-200 inline-block text-xl font-switzer hover:cursor-pointer">{{ props.result.title }}</p>
            <p class="text-xs text-stone-400">{{ props.result.subreddit[0] }}</p>
            <div class="flex text-xs text-stone-400 my-2">
                <p><span class="font-bold text-stone-300">{{ props.result.upvotes }}</span> upvotes</p>
                <p class="mx-2"><span class="font-bold text-stone-300">{{ props.result.comments }}</span> comments</p>
            </div>
        </div>
        <div class="inline-block ml-auto">
            <p v-if="isHotGig(props.result.timestamp, props.result.comments)" class="text-xs font-semibold inline-block text-pink-400 border border-stone-600 my-auto mr-auto px-2 py-1">Hot Gig</p>
            <p class="text-xs font-bold text-emerald-400 border border-stone-600 my-auto mr-auto px-2 py-1">{{ props.result.date }}</p>
        </div>
    </div>
</template>

<script setup lang="ts">
import { isHotGig, goToPost } from '~/composables/utils';
const props = defineProps<{
    result: any;
}>()

</script>