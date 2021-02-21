/**
 * Basic entity object. Is used to represent entities which do not perform collision 
 * checking (such as platforms, ground, blocks, walls, etc.). All entities have a 
 * bounding box which agents can collide with.
 */
class Entity {
    constructor(game, x, y, spritesheet) {
        Object.assign(this, { game });
        this.spritesheet = ASSET_LOADER.getImageAsset(spritesheet);
        this.mapPipColor = 'red';
        this.scale = 1;
        this.pos = {
            x: x,
            y: y
        };
        this.dim = {
            x: PARAMS.TILE_WIDTH,
            y: PARAMS.TILE_WIDTH
        };
        this.scaleDim = {
            x: this.dim.x * this.scale,
            y: this.dim.y * this.scale
        };
        this.animations = [];
        this.updateBB();
    }

    /** 
     * Sets the base dimensions (in pixels) of the image for each frame.
     * @param {number} scale Value to scale the sprite by when displaying on canavs.
     * @param {number} width Width of the sprite on its spritesheet in pixels.
     * @param {number} height Height of the sprite on its spritesheet in pixels.
     */
    setDimensions(scale, width, height) {
        if (!height) {
            height = width;
        }
        this.scale = scale;
        this.dim = {
            x: width,
            y: height
        };
        this.scaleDim = {
            x: width * this.scale,
            y: height * this.scale
        };
        this.worldBB = this.makeDefaultBoundingBox();
        this.lastWorldBB = this.makeDefaultBoundingBox();
    }

    /** 
     * Updates the bounding box to the current position of the entity. 
     */
    updateBB() {
        this.lastWorldBB = this.worldBB;
        this.worldBB = this.makeDefaultBoundingBox();
    }

    /**
     * Draws the entity's sprite to the screen in the proper location.
     * @param {CanvasImageSource} context Canvas to draw on.
     */
    draw(context) {
        context.drawImage(
            this.spritesheet, 0, 0,   // Draw from top left of source
            this.dim.x, this.dim.y,   // Source image width & height
            this.pos.x * this.dim.x,  // Canvas drawing position x
            this.pos.y * this.dim.y,  // Canvas drawing position y
            this.scaleDim.x,          // Canvas drawing width
            this.scaleDim.y);         // Canvas drawing height
    }

    /** 
     * Returns a default bounding box for entities. 
     */
    makeDefaultBoundingBox() {
        return new BoundingBox(this.pos.x, this.pos.y, this.scaleDim.x, this.scaleDim.y);
    }

    /**
     * Location to define animations for this entity. This method should be overridden 
     * by the implementing entity if it has animations in its spritesheet.
     */
    loadAnimations() {
        console.warn(
            "Animations not defined for Entity at x="
            + this.pos.x + ", y=" + this.pos.y);
    }

    /**
     * Location to update the internal state of this entity. This method should be 
     * overriden by the implementing entity if it changes over time.
     */
    update() {
        console.warn(
            "Update not defined for Entity at x="
            + this.pos.x + ", y=" + this.pos.y);
    }
}

/**
 * Basic agent object. Is used to represent entities which are capable of colliding
 * with other entities (such as enemies, the druid, powerups, etc.). All agents have
 * a bounding box to collide with entities and a bounding circle to collide with other
 * agents. BB is used to stand for both bounding boxes and bounding cicles.
 */ 
class Agent extends Entity {
    constructor(game, x, y, spritesheet) {
        super(game, x, y, spritesheet);
        this.vel = { x: 0, y: 0 };
        
        this.facing = 0; // Left = 0, Right = 1
        this.agentBB = this.makeDefaultBoundingCircle();
        this.lastAgentBB = this.agentBB;
        this.loadAnimations();
    }

    /** 
     * Updates this agent's facing direction. 
     */
    updateFacing() {
        if (this.vel.x < 0) {
            this.facing = 0;
        } else if (this.vel.x > 0) {
            this.facing = 1;
        }
    }

    /**
     * Causes the agent to take the specified amount of damage. The enemy removes itself 
     * from the world after its health reaches 0.
     * @param {number} damage Damage to health as an integer
     */
    takeDamage(damage) {
        console.log("before hit:" + this.health);
        this.health -= damage;
        if (this.health <= 0) {
            if (this.spawnPrize) {
                this.spawnPrize();
            }
            this.removeFromWorld = true;
        }
        console.log("after hit:" + this.health);
    }

    /**
     * Moves this entity based on its x and y velocity, then does collision checking and
     * updates the facing direction.
     * @param {number} tick Amount of time which has passed since the last tick in ms.
     */
    move(tick) {
        this.pos.x += this.vel.x * tick;
        this.pos.y += this.vel.y * tick;
        this.updateBB();
        this.checkCollisions();
        this.worldBB = this.makeDefaultBoundingBox();
        this.updateFacing();
        this.updateBB();
    }

    /** 
     * Returns a default bounding circle for agents. 
     */
    makeDefaultBoundingCircle() {
        return new BoundingCircle(
            this.pos.x + this.scaleDim.x / 2,
            this.pos.y + this.scaleDim.y / 2,
            Math.min(this.scaleDim.x, this.scaleDim.y) / 2);
    }

