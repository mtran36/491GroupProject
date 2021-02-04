/**
 * Superclass for all enemies that consolidates some common code and attributes. Also 
 * allows for easier detection of enemies colliding with enemies.
 */
class Enemy extends Agent {
	constructor(game, x, y, spritesheet, prize, prizeRate) {
		super(game, x, y, spritesheet);
		// Default values that may be overriden in specific enemy classes.
		this.attack = 1;
		this.defense = 0;
		this.health = 3;
		this.range = { x: 400, y: 400 };
		this.ACC = { x: 1000, y: 1500 };
		this.velMax = { x: 400, y: 700 };
		this.prizeRate = prizeRate ? prizeRate : 0.1;
		this.prize = prize ? prize : "Potion";
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
					this.game.addEntity(new Potions(this.game, this.agentBB.x, this.agentBB.y));
					break;
				case "Key":
					this.game.addEntity(new Key(this.game, this.agentBB.x, this.agentBB.y));
					break;
			}
		}
	}

	/**
	 * Returns a tuple of boolean values that tells what direction or directions this object
	 * has collided with entity. Values are stored in up, down, left, and right properties 
	 * of the tuple.
	 * @param {BoundingBox} othWorldBB
	 */
	worldCollisionDirection(entity) {
		var down = this.vel.y > 0
			&& this.lastWorldBB.bottom <= entity.worldBB.top
			&& (this.lastWorldBB.left) < entity.worldBB.right
			&& (this.lastWorldBB.right) > entity.worldBB.left;
		var up = this.vel.y < 0
			&& (this.lastWorldBB.top) >= entity.worldBB.bottom
			&& (this.lastWorldBB.left) != entity.worldBB.right
			&& (this.lastWorldBB.right) != entity.worldBB.left;
		var left = this.vel.x < 0
			&& (this.lastWorldBB.left) >= entity.worldBB.right
			&& (this.lastWorldBB.top) != entity.worldBB.bottom
			&& (this.lastWorldBB.bottom) != entity.worldBB.top;
		var right = this.vel.x > 0
			&& (this.lastWorldBB.right) <= entity.worldBB.left
			&& (this.lastWorldBB.top) < entity.worldBB.bottom
			&& (this.lastWorldBB.bottom) > entity.worldBB.top;
		return { up, down, left, right };
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
//		this.health = 1;
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
	checkCollisions() {
		let that = this;
		this.game.entities.forEach(function (entity) {
			if (entity.worldBB && that.worldBB.collide(entity.worldBB) && that !== entity) {
				var direction = that.worldCollisionDirection(entity);
				if (entity instanceof Ground || entity instanceof Enemy || entity instanceof Door) {
					if (direction.down) { // falling dowm
						that.pos.y = entity.worldBB.top - that.scaleDim.y;
						that.vel.y = -that.vel.y;
					}
					if (direction.up) { // jumping up
						that.pos.y = entity.worldBB.bottom;
						that.vel.y = -that.vel.y;
					}
					if (direction.left) { // going left
						that.pos.x = entity.worldBB.right;
						that.vel.x = -that.vel.x;
					}
					if (direction.right) { // going right
						that.pos.x = entity.worldBB.left - that.scaleDim.x;
						that.vel.x = -that.vel.x;
					}
				}
			}
		});
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
		if (this.vel.x > this.velMax.x) {
			this.vel.x -= this.ACC.x * this.game.clockTick;
			Math.max(this.velMax.x, this.vel.x);
		} else if (this.vel.x < -this.velMax.x) {
			this.vel.x += this.ACC.x * this.game.clockTick;
			Math.min(-this.velMax.x, this.vel.x);
		}
		this.vel.y = Math.min(this.vel.y + this.game.clockTick * this.ACC.y, this.velMax.y);
		this.move(this.game.clockTick);
	}

	/** @override */
	checkCollisions() {
		let that = this;
		var farLeft = PARAMS.CANVAS_WIDTH;
		var farRight = -1;
		this.game.entities.forEach(function (entity) {
			if (entity.worldBB && that.worldBB.collide(entity.worldBB) && that !== entity) {
				var direction = that.worldCollisionDirection(entity);
				if (entity instanceof Ground || entity instanceof Enemy || entity instanceof Door) {
					if (direction.down) { // falling dowm
						that.pos.y = entity.worldBB.top - that.scaleDim.y;
						that.vel.y = 0;
					}
					if (direction.up) { // moving up
						that.pos.y = entity.worldBB.bottom;
						that.vel.y = 0;
					}
					if (direction.left) { // going left
						that.pos.x = entity.worldBB.right;
						that.vel.x = -that.vel.x;
					}
					if (direction.right) { // going right
						that.pos.x = entity.worldBB.left - that.scaleDim.x;
						that.vel.x = -that.vel.x;
					}
					if (entity instanceof Ground) {
						farLeft = entity.worldBB.left < farLeft
							? entity.worldBB.left : farLeft;
						farRight = entity.worldBB.right > farRight
							? entity.worldBB.right : farRight;
					}
				}
			}
		});
		// If the beetles leftmost position is not on ground and it is moving in the left
		// direction and it is not moving vertically, then it will start moving right.
		if (farLeft > this.pos.x && that.vel.x < 0 && this.vel.y === 0) {
			this.vel.x = -this.vel.x;
			this.pos.x = farLeft;
		}
		// If the beetle's rightmost position is not on ground and it is moving in the right
		// direction and it is not moving vertically, then it will start moving left.
		if (farRight < this.pos.x + this.dim.x && that.vel.x > 0 && this.vel.y === 0) {
			this.vel.x = -this.vel.x;
			this.pos.x = farRight - this.dim.x;
		}
	}
}

