<script>
    import * as api from '@/services/api_access';

    // Components
    import Food from './Food.vue';
    import CircleObject from './CircleObject.vue';
    import Wall from './Wall.vue';

    export default {
        components: {
            Food,
            CircleObject,
            Wall
        },

        data() {
            return {
                // Screen Movement
                scale: 1,
                zoomStep: 0.25,

                translateX: 0,
                translateY: 0,

                mouseDownBoolean: false,
                previousX: 0,
                previousY: 0,

                // Game loop
                tickTimout: null,

                // Enviroment
                ID: null,

                gameState: {
                    bounds: {
                        width: 0, height: 0, wallThickness: 0
                    },
                    /*
                        Objects are referenced by their top left
                    */
                    // Wall Objects
                    walls: [],
                    // Circle objects
                    allies: [],
                    enemies: [],
                    // Food objects
                    food: [],

                    lastFoodSpawn: 0
                }
            }
        },

        methods: {
            // Tick the server to get the current state of the game
            tick() {
                api.getState(this.ID).then(
                    update => {
                        if (update.status == 100) {
                            this.gameState = update.gameState;
                            const THIS = this;
                            this.tickTimout = setTimeout(() => {
                                THIS.tick();
                            }, 0);

                        } else if (update.status == 300) {
                            clearTimeout(this.tickTimout);
                            alert(update.message);
                        }
                    }
                );
            },

            // Size rendering to the size of the screen
            getAspectRatio() {
                return window.screen.width / this.gameState.bounds.width;
            },

            // Camera control
            scrollArena(event) {
                var direction = 0;
                if (event.deltaY > 0)
                    direction = 1;
                else
                    direction = -1

                this.scale - direction * this.zoomStep >= 0.75 &&
                this.scale - direction * this.zoomStep <= 8 ?
                (this.scale -= direction * this.zoomStep) : null;
            },
            mouseDown(event) {
                this.mouseDownBoolean = true;
                this.previousX = event.clientX;
                this.previousY = event.clientY;
            },
            mouseMove(event) {
                if (this.mouseDownBoolean) {
                    this.translateX += event.clientX - this.previousX;
                    this.translateY += event.clientY - this.previousY;

                    this.previousX = event.clientX;
                    this.previousY = event.clientY;
                }
            },
            mouseUp() {
                this.mouseDownBoolean = false;
            },
            mouseLeave() {
                this.mouseDownBoolean = false;
            }
        },

        mounted() {
            api.createNewGame().then(
                response => {
                    if (response.status == 100) {
                        this.ID = response.ID;
                        this.gameState = response.gameState;

                        const THIS = this;
                        this.tickTimout = setTimeout(() => {
                            THIS.tick();
                        }, 0);
                    }

                    else if (response.status == 300) {
                        alert(response.message);
                    }
                }
            );
        },
        beforeDestroy() {
            clearTimeout(this.tickTimout);
        }
    }
</script>


<template>

    <div class="arena" :style="'transform: scale('+scale+') translate('+translateX+'px,'+translateY+'px);'+
    'width: '+getAspectRatio()*gameState.bounds.width+'px; height: '+getAspectRatio()*gameState.bounds.height+'px;'"
    @mousedown="mouseDown($event)"
    @mousemove="mouseMove($event)"
    @mouseup="mouseUp()"
    @mouseleave="mouseLeave()"
    @mousewheel="scrollArena($event)">

        <!--svg :style="'width: 100%; height: 100%; outline: '+(50/gameState.bounds.height)*gameState.bounds.height+'px lightblue solid'"-->
        <svg style="width: 100%; height: 100%;">

            <!-- Food -->
            <Food v-for="(food, i) in gameState.food" :key="'food '+i"
                :gameStateWidth="gameState.bounds.width"
                :gameStateHeight="gameState.bounds.height"
                :food="food"
            />

            <!-- Allies -->
            <CircleObject v-for="(circleObject, i) in gameState.allies" :key="'ally circleObject '+i"
                :gameStateWidth="gameState.bounds.width"
                :gameStateHeight="gameState.bounds.height"
                :teamNumber="0"
                :circleObject="circleObject"
            />

            <!-- Enemies -->
            <CircleObject v-for="(circleObject, i) in gameState.enemies" :key="'enemy circleObject '+i"
                :gameStateWidth="gameState.bounds.width"
                :gameStateHeight="gameState.bounds.height"
                :teamNumber="1"
                :circleObject="circleObject"
            />

            <!-- Walls -->
            <Wall v-for="(wall, i) in gameState.walls" :key="'wall '+i"
                :gameStateWidth="gameState.bounds.width"
                :gameStateHeight="gameState.bounds.height"
                :wall="wall"
            />

        </svg>

    </div>

</template>


<style lang="scss">
    @import '../Game.sass';
</style>
