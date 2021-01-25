class SceneManager {
	constructor(game) {
		this.game = game;
		this.game.camera = this;
		this.loadTestLevel();
	}

	loadTestLevel() {
		/*
		this.game.addEntity(new Fly(this.game, player, randomInt(800), randomInt(600)));
		this.game.addEntity(new Beetle(this.game, 0, this.game.surfaceHeight - 64));
		this.game.addEntity(new Hopper(this.game, player, 0, randomInt(600)))
		*/

		// ground
		this.game.addEntity(new Ground(
			this.game, 0, PARAMS.CANVAS_HEIGHT - PARAMS.TILE_WIDTH, 16));
		this.game.addEntity(new Ground(
			this.game, 0, PARAMS.CANVAS_HEIGHT - PARAMS.TILE_WIDTH * 2, 1));
		this.game.addEntity(new Ground(this.game, PARAMS.CANVAS_WIDTH - PARAMS.TILE_WIDTH,
			PARAMS.CANVAS_HEIGHT - PARAMS.TILE_WIDTH * 2, 1));

		// left platform
		this.game.addEntity(new Ground(
			this.game, 0, PARAMS.CANVAS_HEIGHT - PARAMS.TILE_WIDTH * 5, 3));
		this.game.addEntity(new Ground(
			this.game, 0, PARAMS.CANVAS_HEIGHT - PARAMS.TILE_WIDTH * 6, 2));
		this.game.addEntity(new Ground(
			this.game, 0, PARAMS.CANVAS_HEIGHT - PARAMS.TILE_WIDTH * 7, 1));
		this.game.addEntity(new Ground(
			this.game, 0, PARAMS.CANVAS_HEIGHT - PARAMS.TILE_WIDTH * 8, 1));
		this.game.addEntity(new Ground(
			this.game, 0, PARAMS.CANVAS_HEIGHT - PARAMS.TILE_WIDTH * 9, 1));
		this.game.addEntity(new Ground(
			this.game, 0, PARAMS.CANVAS_HEIGHT - PARAMS.TILE_WIDTH * 10, 1));

		// right platform
		this.game.addEntity(new Ground(
			this.game, PARAMS.CANVAS_WIDTH - PARAMS.TILE_WIDTH * 3,
			PARAMS.CANVAS_HEIGHT - PARAMS.TILE_WIDTH * 5, 3));
		this.game.addEntity(new Ground(
			this.game, PARAMS.CANVAS_WIDTH - PARAMS.TILE_WIDTH * 2,
			PARAMS.CANVAS_HEIGHT - PARAMS.TILE_WIDTH * 6, 2));
		this.game.addEntity(new Ground(
			this.game, PARAMS.CANVAS_WIDTH - PARAMS.TILE_WIDTH,
			PARAMS.CANVAS_HEIGHT - PARAMS.TILE_WIDTH * 7, 1));
		this.game.addEntity(new Ground(
			this.game, PARAMS.CANVAS_WIDTH - PARAMS.TILE_WIDTH,
			PARAMS.CANVAS_HEIGHT - PARAMS.TILE_WIDTH * 8, 1));
		this.game.addEntity(new Ground(
			this.game, PARAMS.CANVAS_WIDTH - PARAMS.TILE_WIDTH,
			PARAMS.CANVAS_HEIGHT - PARAMS.TILE_WIDTH * 9, 1));
		this.game.addEntity(new Ground(
			this.game, PARAMS.CANVAS_WIDTH - PARAMS.TILE_WIDTH,
			PARAMS.CANVAS_HEIGHT - PARAMS.TILE_WIDTH * 10, 1));

		// mid platform
		this.game.addEntity(new Ground(
			this.game, PARAMS.TILE_WIDTH * 6, PARAMS.CANVAS_HEIGHT - PARAMS.TILE_WIDTH * 7, 5));
		this.game.addEntity(new Ground(
			this.game, PARAMS.TILE_WIDTH * 8, PARAMS.CANVAS_HEIGHT - PARAMS.TILE_WIDTH * 8, 1));
		this.game.addEntity(new Ground(
			this.game, PARAMS.TILE_WIDTH * 6, PARAMS.CANVAS_HEIGHT - PARAMS.TILE_WIDTH * 6, 1));
		this.game.addEntity(new Ground(
			this.game, PARAMS.TILE_WIDTH * 10, PARAMS.CANVAS_HEIGHT - PARAMS.TILE_WIDTH * 6, 1));

		
		this.game.addEntity(new Druid(
			this.game,
			PARAMS.CANVAS_WIDTH - 700,
			PARAMS.CANVAS_HEIGHT - PARAMS.TILE_WIDTH * 5));
	}

	update() {
		PARAMS.DEBUG = document.getElementById("debug").checked;
	};
}
