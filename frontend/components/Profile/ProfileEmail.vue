<template>
    <div class="container">
      <input v-model="email" placeholder="email" class="mailInput" />&nbsp;
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


      async valider() {
        // Stocke le contenu du champ de remplissage dans la variable 'email'
        if (this.email === '') return ;
        // if (emailRegex.test(this.email)) {
        //   showInvalidEmail.value = true
        //   return
        // }
        console.log("Email saisi :", this.email);
        try {
          const response = await fetch(`http://localhost:3001/checkIfMail?email=${this.email}`);
          if (response.ok === true)
          {
            console.log("Email is in the DB");
          }
          else
          {
            console.log(response);
          }
        } 
        catch (error) {
          console.error('Error checking if mail is in db:', error);
        }
        
      },



  //     let response:any;
  // try {
  //   response = await fetch(`http://localhost:3001/subscribeToMailingList?email=${email}`);
  //   if (!response.ok) {
  //         throw new Error('');
  //   }
  //   const res = await response.json()
  //   if (res.ok === false) {
  //     if (res.errorMessage === 'NonUnique') {
  //       showDupError.value = true
  //       emailField.value = ''
  //     } else {
  //       showDbError.value = true
  //     }
  //   } else {
  //     showConfirmation.value = true
  //   }
  // } catch (error) {
  //   showDbError.value = true
  // }
    },
  };
  </script>
  
  <style scoped>

.mailInput {
  color: black;
}
.buttonProfile {
  border: 0.1px solid rgb(80, 80, 80);
  box-sizing:content-box;
  color: rgb(153, 153, 153);
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
  