//Player character
class druid {
	constructor(game, x, y) {
		Object.assign(this, { game, x, y });
		this.spritesheet = ASSET_MANAGER.getAsset("./Sprites/TestPlayer.png");

		this.animations = [];
		this.loadAnimations();
	}

	loadAnimations() {
		this.animations[0] = new Animator(this.spritesheet, 0, 0, 32, 32, 1, 1, 0, false, true, false);
	}

	update() {
		if (this.game.left) {
			this.x -= 4;
		}
		if (this.game.right) {
			this.x += 4;
		}
		if (this.game.up) {
			this.y -= 4;
		}
		if (this.game.down) {
			this.y += 4;
		}
	}

	draw() {
		this.animations[0].drawFrame(this.game.clockTick, this.game.ctx, this.x, this.y, 2);
	}
}
