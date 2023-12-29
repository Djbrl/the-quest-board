<template>
    <div class="bg-white px-2 py-2 m-2 flex rounded-lg border-4 border-zinc-200">
        <div class="my-auto w-4/5">
            <p @click="goToPost(props.result.url)" class="font-semibold hover:underline text-xl hover:cursor-pointer">{{ props.result.title }}</p>
            <p class="text-xs">{{ props.result.subreddit }}</p>
            <div class="flex text-sm my-2">
                <p>{{ props.result.comments }} comments</p>
                <p class="mx-2">{{ props.result.upvotes }} upvotes</p>
            </div>
        </div>
        <div class="inline-block ml-auto">
            <p class="text-xs text-white font-semibold bg-violet-600/80 my-auto mr-auto rounded-full px-2 py-1">{{ props.result.date }}</p>
            <p v-if="isHotGig(props.result.timestamp, props.result.comments)" class="text-xs text-white font-semibold inline-block bg-pink-500 my-auto mr-auto rounded-full px-2 py-1">Hot Gig</p>
        </div>
    </div>
</template>

<script setup lang="ts">
import { isHotGig, goToPost } from '~/composables/utils';
const props = defineProps<{
    result: any;
}>()
</script>