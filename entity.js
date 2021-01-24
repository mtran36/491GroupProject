/**
 * Basic entity object. Is used to represent entities which do not perform collision 
 * checking (such as platforms, ground, blocks, walls, etc.). All entities have a 
 * bounding box which agents can collide with.
 */
class Entity {
    constructor(game, x, y, spritesheet) {
        Object.assign(this, { game });
        this.spritesheet = ASSET_MANAGER.getAsset(spritesheet);
        this.dim = { x: PARAMS.TILE_WIDTH, y: PARAMS.TILE_WIDTH };
        this.pos = { x: x, y: y };
        this.worldBB = this.makeDefaultBoundingBox();
        this.lastWorldBB = this.worldBB;
        this.animations = [];
    }

    /** 
     * Sets the dimensions of the sprite. If only width is included, makes the dimensions
     * square shaped with width length sides. 
     */
    setDimensions(width, height) {
        if (height) {
            this.dim = { x: width, y: height };
        } else {
            this.dim = { x: width, y: width };
        }
    }

    /** Updates the bounding box to the current position of the entity. */
    updateBB() {
        this.lastWorldBB = this.worldBB;
        this.worldBB = new BoundingBox(
            this.pos.x, this.pos.y, this.dim.x, this.dim.y);
    }

    /** Draws the entity's bounding box used for collisions with entities. */
    drawWorldBB(context) {
        if (PARAMS.DEBUG) { 
            context.save();
            context.strokeStyle = 'red';
            context.lineWidth = PARAMS.BB_LINE_WIDTH;
            context.strokeRect(
                this.pos.x, this.pos.y, this.dim.x, this.dim.y);
            context.restore();
        }
    }

    /**
     * Draws the entity's sprite to the screen in the proper location.
     * @param {CanvasImageSource} context Canvas to draw on.
     */
    draw(context) {
        context.drawImage(this.spritesheet, 0, 0, this.dim.x, this.dim.y,
            this.pos.x * this.dim.x, this.pos.y * this.dim.y,
            this.dim.x, this.dim.y);
        this.drawWorldBB(context);
    }

    /** Returns a default bounding box for entities. */
    makeDefaultBoundingBox() {
        return new BoundingBox(this.pos.x, this.pos.y, this.dim.x, this.dim.y);
    }

    /**
     * Location to define animations for this entity. This method should be overridden 
     * by the implementing entity if it has animations in its spritesheet.
     */
    loadAnimations() {
        console.log(
            "Animations not defined for Entity at x="
            + this.pos.x + ", y=" + this.pos.y);
    }

    /**
     * Location to update the internal state of this entity. This method should be 
     * overriden by the implementing entity if it changes over time.
     */
    update() {
        console.log(
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
        // Left = 0, Right = 1
        this.facing = 0;
        this.agentBB = this.makeDefaultBoundingCircle();
        this.lastAgentBB = this.agentBB;
        this.loadAnimations();
    }

    /** Updates this entity's facing direction. */
    updateFacing() {
        if (this.vel.x < 0) {
            this.facing = 0;
        } else if (this.vel.x > 0) {
            this.facing = 1;
        }
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
        this.updateFacing();
    }

    /** Returns a default bounding circle for agents. */
    makeDefaultBoundingCircle() {
        return new BoundingCircle(
            this.pos.x + this.dim.x / 2,
            this.pos.y + this.dim.y / 2,
            Math.min(this.dim.x, this.dim.y) / 2);
    }

    /** 
     * Location to check if the agent is colliding with anything. This method should be
     * overriden by the implementing agent.
     */
    checkCollisions() {
        console.log(
            "Collisions not defined for Agent at x="
            + this.pos.x + ", y=" + this.pos.y);
    }

    /** @override */
    updateBB() {
        super.updateBB();
        this.lastAgentBB = this.agentBB;
        this.agentBB = this.makeDefaultBoundingCircle();
    }

    /** @override */
    loadAnimations() {
        console.log(
            "Animations not defined for Agent at x="
            + this.pos.x + ", y=" + this.pos.y);
    }

    /** @override */
    update() {
        console.log(
            "Update not defined for Agent at x="
            + this.pos.x + ", y=" + this.pos.y);
    }
}

/** Checks collisions with entities. */ 
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
     * @param {CanvasImageSource} context Canvas to draw on.
     */
    display(context) {
        if (PARAMS.DEBUG) {
            context.save();
            context.strokeStyle = 'red';
            context.lineWidth = PARAMS.BB_LINE_WIDTH;
            context.strokeRect(
                this.x, this.y, this.width, this.height);
            context.restore();
        }
    }
}

/** Checks collisions between agents. */
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
     * @param {CanvasImageSource} context Canvas to draw on.
     */
    display(context) {
        if (PARAMS.DEBUG) {
            context.save();
            context.strokeStyle = 'green';
            context.lineWidth = PARAMS.BB_LINE_WIDTH;
            context.beginPath();
            context.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
            context.stroke();
            context.restore();
        }
    }
}