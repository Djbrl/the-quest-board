<template>
    <div @click="goToPost(props.result.permalink)" class="group px-2 py-2 m-2 hover:bg-stone-800 hover:cursor-pointer rounded-lg border border-stone-700">
        <p class="text-xs font-bold text-emerald-400 border rounded-lg border-stone-600 my-auto mr-auto px-2 py-2">{{ timeAgo(props.result.created_utc) }}</p>
        <p class="text-xs text-stone-400 px-2 py-1 ">r/{{ props.result.subreddit }}</p>
        <div class="flex text-xs text-stone-400 px-2 mb-4">
            <p><span class="font-bold text-stone-300">{{ props.result.score }}</span> upvotes</p>
            <p class="mx-2"><span class="font-bold text-stone-300">{{ props.result.num_comments }}</span> comments</p>
        </div>
        <div class="my-auto mx-auto w-4/5">
            <p @click="goToPost(props.result.permalink)" class="font-semibold text-stone-300 text-center hover:text-stone-200 inline-block text-base font-switzer hover:cursor-pointer">{{ props.result.title }}</p>
        </div>
        <div class="flex mt-3 justify-center items-center">
          <div>
            <p v-if="isHotGig(props.result.created_utc, props.result.num_comments)" class="text-xs font-semibold inline-block text-pink-400 border border-stone-600 my-auto mr-auto px-2 py-1">Hot Gig</p>
          </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { isHotGig, goToPost } from '~/composables/utils';
const props = defineProps<{
    result: any;
}>()

function timeAgo(timestamp:number) {
  const currentTimestamp = Math.floor(Date.now() / 1000); // Convert milliseconds to seconds
  const seconds = currentTimestamp - timestamp;

  const minute = 60;
  const hour = minute * 60;
  const day = hour * 24;
  const week = day * 7;
  const month = day * 30;
  const year = day * 365;

  if (seconds < minute) {
    return seconds + ' seconds ago';
  } else if (seconds < hour) {
    const minutes = Math.floor(seconds / minute);
    return minutes === 1 ? 'a minute ago' : minutes + ' minutes ago';
  } else if (seconds < day) {
    const hours = Math.floor(seconds / hour);
    return hours === 1 ? 'an hour ago' : hours + ' hours ago';
  } else if (seconds < week) {
    const days = Math.floor(seconds / day);
    return days === 1 ? 'a day ago' : days + ' days ago';
  } else if (seconds < month) {
    const weeks = Math.floor(seconds / week);
    return weeks === 1 ? 'a week ago' : weeks + ' weeks ago';
  } else if (seconds < year) {
    const months = Math.floor(seconds / month);
    return months === 1 ? 'a month ago' : months + ' months ago';
  } else {
    const years = Math.floor(seconds / year);
    return years === 1 ? 'a year ago' : years + ' years ago';
  }
}


</script>