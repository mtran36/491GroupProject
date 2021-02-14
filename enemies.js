/**
 * Superclass for all enemies that consolidates some common code and attributes. Also 
 * allows for easier detection of enemies colliding with enemies.
 */
class Enemy extends Agent {
	constructor(game, x, y, spritesheet, prize = "Potion", prizeRate = 1) {
		super(game, x, y, spritesheet);
		Object.assign(this, { prize, prizeRate });
		// Default values that may be overriden in specific enemy classes.
		this.attack = 5;
		this.defense = 0;
		this.health = 3;
		this.ACC = { x: 1000, y: 1500 };
		this.velMax = { x: 400, y: 700 };
		this.prizeRate = prizeRate ? prizeRate : 0.1;
		this.prize = prize ? prize : "Potion";
		this.sightRange = 400;
		this.sight = new BoundingCircle(this.pos.x, this.pos.y, this.sightRange);
		this.defineAgentCollisions = function () { /* Do nothing */ };
	}

	/**
	 * Causes the enemy to take the specified amount of damage. The enemy removes itself 
	 * from the world after its health reaches 0.
	 * @param {number} damage Damage to health as an integer
	 */
	takeDamage(damage) {
		this.health -= damage;
		if (this.health <= 0) {
			this.spawnPrize();
			this.removeFromWorld = true;
		}
	}


	/**
	 * Takes in an attack that has a knockback force value defined. The angle of the
	 * collision is determined and then the force is used as a force vector with that angle
	 * to detemine the x and y components of the force vectore. The x and y components of
	 * the force vector are then applied to the enemies x and y velocities respectively.
	 * @param {Agent} attack
	 */
	knockback(attack) {
		// If the collision is directly vertical, then the entire force applies to the
		// y velocity.
		if (this.agentBB.x - attack.agentBB.x === 0) {
			this.vel.y = attack.force;
		} else {
			let angle = Math.atan2((this.agentBB.y - attack.agentBB.y), (this.agentBB.x - attack.agentBB.x));
			this.vel.y = attack.force * Math.sin(angle);
			this.vel.x = attack.force * Math.cos(angle);
		}
	}

	/**
	 * Spawns a prize at this Enemy location if PARAMS.DEBUG is true or on a random
	 * chance based on this.prizeRate.
	 * e.g. a prize rate of 0.1 yields a 10% chance of spawning a prize.
	 * Currently only spawns potions.
	 */
	spawnPrize() {
		if (PARAMS.DEBUG || Math.random() < this.prizeRate) {
			switch (this.prize) {
				case "Potion":
					this.game.addEntity(new Potions(
						this.game, this.agentBB.x, this.agentBB.y));
					break;
				case "Key":
					this.game.addEntity(new Key(
						this.game, this.agentBB.x, this.agentBB.y));
					break;
			}
		}
	}

	canSee(DRUID) {
		this.sight = new BoundingCircle(this.pos.x, this.pos.y, this.sightRange);
		return this.sight.collide(DRUID.agentBB);
	}
}

