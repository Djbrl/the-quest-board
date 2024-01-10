<template>
    <div class="min-h-screen min-w-[550px] bg-stone-900 ">
        <!-- <LandingHeaderBox/> -->
        <div class="min-h-[90vh] justify-center mb-40 items-center">
            <!-- main landing container -->
            <div class="w-[90vw] mx-auto sm:border-x sm:border-b border-stone-700 p-4">
                <!-- hero -->
                <div class="w-full h-2/3 text-stone-300 p-10">
                    <div v-if="!clicked">
                        <h1 class="text-center">Are you sure you want to unsubscribe ? Your email will be <span class="font-bold">removed</span> from the mailing list and you will no longer receive job updates.</h1>
                        <p @click = "unsubscribe" class="text-center mt-5 p-4 border border-stone-600 hover:cursor-pointer hover:bg-stone-800">Yes, I understand !</p>
                    </div>
                    <p v-else>
                        <h1 v-if="unsubbed" class="text-center">Done ! You will no longer receive our mail updates, but you can re-subscribe anytime.</h1>
                        <h1 v-if="showNotFound" class="text-center">Seems like you're unsubscribed already ! Please contact us at artquestboard@gmail.com if you believe this is an error.</h1>
                        <h1 v-if="showDbError" class="text-center">Something went wrong in the back, please try again in a bit ! If the issue persists, please contact us at artquestboard@gmail.com</h1>
                        <p @click = "goHome" class="text-center mt-5 p-4 border border-stone-600 hover:cursor-pointer hover:bg-stone-800">Click to return to the home page</p>
                    </p>
                </div>
                <!-- results -->
            </div>
        </div>
        <!-- <LandingFooterBox /> -->
    </div>
    </template>
    
    <script setup lang="ts">
    import { ref, onMounted } from 'vue';

    const showDbError = ref(false)
    const showNotFound = ref(false)
    const clicked = ref(false)
    const unsubbed = ref(false)
    
    function goHome () {
        window.location.href = 'http://localhost:3000';
    }


    const unsubscribe = async (email: string) => {
        clicked.value = true
        try {
            const response = await fetch(`http://localhost:3001/unsubscribe?email=${email}`);

            if (!response.ok) {
                showDbError.value = true;
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const res = await response.json();

            if (res.ok === false) {
                if (res.errorMessage === 'NotFound') {
                    showNotFound.value = true;
                } else {
                    showDbError.value = true;
                }
            } else {
                unsubbed.value = true;
            }
        } catch (error) {
            console.error('Error during unsubscribe:', error);
            showDbError.value = true;
        }
    };


    onMounted(async () => {
    })
    </script>