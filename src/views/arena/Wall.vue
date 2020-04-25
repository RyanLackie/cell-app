<template>

    <!-- SVG container -->
    <svg style="width: 100%; height: 100%">

        <!-- Wall -->
        <rect
            :x="(wall.x/gameStateWidth)*100+'%'"
            :y="(wall.y/gameStateHeight)*100+'%'"
            :width="(wall.width/gameStateWidth)*100+'%'"
            :height="(wall.height/gameStateHeight)*100+'%'"
            fill="lightblue"
        />
    
    </svg>

</template>


<script>
    export default {
        props: {
            gameStateWidth: Number,
            gameStateHeight: Number,
            wall: Object
        }
    }
</script>