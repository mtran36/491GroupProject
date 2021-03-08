/**
 * Superclass for all enemies that consolidates some common code and attributes. Also 
 * allows for easier detection of enemies colliding with enemies.
 */
class Enemy extends Agent {
	constructor(game, x, y, spritesheet, prize = "Potion", prizeRate) {
		super(game, x, y, spritesheet);
		Object.assign(this, { prize, prizeRate });
		// Default values that may be overriden in specific enemy classes.
		this.attack = 5;
		this.defense = 0;
		this.health = 3;
		this.ACC = { x: 1000, y: 1500 };
		this.velMax = { x: 400, y: 700 };
		this.sightRange = 400;
		this.sight = new BoundingCircle(this.pos.x, this.pos.y, this.sightRange);
		this.defineAgentCollisions = function () { /* Do nothing */ };
	}

	/**
	 * Uses an attack agent to knock this enemy in a direction. The angle of the collision
	 * is determined and then the force is used as a force vector with that angle to 
	 * detemine the x and y components of the force vector. The x and y components of the 
	 * force vector are then applied to the enemies x and y velocities respectively.
	 * @param {Agent} attack Agent that has a knockback force value defined.
	 */
	knockback(attack, angle) {
		let thisCenter = this.worldBB.centerPoint();
		let attackCenter = attack.worldBB.centerPoint();
		if (!angle) {
			angle = Math.atan2(
				thisCenter.y - attackCenter.y,
				thisCenter.x - attackCenter.x);
		}
		this.vel.y = attack.force * Math.sin(angle);
		this.vel.x = attack.force * Math.cos(angle);
	}

	/**
	 * Spawns a prize at this Enemy location if PARAMS.DEBUG is true or on a random
	 * chance based on this.prizeRate. Prize rate is a standard probablity value in range
	 * 0-1.
	 */
	spawnPrize() {
		let thisCenter = this.worldBB.centerPoint();
		if (Math.random() < this.prizeRate) {
			switch (this.prize) {
				case 'Potion':
					this.game.addEntity(new Potion(
						this.game, thisCenter.x, thisCenter.y, 0));
					break;
				case 'PotionMid':
					this.game.addEntity(new Potion(
						this.game, thisCenter.x, thisCenter.y, 1));
					break;
				case 'PotionHigh':
					this.game.addEntity(new Potion(
						this.game, thisCenter.x, thisCenter.y, 2));
					break;
				case 'Key':
					this.game.addEntity(new Key(
						this.game, thisCenter.x, thisCenter.y));
					break;
			}
		}
	}

	/**
	 * 
	 * @param {any} DRUID
	 */
	canSee(DRUID) {
		let thisCenter = this.worldBB.centerPoint();
		let result = false;
		this.sight = new BoundingCircle(thisCenter.x, thisCenter.y, this.sightRange);
		DRUID.agentBB.forEach((BB) => {
			if (this.sight.collide(BB)) {
				result = true;
			}
		});
		return result;
	}

	/**
	 * 
	 * @param {any} damage
	 */
	takeDamage(entity) {
		super.takeDamage(entity.attack);
		if (this.removeFromWorld) {
			AUDIO_PLAYER.playSound("./Audio/EnemyDeath.mp3");
		} else {
			AUDIO_PLAYER.playSound("./Audio/EnemyDamage.mp3");
		}
	}
}

/** 
 * Flies straight at the druid, colliding with enemies and blocks. Deals damage by 
 * touching the druid.
 */
class Fly extends Enemy {
	constructor(game, x, y, prize, prizeRate) {
		super(game, x, y, "./Sprites/Fly.png", prize, prizeRate);
		this.setDimensions(1.5, 32, 32);
		// Override default values
		this.ACC = { x: 700, y: 700 };
		this.attack = 3;
		this.sightRange = 500;
		this.health = 1;
		// End override
		this.velMax = { x: 400, y: 400 };
		this.left = false;
		this.up = false;
		this.seesDruid = false;
		this.accelerate = false;
		this.xOffset = 5;
	}

