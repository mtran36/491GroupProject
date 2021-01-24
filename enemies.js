class Enemy extends Agent {

}

/**
 * Enemy type: Fly
 * Movemenet pattern: Flies straight at player. Collides with all non-enemy objects.
 * 
 * */
class Fly extends Enemy {
	constructor(game, x, y) {
		super(game, x, y, "./Sprites/TestEnemy.png");
		this.range = { x: 800, y: 800 };
		this.ACC = {x: 500, y: 500}
		this.velMax = { x: 400, y: 400 };
		this.left = false;
		this.up = false;
		this.accelerate = false;
	}

	loadAnimations() {
		this.animations[0] = new Animator(
			this.spritesheet, 0, 0, 32, 32, 1, 1, 0, false, true, false);
	}

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

	checkCollisions() {
		for (var i = this.game.entities.length - 1; i >= 0; --i) {
			var oth = this.game.entities[i];
			if (oth instanceof Agent && !(oth instanceof Enemy)) {

			} else {
				var direction = collisionDirectionWorld(this, oth);
				if (this.worldBB.collide(oth.worldBB)) {
					if (direction.down) {
						this.pos.y = oth.worldBB.top - this.dim.y - 1;
						this.vel.y = -this.vel.y;
					}
					if (direction.up) {
						this.pos.y = oth.worldBB.bottom + 1;
						this.vel.y = -this.vel.y;
					}
					if (direction.right > oth.worldBB.left
						&& this.lastWorldBB.right <= oth.worldBB.left) {
						this.pos.x = oth.worldBB.left - this.dim.x - 1;
						this.vel.x = -this.vel.x;
					}
					if (direction.left) {
						this.pos.x = oth.worldBB.right + 1;
						this.vel.x = -this.vel.x;
					}
				}
			}
		}
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

		this.xspeed = 200;
		this.vel.x = this.xspeed;
		this.animations = [];
		this.loadAnimations();
		this.facing = 1;
	}

	loadAnimations() {
		this.animations[0] = new Animator(
			this.spritesheet, 0, 0, 32, 32, 1, 1, 0, false, true, false);
	}

	update() {
		this.move(this.game.clockTick);
	}

	checkCollisions() {
		for (var i = this.game.entities.length - 1; i >= 0; --i) {
			var oth = this.game.entities[i];
			if (oth instanceof Agent && !(oth instanceof Enemy)) {

			} else {
				if (this.worldBB.collide(oth.worldBB)) {
					if (oth instanceof Ground) {
						if (this.worldBB.left < oth.worldBB.left) {
							this.facing = 1;
							this.vel.x = this.xspeed;
						}
						if (this.worldBB.right > oth.worldBB.right) {
							this.facing = 0;
							this.vel.x = -this.xspeed;
						}
					}
					if (oth instanceof Enemy) {
						if (this.worldBB.right > oth.worldBB.left
							&& this.lastWorldBB.right <= oth.worldBB.left) {
							this.pos.x = oth.worldBB.left - this.dim.x - 1;
							this.vel.x = -this.vel.x;
						}
						if (this.worldBB.left < oth.worldBB.right
							&& this.lastWorldBB.left >= oth.worldBB.right) {
							this.pos.x = oth.worldBB.right + 1;
							this.vel.x = -this.vel.x;
						}
					}
				}
			}
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
		this.velMax = { y: 500 };
		this.jumpForce = -750;
		this.xspeed = 300;
		this.ACC = { y: 2000 };
		this.left = false;
		this.range = { x: 300, y: 300 };
		this.landLag = 0.3;
		this.landTime = this.landLag;
		this.jumping = false;
		this.animations = [];
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

	checkCollisions() {
		for (var i = this.game.entities.length - 1; i >= 0; --i) {
			var oth = this.game.entities[i];
			if (oth instanceof Agent && !(oth instanceof Enemy)) {

			} else {
				if (this.worldBB.collide(oth.worldBB)) {
					var temp = this.lastWorldBB;
					var direction = collisionDirectionWorld(this, oth);
					if (oth instanceof Ground) {
						if (direction.down) {
							this.pos.y = oth.worldBB.top - this.dim.y - 1;
							if (this.jumping) {
								this.landTime = this.landLag;
							}
							this.jumping = false;
							this.vel.y = 0;
							this.vel.x = 0;
							this.status = 0;
						}
						if (direction.up) {
							this.pos.y = oth.worldBB.bottom + 1;
							this.vel.y = 0;
						}
						if (direction.right) {
							this.pos.x = oth.worldBB.left - this.dim.x - 1;
							this.vel.x = -this.vel.x;
						}
						if (direction.left) {
							this.pos.x = oth.worldBB.right + 1;
							this.vel.x = -this.vel.x;
						}
					}
					if (oth instanceof Enemy) {
						if (direction.down) {
							this.pos.y = oth.worldBB.top - this.dim.y - 1;
							this.vel.y = -this.vel.y;
						}
						if (direction.up) {
							this.pos.y = oth.worldBB.bottom + 1;
							this.vel.y = -this.vel.y;
						}
						if (direction.right) {
							this.pos.x = oth.worldBB.left - this.dim.x - 1;
							this.vel.x = -this.vel.x;
						}
						if (direction.left) {
							this.pos.x = oth.worldBB.right + 1;
							this.vel.x = -this.vel.x;
						}
					}
				}
			}
		}
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

/**
 * Takes in two entities and returns the direction of collision relative to the
 * self as a tuple of values.
 * i.e. if self is moving right and collides with other, then right will be true.
 */
function collisionDirectionWorld(self, oth) {
	var down = self.worldBB.bottom >= oth.worldBB.top
		&& self.lastWorldBB.bottom < oth.lastWorldBB.top;
	var up = self.worldBB.top <= oth.worldBB.bottom
		&& self.lastWorldBB.top > oth.lastWorldBB.bottom;
	var right = self.worldBB.right >= oth.worldBB.left
		&& self.lastWorldBB.right < oth.lastWorldBB.left;
	var left = self.worldBB.left <= oth.worldBB.right
		&& self.lastWorldBB.left > oth.lastWorldBB.right;
	return { down, up, right, left };
}