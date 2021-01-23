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

		this.game.addEntity(new Ground(
			this.game, 0, PARAMS.CANVAS_HEIGHT - PARAMS.TILE_WIDTH, 16));
		this.game.addEntity(new Ground(
			this.game, 0, PARAMS.CANVAS_HEIGHT - PARAMS.TILE_WIDTH * 5, 3));
		this.game.addEntity(new Druid(
			this.game,
			PARAMS.CANVAS_WIDTH - 700,
			PARAMS.CANVAS_HEIGHT - PARAMS.TILE_WIDTH - 160));
	}

	update() {
		PARAMS.DEBUG = document.getElementById("debug").checked;
	};
}
