class Ground extends Entity {
	constructor(game, x, y, width) {
		super(game, x, y, "./Sprites/ground.png");
		this.dim.x = width;
		this.updateBB();
		this.update = function () { /* Do nothing. */ };
	};

	/** @override */
	updateBB(context) {
		this.worldBB = new BoundingBox(
			this.pos.x, this.pos.y, this.dim.x * PARAMS.TILE_WIDTH, this.dim.y);
		this.lastWorldBB = this.worldBB;
		this.drawWorldBB(context);
    }

	/** @override */
	draw(context) {
		for (var i = 0; i < this.dim.x; i++)
			context.drawImage(this.spritesheet, 0, 0, 128, 128,
				this.pos.x + i * this.dim.y - this.game.camera.pos.x, this.pos.y - this.game.camera.pos.y,
				this.dim.y, this.dim.y);
		this.worldBB.display(this.game);
	}

	/** @override */
	drawWorldBB(context) {
		if (PARAMS.DEBUG) {
			context.save();
			context.strokeStyle = 'red';
			context.lineWidth = PARAMS.BB_LINE_WIDTH;
			context.strokeRect(
				this.pos.x - this.game.camera.pos.x, this.pos.y - this.game.camera.pos.y, this.dim.x * PARAMS.TILE_WIDTH, this.dim.y);
			context.restore();
		}
	}
}

class Key extends Entity {
	constructor(game, x, y) {
		super(game, x, y, "./Sprites/key.png");
		this.updateBB();
		this.update = function () { /* Do nothing. */ };
	};

	/** @override */
	updateBB(context) {
		this.worldBB = new BoundingBox(
			this.pos.x, this.pos.y, this.dim.x, this.dim.y);
		this.lastWorldBB = this.worldBB;
		this.drawWorldBB(context);
	}

	/** @override */
	draw(context) {
		context.drawImage(this.spritesheet, 0, 0, 128, 128,
			this.pos.x - this.game.camera.pos.x, this.pos.y - this.game.camera.pos.y,
			this.dim.x, this.dim.y);
		this.worldBB.display(this.game);
	}

	/** @override */
	drawWorldBB(context) {
		if (PARAMS.DEBUG) {
			context.save();
			context.strokeStyle = 'red';
			context.lineWidth = PARAMS.BB_LINE_WIDTH;
			context.strokeRect(
				this.pos.x - this.game.camera.pos.x, this.pos.y - this.game.camera.pos.y, this.dim.x, this.dim.y);
			context.restore();
		}
	}
}

class Door extends Entity {
	constructor(game, x, y) {
		super(game, x, y, "./Sprites/door.png");
		this.setDimensions(1, PARAMS.TILE_WIDTH, PARAMS.TILE_WIDTH * 3);
		this.updateBB();
		this.update = function () { /* Do nothing. */ };
	};

	/** @override */
	updateBB(context) {
		this.worldBB = new BoundingBox(
			this.pos.x, this.pos.y, this.dim.x, this.dim.y);
		this.lastWorldBB = this.worldBB;
		this.drawWorldBB(context);
	}

	/** @override */
	draw(context) {
		context.drawImage(this.spritesheet, 0, 0, 128, 384,
			this.pos.x - this.game.camera.pos.x, this.pos.y - this.game.camera.pos.y,
			this.dim.x, this.dim.y);
		this.worldBB.display(this.game);
	}

	/** @override */
	drawWorldBB(context) {
		if (PARAMS.DEBUG) {
			context.save();
			context.strokeStyle = 'red';
			context.lineWidth = PARAMS.BB_LINE_WIDTH;
			context.strokeRect(
				this.pos.x - this.game.camera.pos.x, this.pos.y - this.game.camera.pos.y, this.dim.x, this.dim.y);
			context.restore();
		}
	}
}