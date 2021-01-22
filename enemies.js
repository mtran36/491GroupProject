// Enemies File.

// Flies straight at druid.
class Fly {
	constructor(game, druid, x, y) {
		Object.assign(this, { game, druid, x, y });
		this.spritesheet = ASSET_MANAGER.getAsset("./Sprites/TestEnemy.png");
		this.range = { x: 400, y: 400 };
		this.ACC = {x: 1000, y: 1000}
		this.velocityMAX = { x: 3500, y: 3500 };
		this.velocity = { x: 0, y: 0 };
		this.left = false;
		this.up = false;
		this.accelerate = false;
		this.animations = [];
		this.loadAnimations();
	}

	loadAnimations() {
		this.animations[0] = new Animator(
			this.spritesheet, 0, 0, 32, 32, 1, 1, 0, false, true, false);
	}

	update() {
		var xdist = this.x - this.druid.x;
		var ydist = this.y - this.druid.y;
		if (Math.abs(xdist) < this.range.x && Math.abs(ydist) < this.range.y) {
			this.left = xdist > 0;
			this.up = ydist > 0;
			this.accelerate = true;
		} else {
			this.accelerate = false;
		}
		var velocityChangeX = this.ACC.x * this.game.clockTick;
		var velocityChangeY = this.ACC.y * this.game.clockTick;
		if (this.accelerate) {
			if (this.left) {
				this.velocity.x = Math.max(-1 * this.velocityMAX.x, this.velocity.x - velocityChangeX);
			} else {
				this.velocity.x = Math.min(this.velocityMAX.x, this.velocity.x + velocityChangeX);
			}
			if (this.up) {
				this.velocity.y = Math.max(-1 * this.velocityMAX.y, this.velocity.y - velocityChangeY);
			} else {
				this.velocity.y = Math.min(this.velocityMAX.y, this.velocity.y + velocityChangeY);
			}
		} else {
			if (this.velocity.x > 0) {
				this.velocity.x = Math.max(0, this.velocity.x - velocityChangeX);
			} else {
				this.velocity.x = Math.min(0, this.velocity.x + velocityChangeX);
			}
			if (this.velocity.y > 0) {
				this.velocity.y = Math.max(0, this.velocity.y - velocityChangeY);
			} else {
				this.velocity.y = Math.min(0, this.velocity.y + velocityChangeY);
			}
		}
		this.x += this.velocity.x * this.game.clockTick;
		this.y += this.velocity.y * this.game.clockTick;
	}

	draw() {
		this.animations[0].drawFrame(
			this.game.clockTick, this.game.ctx, this.x, this.y, 2);
		// Label for during testing. Remove in full game.
		this.game.ctx.font = "48px serif";
		this.game.ctx.fillText("F", this.x + 16, this.y + 48);
	}
}

// Moves back and forth
class Beetle {
	constructor(game, x, y) {
		Object.assign(this, { game, x, y });
		this.spritesheet = ASSET_MANAGER.getAsset("./Sprites/TestEnemy.png");

		this.faceRight = true;
		this.speed = 100;

		this.animations = [];
		this.loadAnimations();
	}

	loadAnimations() {
		this.animations[0] = new Animator(
			this.spritesheet, 0, 0, 32, 32, 1, 1, 0, false, true, false);
	}

	update() {
		var xmove = this.game.clockTick * this.speed;
		if (this.faceRight) {
			this.x += xmove;
		} else {
			this.x -= xmove;
		}
		if (this.x >= this.game.surfaceWidth - 64) {
			this.x = this.game.surfaceWidth - 64;
			this.faceRight = false;
		} else if (this.x <= 0) {
			this.x = 0;
			this.faceRight = true;
		}
	}

	draw() {
		this.animations[0].drawFrame(
			this.game.clockTick, this.game.ctx, this.x, this.y, 2);
		// Test Label. Remove after getting proper sprites.
		this.game.font = '48px serif';
		this.game.ctx.fillText("B", this.x + 16, this.y + 48);
	}

}

// Hops towards the druid
class Hopper {
	constructor(game, druid, x, y) {
		Object.assign(this, { game, druid, x, y });
		this.spritesheet = ASSET_MANAGER.getAsset("./Sprites/TestEnemy.png");
		this.velocityMAX = { y: 5000 };
		this.jumpForce = 700;
		this.velocity = { x: 350, y: 0 };
		this.ACC = { y: 2500 };
		this.left = false;
		this.range = { x: 300, y: 300 };
		this.status = 0; // 0 is idle, 1 is noticed player, 2 is start jump, 3 is mid-jump.
		this.landLag = 0.3;
		this.landingTime = this.landLag;
		this.animations = [];
		this.loadAnimations();
	}

	loadAnimations() {
		this.animations[0] = new Animator(
			this.spritesheet, 0, 0, 32, 32, 1, 1, 0, false, true, false);
	}

	update() {
		// Keeps hopper grounded for a brief moment before it can jump again.
		this.landingTime -= this.game.clockTick;
		var xdist = this.x - this.druid.x;
		var ydist = this.y - this.druid.y;
		if (this.landingTime >= 0 && this.status === 2) {
			return;
		}
		var velocityChangeY = this.ACC.y * this.game.clockTick;
		switch (this.status) {
			case 0:
				if (Math.abs(xdist) < this.range.x && Math.abs(ydist) < this.range.y) {
					this.status = 1;
					this.left = xdist > 0;
				}
				break;
			case 1:
				if (this.left) {
					this.velocity.x = Math.min(-1 * this.velocity.x, this.velocity.x);
				} else {
					this.velocity.x = Math.max(this.velocity.x, -1 * this.velocity.x);
				}
				this.velocity.y = -1 * this.jumpForce;
				this.status = 2;
				break;
			case 2:
			case 3:
				this.velocity.y = Math.min(this.velocityMAX.y, this.velocity.y + velocityChangeY);
				this.status = 3;
				this.x += this.velocity.x * this.game.clockTick;
				this.y += this.velocity.y * this.game.clockTick;
				if (this.y > this.game.surfaceHeight - 64) {
					this.y = this.game.surfaceHeight - 64;
				}
				if (this.status === 3) {
					if (this.y === this.game.surfaceHeight - 64) {
						this.status = 0;
					}
					this.landingTime = this.landLag;
				}
				break;
			default:
				console.log("Illegal status = ");
				console.log(this.status);

		}
	}

	draw() {
		this.animations[0].drawFrame(this.game.clockTick, this.game.ctx, this.x, this.y, 2);
		// Test Label. Remove after getting proper sprites.
		this.game.font = '48px serif';
		this.game.ctx.fillText("H", this.x + 16, this.y + 48);
	}
}