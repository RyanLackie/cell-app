<template>

    <!-- SVG container -->
    <svg style="width: 100%; height: 100%">

        <!-- Food -->
        <ellipse
            :cx="(food.x/gameStateWidth)*100+'%'"
            :cy="(food.y/gameStateHeight)*100+'%'"
            :rx="(food.radius/gameStateWidth)*100+'%'"
            :ry="(food.radius/gameStateHeight)*100+'%'"
            fill="orange"
        />
    
    </svg>

</template>


<script>
    export default {
        props: {
            gameStateWidth: Number,
            gameStateHeight: Number,
            food: Object
        }
    }
</script>