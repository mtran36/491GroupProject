class Items extends Agent {
    constructor(game, x, y, spritesheet) {
        super(game, x, y, spritesheet);
        this.emerging = false;
        this.updateBB();
    }

    /** @override */
    update() {
        this.checkCollisions();
    }

    addItemsToDruid(DRUID) {
        console.warn("Potion not define: ");
    }

    defineAgentCollisions(entity) {
        if (entity instanceof Druid) {
            this.removeFromWorld = true;
            this.addItemsToDruid(entity);
        }
    }

    /** @override */
    defineWorldCollisions(entity, collisions) {
        if (entity instanceof Ground) {
            if (collisions.down) {
                this.pos.y = entity.worldBB.top - this.scaleDim.y;
                this.vel.y = 0;
            }
        }
    }
}

class Potions extends Items {
    constructor(game, x, y) {
        super(game, x, y, "./Sprites/testpotion.png");
        this.setDimensions(1, 32, 32);
    }

    /** @override */
    loadAnimations() {
        this.animations[0] = new Animator(
            this.spritesheet, 0, 0, 32, 32, 1, 1, 0, false, true, false);
    }

    /** @override */
    update() {
        const FALL_ACC = 1500;
        const TICK = this.game.clockTick;
        this.vel.y += FALL_ACC * TICK;
        this.move(TICK);
        console.log("update potion");

    }

    /** @override */
    updateBB() {
        super.updateBB();
    }

    addItemsToDruid(DRUID) {
        DRUID.game.health += 10;
    }
}