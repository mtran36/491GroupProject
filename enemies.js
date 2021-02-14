/**
 * Superclass for all enemies that consolidates some common code and attributes. Also 
 * allows for easier detection of enemies colliding with enemies.
 */
class Enemy extends Agent {
	constructor(game, x, y, spritesheet, prize = "Potion", prizeRate = 1) {
		super(game, x, y, spritesheet);
		Object.assign(this, { prize, prizeRate });
		// Default values that may be overriden in specific enemy classes.
		this.attack = 1;
		this.defense = 0;
		this.health = 2;
		this.range = { x: 400, y: 400 };
		this.ACC = { x: 1000, y: 1500 };
		this.velMax = { x: 400, y: 700 };
		this.defineAgentCollisions = function () { /* Do nothing */ };
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
		this.range = { x: 600, y: 600 };
		this.ACC = { x: 700, y: 700 };
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
	updateBB() {
		super.updateBB();
		this.agentBB.radius = this.agentBB.radius - 3;
		this.worldBB = new BoundingBox(
			this.pos.x + 2, this.pos.y + 4, this.dim.x - 5, this.dim.y - 6);
	}

	/** @override */
	update() {
		var xdist = this.pos.x - this.game.druid.pos.x;
		var ydist = this.pos.y - this.game.druid.pos.y;
		if (Math.abs(xdist) < this.range.x && Math.abs(ydist) < this.range.y) {
			this.left = xdist > 0;
			this.up = ydist > 0;
			this.accelerate = true;
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
		if (entity instanceof Ground || entity instanceof Enemy || entity instanceof Door) {
			if (collisions.down) {
				this.pos.y = entity.worldBB.top - this.scaleDim.y;
				this.vel.y = -this.vel.y;
			}
			if (collisions.up) {
				this.pos.y = entity.worldBB.bottom;
				this.vel.y = -this.vel.y;
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

/**
 * Enemy type: Beetle
 * Movement pattern: Moves back and forth on a platform or the ground.
 */
class Beetle extends Enemy{
	constructor(game, x, y, prize, prizeRate) {
		super(game, x, y, "./Sprites/TestBeetle.png", prize, prizeRate);
		this.setDimensions(2, 32, 32);
		this.vel.x = -200;
		this.loadAnimations();
		this.farLeft = PARAMS.CANVAS_WIDTH;
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
			this.pos.x = this.farLeft;
		}
		if (this.farRight < this.pos.x + this.dim.x
			&& this.vel.x > 0
			&& this.vel.y === 0) {
			this.vel.x = -this.vel.x;
			this.pos.x = this.farRight - this.dim.x;
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
		this.vel.y = Math.min(this.vel.y + this.game.clockTick * this.ACC.y, this.velMax.y);
		this.move(this.game.clockTick);
		if (this.removeFromWorld) {
			switch (prize) {
				case 'Potion':
					this.game.addEntity(new Potions(this.game, this.x, this.y));
            }
		}
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
	constructor(game, x, y) {
		super(game, x, y, "./Sprites/TestBeetle.png)");

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
		// End Override
		this.velMax = { y: 550 };
		this.jumpForce = -800;
		this.xspeed = 300;
		this.left = false;
		this.range = { x: 300, y: 300 };
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
	update() {
		// Keeps hopper grounded for a brief moment before it can jump again.
		this.landTime -= this.game.clockTick;
		let xdist = this.pos.x - this.game.druid.pos.x;
		let ydist = this.pos.y - this.game.druid.pos.y;
		if (Math.abs(xdist) < this.range.x
			&& Math.abs(ydist) < this.range.y
			&& !this.jumping
			&& this.landTime < 0) {
			this.left = xdist > 0;
			this.vel.y = this.jumpForce;
			this.jumping = true;
		}
		if (this.jumping) {
			this.vel.x = this.left ? 0 - this.xspeed : this.xspeed;
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
				if (this.jumping)
					this.landTime = this.landLag;
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