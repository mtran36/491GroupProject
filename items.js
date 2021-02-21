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
        super(game, x, y - 100, "./Sprites/potions.png");
        this.setDimensions(1, 45, 55);
    }

    /** @override */
    loadAnimations() {
        //this.animations[0] = new Animator(
        //    this.spritesheet, 5, 0, 35, 60, 1, 1, 0, false, true, false); // level 1 potion
        //this.animations[0] = new Animator(
        //    this.spritesheet, 50, 0, 40, 60, 1, 1, 0, false, true, false); // level 2 potion
        this.animations[0] = new Animator(
            this.spritesheet, 90, 0, 45, 60, 1, 1, 0, false, true, false); // level 3 potion
        this.animations[1] = new Animator(
            this.spritesheet, 90, 0, 45, 60, 1, 1, 0, false, true, false); 
    }

    /** @override */
    update() {
        const FALL_ACC = 1500;
        const TICK = this.game.clockTick;
        this.vel.y += FALL_ACC * TICK;
        this.move(TICK);
    }

    addItemsToDruid(DRUID) {
        AUDIO_PLAYER.playSound("./Audio/Potion.mp3");
        if (DRUID.health === DRUID.maxHealth) {
            DRUID.potionCounter += 1;
        } else {
            DRUID.health += 100;
            if (DRUID.health >= DRUID.maxHealth) {
                DRUID.health = DRUID.maxHealth;
            }
        }
    }
}