	static construct(game, params) {
		game.addEntity(new Fly(game,
			params.x * PARAMS.TILE_WIDTH,
			params.y * PARAMS.TILE_WIDTH,
			params.prize, params.prizeRate));
	}

	/** @override */
	loadAnimations() {
		this.animations[1] = new Animator(
			this.spritesheet, 0, 0, 32, 32, 8, 0.083, 0, false, true, false);
		this.animations[0] = new Animator(
			this.spritesheet, 0, 0, 32, 32, 8, 0.083, 0, false, true, true);
	}

	/** @override */
	update() {
		let druidCenter = this.game.druid.worldBB.centerPoint();
		if (this.canSee(this.game.druid)) {
			if (!this.seesDruid) {
				AUDIO_PLAYER.playSound("./Audio/FlyBuzz.mp3");
			}
			this.seesDruid = true;
			this.accelerate = true;
			this.left = this.sight.x > druidCenter.x;
			this.up = this.sight.y > druidCenter.y;
		} else {
			this.seesDruid = false;
			this.accelerate = false;
		}
		var velChangeX = this.ACC.x * this.game.clockTick;
		var velChangeY = this.ACC.y * this.game.clockTick;
		if (this.accelerate) {
			if (this.left) {
				this.vel.x = Math.max(-this.velMax.x, this.vel.x - velChangeX);
			} else {
				this.vel.x = Math.min(this.velMax.x, this.vel.x + velChangeX);
			}
			if (this.up) {
				this.vel.y = Math.max(-this.velMax.y, this.vel.y - velChangeY);
			} else {
				this.vel.y = Math.min(this.velMax.y, this.vel.y + velChangeY);
			}
		} else {
			if (this.vel.x > 0) {
				this.vel.x = Math.max(0, this.vel.x - velChangeX);
			} else {
				this.vel.x = Math.min(0, this.vel.x + velChangeX);
			}
			if (this.vel.y > 0) {
				this.vel.y = Math.max(0, this.vel.y - velChangeY);
			} else {
				this.vel.y = Math.min(0, this.vel.y + velChangeY);
			}
		}
		if (this.left) {
			this.xOffset = 5;
		} else {
			this.xOffset = -5;
		}
		this.move(this.game.clockTick);
	}

	/** @override */
	defineWorldCollisions(entity, collisions) {
		let bounce = false;
		let x = this.worldBB.x;
		let y = this.worldBB.y;
		if (entity instanceof Ground || entity instanceof Enemy || entity instanceof Door) {
			if (collisions.down) {
				y = entity.worldBB.top - this.worldBB.height;
				if (this.vel.y > 100) {
					bounce = true;
				}
				this.vel.y = -this.vel.y;
			}
			if (collisions.up) {
				y = entity.worldBB.bottom;
				if (this.vel.y < -100) {
					bounce = true;
				}
				this.vel.y = -this.vel.y;
			}
			if (collisions.left) {
				x = entity.worldBB.right;
				if (this.vel.x < -100) {
					bounce = true;
				}
				this.vel.x = -this.vel.x;
			}
			if (collisions.right) {
				x = entity.worldBB.left - this.worldBB.width;
				if (this.vel.x > 100) {
					bounce = true;
				}
				this.vel.x = -this.vel.x;
			}
		}
		if (bounce) {
			AUDIO_PLAYER.playSound("./Audio/EnemyBounce.mp3");
		}
		this.worldBB.shift(x, y);
	}

	draw(context) {
		this.animations[this.facing].drawFrame(
			this.game.clockTick, context,
			this.pos.x, this.pos.y,
			this.scale, this.game.camera, this.xOffset);
		this.worldBB.display(this.game);
		this.agentBB.forEach((BB) => {
			BB.display(this.game);
		});
	}
}

/**
 * Flies straight at player, colliding with enemies and blocks. Shoots a ranged attack at
 * the druids location.
 */
class RangedFly extends Fly {
	constructor(game, x, y, prize, prizeRate) {
		super(game, x, y, prize, prizeRate);
		this.setDimensions(2.5, 32, 32);
		this.sightRange = 900;
		this.ACC = { x: 500, y: 500 };
		this.health = 3;
		this.flyTime = 2.5;
		this.currFlyTime = 0;
		this.canShoot = false;
	}

