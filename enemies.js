// Enemies File.

//Flies straight at druid.
class fly {
	constructor(game, druid, x, y) {
		Object.assign(this, { game, druid, x, y });
		this.spritesheet = ASSET_MANAGER.getAsset("./Sprites/TestEnemy.png");
		this.flyTimeTotal = 0.4;
		this.flyTimeRemain = this.flyTimeTotal;
		this.xchange = 0;
		this.ychange = 0;
		this.speed = 160;
		this.range = 350;
		this.animations = [];
		this.loadAnimations();
	}

	loadAnimations() {
		this.animations[0] = new Animator(this.spritesheet, 0, 0, 32, 32, 1, 1, 0, false, true, false);
	}

	update() {
		this.flyTimeRemain -= this.game.clockTick;
		console.log
		if (this.flyTimeRemain <= 0) {
			var xdist = this.x - this.druid.x;
			var ydist = this.y - this.druid.y;
			var xmove = this.game.clockTick * this.speed;
			var ymove = this.game.clockTick * this.speed;
			if (Math.abs(xdist) < this.range && Math.abs(ydist) < this.range) {
				if (xdist < 0) { this.xchange = xmove; }
				if (xdist > 0) { this.xchange = 0 - xmove; }
				if (ydist < 0) { this.ychange = ymove; }
				if (ydist > 0) { this.ychange = 0 - ymove; }
			} else {
				this.xchange = 0;
				this.ychange = 0;
			}
			this.flyTimeRemain = this.flyTimeTotal;
		}
		this.x += this.xchange;
		this.y += this.ychange;
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
		this.hoptick = 0.01;
		this.hoptime = 0;
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
			this.hoptime += this.game.clockTick;
			this.airtime += this.game.clockTick;
			if (this.hoptime >= this.hoptick) {
				this.yspeed += params.velocityACC * this.airtime;
				this.yspeed = this.yspeed < params.velocityMin ? params.velocityMin : this.yspeed;
				this.hoptime = 0;
			}
			this.x += this.xspeed * this.game.clockTick;
			this.y -= this.yspeed * this.game.clockTick;
		} else if (Math.abs(xdist) < this.range && Math.abs(ydist) < this.range) {
			//If not hopping and the player is close enough
			this.hop = true;
			this.yspeed = this.yspeedStart;
			this.hoptime = 0;
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