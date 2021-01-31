class SceneManager {
	constructor(game) {
		this.game = game;
		this.game.camera = this;
		this.pos = { x: 0, y: 0 };


		this.loadLevel(levelOne, PARAMS.CANVAS_WIDTH - 700, PARAMS.CANVAS_HEIGHT - PARAMS.TILE_WIDTH * 9);
	};

	loadLevel(level, x, y) {
		this.game.entities = [];
		this.x = 0;

		if (level.grounds) {
			for (var i = 0; i < level.grounds.length; i++) {
				let ground = level.grounds[i];
				this.game.addEntity(new Ground(this.game,
					(PARAMS.CANVAS_WIDTH - PARAMS.TILE_WIDTH) * ground.x,
					PARAMS.CANVAS_HEIGHT - PARAMS.TILE_WIDTH * ground.y,
					ground.size));
			}
		}
		if (level.middle) {
			for (var i = 0; i < level.middle.length; i++) {
				let middle = level.middle[i];
				this.game.addEntity(new Ground(this.game,
					(PARAMS.TILE_WIDTH) * middle.x,
					PARAMS.CANVAS_HEIGHT - PARAMS.TILE_WIDTH * middle.y,
					middle.size));
			}
		}
		if (level.flies) {
			for (var i = 0; i < level.flies.length; i++) {
				let flies = level.flies[i];
				this.game.addEntity(new Fly(this.game,
					randomInt(800) * flies.x, randomInt(600) * flies.y));
			}
		}
		if (level.beetles) {
			for (var i = 0; i < level.beetles.length; i++) {
				let beetles = level.beetles[i];
				this.game.addEntity(new Beetle(this.game,
					beetles.x, PARAMS.CANVAS_HEIGHT - PARAMS.TILE_WIDTH * beetles.y - 10));
			}
		}
		if (level.hopper) {
			for (var i = 0; i < level.hopper.length; i++) {
				let hopper = level.hopper[i];
				this.game.addEntity(new Hopper(this.game,
					hopper.x, PARAMS.CANVAS_HEIGHT - PARAMS.TILE_WIDTH * hopper.y - 10));
			}
		}
		if (level.potions) {
			for (var i = 0; i < level.potions.length; i++) {
				let potion = level.potions[i];
				this.game.addEntity(new Potions(this.game, potion.x, potion.y));
            }
        }

		if (level.keys) {
			for (var i = 0; i < level.keys.length; i++) {
				let key = level.keys[i];
				this.game.addEntity(new Key(this.game, key.x * PARAMS.TILE_WIDTH, key.y * PARAMS.TILE_WIDTH));
			}
        }

		if (level.doors) {
			for (var i = 0; i < level.doors.length; i++) {
				let door = level.doors[i];
				this.game.addEntity(new Door(this.game, door.x * PARAMS.TILE_WIDTH, door.y * PARAMS.TILE_WIDTH));
			}
		}

		this.game.druid = new Druid(
			this.game, x, y)
		this.game.addEntity(this.game.druid);
	};

	update() {
		PARAMS.DEBUG = document.getElementById("debug").checked;
		
		this.pos.x = this.game.druid.agentBB.x - PARAMS.CANVAS_WIDTH / 2;
		this.pos.y = this.game.druid.agentBB.y - PARAMS.CANVAS_HEIGHT / 2;
	};

	draw() {

	};
}
