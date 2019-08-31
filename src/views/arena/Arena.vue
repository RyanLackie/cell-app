<template>

    <div class="arena" :style="'transform: scale('+scale+') translate('+translateX+'px,'+translateY+'px);'+
    'width: '+getAspectRatio()*bounds.width+'px; height: '+getAspectRatio()*bounds.height+'px;'"
    @mousedown="mouseDown($event)" @mousemove="mouseMove($event)" @mouseup="mouseUp()" @mouseleave="mouseLeave()"
    @mousewheel="scrollArena($event)">

        <!--svg :style="'width: 100%; height: 100%; outline: '+(50/bounds.height)*bounds.height+'px lightblue solid'"-->
        <svg style="width: 100%; height: 100%">
            
            <!-- Walls -->
            <rect v-for="(wall, i) in walls" :key="'wall'+i"
            :x="(wall.x/bounds.width)*100+'%'" :y="(wall.y/bounds.height)*100+'%'"
            :width="(wall.width/bounds.width)*100+'%'" :height="(wall.height/bounds.height)*100+'%'"
            fill="lightblue"
            :id="'wall'+i"/>

            <!-- Food -->
            <ellipse v-for="(food, i) in food" :key="'food'+i"
            :cx="(food.x/bounds.width)*100+'%'" :cy="(food.y/bounds.height)*100+'%'"
            :rx="(food.radius/bounds.width)*100+'%'" :ry="(food.radius/bounds.height)*100+'%'"
            fill="orange"
            :id="'food'+i"/>
            
            <!-- Circles -->
            <ellipse v-for="(circle, i) in circles" :key="'circle'+i"
            :cx="(circle.x/bounds.width)*100+'%'" :cy="(circle.y/bounds.height)*100+'%'"
            :rx="(circle.radius/bounds.width)*100+'%'" :ry="(circle.radius/bounds.height)*100+'%'"
            fill="green"
            :id="'circle'+i"/>
            <!--fill="url(#image)"-->
            <pattern id="image" x="0%" y="0%" height="100%" width="100%" viewBox="0 0 512 512">
                <image x="0%" y="0%" width="512" height="512" xlink:href="./test.png"></image>
            </pattern>

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

function Wall(x, y, width, height) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    //this.color = color;
}

function Food(x, y, radius) {
    this.x = x;
    this.y = y;
    this.radius = radius;
}

function Circle(x, y, radius, mass) {
    this.x = x;
    this.y = y;
    this.velocity = {
        x: Math.random() - 0.5,
        y: Math.random() - 0.5
    };
    this.radius = radius;
    this.mass = mass;
    //this.color = color;

    this.update = (food, circles, walls) => {
        // Food
        for (var i = 0; i < food.length; i++) {
            // food[i].radius / 2 because a circle only has to cover half of something to eat it
            if (distance(this.x, this.y, food[i].x, food[i].y) - (this.radius + food[i].radius/2) < 0) {
                food.splice(i, 1);
                this.radius++;
            }
        }
        
        // Circles
        for (i = 0; i < circles.length; i++) {
            if (this == circles[i]) continue;
            
            if (distance(this.x, this.y, circles[i].x, circles[i].y) - (this.radius + circles[i].radius) < 0)
                resolveCollision(this, circles[i]);
        }

        // Walls
        for (i = 0; i < walls.length; i++) {
            var deltaX = this.x - Math.max(walls[i].x, Math.min(this.x, walls[i].x + walls[i].width));
            var deltaY = this.y - Math.max(walls[i].y, Math.min(this.y, walls[i].y + walls[i].height));
            if ((deltaX * deltaX + deltaY * deltaY) < (this.radius * this.radius))
                resolveWallCollision(this, deltaX, deltaY);
        }
        
        // End of world
        /*
        if ((this.x - this.radius <= 0) || (this.x + this.radius >= bounds.width))
            this.velocity.x = -this.velocity.x;
        if ((this.y - this.radius <= 0) || (this.y + this.radius >= bounds.height))
            this.velocity.y = -this.velocity.y;
        */
        
        // Move
        this.x += this.velocity.x;
        this.y += this.velocity.y;
    };
}