	static construct(game, params) {
		game.addEntity(new RangedFly(game,
			params.x * PARAMS.TILE_WIDTH,
			params.y * PARAMS.TILE_WIDTH,
			params.prize, params.prizeRate));
	}

	/** @override */
	update() {
		let thisCenter = this.worldBB.centerPoint();
		let druidCenter = this.game.druid.worldBB.centerPoint();

		if (this.canShoot) {
			if (this.vel.x > 0) {
				this.vel.x = Math.max(
					0, this.vel.x - this.ACC.x * this.game.clockTick);
			} else {
				this.vel.x = Math.min(
					0, this.vel.x + this.ACC.x * this.game.clockTick);
			}
			if (this.vel.y > 0) {
				this.vel.y = Math.max(
					0, this.vel.y - this.ACC.y * this.game.clockTick);
			} else {
				this.vel.y = Math.min(
					0, this.vel.y + this.ACC.y * this.game.clockTick);
			}
			if (this.vel.x === 0 && this.vel.y === 0) {
				this.game.addEntity(new EnemyRangedAttack(this.game,
					thisCenter.x, thisCenter.y,
					druidCenter.x - thisCenter.x,
					druidCenter.y - thisCenter.y));
				this.canShoot = false;
			}
			this.move(this.game.clockTick);
		} else {
			super.update();
			if (this.accelerate && this.currFlyTime > this.flyTime) {
				this.canShoot = true;
				this.currFlyTime = 0;
			} else {
				this.currFlyTime += this.game.clockTick;
			}
		}
	}
}

/**
 * Moves back and forth on a platform or the ground. Turns around when it reaches the end
 * of a platform. Deals damage to the druid by touching them.
 */
class Beetle extends Enemy{
	constructor(game, x, y, prize, prizeRate) {
		super(game, x, y, "./Sprites/Snail.png", prize, prizeRate);
		this.setDimensions(3.3, 32, 24)
		this.loadAnimations();

		this.velMax.x = 200;
		this.vel.x = -200;
		this.farLeft = -1;
		this.farRight = -1;
		this.groundCheckLeft = new BoundingBox(
			this.worldBB.left, this.worldBB.bottom, 1, 1);
		this.groundCheckRight = new BoundingBox(
			this.worldBB.right - 1, this.worldBB.bottom, 1, 1);
		this.leftGround = false;
		this.rightGround = false;
		this.angryTimer = 0;
		this.angry = false;
		this.druidLeft = false;
	}

	/**
	 * If the beetles leftmost position is not on ground and it is moving in the left
	 * direction and it is not moving vertically, then it will start moving right.
	 * If the beetle's rightmost position is not on ground and it is moving in the right
	 * direction and it is not moving vertically, then it will start moving left.
	 */
	avoidLedge() {
		if (this.vel.y !== 0 || (this.rightGround && this.leftGround)) return;
		this.game.entities.forEach((entity) => {
			if (entity instanceof Ground) {
				if (this.groundCheckLeft.collide(entity.worldBB)) {
					this.leftGround = true;
				}
				if (this.groundCheckRight.collide(entity.worldBB)) {
					this.rightGround = true;
				}
			}
		});
		if ((this.vel.x > 0 && !this.rightGround)
			|| (this.vel.x < 0 && !this.leftGround)) {
			this.vel.x = -this.vel.x;
			this.updateFacing();
		}
	}

	draw(context) {
		super.draw(context);
		if (PARAMS.DEBUG) {
			this.groundCheckLeft.display(this.game);
			this.groundCheckRight.display(this.game);
		}
	}

	takeDamage(entity) {
		super.takeDamage(entity);
		if (!(entity instanceof SwordAttack)) {
			this.angryTimer = 3.5;
		}
	}

	static construct(game, params) {
		game.addEntity(new Beetle(game,
			params.x * PARAMS.TILE_WIDTH,
			params.y * PARAMS.TILE_WIDTH,
			params.prize, params.prizeRate));
	}