/**
 * Enemy type: Fly
 * Movement pattern: Flies straight at player. Collides with ground and other enemies.
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
		const DRUID = this.game.druid;
		if (this.canSee(DRUID)) {
			this.accelerate = true;
			this.left = this.sight.x > DRUID.agentBB.x;
			this.up = this.sight.y > DRUID.agentBB.y;
		} else {
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
		if (entity instanceof Ground || entity instanceof Enemy || entity instanceof Door) {
			if (collisions.down) {
				bounce = true;
				this.pos.y = entity.worldBB.top - this.scaleDim.y;
				this.vel.y = -this.vel.y;
			}
			if (collisions.up) {
				bounce = true;
				this.pos.y = entity.worldBB.bottom;
				this.vel.y = -this.vel.y;
			}
			if (collisions.left) {
				bounce = true;
				this.pos.x = entity.worldBB.right;
				this.vel.x = -this.vel.x;
			}
			if (collisions.right) {
				bounce = true;
				this.pos.x = entity.worldBB.left - this.scaleDim.x;
				this.vel.x = -this.vel.x;
			}
		}
		if (bounce) {
			AUDIO_PLAYER.playSound("./Audio/TestSound.mp3");
		}
    }
}

/**
 * Enemy type: Ranged Attack Fly
 * Movement pattern: Flies straight at player. Collides with enemies and solid map entities.
 * Firing pattern: 
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
		if (this.canShoot) {
			if (this.vel.x > 0) {
				this.vel.x = Math.max(0, this.vel.x - this.ACC.x * this.game.clockTick);
			} else {
				this.vel.x = Math.min(0, this.vel.x + this.ACC.x * this.game.clockTick);
			}
			if (this.vel.y > 0) {
				this.vel.y = Math.max(0, this.vel.y - this.ACC.y * this.game.clockTick);
			} else {
				this.vel.y = Math.min(0, this.vel.y + this.ACC.y * this.game.clockTick);
			}
			if (this.vel.x === 0 && this.vel.y === 0) {
				this.game.addEntity(new EnemyRangedAttack(this.game, this.agentBB.x, this.agentBB.y,
					this.game.druid.agentBB.x - this.agentBB.x, this.game.druid.agentBB.y - this.agentBB.y));
				this.canShoot = false;;
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
 * Enemy type: Beetle
 * Movement pattern: Moves back and forth on a platform or the ground.
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
		if (this.facing === 0) {
			if (this.vel.x > this.velMax.x) {
				this.vel.x = Math.max(this.vel.x - this.ACC.x * this.game.clockTick, -this.velMax.x);
			} else {
				this.vel.x = Math.min(this.vel.x + this.ACC.x * this.game.clockTick, -this.velMax.x);
			}
		} else {
			if (this.vel.x > this.velMax.x) {
				this.vel.x = Math.max(this.vel.x - this.ACC.x * this.game.clockTick, this.velMax.x);
			} else {
				this.vel.x = Math.min(this.vel.x + this.ACC.x * this.game.clockTick, this.velMax.x);
			}
		}
		this.vel.y = Math.min(this.vel.y + this.game.clockTick * this.ACC.y, this.velMax.y);
		this.move(this.game.clockTick);
		this.avoidLedge();
	}

	/** @override */
	defineWorldCollisions(entity, collisions) {
		if (entity instanceof Ground || entity instanceof Enemy || entity instanceof Door) {
			if (collisions.down) {
				this.pos.y = entity.worldBB.top - this.scaleDim.y;
				this.vel.y = 0;
			}
			if (collisions.up) {
				this.pos.y = entity.worldBB.bottom;
				this.vel.y = 0;
			}
			if (collisions.left) {
				this.pos.x = entity.worldBB.right;
				this.vel.x = -this.vel.x;
			}
			if (collisions.right) {
				this.pos.x = entity.worldBB.left - this.scaleDim.x;
				this.vel.x = -this.vel.x;
			}
			if (entity instanceof Ground) {
				this.farLeft = entity.worldBB.left < this.farLeft
					? entity.worldBB.left : this.farLeft;
				this.farRight = entity.worldBB.right > this.farRight
					? entity.worldBB.right : this.farRight;
			}
		}
    }
}

class FlyBeetle extends Beetle {
	constructor(game, x, y, prize, prizeRate) {
		super(game, x, y, prize, prizeRate);
	}

	/** @override */
	update() {
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
 * Enemy type: Hopper
 * Movement pattern: Hops towards the player in an arc if the player is within range. Has
 * a bit of landing lag before it can hop again.
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
		this.left = this.vel.x < 0 ? true : false;
	}

	/** @override */
	update() {
		const DRUID = this.game.druid;
		// Keeps hopper grounded for a brief moment before it can jump again.
		this.landTime -= this.game.clockTick;
		if (this.canSee(DRUID)
			&& !this.jumping
			&& this.landTime < 0) {
			this.left = this.agentBB.x > DRUID.agentBB.x;
			this.vel.y = this.jumpForce;
			this.jumping = true;
		}
		if (this.jumping) {
			this.vel.x = this.left ? -this.xspeed : this.xspeed;
		}
		this.vel.y = Math.min(this.velMax.y, this.vel.y + this.ACC.y * this.game.clockTick);
		this.move(this.game.clockTick);
	}

	/** @override */
	defineWorldCollisions(entity, collisions) {
		if (entity instanceof Ground || entity instanceof Enemy || entity instanceof Door) {
			if (collisions.down) {
				this.pos.y = entity.worldBB.top - this.scaleDim.y;
				this.vel.y = 0;
				this.vel.x = 0;
				if (this.jumping) {
					this.landTime = this.landLag;
				}
				this.jumping = false;
			}
			if (collisions.up) {
				this.pos.y = entity.worldBB.bottom;
				this.vel.y = 0;
			}
			if (collisions.left) {
				this.pos.x = entity.worldBB.right;
				this.vel.x = -this.vel.x;
			}
			if (collisions.right) {
				this.pos.x = entity.worldBB.left - this.scaleDim.x;
				this.vel.x = -this.vel.x;
			}
		}
    }
}