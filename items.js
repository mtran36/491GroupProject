class Items extends Agent {
    constructor(game, x, y, spritesheet) {
        super(game, x, y, spritesheet);
        this.emerging = false;
    }
}

class Potions extends Items {
    constructor(game, x, y) {
        super(game, x, y, "./Sprites/testpotion.png");
    }

    /** @override */
    loadAnimations() {
        this.animations[0] = new Animator(
            this.spritesheet, 0, 0, 32, 32, 1, 1, 0, false, true, false);
    }

    /** @override */
    updateBB() {
        super.updateBB();
        //this.agentBB.radius = this.agentBB.radius - 3;
        //this.worldBB = new BoundingBox(
        //    this.pos.x + 2, this.pos.y + 4, this.dim.x - 5, this.dim.y - 6);
    }
}