/*
 * Player character
 */
class Druid {
	constructor(game, x, y) {
		Object.assign(this, { game, x, y });
		this.spritesheet = ASSET_MANAGER.getAsset("./Sprites/TestPlayer.png");
		this.spritesheet = ASSET_MANAGER.getAsset("./Sprites/druid.png");

		this.facing = 0;	// 0 is left 1 is right
		this.velocity = { x: 0, y: 0 };
		this.animations = [];
		this.loadAnimations();
		this.isJumping = false;
		this.fallAcc = 600;
	}

	loadAnimations() {
		this.animations[0] = new Animator(this.spritesheet, 610, 780, 94, 160, 1, 0.25, 0 , false, true, false);


		//this.animations[0] = new Animator(this.spritesheet, 0, 0, 32, 32, 1, 1, 0, false, true, false);
	}

	update() {
		const WALK_SPEED = 300;
		const TICK = this.game.clockTick;
		if (!this.isJumping) {
			if (this.game.B) {
				this.velocity.y = -500;
				this.isJumping = true;
			}
		} else {
			this.velocity.y += this.fallAcc * TICK;
        }
		if (this.game.right) {
			this.velocity.x = WALK_SPEED;
		} else if (this.game.left) {
			this.velocity.x = -WALK_SPEED;
		} else {
			this.velocity.x = 0;
		}

		// for flying
		//if (this.game.up) {
		//	this.velocity.y = -WALK_SPEED;
		//} else if (this.game.down) {
		//	this.velocity.y = WALK_SPEED;
		//} else {
		//	this.velocity.y = 0;
		//}

		this.x += this.velocity.x * TICK;
		this.y += this.velocity.y * TICK;

		// collision detection haven't implemented, hard code landing
		if (this.y > params.canvasHeight - params.tileWidth * 3.5) {
			this.velocity.y = 0;
			this.y = params.canvasHeight - params.tileWidth * 3.5;
			this.isJumping = false;
		}

		// update direction
		if (this.velocity.x < 0) this.facing = 0;
		if (this.velocity.x > 0) this.facing = 1;
	}

	draw(ctx) {
		this.animations[0].drawFrame(this.game.clockTick, ctx, this.x, this.y, 1);
	}
}
