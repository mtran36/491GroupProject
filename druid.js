/** Player character */
class Druid extends Agent {
	constructor(game, x, y) {
		super(game, x, y, "./Sprites/druid.png");
		this.setDimensions(97, 157);
		this.isJumping = false;
		this.loadAnimations();
	}

	/** @override */
	checkCollisions() {
		let that = this;
		this.game.entities.forEach(function (entity) {
			if (that.vel.y > 0) {
				if (entity.worldBB && that.worldBB.collide(entity.worldBB)) {
					if (entity instanceof Ground) {
						that.isJumping = false;
						that.pos.y = entity.worldBB.top - that.dim.y;
						that.vel.y = 0;
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
			this.spritesheet, 740, 0, this.dim.x, this.dim.y, 1, 0.25, 1, false, true, false);
	}

	/** @override */
	update() {
		const FALL_ACC = 1500;
		const WALK_SPEED = 300;
		const JUMP_VEL = 700;
		const TICK = this.game.clockTick;

		if (!this.isJumping) { 
			if (this.game.B) {
				this.vel.y = -JUMP_VEL;
				this.isJumping = true;
			}
		} else {
			this.vel.y += FALL_ACC * TICK;
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
		if (this.facing === 0) {
			this.animations[this.facing].drawFrame(
				this.game.clockTick, context, this.pos.x, this.pos.y, 1);
		// Flip animation when facing right.
		} else {
			context.save();
			context.scale(-1, 1);
			this.animations[this.facing].drawFrame(
				this.game.clockTick, context, -this.pos.x - this.dim.x, this.pos.y, 1);
			context.restore();
		}
		this.worldBB.display(context);
		this.agentBB.display(context);
	}
}