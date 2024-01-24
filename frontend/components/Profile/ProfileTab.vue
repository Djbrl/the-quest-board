<template>
    <!-- Bouton pour ouvrir la modale -->
    <button class="buttonProfile" @click="ouvrirModal">Profile</button>

    <!-- Modale -->
    <div v-if="showModal" class="modal">
      <div class="modal-content">
        <button class="buttonProfile" @click="fermerModal">X</button>
        <div class="modal-padding"><component :is="componentToRender"/></div>
      </div>
    </div>
</template>


<script>
import Profile from './Profile.vue'; // Assurez-vous d'ajuster le chemin vers votre composant Profile
import ProfileEmail from './ProfileEmail.vue';
import Cookies from "js-cookie";

export default {
  components: {
    Profile,
  },
  data() {
    return {
      showModal: false,
      componentToRender: null,
    };
  },
  methods: {
    ouvrirModal() {
      // Vérifiez la présence du cookie ici
      const jwtToken = Cookies.get('jwt-token');

      // Si le cookie est présent, affichez le composant Profile, sinon affichez le composant Email
      if (jwtToken) {
        this.componentToRender = Profile;
      } else {
        this.componentToRender = ProfileEmail;
      }

      this.showModal = true;
    },
    fermerModal() {
      this.showModal = false;
      this.componentToRender = null; // Réinitialisez le composant à rendre lorsque la modal est fermée
    },
  },
};
</script>

<style scoped>
.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(31, 31, 31, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-content {
  background: black;
  padding: 10px;
}

.modal-padding {
  padding: 10px 50px 50px 50px;
}


 .buttonProfile {
  border: 0.1px solid rgb(80, 80, 80);
  color: rgb(153, 153, 153);
  box-sizing:content-box;
}

button:hover {
  color: lightgrey;
} 
</style>
