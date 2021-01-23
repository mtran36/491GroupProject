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
		this.state = 0; // 0 = idle, 1 = jumping/falling
		this.isHittingWallLeft = false;
		this.isHittingWallRight = false;
		this.fallAcc = 600;

		this.updateBB();
	}

	loadAnimations() {
		this.animations[0] = new Animator(this.spritesheet, 610, 780, 94, 160, 1, 0.25, 0 , false, true, false);


		//this.animations[0] = new Animator(this.spritesheet, 0, 0, 32, 32, 1, 1, 0, false, true, false);
	}

	updateBB() {
		this.lastBB = this.BB;
		this.BB = new BoundingBox(this.x, this.y, params.tileWidth, params.tileWidth * 2);
    }

	update() {
		const WALK_SPEED = 300;
		const TICK = this.game.clockTick;

		if (this.game.right && !this.isHittingWallRight) {
			this.velocity.x = WALK_SPEED;
		} else if (this.game.left && !this.isHittingWallLeft) {
			this.velocity.x = -WALK_SPEED;
		} else {
			this.velocity.x = 0;
		}
		// if hit jump
		if (this.state == 0 && this.game.B) {
				this.velocity.y = -600;
				this.state = 1
		} else {
			this.velocity.y += this.fallAcc * TICK;
        }

		this.x += this.velocity.x * TICK;
		this.y += this.velocity.y * TICK;

        var that = this;
        this.game.entities.forEach(function (entity) {
			if (entity.BB && that.BB.collide(entity.BB)) {
				if (that.velocity.y > 0 && (that.state == 1 || that.state == 0)) { // falling down
					if ((entity instanceof Ground) && (that.lastBB.bottom) <= entity.BB.top) { // above ground
						that.y = entity.BB.top - params.tileWidth * 2;
						that.velocity.y = 0;
						that.state = 0;
					}
				}
				if (that.velocity.y < 0) { // jumping up
					if ((entity instanceof Ground) && (that.lastBB.top) >= entity.BB.bottom) { // below ground
						that.y = entity.BB.bottom;
						that.velocity.y = 0;
					}
				}
				if (that.velocity.x < 0) { // going left
					if ((entity instanceof Ground) && (that.lastBB.left) >= entity.BB.right) { // hit wall on left
						that.x = entity.BB.right;
						that.velocity.x = 0;
						that.state = 0;
						that.isHittingWallLeft = true;
					}
				}
				if (that.velocity.x > 0) { // going right
					if ((entity instanceof Ground) && (that.lastBB.right) <= entity.BB.left) { // hit wall on right
						that.x = entity.BB.left - params.tileWidth;
						that.velocity.x = 0;
						that.state = 0;
						that.isHittingWallRight = true;
					}
				}
			} else {
				that.isHittingWallLeft = false;
				that.isHittingWallRight = false;
            }
		});

		that.updateBB();

		// update direction
		if (this.velocity.x < 0) this.facing = 0;
		if (this.velocity.x > 0) this.facing = 1;

		// for testing
		//console.log("x:" + this.x);
		//console.log("y:" + this.y);
		//console.log("x velocity:" + this.velocity.x);
		//console.log("y velocity:" + this.velocity.y);
		//console.log("State:" + this.state);
	}

	draw(ctx) {
		this.animations[0].drawFrame(this.game.clockTick, ctx, this.x, this.y, 1);
		if (params.debug) {
			ctx.strokeStyle = 'Red';
			ctx.strokeRect(this.BB.x, this.BB.y, this.BB.width, this.BB.height);
		}
	}
}
