class Scene {
	constructor(game) {
		this.game = game;
		this.game.camera = this;
		this.pos = { x: 0, y: 0 };

		this.createScreens();
	};

	createScreens() {
		this.pauseScreen = new PauseScreen(this.game, { fill: 'white', stroke: 'red' });
		new StartScreen(this.game, {fill: 'white', stroke: 'red'});
	}

	loadLevel(level, x, y) {
		this.game.entities = [];
		AUDIO_PLAYER.stopAll();
		let entry, construct, entityArr;
		document.getElementById("gameWorld").setAttribute('style', 'background: black');
		// Add all entities from level data
		for (entry of Object.entries(level)) {
			console.log("Loading", entry.shift());
			entityArr = entry.shift();
			construct = entityArr.shift();
			entityArr.forEach((params) => {
				construct(this.game, params);
			});
		}

		this.game.druid = new Druid(this.game, x - 6500, y - 200);
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
	draw() {
		// Do nothing
    }
}
