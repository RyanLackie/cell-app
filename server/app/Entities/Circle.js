// Required modules
const Util = require('../Util/Util.js');

class Circle {
    constructor(x, y, radius, mass) {
        this.x = x;
        this.y = y;

        var velX = Math.random() - 0.5;
        var velY = Math.random() - Math.abs(velX);
        this.velocity = {
            x: velX,
            y: velY    // Not quite it
        };

        this.radius = radius;
        this.mass = mass;
    }

    update(dt, walls, circles, food, bounds) {
        var target = null;
        var targetDistance = null;

        // Food
        
        for (var i = 0; i < food.length; i++) {
            var distance = Util.distance(this.x, this.y, food[i].x, food[i].y);

            // food[i].radius / 2 because a circle only has to cover half of something to eat it
            if (distance - (this.radius + food[i].radius/2) < 0) {
                food.splice(i, 1);
                this.radius++;
            }

            else if (distance < targetDistance || target == null) {
                target = food[i];
                targetDistance = distance;
            }
        }
        
        // Manipulate xy velocity to target xy
        if (target != null) {
            var diffX = target.x - this.x;
            var diffY = target.y - this.y;
            this.velocity.x = diffX / (Math.abs(diffX) + Math.abs(diffY));
            this.velocity.y = diffY / (Math.abs(diffX) + Math.abs(diffY));
        }
        
        // Circles  // Add enemy targeting later
        for (var i = 0; i < circles.length; i++) {
            if (this == circles[i]) continue;
            
            if (Util.distance(this.x, this.y, circles[i].x, circles[i].y) - (this.radius + circles[i].radius) < 0)
                Util.resolveCollision(this, circles[i]);
        }

        // Walls
        /*
        for (i = 0; i < walls.length; i++) {
            var deltaX = this.x - Math.max(walls[i].x, Math.min(this.x, walls[i].x + walls[i].width));
            var deltaY = this.y - Math.max(walls[i].y, Math.min(this.y, walls[i].y + walls[i].height));
            if ((deltaX * deltaX + deltaY * deltaY) < (this.radius * this.radius))
                Util.resolveWallCollision(this, deltaX, deltaY);
        }
        */
        if (this.x - this.radius <= bounds.wallThickness)
            this.velocity.x = Math.abs(this.velocity.x);
        else if (this.x + this.radius >= bounds.width - bounds.wallThickness)
            this.velocity.x = -Math.abs(this.velocity.x);
            
        if (this.y - this.radius <= bounds.wallThickness)
            this.velocity.y = Math.abs(this.velocity.y);
        else if (this.y + this.radius >= bounds.height - bounds.wallThickness)
            this.velocity.y = -Math.abs(this.velocity.y);
        
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

module.exports = Circle;