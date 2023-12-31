<template>
    <div class="w-20 mt-4 border border-stone-400 mx-auto overflow-hidden">
      <div
        class="bg-stone-400 h-2 transition-all duration-500 ease-in-out"
        :style="{ width: `${loadingPercentage}%` }"
      ></div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, onMounted } from 'vue';
  
  const loadingPercentage = ref(0);
  
  onMounted(() => {
    startLoading();
  });

  const getRandomInt = (min:number, max:number) => {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
  
  const startLoading = () => {
    const interval = setInterval(() => {
      if (loadingPercentage.value >= 70 && loadingPercentage.value < 95) {
        loadingPercentage.value += 1;
      } else if (loadingPercentage.value < 30) {
        loadingPercentage.value += getRandomInt(5,10);
      } else if (loadingPercentage.value >= 30 && loadingPercentage.value < 70) {
        loadingPercentage.value += getRandomInt(1,3);
      } else {
        clearInterval(interval);
      }
    }, 100);
  };
  </script>
  
  <style scoped>
    .w-full.bg-gray-300.rounded-lg.overflow-hidden {
    }
  </style>
  