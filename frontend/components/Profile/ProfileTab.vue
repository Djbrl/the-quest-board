<template>
    <!-- Bouton pour ouvrir la modale -->
    <button @click="ouvrirModal">Profile</button>

    <!-- Modale -->
    <div v-if="showModal" class="modal">
      <div class="modal-content">
        <button @click="fermerModal">X</button>
        <Profile/>
      </div>
    </div>
</template>


<script>
import Profile from './Profile.vue'; // Assurez-vous d'ajuster le chemin vers votre composant Profile

export default {
  components: {
    Profile,
  },
  data() {
    return {
      showModal: false,
    };
  },
  methods: {
    ouvrirModal() {
      this.showModal = true;
    },
    fermerModal() {
      this.showModal = false;
    },
  },
};
</script>

<style scoped>
/* Styles de la modale */
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
  padding: 50px;
}

 button {
  border: 0.1px solid rgb(80, 80, 80);
  color: rgb(153, 153, 153);
  box-sizing:content-box;
}

button:hover {
  color: lightgrey;
} 
</style>