	/** @override */
	loadAnimations() {
		this.idleAnim = [];
		this.angryAnim = [];

		this.spritesheet = ASSET_LOADER.getImageAsset("./Sprites/Snail.png");
		this.idleAnim[1] = new Animator(
			this.spritesheet, 5, 0, 32, 24, 15, 0.1, 6, false, true, true);
		this.idleAnim[0] = new Animator(
			this.spritesheet, 5, 0, 32, 24, 15, 0.1, 6, false, true, false);

		this.spritesheet = ASSET_LOADER.getImageAsset("./Sprites/SnailAngry.png");
		this.angryAnim[1] = new Animator(
			this.spritesheet, 5, 0, 32, 24, 15, 0.033, 6, false, true, true);
		this.angryAnim[0] = new Animator(
			this.spritesheet, 5, 0, 32, 24, 15, 0.033, 6, false, true, false);

		this.animations = this.idleAnim;
	}

	/** @override */
	update() {
		if (!this.angry && this.angryTimer == 3.5) {
			this.velMax.x *= 2.5;
			this.animations = this.angryAnim;
			this.angry = true;
		} else if ( this.angry && this.angryTimer < 0 ) {
			this.velMax.x /= 2.5;
			this.animations = this.idleAnim;
			this.angry = false;
		}
		this.angryTimer -= this.game.clockTick;

		// Cap speed to return beetle to normal speed after being hit
		if (this.facing === 0) { // Facing left
			if (this.vel.x > this.velMax.x) {
				this.vel.x = Math.max(
					this.vel.x - this.ACC.x * this.game.clockTick, this.velMax.x);
			} else {
				this.vel.x = Math.min(
					this.vel.x + this.ACC.x * this.game.clockTick, -this.velMax.x);
			}
		} else { // Facing right
			if (this.vel.x > this.velMax.x) {
				this.vel.x = Math.max(
					this.vel.x - this.ACC.x * this.game.clockTick, this.velMax.x);
			} else {
				this.vel.x = Math.min(
					this.vel.x + this.ACC.x * this.game.clockTick, this.velMax.x);
			}
		}
		this.vel.y = Math.min(
			this.vel.y + this.game.clockTick * this.ACC.y,
			this.velMax.y);
		this.groundCheckLeft = new BoundingBox(
			this.worldBB.left - 4, this.worldBB.bottom, 1, 5);
		this.groundCheckRight = new BoundingBox(
			this.worldBB.right - 1, this.worldBB.bottom, 1, 5);
		this.leftGround = false;
		this.rightGround = false;
		if (this.angry) {
			let thisCenter = this.worldBB.centerPoint();
			let druidCenter = this.game.druid.worldBB.centerPoint();
			this.druidLeft = thisCenter.x > druidCenter.x;
			if (thisCenter.x < druidCenter.x - PARAMS.TILE_WIDTH * 3 && this.vel.x < 0 ||
				thisCenter.x > druidCenter.x + PARAMS.TILE_WIDTH * 3 && this.vel.x > 0) {
				this.vel.x = -this.vel.x;
			}
		}
		this.move(this.game.clockTick);
		if (!this.angry) {
			this.avoidLedge();
		}
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
					this.vel.x = -this.vel.x;
				}
			}
			if (collisions.right) {
				x = entity.worldBB.left - this.worldBB.width;
				if (!(this.angry && !this.druidLeft)) {
					this.vel.x = -this.vel.x;
				}
			}
			if (entity instanceof Ground) {
				if (this.groundCheckLeft.collide(entity.worldBB)) {
					this.leftGround = true;
				}
				if (this.groundCheckRight.collide(entity.worldBB)) {
					this.rightGround = true;
				}
			}
		}
		this.worldBB.shift(x, y);
	}
}

class FlyBeetle extends Beetle {
	constructor(game, x, y, prize, prizeRate) {
		super(game, x, y, prize, prizeRate);
		this.setDimensions(0.8, 84, 98)
		this.loadAnimations();
		this.groundCheckLeft = new BoundingBox(0, 0, 0, 0);
		this.groundCheckRight = this.groundCheckLeft;
	}

