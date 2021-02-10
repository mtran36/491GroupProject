class SceneManager {
	constructor(game) {
		this.game = game;
		this.game.camera = this;
		this.pos = { x: 0, y: 0 };

		this.loadLevel(levelOne, PARAMS.TILE_WIDTH * 5.5, PARAMS.TILE_WIDTH);
	};

	loadLevel(level, x, y) {
		this.game.entities = [];
		this.x = 0;
		let i;

		if (level.ground) {
			for (i = 0; i < level.ground.length; i++) {
				let ground = level.ground[i];
				this.game.addEntity(new Ground(this.game,
					PARAMS.TILE_WIDTH * ground.x,
					PARAMS.TILE_WIDTH * ground.y,
					ground.width, ground.height));
			}
		}
		if (level.mask) {
			for (i = 0; i < level.mask.length; i++) {
				let mask = level.mask[i];
				this.game.addEntity(new Mask(this.game,
					PARAMS.TILE_WIDTH * mask.x,
					PARAMS.TILE_WIDTH * mask.y,
					mask.width, mask.height));
            }
        }
		if (level.flies) {
			for (i = 0; i < level.flies.length; i++) {
				let fly = level.flies[i];
				this.game.addEntity(new Fly(this.game,
					fly.x * PARAMS.TILE_WIDTH,
					fly.y * PARAMS.TILE_WIDTH,
					fly.prize, fly.prizeRate));
			}
		}
		if (level.beetles) {
			for (i = 0; i < level.beetles.length; i++) {
				let beetle = level.beetles[i];
				this.game.addEntity(new Beetle(this.game,
					beetle.x * PARAMS.TILE_WIDTH,
					beetle.y * PARAMS.TILE_WIDTH,
					beetle.prize, beetle.prizeRate));
			}
		}
		if (level.hopper) {
			for (i = 0; i < level.hopper.length; i++) {
				let hopper = level.hopper[i];
				this.game.addEntity(new Hopper(this.game,
					hopper.x * PARAMS.TILE_WIDTH,
					hopper.y * PARAMS.TILE_WIDTH,
					hopper.prize, hopper.prizeRate));
			}
		}
		if (level.potions) {
			for (i = 0; i < level.potions.length; i++) {
				let potion = level.potions[i];
				this.game.addEntity(new Potions(
					this.game, potion.x, potion.y));
            }
        }
		if (level.keys) {
			for (i = 0; i < level.keys.length; i++) {
				let key = level.keys[i];
				this.game.addEntity(new Key(
					this.game, key.x * PARAMS.TILE_WIDTH,
					key.y * PARAMS.TILE_WIDTH));
			}
        }
		if (level.doors) {
			for (i = 0; i < level.doors.length; i++) {
				let door = level.doors[i];
				this.game.addEntity(new Door(
					this.game, door.x * PARAMS.TILE_WIDTH,
					door.y * PARAMS.TILE_WIDTH));
			}
		}
		this.game.druid = new Druid(
			this.game, x, y)
		this.game.addEntity(this.game.druid);
	};

	update() {
		PARAMS.DEBUG = document.getElementById("debug").checked;

		this.pos.x = Math.floor(this.game.druid.agentBB.x - PARAMS.CANVAS_WIDTH / 2);
		this.pos.y = Math.floor(this.game.druid.agentBB.y - PARAMS.CANVAS_HEIGHT / 2);
	};

	draw() {

	};
}
