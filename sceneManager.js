class SceneManager {
	constructor(game) {
		this.game = game;
		this.game.camera = this;

		this.sprites = new Array(2);

		this.currentLevel = 1;
		this.map = level_1_map;

		mapLevel1(game, this);

		this.sprites[0] = null;
		this.sprites[1] = 1;

		this.loadTestLevel();
	}

	loadTestLevel() {

		/* Switch to this once collision detection is handled */

		//for (var i = 0; i < 200; i++) {
		//	for (var j = 0; j < 35; j++) {
		//		var sprite = this.sprites[this.map[j][i]];
		//		//var currentLevel = this.currentLevel;
		//		if (sprite) {
		//			if (sprite == 1) {
		//				this.game.addEntity(new Ground(
		//					this.game, i * 64, j * 20.7, 1));
		//			}
		//		}
		//	}
		//}

		// ground
		this.game.addEntity(new Ground(
			this.game, 0, PARAMS.CANVAS_HEIGHT - PARAMS.TILE_WIDTH, 16));
		this.game.addEntity(new Ground(this.game, 0,
			PARAMS.CANVAS_HEIGHT - PARAMS.TILE_WIDTH * 2 , 1));
//		this.game.addEntity(new Ground(this.game, PARAMS.CANVAS_WIDTH - PARAMS.TILE_WIDTH,
//			PARAMS.CANVAS_HEIGHT - PARAMS.TILE_WIDTH * 2, 1));

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

		// enemies
		this.game.addEntity(new Fly(
			this.game, randomInt(800), randomInt(600)));
		this.game.addEntity(new Fly(
			this.game, randomInt(800), randomInt(600)));
		this.game.addEntity(new Beetle(
			this.game, 200, PARAMS.CANVAS_HEIGHT - PARAMS.TILE_WIDTH * 2));
		this.game.addEntity(new Hopper(
			this.game, 700, PARAMS.CANVAS_HEIGHT - PARAMS.TILE_WIDTH * 2));

		// mc
		this.game.addEntity(new Druid(
			this.game,
			PARAMS.CANVAS_WIDTH - 700,
			PARAMS.CANVAS_HEIGHT - PARAMS.TILE_WIDTH * 5));
	}

	update() {
		PARAMS.DEBUG = document.getElementById("debug").checked;
	};
}
