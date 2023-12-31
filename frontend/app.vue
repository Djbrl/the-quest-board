
<template>
  <div class="">
    <div v-if="showAppLoader" class="absolute top-0 left-0 w-full h-full bg-stone-900 flex flex-col items-center justify-center">
      <div class="p-4 border border-stone-700">
        <div class="mx-auto">
          <span class="text-5xl font-switzer text-stone-300 font-bold hover:cursor-pointer">thequestboard</span>
          <div class="relative font-switzer absolute bottom-[27px] right-[1px] inline-block text-xs text-stone-300 font-bold px-2 py-1">
              <p>beta</p>
          </div>
        </div>
        <ResultsResultLoader class="mx-auto"/>
      </div>  
    </div>
    <LandingPage v-show="!showAppLoader" :keywords="artFreelancerKeywords" />
  </div>
</template>

<script setup lang="ts">
const showAppLoader = ref(true)
onBeforeMount(() => {
    showAppLoader.value = true
})

onMounted(() => {
  showAppLoader.value = false
})

const artFreelancerKeywords: string[] = [
    'Concept Artist',
    'Illustrator',
    'Emote Artist',
    'Background Artist',
    '3D Modeler',
    'Animator',
    '3D Artist',
    'Graphic Designer',
    'Logo Designer',
    'Character Designer',
    'Character Artist',
    'Pixel Artist',
    'Comic Artist',
    'Portrait Artist',
    'Caricature Artist',
    'Motion Designer',
    'UI/UX Designer',
    'Storyboard Artist',
    'Art Director',
    'Visual Development Artist',
    'Sketch Artist',
    'Texture Artist',
    'Mesh Artist',
    'Game Artist',
    'Book Cover Artist',
    'Children\'s Book Illustrator',
    'Children Book Illustrator',
    'Childrens Book Illustrator',
    'Medical Illustrator',
    'Technical Illustrator',
    'Storybook Illustrator',
    'DnD',
    'D&D',
    'Anime Artist',
    'Anime',
    'Realism',
    'Semi Realism',
    'Semi-Realism',
    'Semi-Realistic',
    'Semi Realistic',
    'OC Art',
    'Pet Portrait',
    'Graphic Design',
    'Book Cover',
    'Twitch',
    'Animation',
    'Fantasy',
    'Sci-Fi',
    'Surrealism',
    'Concept Art',
    'Character Design',
    'Landscape Art',
    'Portraits',
    'Traditional painting',
    'Watercolor',
    'Digital Art',
    'Traditional Art',
    'Vector Art',
    'Horror Art',
    'Steampunk',
    'Cyberpunk',
    'Fanart',
    'Fanartist',
    'Fan Art',
    'League',
    'Jujustu Kaisen',
    'Dragon Ball',
    'One Piece',
    'Marvel',
    'Overwatch',
    'Valorant',
    'TTRPG',
    'Comic Book',
    'Manga',
    'Lettering',
    'Game Design',
    'Logo Design',
    'Typography Art',
  ];
</script>

<!-- TODO LIST
search by keyword
past 24 hours
past few days
live feed
recommendation engine
trending -->