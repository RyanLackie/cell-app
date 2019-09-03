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
        var rateOfChange = 0.1/this.radius;
        if (target != null) {
            var diffX = target.x - this.x;
            var diffY = target.y - this.y;
            var targetVelX = diffX / (Math.abs(diffX) + Math.abs(diffY));
            var targetVelY = diffY / (Math.abs(diffX) + Math.abs(diffY));
            
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
        }
        var extraSpeed = (Math.abs(this.velocity.x) + Math.abs(this.velocity.y)) - 1;
        /*
        // Slow down
        if (extraSpeed > 0) {
            if (this.velocity.x > 0)
                this.velocity.x -= extraSpeed/2;
            else
                this.velocity.x += extraSpeed/2;

            if (this.velocity.y > 0)
                this.velocity.y -= extraSpeed/2;
            else
                this.velocity.y += extraSpeed/2;
        }
        */
        /*
        // Speed up
        if (extraSpeed < 0) {
            if (this.velocity.x > 0)
                this.velocity.x -= extraSpeed/2;
            else
                this.velocity.x += extraSpeed/2;
                
            if (this.velocity.y > 0)
                this.velocity.y -= extraSpeed/2;
            else
                this.velocity.y += extraSpeed/2;
        }
        */
        
        // Circles
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