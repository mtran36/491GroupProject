class Ground extends Entity {
	constructor(game, x, y, width) {
		super(game, x, y, "./Sprites/ground.png");
		this.dim.x = width;
		this.updateBB();
		this.update = function () { /* Do nothing. */ };
	};

	/** @override */
	updateBB(context) {
		//this.lastWorldBB = this.worldBB;
		this.worldBB = new BoundingBox(
			this.pos.x, this.pos.y, this.dim.x * PARAMS.TILE_WIDTH, this.dim.y);
		this.drawWorldBB(context);
    }

	/** @override */
	draw(context) {
		for (var i = 0; i < this.dim.x; i++)
			context.drawImage(this.spritesheet, 0, 0, 128, 128,
				this.pos.x + i * this.dim.y, this.pos.y,
				this.dim.y, this.dim.y);
		this.worldBB.display(context);
	}

	/** @override */
	drawWorldBB(context) {
		if (PARAMS.DEBUG) {
			context.save();
			context.strokeStyle = 'red';
			context.lineWidth = PARAMS.BB_LINE_WIDTH;
			context.strokeRect(
				this.pos.x, this.pos.y, this.dim.x * PARAMS.TILE_WIDTH, this.dim.y);
			context.restore();
		}
	}
}