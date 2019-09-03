// Required modules
const Util = require('../Util/Util.js');

class Circle {
    constructor(x, y, radius) {
        this.x = x;
        this.y = y;
        this.radius = radius;

        var velX = Math.random() - 0.5;
        var velY = Math.random() - Math.abs(velX);  // Not quite it
        this.velocity = {
            x: velX,
            y: velY
        };
        
        this.targetX = null;
        this.targetY = null;
    }

    update(dt, walls, circles, food, bounds) {
        var target = null;
        var targetDistance = null;
        // Remove after
        this.targetX = null;
        this.targetY = null;

        // Food     // Add enemy attack and run later
        for (var i = 0; i < food.length; i++) {
            var distance = Util.distance(this.x, this.y, food[i].x, food[i].y);

            // food[i].radius / 2 because a circle only has to cover half of something to eat it
            if (distance - (this.radius + food[i].radius/2) < 0) {
                food.splice(i, 1);
                if (this.radius <= 70)  // Radius limit
                    this.radius++;
            }

            //else if (distance < this.radius * 3 + food[i].radius) {
                else if (distance < targetDistance || target == null) {
                    target = food[i];
                    targetDistance = distance;
                    // Remove after
                    this.targetX = target.x;
                    this.targetY = target.y;
                }
            //}
        }
        
        // Manipulate xy velocity to target xy
        var targetVelX = this.velocity.x;
        var targetVelY = this.velocity.y;

        var rateOfChange = 0.1/this.radius;

        // Set  speed up or slow down to a speed of 1
        if (target == null && Math.abs(this.velocity.x) + Math.abs(this.velocity.y) != 1) {
            var extraSpeed = (Math.abs(this.velocity.x) + Math.abs(this.velocity.y)) - 1;

            if (targetVelX > 0)
                targetVelX -= extraSpeed / 2;
            else if (targetVelX < 0)
                targetVelX += extraSpeed / 2;

            if (targetVelY > 0)
                targetVelY -= extraSpeed / 2;
            else if (targetVelY < 0)
                targetVelY += extraSpeed / 2;
        }

        // Set target velocity to move towards target
        else if (target != null) {
            var xDifference = target.x - this.x;
            var yDifference = target.y - this.y;
            targetVelX = xDifference / (Math.abs(xDifference) + Math.abs(yDifference));
            targetVelY = yDifference / (Math.abs(xDifference) + Math.abs(yDifference));
        }

        // Move current velocity towards target velocty in relation to momentum
        if (Math.abs(this.velocity.x - targetVelX) <= rateOfChange)
                this.velocity.x = targetVelX;
        else if (this.velocity.x < targetVelX)
            this.velocity.x += rateOfChange;
        else if (this.velocity.x > targetVelX)
            this.velocity.x -= rateOfChange;

        if (Math.abs(this.velocity.y - targetVelY) <= rateOfChange)
            this.velocity.Y = targetVelY;
        else if (this.velocity.y < targetVelY)
            this.velocity.y += rateOfChange;
        else if (this.velocity.y > targetVelY)
            this.velocity.y -= rateOfChange;
            
        
        // Circles collision
        for (var i = 0; i < circles.length; i++) {
            if (this == circles[i]) continue;
            
            if (Util.distance(this.x, this.y, circles[i].x, circles[i].y) - (this.radius + circles[i].radius) < 0)
                Util.resolveCollision(this, circles[i]);
        }

        // Walls collision
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
        
        // End of world collision
        /*
        if ((this.x - this.radius <= 0) || (this.x + this.radius >= bounds.width))
            this.velocity.x = -this.velocity.x;
        if ((this.y - this.radius <= 0) || (this.y + this.radius >= bounds.height))
            this.velocity.y = -this.velocity.y;
        */
        
        // Move
        var deltaTime = 1;
        if (dt != 0)
            deltaTime = dt;
        // Add a movment speed limiter
        var speedLimiter = 3 / this.radius;
        this.x += this.velocity.x * speedLimiter * deltaTime;
        this.y += this.velocity.y * speedLimiter *  deltaTime;
    };
}

module.exports = Circle;