    /**
    * Returns a tuple of boolean values that tells what direction or directions this agent
    * has collided with an entity. Values are stored in up, down, left, and right properties 
    * of the tuple.
    * @param {Entity} entity Entity to check collision against.
    */
    worldCollisions(entity) {
        let down = this.vel.y > 0
            && this.lastWorldBB.bottom <= entity.worldBB.top
            && (this.lastWorldBB.left) < entity.worldBB.right
            && (this.lastWorldBB.right) > entity.worldBB.left;
        let up = this.vel.y < 0
            && (this.lastWorldBB.top) >= entity.worldBB.bottom
            && (this.lastWorldBB.left) !== entity.worldBB.right
            && (this.lastWorldBB.right) !== entity.worldBB.left;
        let left = this.vel.x < 0
            && (this.lastWorldBB.left) >= entity.worldBB.right
            && (this.lastWorldBB.top) !== entity.worldBB.bottom
            && (this.lastWorldBB.bottom) !== entity.worldBB.top;
        let right = this.vel.x > 0
            && (this.lastWorldBB.right) <= entity.worldBB.left
            && (this.lastWorldBB.top) < entity.worldBB.bottom
            && (this.lastWorldBB.bottom) > entity.worldBB.top;
        // Bottom corners to entity's top corners collision
        if (down) { 
            if (this.lastWorldBB.bottom > entity.worldBB.top) {
                if (this.vel.x > 0
                    && this.lastWorldBB.right > entity.worldBB.left) {
                    right = true;
                } else if (this.vel.x < 0
                    && this.lastWorldBB.left < entity.worldBB.right) {
                    left = true;
                }
            }
        }
        // Top corners to entity's bottom corners
        if (up) { 
            if (this.vel.x > 0
                && this.lastWorldBB.top < entity.worldBB.bottom
                && this.lastWorldBB.right > entity.worldBB.left) {
                right = true;
            } else if (this.vel.x < 0
                && this.lastWorldBB.top < entity.worldBB.bottom
                && this.lastWorldBB.left < entity.worldBB.right) {
                left = true;
            }
        }
        return { up, down, left, right };
    }

    /** 
     * Checks this entity's collisisons with all other bounding shapes in the scene. 
     * Passes information needed to handle collisions to the define collisions 
     * methods so that each entity may define their own collision behavior.
     */
    checkCollisions() {
        let that = this;
        this.game.entities.forEach(function (entity) {
            // Check agent collisions
            if (entity.agentBB
                && that.agentBB.collide(entity.agentBB)
                && that != entity) {
                that.defineAgentCollisions(entity);
            }
            // Check world collisions
            if (entity.worldBB
                && that.worldBB.collide(entity.worldBB)
                && that != entity) {
                let collisions = that.worldCollisions(entity);
                that.defineWorldCollisions(entity, collisions);
            }
        });
    }

    /**
     * 
     * @param {any} entity
     */
    defineAgentCollisions(entity) {
        console.warn(
            "Agent collisions not defined for Agent at x="
            + this.pos.x + ", y=" + this.pos.y);
    }

    /**
     * 
     * @param {any} entity
     * @param {any} collisions
     */
    defineWorldCollisions(entity, collisions) {
        console.warn(
            "World collisions not defined for Agent at x="
            + this.pos.x + ", y=" + this.pos.y);
    }

    /** @override */
    draw(context) {
        this.animations[this.facing].drawFrame(
            this.game.clockTick, context,
            this.pos.x, this.pos.y,
            this.scale, this.game.camera);
        this.worldBB.display(this.game);
        this.agentBB.display(this.game);
    }

    /** @override */
    updateBB() {
        super.updateBB();
        this.lastAgentBB = this.agentBB;
        this.agentBB = this.makeDefaultBoundingCircle();
    }

    /** @override */
    loadAnimations() {
        console.warn(
            "Animations not defined for Agent at x="
            + this.pos.x + ", y=" + this.pos.y);
    }

    /** @override */
    update() {
        console.warn(
            "Update not defined for Agent at x="
            + this.pos.x + ", y=" + this.pos.y);
    }
}

/** 
 * Checks collisions with entities. 
 */ 
class BoundingBox {
    constructor(x, y, width, height) {
        Object.assign(this, { x, y, width, height });

        this.left = x;
        this.top = y;
        this.right = this.left + this.width;
        this.bottom = this.top + this.height;
    }

    /**
     * Checks if this bounding box is colliding with another.
     * @param {BoundingBox} other Bounds to collide with.
     */
    collide(other) {
        return (this.right > other.left
            && this.left < other.right
            && this.top < other.bottom
            && this.bottom > other.top);
    }

    /**
     * Displays the bounding box for testing purposes.
     * @param {CanvasImageSource} game.context Canvas to draw on.
     */
    display(game) {
        if (PARAMS.DEBUG) {
            game.context.save();
            game.context.strokeStyle = 'red';
            game.context.lineWidth = PARAMS.BB_LINE_WIDTH;
            game.context.strokeRect(
                this.x - game.camera.pos.x,
                this.y - game.camera.pos.y,
                this.width, this.height);
            game.context.restore();
        }
    }

    shift(xChange, yChange) {
        this.left += xChange;
        this.right += xChange;
        this.top += yChange;
        this.bottom += yChange;
    }
}

/** 
 * Checks collisions between agents. 
 */
class BoundingCircle {
    constructor(x, y, radius) {
        Object.assign(this, { x, y, radius });
    }

    /**
     * Checks if this bounding circle is colliding with another.
     * @param {BoundingCircle} other
     */
    collide(other) {
        let dx = this.x - other.x;
        let dy = this.y - other.y;
        let distance = Math.sqrt(dx * dx + dy * dy);
        return (distance < this.radius + other.radius);
    }

    /**
     * Displays the bounding cicle for testing purposes.
     * @param {CanvasImageSource} game.context Canvas to draw on.
     */
    display(game) {
        if (PARAMS.DEBUG) {
            game.context.save();
            game.context.strokeStyle = 'green';
            game.context.lineWidth = PARAMS.BB_LINE_WIDTH;
            game.context.beginPath();
            game.context.arc(
                this.x - game.camera.pos.x,
                this.y - game.camera.pos.y,
                this.radius, 0, 2 * Math.PI);
            game.context.stroke();
            game.context.restore();
        }
    }
}