// Enemies File.

//Flies straight at druid.
class fly {
	constructor(game, druid, x, y) {
		Object.assign(this, { game, druid, x, y });
		this.spritesheet = ASSET_MANAGER.getAsset("./Sprites/TestEnemy.png");
		this.flyTime = 10;
		this.xchange = 0;
		this.ychange = 0;
		this.animations = [];
		this.loadAnimations();
	}

	loadAnimations() {
		this.animations[0] = new Animator(this.spritesheet, 0, 0, 32, 32, 1, 1, 0, false, true, false);
	}

	update() {
		if (this.flyTime === 0) {
			var xdist = this.x - this.druid.x;
			var ydist = this.y - this.druid.y;
			if (Math.abs(xdist) < 400 && Math.abs(ydist) < 400) {
				if (xdist < 0) { this.xchange = 3; }
				if (xdist > 0) { this.xchange = -3; }
				if (xdist === 0) { this.xchange = 2 };
				if (ydist < 0) { this.ychange = 3; }
				if (ydist > 0) { this.ychange = -3; }
				if (ydist === 0) { this.ychange = 2; }
			} else {
				this.xchange = 0;
				this.ychange = 0;
			}
			this.flyTime = 30;
		} else {
			this.flyTime--;
		}
		this.x += this.xchange;
		this.y += this.ychange;
	}

	draw() {
		this.animations[0].drawFrame(this.game.clockTick, this.game.ctx, this.x, this.y, 2);
	}
}