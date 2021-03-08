class Scene {
	constructor(game) {
		this.game = game;
		this.game.camera = this;
		this.game.druid = new Druid(this.game,
			PARAMS.TILE_WIDTH * 16, PARAMS.TILE_WIDTH * 115);
		this.pos = { x: 0, y: 0 };

		this.createScreens();
	};

	createScreens() {
		this.pauseScreen = new PauseScreen(this.game);
		this.winScreen = new WinScreen(this.game);
		this.startScreen = new StartScreen(this.game);
		this.loseScreen = new LoseScreen(this.game);
	}

	loadLevel(level) {
		this.game.entities = [];
		AUDIO_PLAYER.stopAll();
		let entry, construct, entityArr;
		document.getElementById("gameWorld").setAttribute('style', 'background: black');
		// Add all entities from level data
		for ([entry, entityArr] of Object.entries(level)) {
			console.log("Loading", entry);
			construct = entityArr.shift();
			entityArr.forEach((params) => {
				construct(this.game, params);
			});
			entityArr.splice(0, 0, construct);
		}

		this.temporaryBoss = new Hopper(this.game, 60 * PARAMS.TILE_WIDTH, 28 * PARAMS.TILE_WIDTH);
		this.temporaryBoss.setDimensions(2, this.temporaryBoss.dim.x, this.temporaryBoss.dim.y);
		this.temporaryBoss.health = 10;
		this.temporaryBoss.attack = 10;
		this.game.addEntity(this.temporaryBoss);

		this.game.addEntity(this.game.druid);
		this.game.addEntity(new Minimap(this.game, 7, 7, 100));
	};

	update() {
		PARAMS.DEBUG = document.getElementById("debug").checked;
		if (this.game.druid) {
			this.pos.x = this.game.druid.worldBB.x - PARAMS.CANVAS_WIDTH / 2;
			this.pos.y = this.game.druid.worldBB.y - PARAMS.CANVAS_HEIGHT / 1.75;
			this.pos.x = Math.floor(this.pos.x);
			this.pos.y = Math.floor(this.pos.y);
		}
	};

	/** @override */
	draw(context) {
		const ORIGIN_X = 20;
		const ORIGIN_Y = PARAMS.CANVAS_HEIGHT - 15;

		if (PARAMS.DEBUG) {
			context.save();
			context.font = "bold 16px sans-serif";
			context.fillStyle = 'grey';
			context.fillRect(ORIGIN_X - 10, ORIGIN_Y - 17, 300, 25);
			context.fillStyle = 'black';
			context.fillText(
				"Druid Location: (x = "
				+ Math.floor(this.game.druid.pos.x / PARAMS.TILE_WIDTH)
				+ ", y = " + Math.floor(this.game.druid.pos.y / PARAMS.TILE_WIDTH) + ")",
				ORIGIN_X, ORIGIN_Y);
			context.restore();
		}
    }
}
