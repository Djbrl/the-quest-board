<template>
    <div class="relative">
      <div class="sm:absolute sm:bottom-[-70px] border-t border-stone-700 flex sm:left-1/2 sm:transform sm:-translate-x-1/2 bg-stone-900 sm:border sm:border-stone-700 p-4 sm:rounded-md">
        <div class="flex flex-col">
          <span class="text-xl text-stone-300 mx-auto font-bold">Join the newsletter and never miss an <span class="text-transparent font-serif bg-clip-text bg-stone-700 hover:cursor-pointer hover:bg-gradient-to-r from-sky-600 via-yellow-300 to-pink-600 transition-all duration-500 ease-in-out animate-shine">opportunity!</span></span>
          <p v-show="!emailEntered" class="text-stone-3 00 mt-1 text-sm text-stone-400">We only send emails when necessary, no <span class="italic">fluff</span>, no <span class="italic">marketing</span>.</p>
          <input @keyup.enter="subscribeToMailingList(emailField)" v-show="!emailEntered" v-model="emailField" class="my-4 px-4 py-2 w-60 text-stone-400 text-sm bg-stone-800 outline-none placeholder-stone-500 mx-auto" placeholder="your@email.com">
          <p v-if="showConfirmation" class="text-stone-300 mt-1 text-sm text-center text-stone-400">You're in ! Feel free to create an account to fine-tune your alert preferences.</p>
          <p v-if="showDbError" class="text-stone-300 mt-1 text-sm text-center text-stone-400">There might be an issue in the back, please try again later !</p>
          <p v-if="showDupError" class="text-stone-300 mt-1 text-sm text-center text-stone-400">Seems like you're already signed in!</p>
          <p v-if="showInvalidEmail" class="text-stone-300 mt-1 text-sm text-center text-stone-400">Seems like an invalid email! You should try again.</p>
        </div>
      </div>
    </div>
</template>

<script setup lang="ts">
const emailField = ref('')
const emailEntered = ref(false)
const showConfirmation = ref(false)
const showDbError = ref(false)
const showDupError = ref(false)
const showInvalidEmail = ref(false)

const subscribeToMailingList = async (email:string) => {
  const emailRegex=/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/
  if (email === '') return ;
  if (emailRegex.test(email)) {
    showInvalidEmail.value = true
    return
  }

  emailEntered.value = true
  showInvalidEmail.value = false

  let response:any;
  try {
    response = await fetch(`http://localhost:3001/subscribeToMailingList?email=${email}`);
    if (!response.ok) {
          throw new Error('');
    }
    const res = await response.json()
    if (res.ok === false) {
      if (res.errorMessage === 'NonUnique') {
        showDupError.value = true
        emailField.value = ''
      } else {
        showDbError.value = true
      }
    } else {
      showConfirmation.value = true
    }
  } catch (error) {
    showDbError.value = true
  }
}
</script>