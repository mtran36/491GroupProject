
class LionBoss extends Enemy{
    constructor(game, x, y) {
        super(game, x, y, "");
        this.setDimensions(3.5, 100, 100);
        this.state = 0;
        this.attack = [5, 10, 10, 7, 0];
        this.force = 1000;
        this.worldBB = new BoundingBox(this.pos.x + 85, this.pos.y + 125, 165, 170);
        let thisCenter = this.worldBB.centerPoint();
        this.agentBB = [new BoundingCircle(thisCenter.x, thisCenter.y, this.worldBB.width / 2.3)];
        this.health = 25;
        this.battleStarted = false;
        this.sightRange = 400;
        this.stateChange = 0;
        this.runCount = 0;
        this.velMax = { x: 500, y: 1200 };
        this.hasAttacked = false;
        this.ACC.y = 2000;
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
        this.animations[0][1] = new Animator(this.spritesheet, 0, 0, 100, 100, 22, 0.1, 0, false, true, false);

        //Run Animation
        this.spritesheet = ASSET_LOADER.getImageAsset("./Sprites/LionRun.png");
        this.animations[1][0] = new Animator(this.spritesheet, 0, 0, 100, 100, 8, 0.1, 0, false, true, true);
        this.animations[1][1] = new Animator(this.spritesheet, 0, 0, 100, 100, 8, 0.1, 0, false, true, false);

        //Attack Animation
        this.spritesheet = ASSET_LOADER.getImageAsset("./Sprites/LionAttack.png");
        this.animations[2][0] = new Animator(this.spritesheet, 0, 0, 100, 100, 34, 0.05, 0, false, true, true);
        this.animations[2][1] = new Animator(this.spritesheet, 0, 0, 100, 100, 34, 0.05, 0, false, true, false);

        //Jump Animation
        this.spritesheet = ASSET_LOADER.getImageAsset("./Sprites/LionAttack.png");
        this.animations[3][0] = new Animator(this.spritesheet, 400, 0, 100, 100, 6, 0.1, 0, false, true, true, false, true);
        this.animations[3][1] = new Animator(this.spritesheet, 400, 0, 100, 100, 6, 0.1, 0, false, true, false, false, true);

        //Death Animation
        this.spritesheet = ASSET_LOADER.getImageAsset("./Sprites/LionDeath.png");
        this.animations[4][0] = new Animator(this.spritesheet, 0, 0, 100, 100, 28, 0.1, 0, false, false, true, false, true);
        this.animations[4][1] = new Animator(this.spritesheet, 0, 0, 100, 100, 28, 0.1, 0, false, false, false, false, true);

    }

    knockback() { }

    takeDamage(entity) {
        if (this.state === 4) {
            return;
        }
        this.battleStarted = true;
        this.health -= entity.attack;
        AUDIO_PLAYER.playSound("./Audio/EnemyDamage.mp3");
        if (this.health <= 0) {
            this.state = 4;
            this.deathtimer = 4;
            this.agentBB = [];
            this.update = () => {
                this.deathtimer -= this.game.clockTick;
                if (this.deathtimer < 0) {
                    this.game.screen = this.game.camera.winScreen;
                }
            }
        }
    }

    update() {
        this.vel.y += this.game.clockTick * this.ACC.y;
        if (!this.battleStarted) {
            if (this.canSee(this.game.druid)) {
                this.battleStarted = true;
            } else {
                this.move(this.game.clockTick);
                return;
            }
        }
        this.stateChange -= this.game.clockTick;
        let druidCenter = this.game.druid.worldBB.centerPoint();
        let thisCenter = this.worldBB.centerPoint();
        console.warn(this.stateChange);
        if (this.stateChange < 0) {
            if (this.state !== 3 && this.state !== 1 && Math.random() < 0.2) {
                this.state = 3;
                this.stateChange = 100;
                this.vel.y = -900;
                let diffx = this.game.druid.pos.x - this.pos.x;
                this.vel.x = diffx * 1.5;
                this.hasAttacked = false;
            } else {
                if (this.state !== 1) {
                    this.state = 1;
                    this.facing = thisCenter.x > druidCenter.x ? 0 : 1;
                    this.runCount++;
                    this.stateChange = Math.random() + 0.5;
                    this.hasAttacked = false;
                } else if (this.state === 1) {
                    this.state = 2;
                    this.stateChange = 1.7;
                    if (this.runCount > 3) {
                        this.runCount = 0;
                        this.state = 0;
                        this.stateChange = Math.random() * 2 + 1;
                    }
                }
            }
        }
        switch (this.state) {
            case 0:
                this.vel.x = 0;
                break;
            case 1:
                this.vel.x = this.facing === 0 ? -this.velMax.x : this.velMax.x;
                break;
            case 2:
                if (this.stateChange < 1.1 & !this.hasAttacked) {
                    let x = thisCenter.x + (this.facing === 0 ? -30 : 30);
                    this.game.addEntity(
                        new LionBossAttack(
                            this.game,
                            x,
                            thisCenter.y,
                            this.scaleDim.x / 2.3
                        )
                    );
                    this.hasAttacked = true;
                }
                this.vel.x = 0;
                break;
            case 3:
                break;
        }
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
                if (this.state === 3) {
                    this.state = 0;
                    this.stateChange = Math.random() * 2 + 1;
                }
			}
			if (collisions.up) {
				y = entity.worldBB.bottom;
				this.vel.y = 0;
			}
			if (collisions.left) {
				x = entity.worldBB.right;
                this.vel.x = 0;
                this.stateChange = 0;
			}
			if (collisions.right) {
				x = entity.worldBB.left - this.worldBB.width;
                this.vel.x = 0;
                this.stateChange = 0;
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

class LionBossAttack extends Agent {
    constructor(game, x, y, radius) {
        super(game, x, y);
        this.worldBB = new BoundingBox(0, 0, 0, 0);
        this.agentBB = [new BoundingCircle(x, y, radius)];
        this.time = 0.7;
        this.attack = 10;
        this.force = 1000;
    }

    update() {
        this.time -= this.game.clockTick;
        if (this.time < 0) {
            this.removeFromWorld = true;
        }

        this.move(this.game.clockTick);
    }

    loadAnimations() { };

    defineWorldCollisions(entity, collisions) { };

    defineAgentCollisions(entity) {
        if (entity instanceof Druid) {
            let druidCenter = this.game.druid.worldBB.centerPoint();
            let left = this.agentBB[0].x > druidCenter.x;
            entity.takeDamage(this.attack);
            entity.knockback(this, left ? -7 * Math.PI / 8 : -Math.PI / 8);
        }
    }

    draw(context) {
        this.agentBB[0].display(this.game);
    };
}