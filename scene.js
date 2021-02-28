class Scene {
	constructor(game) {
		this.game = game;
		this.game.camera = this;
		this.pos = { x: 0, y: 0 };

		this.createScreens();
	};

	createScreens() {
		this.pauseScreen = new PauseScreen(this.game);
		this.winScreen = new WinScreen(this.game);
		this.StartScreen = new StartScreen(this.game);
	}

	loadLevel(level, x, y) {
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
		// Author: tommy
		// temporary boss:
		this.temporaryBoss = new Hopper(this.game, 60 * PARAMS.TILE_WIDTH, 30 * PARAMS.TILE_WIDTH);
		this.temporaryBoss.setDimensions(2, this.temporaryBoss.dim.x, this.temporaryBoss.dim.y);
		this.temporaryBoss.health = 10;
		this.temporaryBoss.attack = 10;
		this.game.addEntity(this.temporaryBoss);

		this.game.druid = new Druid(this.game, x, y);
		this.game.addEntity(this.game.druid);
		this.game.addEntity(new Minimap(this.game, 860, 10, 150));
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
		const ANCHOR_X = PARAMS.CANVAS_WIDTH / 2 - 200;
		const ANCHOR_Y = PARAMS.CANVAS_HEIGHT / 2;

		if (PARAMS.DEBUG) {
			context.save();
			context.font = "bold 16px sans-serif";
			context.fillStyle = 'grey';
			context.fillRect(ANCHOR_X - 10, ANCHOR_Y - 17, 400, 25);
			context.fillStyle = 'black';
			context.fillText(
				"Current location = x: "
				+ Math.floor(this.game.druid.pos.x / PARAMS.TILE_WIDTH)
				+ ", y: " + Math.floor(this.game.druid.pos.y / PARAMS.TILE_WIDTH),
				ANCHOR_X, ANCHOR_Y);
			context.restore();
		}
    }
}
