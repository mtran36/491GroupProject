class Ground {
	constructor(game, x, y, count) {
		Object.assign(this, { game, x, y, count});

		this.spriteSheet = ASSET_MANAGER.getAsset("./Sprites/ground.png");
	};

	update() {

	};

	draw(ctx) {
		// draw # of count of ground tile to the left 
		for (var i = 0; i < this.count; i++) {
			ctx.drawImage(this.spriteSheet, 0, 0, 128, 128, this.x + i * params.tileWidth, this.y, params.tileWidth, params.tileWidth);
		}
		
	};
}