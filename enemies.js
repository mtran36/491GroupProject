// Enemies File.

//Flies straight at druid.
class fly {
	constructor(game, druid, x, y) {
		Object.assign(this, { game, druid, x, y });
		this.spritesheet = ASSET_MANAGER.getAsset("./Sprites/TestEnemy.png");
		this.range = { x: 400, y: 400 };
		this.ACC = {x: 7, y: 7}
		this.velocityMAX = { x: 15, y: 15 };
		this.velocity = { x: 0, y: 0 };
		this.left = false;
		this.up = false;
		this.accelerate = false;
		this.animations = [];
		this.loadAnimations();
	}

	loadAnimations() {
		this.animations[0] = new Animator(this.spritesheet, 0, 0, 32, 32, 1, 1, 0, false, true, false);
	}

	update() {
		var xdist = this.x - this.druid.x;
		var ydist = this.y - this.druid.y;
		if (Math.abs(xdist) < this.range.x && Math.abs(ydist) < this.range.y) {
			if (xdist > 0) {
				this.left = true;
			} else {
				this.left = false;
			}
			if (ydist > 0) {
				this.up = true;
			} else {
				this.up = false;
			}
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
		this.x += this.velocity.x;
		this.y += this.velocity.y;
	}

	draw() {
		this.animations[0].drawFrame(this.game.clockTick, this.game.ctx, this.x, this.y, 2);
		//Label for during testing. Remove in full game.
		this.game.ctx.font = "48px serif";
		this.game.ctx.fillText("F", this.x + 16, this.y + 48);
	}
}

//Moves back and forth
class beetle {
	constructor(game, x, y) {
		Object.assign(this, { game, x, y });
		this.spritesheet = ASSET_MANAGER.getAsset("./Sprites/TestEnemy.png");

		this.faceRight = true;
		this.speed = 100;

		this.animations = [];
		this.loadAnimations();
	}

	loadAnimations() {
		this.animations[0] = new Animator(this.spritesheet, 0, 0, 32, 32, 1, 1, 0, false, true, false);
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
		this.animations[0].drawFrame(this.game.clockTick, this.game.ctx, this.x, this.y, 2);
		//Test Label. Remove after getting proper sprites.
		this.game.font = '48px serif';
		this.game.ctx.fillText("B", this.x + 16, this.y + 48);
	}

}

//Hops towards the druid
class hopper {
	constructor(game, druid, x, y) {
		Object.assign(this, { game, druid, x, y });
		this.spritesheet = ASSET_MANAGER.getAsset("./Sprites/TestEnemy.png");
		this.xspeed = 400;
		this.yspeed = 0;
		this.yspeedStart = 500;
		this.hop = false;
		this.hoptime = 0.01;
		this.hoptick = 0;
		this.landLag = 0.3;
		this.airtime = 0;
		this.range = 450;
		this.animations = [];
		this.loadAnimations();
	}

	loadAnimations() {
		this.animations[0] = new Animator(this.spritesheet, 0, 0, 32, 32, 1, 1, 0, false, true, false);
	}

	update() {
		//Keeps the hopper grounded for a brief moment before it can jump again.
		this.landLag -= this.game.clockTick;
		if (this.landLag >= 0 && this.hop == false) {
			return;
		}
		var xdist = this.x - this.druid.x;
		var ydist = this.y - this.druid.y;
		//If the hopper is hopping then check if it is time to increment the velocity, then move the hopper
		//based on acceleration and gametime.
		if (this.hop == true) {
			this.hoptick += this.game.clockTick;
			this.airtime += this.game.clockTick;
			if (this.hoptick >= this.hoptime) {
				this.yspeed += params.velocityACCy * this.airtime;
				this.yspeed = this.yspeed < params.velocityMINy ? params.velocityMINy : this.yspeed;
				this.hoptick = 0;
			}
			this.x += this.xspeed * this.game.clockTick;
			this.y -= this.yspeed * this.game.clockTick;
		} else if (Math.abs(xdist) < this.range && Math.abs(ydist) < this.range) {
			//If not hopping and the player is close enough
			this.hop = true;
			this.yspeed = this.yspeedStart;
			this.hoptick = 0;
			if (xdist >= 0) {
				this.xspeed = Math.min(this.xspeed, -1 * this.xspeed);
			} else {
				this.xspeed = Math.max(this.xspeed, -1 * this.xspeed);
			}
			this.x += this.xspeed * this.game.clockTick;
			this.y -= this.yspeed * this.game.clockTick;
		}
		if (this.y >= this.game.surfaceHeight - 64) {
			this.y = this.game.surfaceHeight - 64;
			this.hop = false;
			this.landLag = 0.2;
			this.airtime = 0;
		}
		if (this.y <= 0) {
			this.y = 0;
			this.yspeed = Math.min(this.yspeed, 25);
		}
		if (this.x <= 0) {
			this.x = 0;
		}
		if (this.x >= this.game.surfaceWidth - 64) {
			this.x = this.game.surfaceWidth - 64;
		}
	}

	draw() {
		this.animations[0].drawFrame(this.game.clockTick, this.game.ctx, this.x, this.y, 2);
		//Test Label. Remove after getting proper sprites.
		this.game.font = '48px serif';
		this.game.ctx.fillText("H", this.x + 16, this.y + 48);
	}
}