	/** @override */
	loadAnimations() {
		this.spritesheet = ASSET_LOADER.getImageAsset("./Sprites/Bee.png");
		this.animations[1] = new Animator(
			this.spritesheet, 32, 26, 84, 98, 4, 0.1, 67, false, true, true);
		this.animations[0] = new Animator(
			this.spritesheet, 32, 26, 84, 98, 4, 0.1, 67, false, true, false);
	}

	static construct(game, params) {
		game.addEntity(new FlyBeetle(game,
			params.x * PARAMS.TILE_WIDTH,
			params.y * PARAMS.TILE_WIDTH,
			params.prize, params.prizeRate));
	}

	/** @override */
	update() {
		if (this.facing === 0) { // Facing left
			if (this.vel.x > this.velMax.x) {
				this.vel.x = Math.max(
					this.vel.x - this.ACC.x * this.game.clockTick, this.velMax.x);
			} else {
				this.vel.x = Math.min(
					this.vel.x + this.ACC.x * this.game.clockTick, -this.velMax.x);
			}
		} else { // Facing right
			if (this.vel.x > this.velMax.x) {
				this.vel.x = Math.max(
					this.vel.x - this.ACC.x * this.game.clockTick, this.velMax.x);
			} else {
				this.vel.x = Math.min(
					this.vel.x + this.ACC.x * this.game.clockTick, this.velMax.x);
			}
		}
		if (this.vel.x > this.velMax.x) {
			this.vel.x -= this.ACC.x * this.game.clockTick;
			this.vel.x = Math.max(this.velMax.x, this.vel.x);
		} else if (this.vel.x < -this.velMax.x) {
			this.vel.x += this.ACC.x * this.game.clockTick;
			this.vel.x = Math.min(-this.velMax.x, this.vel.x);
		}
		if (this.vel.y > 0) {
			this.vel.y -= this.ACC.y * this.game.clockTick;
			this.vel.y = Math.max(0, this.vel.y);
		} else if (this.vel.y < 0) {
			this.vel.y += this.ACC.y * this.game.clockTick;
			Math.min(0, this.vel.y);
		}
		this.move(this.game.clockTick);
	}
}

/**
 * Hops towards the player in an arc if the player is within range. Has a bit of landing 
 * lag before it can hop again. Deals damage to the druid by jumping into them.
 */
class Hopper extends Enemy {
	constructor(game, x, y, prize, prizeRate) {
		super(game, x, y, "./Sprites/Hopper.png", prize, prizeRate);
		this.setDimensions(0.5, 274, 200);
		// Override default values
		this.ACC = { y: 2000 };
		this.attack = 7;
		// End Override
		this.velMax = { y: 550 };
		this.jumpForce = -800;
		this.xspeed = 300;
		this.left = false;
		this.landLag = 0.3;
		this.landTime = this.landLag;
		this.jumping = false;
		this.loadAnimations();
		this.worldBB = new BoundingBox(
			this.pos.x + this.scaleDim.x / 4,
			this.pos.y + this.scaleDim.y / 2 - 15,
			this.scaleDim.x / 2,
			this.scaleDim.y / 2 + 15);
		this.agentBB = [new BoundingCircle(
			this.worldBB.centerPoint().x,
			this.worldBB.centerPoint().y,
			this.worldBB.height / 2)];
	}

	static construct(game, params) {
		game.addEntity(new Hopper(game,
			params.x * PARAMS.TILE_WIDTH,
			params.y * PARAMS.TILE_WIDTH,
			params.prize, params.prizeRate));
	}

	/** @override */
	loadAnimations() {
		this.idle = [];
		this.idle[1] = new Animator(
			this.spritesheet, 0, 0, 274, 200, 2, 0.6, 0, false, true, true);
		this.idle[0] = new Animator(
			this.spritesheet, 0, 0, 274, 200, 2, 0.6, 0, false, true, false);

		this.jump = [];
		this.jump[1] = new Animator(
			this.spritesheet, 550, 0, 274, 200, 2, 0.1, 0, false, true, true);
		this.jump[0] = new Animator(
			this.spritesheet, 550, 0, 274, 200, 2, 0.1, 0, false, true, false);

		this.animations[0] = this.idle[0];
		this.animations[1] = this.idle[1];
	}

