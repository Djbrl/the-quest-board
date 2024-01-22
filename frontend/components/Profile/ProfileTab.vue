<template>
  <div>
    <button @click="ouvrirModal">Profile</button>
    <modal name="profile-modal">
      <!-- Contenu du composant Profile -->
      <Profile/>
    </modal>
  </div>
</template>



<script>
import Vue from 'vue';
import VModal from 'vue-js-modal';

// Assurez-vous d'installer le plugin VueModal dans votre composant
Vue.use(VModal);

export default {
  methods: {
    ouvrirModal() {
      // Utilisez process.browser pour vérifier si vous êtes du côté client
      if (process.browser) {
        import('vue-js-modal').then((module) => {
          this.$modal.show('profile-modal');
        });
      }
    },
  },
};

</script>

<!-- <script>
export default {
  methods: {
    ouvrirModal() {
      if (typeof window !== 'undefined') {
        import('vue-js-modal').then((module) => {
          this.$modal.show('profile-modal');
        });
      }
    },
  },
};
</script> -->

<style scoped>
/* La section style contient les styles CSS du composant, avec l'attribut scoped pour limiter la portée au composant */

button {
  border: 0.1px rgb(80, 80, 80) solid;
  color: rgb(153, 153, 153);
}

button:hover {
  color: lightgrey;
}
</style>
