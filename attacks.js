class SwordAttack extends Agent {
	constructor(game, x, y, duration) {
		super(game, x, y, "./Sprites/sword.png");

		this.setDimensions(2.5, 34, 15);
		this.duration = 0.5;
		this.attack = 1;
		this.force = 600;
		this.damagedEnemies = [];
		this.defineWorldCollisions = () => { /* Do nothing */ };

		this.updatePos();
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
		const TICK = this.game.clockTick;

		this.duration -= TICK;
		if (this.duration <= 0) {
			this.removeFromWorld = true;
		}
		this.updatePos();
		this.move(TICK);
	}

	/** @override */
	updatePos() {
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
	defineAgentCollisions(entity) {
		if (entity instanceof Enemy) {
			if (!this.damagedEnemies.includes(entity)) {
				entity.takeDamage(this.attack);
				this.damagedEnemies.push(entity);
			}
			entity.knockback(this);
        }
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

/**
 * Basic Ranged attack with changable shooting angel, speed, attack, and animation.
 */
class BasicRangedAttack extends Agent {
	/**
	 * Creates a new ranged attack to be extended.
	 * @param {GameEngine} game Instance of the game.
	 * @param {number} x Horizontal coordinate to place attack.
	 * @param {number} y Vertical coordinate to place attack.
	 * @param {number} degree Degree the attack is shooting out.
	 * @param {number} radius Size of the agent bounding box.
	 * @param {number} speed Speed of the attack.
	 * @param {number} attack Attack value to be subtracted from target health.
	 * @param {boolean} hasAnimation Determines if this ranged attack has an animation.
	 */
	constructor(game, x, y, degree, radius, speed, attack, hasAnimation) {
		super(game, x, y, "./Sprites/energyball.png");
		this.setDimensions(1, radius * 2, radius * 2);

		let radian = degree * (Math.PI / 180);
		this.vel.x = Math.round((speed * Math.cos(radian)) * 100) / 100;
		this.vel.y = Math.round(-(speed * Math.sin(radian)) * 100) / 100;
		this.attack = attack;
		this.attackOwner = null;

		if (hasAnimation === false) {
			this.draw = function () {
				this.worldBB.display(this.game);
				this.agentBB.forEach((BB) => {
					BB.display(this.game);
				});
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

	/**
	 * Change default animation of the ranged attack.
	 * @param {any} leftAnimation animation going left.
	 * @param {any} rightAnimation animation going right.
	 */
	changeAnimations(leftAnimation, rightAnimation) {
		this.animations[0] = leftAnimation;
		this.animations[1] = rightAnimation;
    }

	/** @override */
	update() {
		this.move(this.game.clockTick);
	}

	/** @override */
	defineWorldCollisions(entity, collision) {
		if (entity instanceof Ground) {
			if (collision.left || collision.right) this.removeFromWorld = true;
        }
	}

	/** @override */
	defineAgentCollisions(entity) {
		if (entity instanceof Enemy) {
			if (this.attackOwner instanceof TornadoAttack) {
				if (!this.attackOwner.damagedEnemies.includes(entity)) {
					entity.knockup(this);
					this.attackOwner.addAttackedEnemy(entity);
					entity.takeDamage(this.attack);
				}
			} else {
				entity.takeDamage(this.attack);
				this.removeFromWorld = true;
				if (this.attackOwner instanceof ThunderAttack) {
					this.attackOwner.freeProjectiles();
				}
            }
		}
    }
}

/** 
 * A special attack consists of mutiple ranged attack bounding boxes that would knock up 
 * enemy and deal damage. 
 */
class TornadoAttack {
	/**
	 * @param {GameEngine} game Instance of the game.
	 * @param {number} x Horizontal coordinate to place attack.
	 * @param {number} y Vertical coordinate to place attack.
	 * @param {number} degree Degree the attack is shooting out.
	 */
	constructor(game, x, y, degree) {
		this.game = game;
		this.pos = { x, y };
		this.degree = degree;

		this.attack = 0.8;		// attack value
		this.speed = 400		// speed of the attack
		this.existTime = 2;		// the time the attack would last

		this.spritesheet = ASSET_LOADER.getImageAsset("./Sprites/tornado.png");
		this.projectiles = [];
		this.createProjectileList();
		this.addEntityList();
		this.damagedEnemies = [];

		this.draw = function () { /* Do nothing. */ };
	}

	/** 
	 * Create a list of ranged attacks for this attack. 
	 */
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

	/** 
	 * Add a list of ranged attacks to the game. 
	 */
	addEntityList() {
		let that = this;
		this.projectiles.forEach(function (entity) {
			that.game.addEntity(entity);
		});
	}

	/** 
	 * Add an attacked enemy to the attacked enemy list. 
	 */
	addAttackedEnemy(enemy) {
		this.damagedEnemies.push(enemy);
    }

	/** @override */
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
 * A special attack consists of mutiple ranged attack bounding boxes that would deal a
 * one-time damage. 
 */
class ThunderAttack {
	/**
	 * @param {GameEngine} game Instance of the game.
	 * @param {number} x Horizontal coordinate to place attack.
	 * @param {number} y Vertical coordinate to place attack.
	 * @param {number} degree Degree the attack is shooting out.
	 */
	constructor(game, x, y, degree) {
		this.game = game;
		this.pos = { x, y };
		this.degree = degree;

		this.attack = 2;
		this.speed = 700;
		this.existTime = 5;

		this.spritesheet = ASSET_LOADER.getImageAsset("./Sprites/thunder.png");
		this.projectiles = [];
		this.createProjectileList();
		this.addEntityList();
		
		this.draw = function () { /* Do nothing. */ };
	}

	/** 
	 * Create a list of ranged attacks for this attack. 
	 */
	createProjectileList() {
		const RADIUS = PARAMS.BLOCKWIDTH / 4;
		let i, hasAnimation;

		for (i = 0; i < 4; i++) {
			hasAnimation = i === 0;
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

	/** Add a list of ranged attacks to the game. */
	addEntityList() {
		let that = this;
		this.projectiles.forEach(function (entity) {
			that.game.addEntity(entity);
		});
	}

	/** Remove all the ranged attacks that own by this attack. */
	freeProjectiles() {
		for (var i = 0; i < this.projectiles.length; i++) {
			this.projectiles[i].attack = 0;
			this.projectiles.removeFromWorld = true;
		}
	}

	/** @override */
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

