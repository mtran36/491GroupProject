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
	}
}