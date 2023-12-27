
<template>
  <div>
    <LandingPage :keywords="artFreelancerKeywords" />
    <!-- <QuestsFetcher /> -->
    <!-- <NuxtWelcome /> -->
  </div>
</template>

<script setup lang="ts">
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