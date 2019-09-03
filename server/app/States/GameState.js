// Required modules
const Wall = require('../Entities/Wall.js');
const Circle = require('../Entities/Circle.js');
const Food = require('../Entities/Food.js');

const Util = require('../Util/Util.js');

var lastUpdate = Date.now();
var lastFoodSpawn = 0;

class GameState {
    constructor(bounds, walls, circles, food) {
        this.bounds = bounds;
        this.walls = walls;
        this.circles = circles;
        this.food = food;
    }

    createNewGame() {
        this.bounds = {
            width: 1000, height: 500, wallThickness: 20
        };

        this.walls = [
            new Wall(0, 0, 1000, 20),       // Top
            new Wall(0, 0, 20, 500),        // Left
            new Wall(0, 480, 1000, 20),     // Bottom
            new Wall(980, 0, 20, 500),      // Right
        ];

        for (var i = 0; i < 5; i++) {
            const r = 20;
            var x = Util.randomIntFromRange(this.bounds.wallThickness + r, this.bounds.width - this.bounds.wallThickness - r);
            var y = Util.randomIntFromRange(this.bounds.wallThickness + r, this.bounds.height - this.bounds.wallThickness - r);

            if (i != 0) {
                for (var j = 0; j < this.circles.length; j++) {
                    if (Util.distance(x, y, this.circles[j].x, this.circles[j].y) - (r + this.circles[j].radius) < 0) {
                        x = Util.randomIntFromRange(this.bounds.wallThickness + r, this.bounds.width - this.bounds.wallThickness - r);
                        y = Util.randomIntFromRange(this.bounds.wallThickness + r, this.bounds.height - this.bounds.wallThickness - r);
                        
                        j = -1;
                    }
                }
            }
            
            this.circles.push( new Circle(x, y, r) );
        }
    }

    tick() {
        var now = Date.now();
        var dt = now - lastUpdate;
        lastUpdate = now;
        
        for (var i = 0; i < this.circles.length; i++) {
            this.circles[i].update(dt, this.walls, this.circles, this.food, this.bounds);
        }

        this.spawnFood();
    }

    spawnFood() {
        if (Date.now() > lastFoodSpawn + 5000) {
            lastFoodSpawn = Date.now();

            const r = 5;
            var x = Util.randomIntFromRange(this.bounds.wallThickness + r, this.bounds.width - this.bounds.wallThickness - r);
            var y = Util.randomIntFromRange(this.bounds.wallThickness + r, this.bounds.height - this.bounds.wallThickness - r);

            for (var i = 0; i < this.circles.length; i++) {
                if (Util.distance(x, y, this.circles[i].x, this.circles[i].y) - (r + this.circles[i].radius) < 0) {
                    x = Util.randomIntFromRange(this.bounds.wallThickness + r, this.bounds.width - this.bounds.wallThickness - r);
                    y = Util.randomIntFromRange(this.bounds.wallThickness + r, this.bounds.height - this.bounds.wallThickness - r);
                    
                    i = -1;
                }
            }

            this.food.push( new Food(x, y, r) );
        }
    }

}

module.exports = GameState;