class Items extends Agent {
    constructor(game, x, y, spritesheet) {
        super(game, x, y, spritesheet);
        this.defineAgentCollisions = () => { };
        this.emerging = false;
        this.updateBB();
    }

    /** @override */
    update() {
        this.checkCollisions();
    }

    /** @override */
    defineWorldCollisions(entity, collisions) {
        if (entity instanceof Druid) {
            this.removeFromWorld = true;
            this.addItemsToDruid(this.game.druid);
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

    }

    /** @override */
    updateBB() {
        super.updateBB();
    }
}