/**
 * Houses all of the enemy classes.
 * 
 * */

/**
 * Wrapper class for all enemies that consolidates some common code and attributes.
 * Also allows for easier detection of enemies colliding with enemies.
 * */
class Enemy extends Agent {

	/**
	 * Calls the Agent constructor and sets default values for attack, defense, and health.
	 * @param {any} game The game engine
	 * @param {any} x starting x position on the canvas
	 * @param {any} y starting y position on the canvas
	 */
	constructor(game, x, y) {
		super(game, x, y, "./Sprites/TestEnemy.png");
		//These are default values that may be overriden in specific enemy classes.
		this.attack = 1;
		this.defense = 0;
		this.health = 2;
		this.range = { x: 400, y: 400 };
		this.ACC = { x: 1000, y: 1500 };
		this.velMax = { x: 400, y: 400 };
	}

	/**
	 * Causes the enemy to take the specified amount of damage.
	 * The enemy removes itself from the worl after its health reaches 0.
	 * @param {any} damage damage to health as an integer
	 */
	takeDamage(damage) {
		this.health -= damage;
		if (this.health <= 0) {
			this.removeFromWorld = true;
		}
	}
}

/**
 * Enemy type: Fly
 * Movemenet pattern: Flies straight at player. Collides with ground and other enemies.
 * 
 * */
class Fly extends Enemy {
	/**
	* Calls the Agent constructor and sets default values for attack, defense, and health.
	* @param {any} game The game engine
	* @param {any} x starting x position on the canvas
	* @param {any} y starting y position on the canvas
	*/
	constructor(game, x, y) {
		super(game, x, y, "./Sprites/TestEnemy.png");
		//Override of default values
		this.range = { x: 600, y: 600 };
		this.ACC = { x: 700, y: 700 };
		this.health = 1;
		//End override
		this.velMax = { x: 400, y: 400 };
		this.left = false;
		this.up = false;
		this.accelerate = false;
	}

	loadAnimations() {
		this.animations[0] = new Animator(
			this.spritesheet, 0, 0, 32, 32, 1, 1, 0, false, true, false);
	}

	/**
	 * Updates position in gameWorld.
	 * */
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
	/**
	 * Checks for when this entity collides with another entity in the game world.
	 * Updates position and variables accordingly.
	 * */
	checkCollisions() {
		let that = this;
		this.game.entities.forEach(function (entity) {
			if (entity.worldBB && that.worldBB.collide(entity.worldBB)
				&& !(that === entity)) {
				if (entity instanceof Ground || entity instanceof Enemy) {
					if (that.vel.y > 0 && that.lastWorldBB.bottom <= entity.worldBB.top
						&& (that.lastWorldBB.left) < entity.worldBB.right
						&& (that.lastWorldBB.right) > entity.worldBB.left) { // falling dowm
						that.pos.y = entity.worldBB.top - that.dim.y;
						that.vel.y = -that.vel.y;
					}
					if (that.vel.y < 0 && (that.lastWorldBB.top) >= entity.worldBB.bottom
						&& (that.lastWorldBB.left) != entity.worldBB.right
						&& (that.lastWorldBB.right) != entity.worldBB.left) { // jumping up
						that.pos.y = entity.worldBB.bottom;
						that.vel.y = -that.vel.y;
					}
					if (that.vel.x < 0 && (that.lastWorldBB.left) >= entity.worldBB.right) { // going left
						that.pos.x = entity.worldBB.right;
						that.vel.x = -that.vel.x;
					}
					if (that.vel.x > 0 && (that.lastWorldBB.right) <= entity.worldBB.left) { // going right
						that.pos.x = entity.worldBB.left - that.dim.x;
						that.vel.x = -that.vel.x;
					}
				}
			}
		});
	}

	draw(context) {
		this.animations[0].drawFrame(
			this.game.clockTick, context, this.pos.x, this.pos.y, 2);
		// Label for during testing. Remove in full game.
		context.font = "48px serif";
		context.fillText("F", this.pos.x + 16, this.pos.y + 48);
		this.worldBB.display(context);
		this.agentBB.display(context);
	}
}

/**
 * 
 * Enemy type: Beetle
 * Movement pattern: Moves back and forth on a platform or the ground.
 * 
 * */
class Beetle extends Enemy{
	constructor(game, x, y) {
		super(game, x, y, "./Sprites/TestEnemy.png");
		//Constant horizontal speed.
		this.vel.x = -200;
		this.loadAnimations();
	}

	loadAnimations() {
		this.animations[0] = new Animator(
			this.spritesheet, 0, 0, 32, 32, 1, 1, 0, false, true, false);
	}

	update() {
		this.vel.y = Math.min(this.game.clockTick * this.ACC.y, this.velMax.y);
		this.move(this.game.clockTick);
	}

