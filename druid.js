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
		this.loadAnimations();
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
					if (that.vel.x < 0 && (that.lastWorldBB.left) >= entity.worldBB.right) { // going left
						that.pos.x = entity.worldBB.right;
						that.vel.x = 0;
					}
					if (that.vel.x > 0 && (that.lastWorldBB.right) <= entity.worldBB.left) { // going right
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
		} else {
			this.vel.y += FALL_ACC * TICK;
			this.isJumping = true;
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
