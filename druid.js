/** Player character */
class Druid extends Agent {
	constructor(game, x, y) {
		super(game, x, y, "./Sprites/druid.png");
		this.setDimensions(97, 157);
		this.game.druid = this;

		this.loadAnimations();
		this.isJumping = false;
		this.health = 10;
		this.invincTime = 0;
		this.flashing = false;
		this.rangeAttackCooldown = 0;
	}

	takeDamage(damage) {
		if (!PARAMS.DEBUG) {
			this.health -= damage;
			if (this.health <= 0) {
				this.removeFromWorld = true;
			}
			this.flashing = true;
		}
	}

	/** @override */
	checkCollisions() {
		let that = this;
		this.game.entities.forEach(function (entity) {
			if (entity.agentBB && that.agentBB.collide(entity.agentBB)) {
				if (entity instanceof Enemy && that.invincTime <= 0) {
					that.takeDamage(entity.attack);
					that.invincTime = 1;
				}
			}
			if (entity.worldBB && that.worldBB.collide(entity.worldBB)
				&& that !== entity) {
				if (entity instanceof Ground) {
					if (that.vel.y > 0 && that.lastWorldBB.bottom <= entity.worldBB.top
						&& (that.lastWorldBB.left) < entity.worldBB.right
						&& (that.lastWorldBB.right) > entity.worldBB.left) { // falling dowm
						that.pos.y = entity.worldBB.top - that.dim.y;
						that.vel.y = 0;
						that.isJumping = false;
					}
					if (that.vel.y < 0 && (that.lastWorldBB.top) >= entity.worldBB.bottom
						&& (that.lastWorldBB.left) != entity.worldBB.right
						&& (that.lastWorldBB.right) != entity.worldBB.left) { // jumping up
						that.pos.y = entity.worldBB.bottom;
						that.vel.y = 0;
						that.isJumping = true;
					}
					if (that.vel.x < 0 && (that.lastWorldBB.left) >= entity.worldBB.right
						&& that.lastWorldBB.top != entity.worldBB.bottom
						&& that.lastWorldBB.bottom != entity.worldBB.top) { // going left
						that.pos.x = entity.worldBB.right;
						that.vel.x = 0;
					}
					if (that.vel.x > 0 && (that.lastWorldBB.right) <= entity.worldBB.left
						&& that.lastWorldBB.top < entity.worldBB.bottom
						&& that.lastWorldBB.bottom > entity.worldBB.top) { // going right
						that.pos.x = entity.worldBB.left - that.dim.x;
						that.vel.x = 0;
					}
				}
			}
		});
	}

	/** @override */
	loadAnimations() {
		this.animations[0] = new Animator(
			this.spritesheet, 740, 0, this.dim.x, this.dim.y, 1, 0.25, 1, false, true, false);
		this.animations[1] = new Animator(
			this.spritesheet, 740, 0, this.dim.x, this.dim.y, 1, 0.25, 1, false, true, true);
	}

	/** @override */
	update() {
		const FALL_ACC = 1500;
		const WALK_SPEED = 300;
		const JUMP_VEL = 900;
		const TICK = this.game.clockTick;

		if (this.invincTime > 0) {
			this.invincTime -= this.game.clockTick;
			this.flashing = !this.flashing;
		} else {
			this.flashing = false;
		}

		if (!this.isJumping && this.game.B) { 
				this.vel.y = -JUMP_VEL;
			this.isJumping = true;
			this.game.B = false;
		} else {
			this.vel.y += FALL_ACC * TICK;
			this.isJumping = true;
		}

		this.rangeAttackCooldown -= this.game.clockTick;
		if (this.rangeAttackCooldown <= 0 && this.game.A) {
			if (this.facing == 0) {
				// shoot left
				this.game.addEntity(new RangeAttack(this.game, this.pos.x - PARAMS.TILE_WIDTH, this.pos.y + this.dim.y / 2, this.facing));
			} else {
				// shoot right
				this.game.addEntity(new RangeAttack(this.game, this.pos.x + this.dim.x, this.pos.y + this.dim.y / 2, this.facing));
			}
			this.game.A = false;
			this.rangeAttackCooldown = 2;
        }

		if (this.game.right) { 
			this.vel.x = WALK_SPEED;
		} else if (this.game.left) {
			this.vel.x = -WALK_SPEED;
		} else {
			this.vel.x = 0;
		}
		this.move(TICK);
	}

	/** @override */
	draw(context) {
		if (this.flashing) return;
		// Display normally when facing left.
		this.animations[this.facing].drawFrame(
			this.game.clockTick, context, this.pos.x - this.game.camera.pos.x, this.pos.y - this.game.camera.pos.y, 1);
		this.worldBB.display(this.game);
		this.agentBB.display(this.game);
	}
}


class RangeAttack extends Agent {
	constructor(game, x, y, direction) {
		super(game, x, y, "./Sprites/ball.png");
		this.direction = direction; // 0 is left 1 is right
		if (direction == 0) {
			this.vel.x = -400;
		} else {
			this.vel.x = 400;
        }
		this.attack = 1;
		this.hit = false
		this.loadAnimations();
	}

	loadAnimations() {
		this.animations[0] = new Animator(this.spritesheet, 0, 16, 32, 32, 8, 0.05, 0, false, true, false);
	}

	/** @override */
	update() {
		this.move(this.game.clockTick);
	}

	/** @override */
	checkCollisions() {
		let that = this;
		this.game.entities.forEach(function (entity) {
			if (entity.agentBB && that.agentBB.collide(entity.agentBB)
				&& that !== entity) {
				if (entity instanceof Enemy) {
					entity.takeDamage(that.attack);
					that.removeFromWorld = true;
				}
			}
			if (entity.worldBB && that.worldBB.collide(entity.worldBB)
				&& that !== entity) {
				if (entity instanceof Ground) {
					if ((that.vel.x < 0 && that.lastWorldBB.left < entity.worldBB.right)
						|| (that.vel.x > 0 && that.lastWorldBB.right > entity.worldBB.left)) { // touching a entity on side way
						that.removeFromWorld = true;
					}
				}
			}
		});
	}

	/** @override */
	draw(context) {
		this.animations[0].drawFrame(this.game.clockTick, context, this.pos.x - this.game.camera.pos.x, this.pos.y - this.game.camera.pos.y, 2);
		this.worldBB.display(this.game);
		this.agentBB.display(this.game);
    }
}