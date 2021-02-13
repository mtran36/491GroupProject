class Items extends Agent {
    constructor(game, x, y, spritesheet) {
        super(game, x, y, spritesheet);
        this.emerging = false;
    }

    /** @override */
    update() {
        this.checkDruidCollision();
    }

    checkDruidCollision() {
        const DRUID = this.game.druid;

        if (this.worldBB.collide(DRUID.worldBB)) {
            this.removeFromWorld = true;
            this.addItemsToDruid(DRUID);
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
    }

    /** @override */
    updateBB() {
        super.updateBB();
    }
}