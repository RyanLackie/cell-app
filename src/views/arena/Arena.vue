<template>

    <div class="arena" :style="'transform: scale('+scale+') translate('+translateX+'px,'+translateY+'px);'+
    'width: '+getAspectRatio()*gameState.bounds.width+'px; height: '+getAspectRatio()*gameState.bounds.height+'px;'"
    @mousedown="mouseDown($event)" @mousemove="mouseMove($event)" @mouseup="mouseUp()" @mouseleave="mouseLeave()"
    @mousewheel="scrollArena($event)">

        <!--svg :style="'width: 100%; height: 100%; outline: '+(50/gameState.bounds.height)*gameState.bounds.height+'px lightblue solid'"-->
        <svg style="width: 100%; height: 100%">
            
            <!-- Walls -->
            <rect v-for="(wall, i) in gameState.walls" :key="'wall'+i"
            :x="(wall.x/gameState.bounds.width)*100+'%'" :y="(wall.y/gameState.bounds.height)*100+'%'"
            :width="(wall.width/gameState.bounds.width)*100+'%'" :height="(wall.height/gameState.bounds.height)*100+'%'"
            fill="lightblue"
            :id="'wall'+i"/>

            <!-- Food -->
            <ellipse v-for="(food, i) in gameState.food" :key="'food'+i"
            :cx="(food.x/gameState.bounds.width)*100+'%'" :cy="(food.y/gameState.bounds.height)*100+'%'"
            :rx="(food.radius/gameState.bounds.width)*100+'%'" :ry="(food.radius/gameState.bounds.height)*100+'%'"
            fill="orange"
            :id="'food'+i"/>
            
            <!-- Circles -->
            <ellipse v-for="(circle, i) in gameState.circles" :key="'circle'+i"
            :cx="(circle.x/gameState.bounds.width)*100+'%'" :cy="(circle.y/gameState.bounds.height)*100+'%'"
            :rx="(circle.radius/gameState.bounds.width)*100+'%'" :ry="(circle.radius/gameState.bounds.height)*100+'%'"
            fill="green"
            :id="'circle'+i"/>
            <!--fill="url(#image)"-->
            <!--
            <pattern id="image" x="0%" y="0%" height="100%" width="100%" viewBox="0 0 512 512">
                <image x="0%" y="0%" width="512" height="512" xlink:href="./test.png"></image>
            </pattern>
            -->

            <!-- Circle food sensor -->
            <ellipse v-for="(circle, i) in gameState.circles" :key="'foodSensor'+i"
            :cx="(circle.x/gameState.bounds.width)*100+'%'" :cy="(circle.y/gameState.bounds.height)*100+'%'"
            :rx="(circle.radius*3/gameState.bounds.width)*100+'%'" :ry="(circle.radius*3/gameState.bounds.height)*100+'%'"
            fill="transparent" stroke="red"
            :id="'foodSensor'+i"/>

        </svg>

        <!--canvas id="canvas"
        style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; 
        outline: 5px blue solid">
        </canvas-->

    </div>

</template>


<style lang="scss">
    @import '../Game.sass';
</style>


<script>

import * as api from '@/services/api_access';
import { setTimeout, clearInterval, setInterval } from 'timers';

/*
function resolveWallCollision(circle, deltaX, deltaY) {
    deltaX = Math.abs(deltaX);
    deltaY = Math.abs(deltaY);
    if (deltaX > deltaY)
        circle.velocity.x = -circle.velocity.x;
    else if (deltaY > deltaX)
        circle.velocity.y = -circle.velocity.y;
}
*/

export default {
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
            tickInterval: null,


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
                circles: [],

                // Food objects
                food: [],

                lastFoodSpawn: 0
            },
        }
    },

    methods: {
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
        },

        tick() {
            api.getState(this.ID).then(
                update => {
                    if (update.status == 100) {
                        this.gameState = update.gameState;
                        //console.log(Math.abs(this.circles[0].velocity.x) + Math.abs(this.circles[0].velocity.y));
                    }

                    else if (update.status == 300) {
                        alert(update.message);
                    }
                }
            );
        },


    },

    mounted() {
        //this.init();
        
        api.createNewGame().then(
            responce => {
                if (responce.status == 100) {
                    this.ID = responce.ID;
                    this.gameState = responce.gameState;
                    
                    var THIS = this;
                    this.tickInterval = setInterval(function() {
                        THIS.tick();
                    }, 0);
                }

                else if (responce.status == 300)
                    alert(responce.message);
            }
        );
    },
    beforeDestroy() {
        this.tickInterval = null;
    }
}
</script>
