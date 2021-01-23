class Ground {
	constructor(game, x, y, count) {
		Object.assign(this, { game, x, y, count});

		this.spriteSheet = ASSET_MANAGER.getAsset("./Sprites/ground.png");


		this.BB = new BoundingBox(this.x, this.y, this.count * params.tileWidth, params.tileWidth);
	};

	update() {

	};

	draw(ctx) {
		// draw # of count of ground tile to the left 
		for (var i = 0; i < this.count; i++) {
			ctx.drawImage(this.spriteSheet, 0, 0, 128, 128, this.x + i * params.tileWidth, this.y, params.tileWidth, params.tileWidth);
		}
		if (params.debug) {
			ctx.strokeStyle = 'Red';
			ctx.strokeRect(this.BB.x, this.BB.y, this.BB.width, this.BB.height);
        }
	};
}