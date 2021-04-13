<script>
    export default {
        data() {
            return {
                img1: require('./images/success-meme.jpg'),
                img2: require('./images/fine-meme.jpg')
            }
        },

        props: {
            gameStateWidth: Number,
            gameStateHeight: Number,
            teamNumber: Number,
            circleObject: Object
        },

        methods: {
            getImage() {
                return this.teamNumber === 0 ? this.img1 : this.img2;
                // return this.teamNumber === 0 ? localStorage.getItem('player-one-image') : localStorage.getItem('player-two-image');
            },

            styleTargetPointer() {
                // If there is no target, don't render
                if (this.circleObject.targetX === null || this.circleObject.targetY === null) {
                    return;
                }

                // Render the line
                return this.teamNumber === 0 ? 'green' : 'red';
            }
        }
    }
</script>


<template>

    <!-- SVG container -->
    <svg style="width: 100%; height: 100%; position: relative;">

        <!-- CircleObject -->
        <ellipse
            :cx="(circleObject.x/gameStateWidth)*100+'%'"
            :cy="(circleObject.y/gameStateHeight)*100+'%'"
            :rx="(circleObject.radius/gameStateWidth)*100+'%'"
            :ry="(circleObject.radius/gameStateHeight)*100+'%'"
            :fill="`url(#circleObjectImage-${teamNumber})`"
        />

        <!-- CircleObject images -->
        <pattern :id="`circleObjectImage-${teamNumber}`" x="0%" y="0%" height="100%" width="100%" viewBox="0 0 512 512">
            <image
                x="0%"
                y="0%"
                width="512"
                height="512"
                v-bind:href="getImage()">
            </image>
        </pattern>

        <!-- CircleObject food sensor -->
        <ellipse
            :cx="(circleObject.x/gameStateWidth)*100+'%'"
            :cy="(circleObject.y/gameStateHeight)*100+'%'"
            :rx="(circleObject.radius*3/gameStateWidth)*100+'%'"
            :ry="(circleObject.radius*3/gameStateHeight)*100+'%'"
            fill="transparent"
            :stroke="teamNumber === 0 ? 'green' : 'red'"
        />

        <!-- CircleObject target pointer -->
        <line
            :x1="(circleObject.x/gameStateWidth)*100+'%'"
            :y1="(circleObject.y/gameStateHeight)*100+'%'"
            :x2="(circleObject.targetX/gameStateWidth)*100+'%'"
            :y2="(circleObject.targetY/gameStateHeight)*100+'%'"
            :stroke="styleTargetPointer()"
            stroke-width="2"
        />

    </svg>

</template>


<style lang="scss">
    .image-container {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        overflow: hidden;
    }
    img {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }
</style>
