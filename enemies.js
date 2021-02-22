/**
 * Superclass for all enemies that consolidates some common code and attributes. Also 
 * allows for easier detection of enemies colliding with enemies.
 */
class Enemy extends Agent {
	constructor(game, x, y, spritesheet, prize = "Potion", prizeRate = 0.1) {
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
		if (thisCenter.x - attackCenter.x === 0) {
			// If the collision is directly vertical, then the entire force applies to 
			// the y velocity.
			this.vel.y = attack.force;
		} else {
			if (!angle) {
				angle = Math.atan2(
					thisCenter.y - attackCenter.y,
					thisCenter.x - attackCenter.x);
			}
			this.vel.y = attack.force * Math.sin(angle);
			this.vel.x = attack.force * Math.cos(angle);
		}
	}

	/**
	 * Spawns a prize at this Enemy location if PARAMS.DEBUG is true or on a random
	 * chance based on this.prizeRate. Prize rate is a standard probablity value in range
	 * 0-1.
	 */
	spawnPrize() {
		let thisCenter = this.worldBB.centerPoint();
		if (PARAMS.DEBUG || Math.random() < this.prizeRate) {
			switch (this.prize) {
				case "Potion":
					this.game.addEntity(new Potions(
						this.game, thisCenter.x, thisCenter.y));
					break;
				case "Key":
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
	takeDamage(damage) {
		super.takeDamage(damage);
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
		super(game, x, y, "./Sprites/TestFly.png", prize, prizeRate);
		this.setDimensions(1, 32, 32);
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
	}

	/** @override */
	loadAnimations() {
		this.animations[1] = new Animator(
			this.spritesheet, 0, 0, 32, 32, 1, 1, 0, false, true, false);
		this.animations[0] = new Animator(
			this.spritesheet, 0, 0, 32, 32, 1, 1, 0, false, true, true);
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
}

/**
 * Flies straight at player, colliding with enemies and blocks. Shoots a ranged attack at
 * the druids location.
 */
class RangedFly extends Fly {
	constructor(game, x, y, prize, prizeRate) {
		super(game, x, y, prize, prizeRate);
		this.setDimensions(2, 32, 32);
		this.sightRange = 900;
		this.ACC = { x: 500, y: 500 };
		this.health = 3;
		this.flyTime = 2.5;
		this.currFlyTime = 0;
		this.canShoot = false;
	}

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
				AUDIO_PLAYER.playSound("./Audio/EnemyProjectile.mp3");
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
		super(game, x, y, "./Sprites/TestBeetle.png", prize, prizeRate);
		this.setDimensions(2, 32, 32);
		this.velMax.x = 200;
		this.vel.x = -200;
		this.loadAnimations();
		this.farLeft = -1;
		this.farRight = -1;
	}

	/**
	 * If the beetles leftmost position is not on ground and it is moving in the left
	 * direction and it is not moving vertically, then it will start moving right.
	 * If the beetle's rightmost position is not on ground and it is moving in the right
	 * direction and it is not moving vertically, then it will start moving left.
	 */
	avoidLedge() {
		if (this.farLeft > this.pos.x
			&& this.vel.x < 0
			&& this.vel.y === 0) {
			this.vel.x = -this.vel.x;
			this.facing = 1;
		}
		if (this.farRight < this.pos.x + this.scaleDim.x
			&& this.vel.x > 0
			&& this.vel.y === 0) {
			this.vel.x = -this.vel.x;
			this.facing = 0;
		}
    }

	/** @override */
	loadAnimations() {
		this.animations[1] = new Animator(
			this.spritesheet, 0, 0, 32, 32, 1, 1, 0, false, true, false);
		this.animations[0] = new Animator(
			this.spritesheet, 0, 0, 32, 32, 1, 1, 0, false, true, true);
	}

	/** @override */
	update() {
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
		this.avoidLedge();
		this.vel.y = Math.min(
			this.vel.y + this.game.clockTick * this.ACC.y,
			this.velMax.y);
		this.move(this.game.clockTick);
		this.avoidLedge();
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
				this.vel.x = -this.vel.x;
			}
			if (collisions.right) {
				x = entity.worldBB.left - this.worldBB.width;
				this.vel.x = -this.vel.x;
			}
			if (entity instanceof Ground) {
				this.farLeft = entity.worldBB.left < this.farLeft
					? entity.worldBB.left : this.farLeft;
				this.farRight = entity.worldBB.right > this.farRight
					? entity.worldBB.right : this.farRight;
			}
		}
		this.worldBB.shift(x, y);
    }
}

class FlyBeetle extends Beetle {
	constructor(game, x, y, prize, prizeRate) {
		super(game, x, y, prize, prizeRate);
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
		super(game, x, y, "./Sprites/TestHopper.png", prize, prizeRate);
		this.setDimensions(2, 32, 32);
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
	}

	/** @override */
	loadAnimations() {
		this.animations[1] = new Animator(
			this.spritesheet, 0, 0, 32, 32, 1, 1, 0, false, true, false);
		this.animations[0] = new Animator(
			this.spritesheet, 0, 0, 32, 32, 1, 1, 0, false, true, true);
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
			this.left = this.sightRange.x > druidCenter.x;
			this.vel.y = this.jumpForce;
			this.jumping = true;
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

	static construct(game, params) {
		return new Hopper(
			game, params.x * PARAMS.TILE_WIDTH,
			params.y * PARAMS.TILE_WIDTH,
			params.prize,
			params.prizeRate);
	}
}