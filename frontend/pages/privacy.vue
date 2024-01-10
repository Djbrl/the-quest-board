<template>
    <div class="min-h-screen min-w-[550px] bg-stone-900 ">
        <!-- <LandingHeaderBox/> -->
        <div class="min-h-[90vh] justify-center mb-40 items-center">
            <!-- main landing container -->
            <div class="w-[90vw] mx-auto sm:border-x sm:border-b border-stone-700 p-4">
                <!-- hero -->
                <div class="w-full h-2/3 text-stone-300 p-10">
                    
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