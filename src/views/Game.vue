<template>

    <div class="game">

        <arena></arena>

        <div class="option-bar">
            <img v-for="option in options" :key="option"
            class="option noselect" :src="'http://placehold.it/500/500'"
            @click="optionClicked(option)">
        </div>

    </div>

</template>


<style lang="scss">
    @import './Game.sass';
</style>


<script>
import arena from "./arena/Arena.vue"

export default {
    data() {
        return {
            options: 10
        }
    },
    components: {
        arena
    },

    methods: {
        scrollArena(event) {
            console.log(event);
            console.log(this);
        },

        optionClicked(option) {
            console.log(option+' clicked');
        }
    }
}
</script>
