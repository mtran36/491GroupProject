class SwordAttack extends Agent {
	constructor(game, x, y, duration) {
		super(game, x, y, "./Sprites/sword.png");
		this.setDimensions(2.5, 34, 15);
		this.duration = 0.5;
		this.attack = 1;
		this.damagedEnemies = [];
		this.force = 600;

		this.updateSwordPos();
		AUDIO_PLAYER.playSound("./Audio/SwordAttack.mp3");
	}

	/** @override */
	loadAnimations() {
		this.animations[0] = new Animator(
			this.spritesheet, 0, 0, 34, 15, 4, 0.1, 1, false, true, true);
		this.animations[1] = new Animator(
			this.spritesheet, 0, 0, 34, 15, 4, 0.1, 1, false, true, false);
	}

	/** @override */
	update() {
		const DRUID = this.game.druid;
		const TICK = this.game.clockTick;

		this.duration -= TICK;
		if (this.duration < 0) {
			this.removeFromWorld = true;
		}

		this.updateSwordPos();
		this.move(this.game.clockTick);
	}

	/** @override */
	updateSwordPos() {
		if (this.game.druid.facing === 0) { // facing left
			this.pos.x = this.game.druid.pos.x - this.scaleDim.x
				+ (this.duration * 75) + (this.scaleDim.x / 5);
			this.pos.y = this.game.druid.pos.y + this.game.druid.scaleDim.y / 2;
		} else { // facing right
			this.pos.x = this.game.druid.pos.x + this.game.druid.scaleDim.x
				- (this.duration * 75) - (this.scaleDim.x / 5);
			this.pos.y = this.game.druid.pos.y + this.game.druid.scaleDim.y / 2;
		}
    }

	/** @override */
	checkCollisions() {
		let that = this;
		this.game.entities.forEach(function (entity) {
			if (entity.agentBB && that.agentBB.collide(entity.agentBB) && that !== entity) {
				if (entity instanceof Enemy) {
					if (!that.damagedEnemies.includes(entity)) {
						entity.takeDamage(that.attack);
						that.damagedEnemies.push(entity);
					}
					entity.knockback(that);
				}
			}
		});
	}

	/** @override */
	draw(context) {
		this.animations[this.game.druid.facing].drawFrame(
			this.game.clockTick, context,
			this.pos.x, this.pos.y,
			this.scale, this.game.camera);
		this.worldBB.display(this.game);
		this.agentBB.forEach((BB) => {
			BB.display(this.game);
		});
	}
}

class BasicRangedAttack extends Agent {
	constructor(game, x, y, degree, radius, speed, attack, hasAnimation) {
		super(game, x, y, "./Sprites/energyball.png");
		this.setDimensions(1, radius * 2, radius * 2);

		var radian = degree * (Math.PI / 180);
		this.vel.x = Math.round((speed * Math.cos(radian)) * 100) / 100;
		this.vel.y = Math.round(-(speed * Math.sin(radian)) * 100) / 100;

		this.attack = attack;
		this.hit = false
		this.loadAnimations();

		this.owner = null;
		if (hasAnimation == false) {
			this.draw = function () {
				this.worldBB.display(this.game);
				this.agentBB.display(this.game);
			};
        }
	}

	/** @override */
	loadAnimations() {
		this.animations[0] = new Animator(
			this.spritesheet, 0, 0, 64, 64, 2, 0.3, 0, false, true, false);
		this.animations[1] = new Animator(
			this.spritesheet, 0, 0, 64, 64, 2, 0.3, 0, false, true, false);
	}

	changeAnimations(leftAnimation, rightAnimation) {
		this.animations[0] = leftAnimation;
		this.animations[1] = rightAnimation;
    }

	/** @override */
	update() {
		this.move(this.game.clockTick);
	}

	/** @override */
	checkCollisions() {
		let that = this;
		this.game.entities.forEach(function (entity) {
			if (entity.agentBB && that.agentBB.collide(entity.agentBB) && that !== entity) {
				if (entity instanceof Enemy) {
					if (that.owner instanceof TornadoAttack) {
						if(!that.owner.damagedEnemies.includes(entity)) {
							entity.knockup(that);
							that.owner.addAttackedEnemy(entity);
							entity.takeDamage(that.attack);
						}
					} else {
						entity.takeDamage(that.attack);
						that.removeFromWorld = true;
						if (that.owner instanceof ThunderAttack) {
							that.owner.freeProjectiles();
                        }
                    }
				}
			}
			if (entity.worldBB && that.worldBB.collide(entity.worldBB) && that !== entity) {
				if (entity instanceof Ground) {
					// touching a entity on side way
					if ((that.vel.x < 0 && that.lastWorldBB.left < entity.worldBB.right)
						|| (that.vel.x > 0 && that.lastWorldBB.right > entity.worldBB.left)) {
						that.removeFromWorld = true;
					}
					if ((that.vel.y < 0 && that.lastWorldBB.top < entity.worldBB.bottom)
						|| (that.vel.y > 0 && that.lastWorldBB.bottom > entity.worldBB.top)) {
						that.removeFromWorld = true;
					}
				}
			}
		});
	}
}

class TornadoAttack{
	constructor(game, x, y, degree) {
		this.game = game;
		this.pos = { x, y };
		this.degree = degree;
		this.attack = 0.8;
		this.speed = 400
		this.spritesheet = ASSET_LOADER.getImageAsset("./Sprites/tornado.png");
		this.projectiles = [];
		this.createProjectileList();
		this.addEntityList();
		this.damagedEnemies = [];
		this.existTime = 2;
		this.draw = function () { /* Do nothing. */ };
	}