	/** @override */
	checkCollisions() {
		let that = this;
		var farLeft = PARAMS.CANVAS_WIDTH;
		var farRight = -1;
		this.game.entities.forEach(function (entity) {
			if (entity.worldBB && that.worldBB.collide(entity.worldBB)
				&& !(that === entity)) {
				if (entity instanceof Ground || entity instanceof Enemy) {
					if (that.vel.y > 0 && that.lastWorldBB.bottom <= entity.worldBB.top
						&& (that.lastWorldBB.left) < entity.worldBB.right
						&& (that.lastWorldBB.right) > entity.worldBB.left) { // falling dowm
						that.pos.y = entity.worldBB.top - that.dim.y;
						that.vel.y = 0;
					}
					if (that.vel.y > 0 && that.lastWorldBB.bottom <= entity.worldBB.top
						&& (that.lastWorldBB.left) < entity.worldBB.right
						&& (that.lastWorldBB.right) > entity.worldBB.left) { // falling dowm
						that.pos.y = entity.worldBB.top - that.dim.y;
						that.vel.y = 0;
					}
					if (that.vel.x < 0 && (that.lastWorldBB.left) >= entity.worldBB.right) { // going left
						that.pos.x = entity.worldBB.right;
						that.vel.x = -that.vel.x;
					}
					if (that.vel.x > 0 && (that.lastWorldBB.right) <= entity.worldBB.left) { // going right
						that.pos.x = entity.worldBB.left - that.dim.x;
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
		//If the beetles leftmost position is not on ground and it is moving in the left
		//direction, then it will start moving right.
		if (farLeft > this.pos.x && that.vel.x < 0 && this.vel.y === 0) {
			this.vel.x = -this.vel.x;
			this.pos.x = farLeft;
		}
		//If the beetle's rightmost position is not on ground and it is moving in the right
		//direction, then it will start moving left.
		if (farRight < this.pos.x + this.dim.x && that.vel.x > 0 && this.vel.y === 0) {
			this.vel.x = -this.vel.x;
			this.pos.x = farRight - this.dim.x;
		}
	}

	draw(context) {
		this.animations[0].drawFrame(
			this.game.clockTick, context, this.pos.x, this.pos.y, 2);
		// Test Label. Remove after getting proper sprites.
		context.font = '48px serif';
		context.fillText("B", this.pos.x + 16, this.pos.y + 48);
		this.worldBB.display(context);
		this.agentBB.display(context);
	}

}

/**
 * Enemy type: Hopper
 * Movement pattern: Hops towards the player in an arc if the player is within range.
 * 
 * Has a bit of landing lag before it can hop again.
 * */
class Hopper extends Enemy {
	constructor(game, x, y) {
		super(game, x, y, "./Sprites/TestEnemy.png");
		//Overriden defaults
		this.ACC = { y: 2000 };
		//End Override
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

	loadAnimations() {
		this.animations[0] = new Animator(
			this.spritesheet, 0, 0, 32, 32, 1, 1, 0, false, true, false);
	}

	update() {
		// Keeps hopper grounded for a brief moment before it can jump again.
		this.landTime -= this.game.clockTick;
		var xdist = this.pos.x - this.game.druid.pos.x;
		var ydist = this.pos.y - this.game.druid.pos.y;
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
	checkCollisions() {
		let that = this;
		this.game.entities.forEach(function (entity) {
			if (entity.worldBB && that.worldBB.collide(entity.worldBB)
				&& !(that === entity)) {
				if (entity instanceof Ground || entity instanceof Enemy) {
					if (that.vel.y > 0 && that.lastWorldBB.bottom <= entity.worldBB.top
						&& (that.lastWorldBB.left) < entity.worldBB.right
						&& (that.lastWorldBB.right) > entity.worldBB.left) { // falling dowm
						that.pos.y = entity.worldBB.top - that.dim.y;
						that.vel.y = 0;
						that.vel.x = 0;
						if (that.jumping)
							that.landTime = that.landLag;
						that.jumping = false;
					}
					if (that.vel.y < 0 && (that.lastWorldBB.top) >= entity.worldBB.bottom
						&& (that.lastWorldBB.left) != entity.worldBB.right
						&& (that.lastWorldBB.right) != entity.worldBB.left) { // jumping up
						that.pos.y = entity.worldBB.bottom;
						that.vel.y = 0;
					}
					if (that.vel.x < 0 && (that.lastWorldBB.left) >= entity.worldBB.right) { // going left
						that.pos.x = entity.worldBB.right;
						that.vel.x = -that.vel.x;
					}
					if (that.vel.x > 0 && (that.lastWorldBB.right) <= entity.worldBB.left) { // going right
						that.pos.x = entity.worldBB.left - that.dim.x;
						that.vel.x = -that.vel.x;
					}
				}
			}
		});
	}

	draw(context) {
		this.animations[0].drawFrame(
			this.game.clockTick, context, this.pos.x, this.pos.y, 2);
		// Test Label. Remove after getting proper sprites.
		context.font = '48px serif';
		context.fillText("H", this.pos.x + 16, this.pos.y + 48);
		this.worldBB.display(context);
		this.agentBB.display(context);
	}
}