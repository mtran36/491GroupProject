/** Player character */
class Druid extends Agent {
	constructor(game, x, y) {
		super(game, x, y, "./Sprites/druid.png");
		this.setDimensions(97, 157);
		this.game.druid = this;

		this.facing = 0;	// 0 is left 1 is right
		this.velocity = { x: 0, y: 0 };
		this.animations = [];
		this.loadAnimations();
		this.isJumping = false;
		this.rangeAttackCooldown = 0;
	}

	/** @override */
	checkCollisions() {
		let that = this;
		this.game.entities.forEach(function (entity) {
			if (entity.worldBB && that.worldBB.collide(entity.worldBB)
				&& !(entity instanceof Druid)) {
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
		// Display normally when facing left.
		this.animations[this.facing].drawFrame(
			this.game.clockTick, context, this.pos.x, this.pos.y, 1);
		this.worldBB.display(context);
		this.agentBB.display(context);
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
		this.animations = new Animator(this.spritesheet, 0, 16, 32, 32, 8, 0.05, 0, false, true, false);;
		this.removeFromWorld = false;
		this.attack = 1;
	}

	/** @override */
	update() {
		const TICK = this.game.clockTick;
		this.move(TICK);
	}

	/** @override */
	checkCollisions() {
		let that = this;
		this.game.entities.forEach(function (entity) {
			if (entity.worldBB && that.worldBB.collide(entity.worldBB)
				&& !(entity instanceof RangeAttack) && !(entity instanceof Druid)) {
				if ((that.vel.x < 0 && that.lastWorldBB.left < entity.worldBB.right)
					|| (that.vel.x > 0 && that.lastWorldBB.right > entity.worldBB.left)) { // touching a entity on side way
					that.removeFromWorld = true;
				}
			}
		});
	}

	/** @override */
	draw(context) {
		this.animations.drawFrame(this.game.clockTick, context, this.pos.x, this.pos.y, 2);
		this.worldBB.display(context);
		this.agentBB.display(context);
    }
}