	createProjectileList() {
		var RADIUS = 48;
		for (var i = 0; i < 2; i++) {
			if (i == 0) {
				var hasAnimation = true;
			} else {
				var hasAnimation = false;
            }
			this.projectiles.push(new BasicRangedAttack(
				this.game, this.pos.x, this.pos.y + i * RADIUS * 2,
				this.degree, RADIUS, this.speed, this.attack, hasAnimation));
			this.projectiles[i].force = 600;
			this.projectiles[i].owner = this;

			let leftAnimation = new Animator(
				this.spritesheet, 0, 20, 96, 192, 3, 0.2, 0, false, true, false);
			let rightAnimation = new Animator(
				this.spritesheet, 0, 20, 96, 192, 3, 0.2, 0, false, true, false);
			if (hasAnimation) {
				this.projectiles[0].changeAnimations(leftAnimation, rightAnimation);
			}
		}
	}

	addEntityList() {
		let that = this;
		this.projectiles.forEach(function (entity) {
			that.game.addEntity(entity);
		});
	}

	addAttackedEnemy(enemy) {
		this.damagedEnemies.push(enemy);
    }

	update() {
		this.existTime -= this.game.clockTick
		if (this.existTime <= 0) this.removeFromWorld = true;

		for (var i = 0; i < this.projectiles.length; i++) {
			if (this.removeFromWorld == true || this.projectiles[i].removeFromWorld == true) {
				this.removeFromWorld = true;
				for (var j = 0; j < this.projectiles.length; j++) {
					this.projectiles[j].removeFromWorld = true;
				}
			}
		}
    }
}

class ThunderAttack {
	constructor(game, x, y, degree) {
		this.game = game;
		this.pos = { x, y };
		this.degree = degree;
		this.attack = 2;
		this.speed = 700;
		this.spritesheet = ASSET_LOADER.getImageAsset("./Sprites/thunder.png");
		this.projectiles = [];
		this.createProjectileList();
		this.addEntityList();
		this.existTime = 5;
		this.draw = function () { /* Do nothing. */ };
	}

	createProjectileList() {
		var RADIUS = PARAMS.BLOCKWIDTH / 4;
		for (var i = 0; i < 4; i++) {
			if (i == 0) {
				var hasAnimation = true;
			} else {
				var hasAnimation = false;
			}
			this.projectiles.push(new BasicRangedAttack(
				this.game, this.pos.x + i * 2 * RADIUS, this.pos.y,
				this.degree, RADIUS,
				this.speed, this.attack, hasAnimation));
			this.projectiles[i].owner = this;

			let leftAnimation = new Animator(
				this.spritesheet, 0, 0, 144, 32, 1, 0.2, 0, false, true, true);
			let rightAnimation = new Animator(
				this.spritesheet, 0, 0, 144, 32, 1, 0.2, 0, false, true, false);
			if (hasAnimation) {
				this.projectiles[0].changeAnimations(leftAnimation, rightAnimation);
			}
		}
	}

	addEntityList() {
		let that = this;
		this.projectiles.forEach(function (entity) {
			that.game.addEntity(entity);
		});
	}

	freeProjectiles() {
		for (var i = 0; i < this.projectiles.length; i++) {
			this.projectiles[i].attack = 0;
			this.projectiles.removeFromWorld = true;
		}
	}

	update() {
		this.existTime -= this.game.clockTick
		if (this.existTime <= 0) this.removeFromWorld = true;

		for (var i = 0; i < this.projectiles.length; i++) {
			if (this.removeFromWorld == true || this.projectiles[i].removeFromWorld == true) {
				this.removeFromWorld = true;
				for (var j = 0; j < this.projectiles.length; j++) {
					this.projectiles[j].removeFromWorld = true;
				}
			}
		}
	}
}

/**
 * Basic attacks for ranged enemies. Flies at a fixed angle specified during construction.
 */
class EnemyRangedAttack extends Agent {
	constructor(game, x, y, xdist, ydist) {
		super(game, x, y, "./Sprites/TestEnemyAttack.png");
		this.setDimensions(1.5, 16, 16);
		this.force = 450;
		this.attack = 5;
		this.startX = x;
		this.startY = y;
		this.maxDist = 1200;
		if (ydist === 0) {
			this.vel.y = this.force;
		} else {
			let angle = Math.atan2(ydist, xdist);
			this.vel.y = this.force * Math.sin(angle);
			this.vel.x = this.force * Math.cos(angle);
		}
	}

	/** @override */
	loadAnimations() {
		this.animations[0] = new Animator(
			this.spritesheet, 0, 0, 16, 16, 1, 1, 0, false, true, false);
		this.animations[1] = new Animator(
			this.spritesheet, 0, 0, 16, 16, 1, 1, 0, false, true, false);
	}

	/** @override */
	update() {
		if (this.maxDist < Math.sqrt(Math.pow(this.startX - this.pos.x, 2) + Math.pow(this.startY - this.pos.y, 2))) {
			this.removeFromWorld = true;
		}
		this.move(this.game.clockTick);

	}

	/** @override
	 * If the projectile hits the druid, then damage druid and remove projectile.
	 * @param {Entity} entity
	 */
	defineAgentCollisions(entity) {
		if (entity instanceof Druid) {
			entity.takeDamage(this.attack);
			this.removeFromWorld = true;
		}
	}

	/** @override
	 * If the projectile hits a solid wall or door, then remove the projectile.
	 * @param {Entity} entity
	 * @param {{boolean up, boolean down, boolean left, boolean right}} collisions
	 */
	defineWorldCollisions(entity, collisions) {
		if (entity instanceof Ground || entity instanceof Door) {
			if (collisions.up || collisions.down || collisions.left || collisions.right) {
				this.removeFromWorld = true;
			}
		}
	}
}

