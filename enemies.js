// Enemies File.

//Flies straight at druid.
class fly {
	constructor(game, druid, x, y) {
		Object.assign(this, { game, druid, x, y });
		this.spritesheet = ASSET_MANAGER.getAsset("./Sprites/TestEnemy.png");
		this.flyTime = 0;
		this.xchange = 0;
		this.ychange = 0;
		this.animations = [];
		this.loadAnimations();
	}

	loadAnimations() {
		this.animations[0] = new Animator(this.spritesheet, 0, 0, 32, 32, 1, 1, 0, false, true, false);
	}

	update() {
		this.flyTime += this.game.clockTick;
		if (this.flyTime > 0.75) {
			var xdist = this.x - this.druid.x;
			var ydist = this.y - this.druid.y;
			if (Math.abs(xdist) < 300 && Math.abs(ydist) < 300) {
				if (xdist < 0) { this.xchange = 3; }
				if (xdist > 0) { this.xchange = -3; }
				if (ydist < 0) { this.ychange = 3; }
				if (ydist > 0) { this.ychange = -3; }
			} else {
				this.xchange = 0;
				this.ychange = 0;
			}
			this.flyTime = 0;
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

		this.animations = [];
		this.loadAnimations();
	}

	loadAnimations() {
		this.animations[0] = new Animator(this.spritesheet, 0, 0, 32, 32, 1, 1, 0, false, true, false);
	}

	update() {
		if (this.faceRight) {
			this.x += 2;
		} else {
			this.x -= 2;
		}
		if (this.x >= this.game.surfaceWidth - 64) {
			this.faceRight = false;
		} else if (this.x <= 0) {
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

//Hops towareds the druid
class hopper {
	constructor(game, x, y) {
		Object.assign(this, { game, x, y });
		this.spritesheet = ASSET_MANAGER.getAsset("./Sprites/TestEnemy.png");
		this.velocity = 0;
		this.hop = false;
		this.hoptick = params.velocityTick;
		this.landLag = 0.2;
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
		//based on velocity and speed.
		if (this.hop == true) {
			this.hoptick -= this.game.clockTick;
			if (this.hoptick <= 0) {
				this.velocity--;
				this.velocity = Math.min(this.velocity, this.params.velocityMin);
				this.hoptick = params.velocityTick;
			}
			this.x += this.speed;
			this.y -= velocity;
		} else if (Math.abs(xdist) < 300 && Math.abs(ydist) < 300) {
			//If not hopping and the player is close enough
			this.hop == true;
			this.velocity = params.velocityStart;
			this.hoptick = 0;
			this.speed = xdist <= 0 ? 3 : -3;
			this.x += this.speed;
			this.y -= this.velocity;
		}
		if (this.y >= this.game.surfaceHeight - 64) {
			this.y = this.game.surfaceHeight - 64;
			this.hop = false;
			this.landLag = 0.2;
		}
		if (this.y <= 0) {
			this.y = 0;
			this.velocity = Math.min(this.velocity, 2);
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