class FlyBeetle extends Beetle {
	constructor(game, x, y, prize, prizeRate) {
		super(game, x, y, "./Sprites/TestBeetle.png)", prize, prizeRate);
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

	checkCollisions() {
		let that = this;
		this.game.entities.forEach(function (entity) {
			if (entity.worldBB && that.worldBB.collide(entity.worldBB) && that !== entity) {
				var direction = that.worldCollisionDirection(entity);
				if (entity instanceof Ground || entity instanceof Enemy || entity instanceof Door) {
					if (direction.down) { // falling dowm
						that.pos.y = entity.worldBB.top - that.scaleDim.y;
						that.vel.y = -that.vel.y;
					}
					if (direction.up) { // moving up
						that.pos.y = entity.worldBB.bottom;
						that.vel.y = -that.vel.y;
					}
					if (direction.left) { // going left
						that.pos.x = entity.worldBB.right;
						that.vel.x = -that.vel.x;
					}
					if (direction.right) { // going right
						that.pos.x = entity.worldBB.left - that.scaleDim.x;
						that.vel.x = -that.vel.x;
					}
				}
			}
		});
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
	knockback(attack) {
		super.knockback(attack);
		this.left = this.vel.x < 0 ? true : false;
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
		if (this.jumping && this.knockbackTime === 0) {
			this.vel.x = this.left ? 0 - this.xspeed : this.xspeed;
		}
		this.vel.y = Math.min(this.velMax.y, this.vel.y + this.ACC.y * this.game.clockTick);
		this.move(this.game.clockTick);
	}

	/** @override */
	checkCollisions() {
		let that = this;
		this.game.entities.forEach(function (entity) {
			if (entity.worldBB && that.worldBB.collide(entity.worldBB) && that !== entity) {
				let direction = that.worldCollisionDirection(entity);
				if (entity instanceof Ground || entity instanceof Enemy || entity instanceof Door) {
					if (direction.down) { // falling dowm
						that.pos.y = entity.worldBB.top - that.scaleDim.y;
						that.vel.y = 0;
						that.vel.x = 0;
						if (that.jumping)
							that.landTime = that.landLag;
						that.jumping = false;
						that.knockbackTime = 0;
					}
					if (direction.up) { // jumping up
						that.pos.y = entity.worldBB.bottom;
						that.vel.y = 0;
					}
					if (direction.left) { // going left
						that.pos.x = entity.worldBB.right;
						that.vel.x = -that.vel.x;
					}
					if (direction.right) { // going right
						that.pos.x = entity.worldBB.left - that.scaleDim.x;
						that.vel.x = -that.vel.x;
					}
				}
			}
		});
	}
}