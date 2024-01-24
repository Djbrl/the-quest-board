<template>
    <div class="container">
      <input v-model="email" placeholder="Please enter your email" />&nbsp;
      <span> <button class="buttonProfile" @click="valider">OK</button></span>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        email: "",
      };
    },
    methods: {
      valider() {
        // Stocke le contenu du champ de remplissage dans la variable 'email'
        console.log("Email saisi :", this.email);
      },
    },
  };
  </script>
  
  <style scoped>

.buttonProfile {
  border: 0.1px solid rgb(80, 80, 80);
  color: rgb(153, 153, 153);
  box-sizing:content-box;
  justify-content: center;
}

button:hover {
  color: lightgrey;
} 
  .container {
    align-items: center;
    justify-content: center;
  }
  </style>
  