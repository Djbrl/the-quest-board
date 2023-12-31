<template>
    <div class="animation-container">
        <div class="animation-content">
            <!-- Duplicate the content for infinite effect -->
            <div class="text-4xl font-switzer text-violet-400/40 font-semibold">
                <p class="hover:text-violet-400">r/HungryArtists</p>
                <p class="hover:text-violet-400">r/commissions</p>
                <p class="hover:text-violet-400">r/artcommissions</p>
                <p class="hover:text-violet-400">r/DesignJobs</p>
                <p class="hover:text-violet-400">r/hireanartist</p>
                <p class="hover:text-violet-400">r/fantasyartists</p>
                <p class="hover:text-violet-400">r/starvingartists</p>
                <p class="hover:text-violet-400">r/gameDevJobs</p>
                <p class="hover:text-violet-400">r/gameDevClassified</p>
            </div>
            <!-- Original content -->
            <div class="text-4xl font-switzer text-violet-400/40 font-semibold">
                <p class="hover:text-violet-400">r/HungryArtists</p>
                <p class="hover:text-violet-400">r/commissions</p>
                <p class="hover:text-violet-400">r/artcommissions</p>
                <p class="hover:text-violet-400">r/DesignJobs</p>
                <p class="hover:text-violet-400">r/hireanartist</p>
                <p class="hover:text-violet-400">r/fantasyartists</p>
                <p class="hover:text-violet-400">r/starvingartists</p>
                <p class="hover:text-violet-400">r/gameDevJobs</p>
                <p class="hover:text-violet-400">r/gameDevClassified</p>
            </div>
        </div>
    </div>
</template>

<script>
</script>

<style scoped>
.animation-container {
  overflow: hidden;
  height: 20rem; /* Adjust the height as needed */
  width:350px; /* Adjust the height as needed */
}

.animation-content {
  display: flex;
  flex-direction: column;
  animation: scrollUp 20s linear infinite;
}

@keyframes scrollUp {
  0% {
    transform: translateY(0);
  }
  100% {
    transform: translateY(-50%); /* Adjust the percentage based on the number of duplicated items */
  }
}
</style>