<!-- <template>
  <div>
    <button @click="ouvrirModal">Profile</button>
    <modal name="profile-modal">
      <Profile/>
    </modal>
  </div>
</template>



<script>
import Vue from 'vue';
import VModal from 'vue-js-modal';

Vue.use(VModal);

export default {
  methods: {
    ouvrirModal() {
      if (process.browser) {
        import('vue-js-modal').then((module) => {
          this.$modal.show('profile-modal');
        });
      }
    },
  },
};

</script> -->



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

<!-- <style scoped>
/* La section style contient les styles CSS du composant, avec l'attribut scoped pour limiter la portée au composant */

button {
  border: 0.1px rgb(80, 80, 80) solid;
  color: rgb(153, 153, 153);
}

button:hover {
  color: lightgrey;
}
</style> -->

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
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-content {
  background: white;
  padding: 20px;
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