function distance(x1, y1, x2, y2) {
    return Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow((y1 - y2), 2));
}
function resolveCollision(particle, otherParticle) {
    const xVelocityDiff = particle.velocity.x - otherParticle.velocity.x;
    const yVelocityDiff = particle.velocity.y - otherParticle.velocity.y;

    const xDist = otherParticle.x - particle.x;
    const yDist = otherParticle.y - particle.y;

    // Prevent accidental overlap of particles
    if (xVelocityDiff * xDist + yVelocityDiff * yDist >= 0) {

        // Grab angle between the two colliding particles
        const angle = -Math.atan2(otherParticle.y - particle.y, otherParticle.x - particle.x);

        // Store mass in var for better readability in collision equation
        const m1 = particle.mass;
        const m2 = otherParticle.mass;

        // Velocity before equation
        const u1 = rotate(particle.velocity, angle);
        const u2 = rotate(otherParticle.velocity, angle);

        // Velocity after 1d collision equation
        const v1 = { 
            x: u1.x * (m1 - m2) / (m1 + m2) + u2.x * 2 * m2 / (m1 + m2),
            y: u1.y
        };
        const v2 = {
            x: u2.x * (m1 - m2) / (m1 + m2) + u1.x * 2 * m2 / (m1 + m2),
            y: u2.y
        };

        // Final velocity after rotating axis back to original location
        const vFinal1 = rotate(v1, -angle);
        const vFinal2 = rotate(v2, -angle);

        // Swap particle velocities for realistic bounce effect
        particle.velocity.x = vFinal1.x;
        particle.velocity.y = vFinal1.y;

        otherParticle.velocity.x = vFinal2.x;
        otherParticle.velocity.y = vFinal2.y;
    }
}
function rotate(velocity, angle) {
    // Rotated velocities
    return {
        x: velocity.x * Math.cos(angle) - velocity.y * Math.sin(angle),
        y: velocity.x * Math.sin(angle) + velocity.y * Math.cos(angle)
    };
}

function resolveWallCollision(circle, deltaX, deltaY) {
    deltaX = Math.abs(deltaX);
    deltaY = Math.abs(deltaY);
    if (deltaX > deltaY)
        circle.velocity.x = -circle.velocity.x;
    else if (deltaY > deltaX)
        circle.velocity.y = -circle.velocity.y;
}


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
            lastUpdate: Date.now(),
            tickInterval: null,


            // Enviroment
            bounds: {
                width: 1000, height: 500, wallThickness: 20
            },
            /*
                Objects are referenced by their top left
            */
            // Wall Objects
            walls: [
                new Wall(0, 0, 1000, 20),       // Top
                new Wall(0, 0, 20, 500),        // Left
                new Wall(0, 480, 1000, 20),     // Bottom
                new Wall(980, 0, 20, 500),      // Right
            ],
            
            // Circle objects
            circles: [],

            // Food objects
            food: [],
            lastFoodSpawn: 0
        }
    },

    methods: {
        // Size rendering to the size of the screen
        getAspectRatio() {
            return window.screen.width / this.bounds.width;
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

        // Game
        init() {
            for (var i = 0; i < 15; i++) {
                const r = 20;
                var x = this.randomIntFromRange(this.bounds.wallThickness + r, this.bounds.width - this.bounds.wallThickness - r);
                var y = this.randomIntFromRange(this.bounds.wallThickness + r, this.bounds.height - this.bounds.wallThickness - r);
                var mass = 1;

                if (i != 0) {
                    for (var j = 0; j < this.circles.length; j++) {
                        if (this.distance(x, y, this.circles[j].x, this.circles[j].y) - (r + this.circles[j].radius) < 0) {
                            x = this.randomIntFromRange(this.bounds.wallThickness + r, this.bounds.width - this.bounds.wallThickness - r);
                            y = this.randomIntFromRange(this.bounds.wallThickness + r, this.bounds.height - this.bounds.wallThickness - r);
                            
                            j = -1;
                        }
                    }
                }
                
                this.circles.push( new Circle(x, y, r, mass) );
            }

            this.tickInterval = setInterval(this.tick, 0);
        },
        randomIntFromRange(min, max) {
            return Math.floor(Math.random() * (max - min + 1) + min);
        },

        tick() {
            var now = Date.now();
            var dt = now - this.lastUpdate;
            this.lastUpdate = now;
            
            for (var i = 0; i < this.circles.length; i++) {
                this.circles[i].update(this.food, this.circles, this.walls);
            }

            this.spawnFood();
        },

        spawnFood() {
            if (Date.now() > this.lastFoodSpawn + 5000) {
                this.lastFoodSpawn = Date.now();

                const r = 5;
                var x = this.randomIntFromRange(this.bounds.wallThickness + r, this.bounds.width - this.bounds.wallThickness - r);
                var y = this.randomIntFromRange(this.bounds.wallThickness + r, this.bounds.height - this.bounds.wallThickness - r);

                for (var i = 0; i < this.circles.length; i++) {
                    if (this.distance(x, y, this.circles[i].x, this.circles[i].y) - (r + this.circles[i].radius) < 0) {
                        x = this.randomIntFromRange(this.bounds.wallThickness + r, this.bounds.width - this.bounds.wallThickness - r);
                        y = this.randomIntFromRange(this.bounds.wallThickness + r, this.bounds.height - this.bounds.wallThickness - r);
                        
                        i = -1;
                    }
                }

                this.food.push( new Food(x, y, r) );
            }
        },

        distance(x1, y1, x2, y2) {
            return Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow((y1 - y2), 2));
        },


    },

    mounted() {
        this.init();
    },
    beforeDestroy() {
        this.tickInterval = null;
    }
}
</script>
