/*
 * Player character
 */
class Druid {
	constructor(game, x, y) {
		Object.assign(this, { game, x, y });
		this.spritesheet = ASSET_MANAGER.getAsset("./Sprites/TestPlayer.png");

		this.animations = [];
		this.loadAnimations();
		this.speed = 250;
	}

	loadAnimations() {
		this.animations[0] = new Animator(this.spritesheet, 0, 0, 32, 32, 1, 1, 0, false, true, false);
	}

	update() {
		var xmove = this.game.clockTick * this.speed;
		var ymove = this.game.clockTick * this.speed;
		if (this.game.left) {
			this.x -= xmove;
		}
		if (this.game.right) {
			this.x += xmove;
		}
		if (this.game.up) {
			this.y -= ymove;
		}
		if (this.game.down) {
			this.y += ymove;
		}
	}

	draw() {
		this.animations[0].drawFrame(this.game.clockTick, this.game.ctx, this.x, this.y, 2);
	}
}
