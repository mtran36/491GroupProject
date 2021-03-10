class Items extends Agent {
    constructor(game, x, y, spritesheet) {
        super(game, x, y, spritesheet);
        this.mapPipColor = 'yellow';
        this.emerging = false;
    }

    addItemsToDruid(DRUID) {
        console.warn("Item not define: ");
    }

    defineAgentCollisions(entity) {
        if (entity instanceof Druid) {
            this.removeFromWorld = true;
            this.game.druid.items.push(this);

            if (this.game.druid.itemSelection == null) {
                this.game.druid.itemSelection = 0;
            } else {
                this.game.druid.itemSelection = this.game.druid.items.length - 1;
            }

            this.addItemsToDruid(entity);
        }
    }

    /** @override */
    defineWorldCollisions(entity, collisions) {
        let x = this.worldBB.x;
        let y = this.worldBB.y;
        if (entity instanceof Ground) {
            if (collisions.down) {
                y = entity.worldBB.top - this.worldBB.height;
                this.vel.y = 0;
            }
        }
        this.worldBB.shift(x, y);
    }
}

class Potion extends Items {
    constructor(game, x, y, type = 0) {
        super(game, x, y - 100, "./Sprites/potions.png");
        this.setDimensions(1, 40, 55);
        //this.worldBB.display(this.game);
        this.type = type;
        this.loadAnimations();
    }

    static construct(game, params) {
        game.addEntity(new Potion(game, params.x, params.y));
    }

    /** @override */
    loadAnimations() {
        switch (this.type) {
            case 0:
                this.animations[0] = new Animator(
                    this.spritesheet, 5, 0, 35, 60, 1, 1, 0, false, true, false);
                break;
            case 1:
                this.animations[0] = new Animator(
                    this.spritesheet, 50, 0, 40, 60, 1, 1, 0, false, true, false);
                break;
            case 2:
                this.animations[0] = new Animator(
                    this.spritesheet, 90, 0, 45, 60, 1, 1, 0, false, true, false);
                break;
        }
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

        if (DRUID.health != DRUID.maxHealth) {
            switch (this.type) {
                case 0:
                    DRUID.health += 20;
                    break;
                case 1:
                    DRUID.health += 50;
                    break;
                case 2:
                    DRUID.health += DRUID.maxHealth;
                    break;
            }
            this.game.druid.items.pop(this);
            if (DRUID.health >= DRUID.maxHealth) {
                DRUID.health = DRUID.maxHealth;
                //this.game.druid.items.pop(this);
            }
        } else {
            DRUID.health = DRUID.maxHealth;
        }
    }
}

class Key extends Items {
    constructor(game, x, y) {
        super(game, x, y - 100, "./Sprites/keyTest.png");
        this.worldBB.display(this.game);
        this.loadAnimations();
    };

    static construct(game, params) {
        game.addEntity(new Potion(game, params.x, params.y));
    }

    update() {
        const FALL_ACC = 1500;
        const TICK = this.game.clockTick;
        this.vel.y += FALL_ACC * TICK;
        this.move(TICK);
    }

    addItemsToDruid(DRUID) {
        DRUID.keyCounter += 1;
        AUDIO_PLAYER.playSound("./Audio/Key.mp3");
    }

    loadAnimations() {
        this.animations[0] = new Animator(this.spritesheet, 0, 0, 65, 60, 1, 1, 0, false, true, false);
    }
}