<template>
    <div class="animation-container">
        <div class="animation-content">
            <!-- Duplicate the content for infinite effect -->
            <div class="text-4xl text-purple-400/40 font-semibold">
                <p>r/HungryArtists</p>
                <p>r/commissions</p>
                <p>r/artcommissions</p>
                <p>r/DesignJobs</p>
                <p>r/hireanartist</p>
                <p>r/fantasyartists</p>
                <p>r/starvingartists</p>
                <p>r/gameDevJobs</p>
                <p>r/gameDevClassified</p>
            </div>
            <!-- Original content -->
            <div class="text-4xl text-purple-400/40 font-semibold">
                <p>r/HungryArtists</p>
                <p>r/commissions</p>
                <p>r/artcommissions</p>
                <p>r/DesignJobs</p>
                <p>r/hireanartist</p>
                <p>r/fantasyartists</p>
                <p>r/starvingartists</p>
                <p>r/gameDevJobs</p>
                <p>r/gameDevClassified</p>
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
  width:400px; /* Adjust the height as needed */
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