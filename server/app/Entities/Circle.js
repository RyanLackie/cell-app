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

    update(dt, walls, allies, food, enemies, bounds) {

        // If no collisions take place (circle, wall, edge)
        if (!this.circleCollision(allies) && !this.wallCollision(walls, bounds) && !this.boundaryEdgeCollision(bounds)) {

            // Find food
            var target = this.findAndEatFood(food, enemies);

            // Find threats
            var threats = this.findAndAvoidThreats(enemies);
            
            // Manipulate velocity for food and threats
            this.velocityInRegardsToEnvironment(target, threats);
        }

        // Move by the calculated velocity amounts
        this.moveByVelocity(dt);
    };

    findAndEatFood(food, enemies) {
        var target = null;
        var foodTargetDistance = null;
        var circleTargetDistance = null;

        // Remove after
        this.targetX = null;
        this.targetY = null;

        // Food
        for (var i = 0; i < food.length; i++) {
            var distance = Util.distance(this.x, this.y, food[i].x, food[i].y);

            // food[i].radius / 2 because a circle only has to cover half of something to eat it
            if (distance - (this.radius + food[i].radius/2) < 0) {
                food.splice(i, 1);
                if (this.radius <= 70)  // Radius limit
                    this.radius++;
            }

            //else if (distance < this.radius * 3 + food[i].radius) {
                else if (distance < foodTargetDistance || target == null) {
                    target = food[i];
                    foodTargetDistance = distance;

                    // Remove after
                    this.targetX = target.x;
                    this.targetY = target.y;
                }
            //}
        }
        // enemies
        /*
        for (i = 0; i < enemies.length; i++) {
            var distance = Util.distance(this.x, this.y, enemies[i].x, enemies[i].y);

            // enemies[i].radius / 2 because a circle only has to cover half of something to eat it
            if (distance - (this.radius + enemies[i].radius/2) < 0) {
                enemies.splice(i, 1);
                if (this.radius <= 70)  // Radius limit
                    this.radius++;
            }

            else if (distance < this.radius * 3 + enemies[i].radius && 
                (distance < circleTargetDistance || target == null)) {

                    target = enemies[i];
                    circleTargetDistance = distance;

                    // Remove after
                    this.targetX = target.x;
                    this.targetY = target.y;
            }
        }
        */
        return target;
    }
    findAndAvoidThreats(enemies) {

    }

    velocityInRegardsToEnvironment(target, threats) {
        // Manipulate xy velocity to target xy
        var targetVelX = this.velocity.x;
        var targetVelY = this.velocity.y;

        // Set speed up or slow down to a speed of 1
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

        var rateOfChange = 0.1/this.radius;

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
    }

    circleCollision(allies) {
        var collision = false;

        for (var i = 0; i < allies.length; i++) {
            if (this == allies[i]) continue;
            
            // Circle collision
            if (Util.distance(this.x, this.y, allies[i].x, allies[i].y) - (this.radius + allies[i].radius) < 0) {
                collision = true;
                Util.resolveCollision(this, allies[i]);
            }
        }

        return collision;
    }

    wallCollision(walls, bounds) {
        var collision = false;

        /*
        for (i = 0; i < walls.length; i++) {
            var deltaX = this.x - Math.max(walls[i].x, Math.min(this.x, walls[i].x + walls[i].width));
            var deltaY = this.y - Math.max(walls[i].y, Math.min(this.y, walls[i].y + walls[i].height));
            if ((deltaX * deltaX + deltaY * deltaY) < (this.radius * this.radius))
                Util.resolveStaticCollision(this, walls[i]);
        }
        */
        ///*
        if (this.x - this.radius <= bounds.wallThickness) {
            this.velocity.x = Math.abs(this.velocity.x);
            collision = true;
        }
        else if (this.x + this.radius >= bounds.width - bounds.wallThickness) {
            this.velocity.x = -Math.abs(this.velocity.x);
            collision = true;
        }

        if (this.y - this.radius <= bounds.wallThickness) {
            this.velocity.y = Math.abs(this.velocity.y);
            collision = true;
        }
        else if (this.y + this.radius >= bounds.height - bounds.wallThickness) {
            this.velocity.y = -Math.abs(this.velocity.y);
            collision = true;
        }
        //*/

        return collision;
    }

    boundaryEdgeCollision(bounds) {
        var collision = false;

        if (this.x - this.radius <= 0) {
            this.velocity.x = Math.abs(this.velocity.x);
            collision = true;
        }
        else if (this.x + this.radius >= bounds.width) {
            this.velocity.x = -Math.abs(this.velocity.x);
            collision = true;
        }

        if (this.y - this.radius <= bounds.wallThickness) {
            this.velocity.y = M/ath.abs(this.velocity.y);
            collision = true;
        }
        else if (this.y + this.radius >= bounds.height) {
            this.velocity.y = -Math.abs(this.velocity.y);
            collision = true;
        }

        return collision;
    }

    moveByVelocity(dt) {
        var deltaTime = 1;
        if (dt != 0)
            deltaTime = dt;
        // Add a movment speed limiter
        var speedLimiter = 3 / this.radius;
        this.x += this.velocity.x * speedLimiter * deltaTime;
        this.y += this.velocity.y * speedLimiter *  deltaTime;
    }
}

module.exports = Circle;