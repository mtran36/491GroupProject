
class LionBoss extends Enemy{
    constructor(game, x, y) {
        super(game, x, y, "");
        this.setDimensions(3.5, 100, 100);
        this.state = 0;
        this.attack = [5, 10, 10, 7, 0];
        this.force = 1000;
        this.worldBB = new BoundingBox(this.pos.x + 85, this.pos.y + 125, 165, 170);
        let thisCenter = this.worldBB.centerPoint();
        this.agentBB = [new BoundingCircle(thisCenter.x, thisCenter.y, this.worldBB.width / 2)];
        this.health = 2;

    } 

    static construct(game, params) {
        game.addEntity(new LionBoss(
            game, params.x * PARAMS.TILE_WIDTH, params.y * PARAMS.TILE_WIDTH));
    }

    loadAnimations() {
        let i;
        for (i = 5; i > 0; i--) {
            this.animations.push([]);
        }

        //Idle Animation
        this.spritesheet = ASSET_LOADER.getImageAsset("./Sprites/LionIdle.png");
        this.animations[0][0] = new Animator(this.spritesheet, 0, 0, 100, 100, 22, 0.1, 0, false, true, true);
        this.animations[0][1] = new Animator(this.spritesheet, 0, 0, 100, 100, 22, 0.1, 0, false, true, true);

        //Run Animation
        this.spritesheet = ASSET_LOADER.getImageAsset("./Sprites/LionRun.png");
        this.animations[1][0] = new Animator(this.spritesheet, 0, 0, 100, 100, 8, 0.1, 0, false, true, true);
        this.animations[1][1] = new Animator(this.spritesheet, 0, 0, 100, 100, 8, 0.1, 0, false, true, true);

        //Attack Animation
        this.spritesheet = ASSET_LOADER.getImageAsset("./Sprites/LionAttack.png");
        this.animations[2][0] = new Animator(this.spritesheet, 0, 0, 100, 100, 34, 0.1, 0, false, true, true);
        this.animations[2][1] = new Animator(this.spritesheet, 0, 0, 100, 100, 34, 0.1, 0, false, true, true);

        //Jump Animation
        this.spritesheet = ASSET_LOADER.getImageAsset("./Sprites/LionAttack.png");
        this.animations[3][0] = new Animator(this.spritesheet, 400, 0, 100, 100, 6, 0.1, 0, false, true, true);
        this.animations[3][1] = new Animator(this.spritesheet, 400, 0, 100, 100, 6, 0.1, 0, false, true, true);

        //Death Animation
        this.spritesheet = ASSET_LOADER.getImageAsset("./Sprites/LionDeath.png");
        this.animations[4][0] = new Animator(this.spritesheet, 0, 0, 100, 100, 28, 0.1, 0, false, false, true, false, true);
        this.animations[4][1] = new Animator(this.spritesheet, 0, 0, 100, 100, 28, 0.1, 0, false, false, true, false, true);

    }

    knockback() { }

    takeDamage(entity) {
        if (this.state === 4) return;
        this.health -= entity.attack;
        AUDIO_PLAYER.playSound("./Audio/EnemyDamage.mp3");
        if (this.health <= 0) {
            this.state = 4;
            this.deathtimer = 4;
            this.update = () => {
                this.deathtimer -= this.game.clockTick;
                if (this.deathtimer < 0) {
                    this.game.screen = this.game.camera.winScreen;
                }
            }
        }
    }

    update() {

        this.move(this.game.clockTick);
    }

	/** @override */
	defineWorldCollisions(entity, collisions) {
		let x = this.worldBB.x;
		let y = this.worldBB.y;
		if (entity instanceof Ground || entity instanceof Enemy || entity instanceof Door) {
			if (collisions.down) {
				y = entity.worldBB.top - this.worldBB.height;
				this.vel.y = 0;
			}
			if (collisions.up) {
				y = entity.worldBB.bottom;
				this.vel.y = 0;
			}
			if (collisions.left) {
				x = entity.worldBB.right;
				if (!(this.angry && this.druidLeft)) {
					this.vel.x = 0;
				}
			}
			if (collisions.right) {
				x = entity.worldBB.left - this.worldBB.width;
				if (!(this.angry && !this.druidLeft)) {
					this.vel.x = 0;
				}
			}
		}
        this.worldBB.shift(x, y);
    }

    defineAgentCollisions(entity) {
        if (entity instanceof Druid && this.state !== 4) {
            let thisCenter = this.worldBB.centerPoint();
            let druidCenter = this.game.druid.worldBB.centerPoint();
            let left = thisCenter.x > druidCenter.x;
            entity.takeDamage(this.attack[this.state]);
            entity.knockback(this, left ? -7 * Math.PI / 8 : -Math.PI / 8);
        }
    }

    /** @override */
    draw(context) {
        this.animations[this.state][this.facing].drawFrame(
            this.game.clockTick, context,
            this.pos.x, this.pos.y,
            this.scale, this.game.camera);
        this.worldBB.display(this.game);
        this.agentBB.forEach((BB) => {
            BB.display(this.game);
        });
    }
}