	/** @override */
	knockback(attack) {
		super.knockback(attack);
		this.left = this.vel.x < 0;
	}

	/** @override */
	update() {
		let druidCenter = this.game.druid.worldBB.centerPoint();
		// Keeps hopper grounded for a brief moment before it can jump again.
		this.landTime -= this.game.clockTick;
		if (this.canSee(this.game.druid) && !this.jumping && this.landTime < 0) {
			this.left = this.sight.x > druidCenter.x;
			this.vel.y = this.jumpForce;
			this.jumping = true;
			this.animations[0] = this.jump[0];
			this.animations[1] = this.jump[1];
			AUDIO_PLAYER.playSound("./Audio/Hopper.mp3");
		}
		if (this.jumping) {
			this.vel.x = this.left ? -this.xspeed : this.xspeed;
		}
		this.vel.y = Math.min(this.velMax.y, this.vel.y + this.ACC.y * this.game.clockTick);
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
				this.vel.x = 0;
				if (this.jumping) {
					this.landTime = this.landLag;
				}
				this.jumping = false;
				this.animations[0] = this.idle[0];
				this.animations[1] = this.idle[1];
			}
			if (collisions.up) {
				y = entity.worldBB.bottom;
				this.vel.y = 0;
			}
			if (collisions.left) {
				x = entity.worldBB.right;
				this.vel.x = -this.vel.x;
			}
			if (collisions.right) {
				x = entity.worldBB.left - this.worldBB.width;
				this.vel.x = -this.vel.x;
			}
		}
		this.worldBB.shift(x, y);
	}
}

class Mantis extends Enemy {
	constructor(game, x, y, prize, prizeRate) {
		super(game, x, y, "./Sprites/Mantis.png", prize, prizeRate);
		this.setDimensions(1.5, 134, 120);
		this.worldBB = new BoundingBox(this.pos.x + this.scaleDim.x / 4, this.pos.y, 4 * this.scaleDim.x / 8, this.scaleDim.y - 20)
		this.agentBB = [new BoundingCircle(this.pos.x + this.scaleDim.x / 2, this.pos.y + this.scaleDim.y / 4, this.worldBB.width / 2),
			new BoundingCircle(this.pos.x + this.scaleDim.x / 2, this.pos.y + 3 * this.scaleDim.y / 4, this.worldBB.width / 2)];
		this.sightRangeFar = 1500;
		this.sightRangeMid = 600;
		this.sightRangeClose = 130;
		this.ACC = { y: 2000, x: 500 };
		this.health = 5;
		this.cooldown = 0;
		this.puffCooldown = 0;
		this.xOffset = 20;
		this.animationTimer = 0;
	}

	knockback(attack, angle) {
		super.knockback(attack, angle);
		this.vel.x /= 10;
		this.vel.y /= 10;
	}

	loadAnimations() {
		this.idle = [];
		this.attackAnimation = [];
		this.hitDruid = [];
		this.idle[1] = new Animator(
			this.spritesheet, 2, 2, 134, 118, 1, 0.4, 5, false, true, false);
		this.idle[0] = new Animator(
			this.spritesheet, 2, 2, 134, 118, 1, 0.4, 5, false, true, true);
		this.attackAnimation[1] = new Animator(
			this.spritesheet, 152, 2, 134, 118, 1, 0.4, 5, false, true, false);
		this.attackAnimation[0] = new Animator(
			this.spritesheet, 152, 2, 134, 118, 1, 0.4, 5, false, true, true);
		this.hitDruid[1] = new Animator(
			this.spritesheet, 434, 2, 134, 118, 1, 0.4, 5, false, true, false);
		this.hitDruid[0] = new Animator(
			this.spritesheet, 434, 2, 134, 118, 1, 0.4, 5, false, true, true);
		this.animations = this.idle;
	}

