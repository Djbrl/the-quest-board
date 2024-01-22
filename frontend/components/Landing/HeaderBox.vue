<template>
    <header class="w-full bg-stone-900 border-b border-zinc-700 py-4">
        <div class="flex">
            <div class="flex flex-col">
                <div class="inline-block mx-auto sm:ml-20">
                    <span @click="goHome" class="text-5xl font-switzer text-stone-300 font-bold hover:cursor-pointer">thequestboard</span>
                    <div class="relative font-switzer absolute bottom-[27px] right-[1px] inline-block text-xs text-stone-300 font-bold px-2 py-1">
                        <p>beta</p>
                    </div>
                </div>

                <div class="my-auto inline-block mt-2 sm:ml-20 sm:mr-auto flex">
                    <div>
                        <span class="font-switzer text-stone-400 hover:text-stone-300 hover:cursor-pointer hidden md:flex text-sm">Newsletter</span>
                    </div>
                    <div class="mx-4">
                        <span class="font-switzer text-stone-400 hover:text-stone-300 hover:cursor-pointer hidden md:flex text-sm">Support us on Ko-Fi</span>
                    </div>
                    <div @click="toggleLightMode()">
                        <span class="font-switzer text-stone-400 hover:text-stone-300 hover:cursor-pointer hidden md:flex text-sm">Light Mode</span>
                    </div>
                </div>
            </div>
            <!-- <div class="my-auto inline-block mr-20 sm:ml-auto flex">
                <span class="font-switzer text-stone-300 text-xl hidden md:flex hover:cursor-pointer border border-stone-600 font-semibold px-6 py-1">Sign In</span>
            </div> -->
            <div class="flex items-end justify-end ml-auto">
                <span class="text-4xl font-switzer text-stone-300 font-bold hover:cursor-pointer"><ProfileTab/></span>
                <div class="mr-10"></div>
            </div>                 
        </div>
    </header>
</template>

<script setup lang="ts">
const state = useResults()

function goHome () {
        window.location.href = 'http://localhost:3000';
}

const toggleLightMode = () => {
    state.toggleLightMode()
}
</script>