	update() {
		this.vel.y += this.game.clockTick * this.ACC.y;
		this.cooldown -= this.game.clockTick;
		this.animationTimer -= this.game.clockTick;
		this.puffCooldown -= this.game.clockTick;
		if (this.animationTimer < 0) {
			this.animations = this.idle;
			this.xOffset = 20;
		} 
		let thisCenter = this.worldBB.centerPoint();
		let druidCenter = this.game.druid.worldBB.centerPoint();
		if (druidCenter.x < thisCenter.x) {
			this.facing = 0;
		} else {
			this.facing = 1;
		}
		this.sightRange = this.sightRangeClose;
		if (this.canSee(this.game.druid) && this.puffCooldown < 0) {
			if (this.facing === 0) {
				this.game.addEntity(new EnemyPuff(this.game, this.pos.x - PARAMS.TILE_WIDTH, this.pos.y, this.facing));
			} else {
				this.game.addEntity(new EnemyPuff(this.game, this.pos.x + this.worldBB.width, this.pos.y, this.facing));
			}
			this.animations = this.hitDruid;
			this.animationTimer = 2;
			this.puffCooldown = 2.5;
			this.cooldown = 2.5;
			this.xOffset = 20;
			AUDIO_PLAYER.playSound("./Audio/MantisCackle.mp3");
		}
		this.sightRange = this.sightRangeMid;
		if (this.canSee(this.game.druid) && this.cooldown < 0) {
			this.game.addEntity(new EnemyHomingAttack(this.game,
				thisCenter.x, thisCenter.y,
				druidCenter.x - thisCenter.x,
				druidCenter.y - thisCenter.y));
			AUDIO_PLAYER.playSound("./Audio/EnemyProjectile.mp3");
			this.animations = this.attackAnimation;
			this.animationTimer = 0.4;
			this.cooldown = 1.5;
			this.xOffset = -12;
		}
		this.sightRange = this.sightRangeFar;
		if (this.canSee(this.game.druid) && this.cooldown < 0) {
			if (this.facing === 0) {
				this.game.addEntity(new EnemyRangedAttack(this.game,
					thisCenter.x, thisCenter.y - 20,
					druidCenter.x - thisCenter.x,
					druidCenter.y - thisCenter.y - 80));
			} else {
				this.game.addEntity(new EnemyRangedAttack(this.game,
					thisCenter.x, thisCenter.y - 20,
					druidCenter.x - thisCenter.x,
					druidCenter.y - thisCenter.y - 80));
			}
			AUDIO_PLAYER.playSound("./Audio/EnemyProjectile.mp3");
			this.animations = this.attackAnimation;
			this.animationTimer = 0.4;
			this.cooldown = 3;
			this.xOffset = -12;
		}
		if (this.vel.x > 0) {
			this.vel.x = Math.max(0, this.vel.x -= this.ACC.x * this.game.clockTick);
		} else {
			this.vel.x = Math.min(0, this.vel.x += this.ACC.x * this.game.clockTick);
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
			}
			if (collisions.up) {
				y = entity.worldBB.bottom;
				this.vel.y = 0;
			}
			if (collisions.left) {
				x = entity.worldBB.right;
				this.vel.x = 0;
			}
			if (collisions.right) {
				x = entity.worldBB.left - this.worldBB.width;
				this.vel.x = 0;
			}
		}
		this.worldBB.shift(x, y);
	}

	static construct(game, params) {
		game.addEntity(new Mantis(game,
			params.x * PARAMS.TILE_WIDTH,
			params.y * PARAMS.TILE_WIDTH,
			params.prize, params.prizeRate));
	}

	draw(context) {
		this.animations[this.facing].drawFrame(
			this.game.clockTick,
			context, this.pos.x,
			this.pos.y,
			this.scale,
			this.game.camera,
			this.xOffset);
		this.worldBB.display(this.game);
		this.agentBB.forEach((bb) => {
			bb.display(this.game);
		});
	}

}