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

		// Author: tommy
		// backgroung testing
		// 4 layers, lowest layer doesn't have speed, layer speed increases as layer inceases, speed different for this set is 50
		this.game.addEntity(new Background(this.game, this.pos.x, this.pos.y, "./Sprites/layer1.png", 592, 272, 0));
		this.game.addEntity(new Background(this.game, this.pos.x, this.pos.y, "./Sprites/layer2.png", 592, 272, 50));
		this.game.addEntity(new Background(this.game, this.pos.x, this.pos.y, "./Sprites/layer3.png", 592, 272, 100));
		this.game.addEntity(new Background(this.game, this.pos.x, this.pos.y, "./Sprites/layer4.png", 592, 272, 150));


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
				let fly = level.flies[i];
				this.game.addEntity(new Fly(this.game,
					fly.x * PARAMS.TILE_WIDTH, fly.y * PARAMS.TILE_WIDTH, fly.prize, fly.prizeRate));
			}
		}
		if (level.rangedFlies) {
			for (var i = 0; i < level.rangedFlies.length; i++) {
				let rangedFly = level.rangedFlies[i];
				this.game.addEntity(new RangedFly(this.game,
					rangedFly.x * PARAMS.TILE_WIDTH, rangedFly.y * PARAMS.TILE_WIDTH, rangedFly.prize, rangedFly.prizeRate));
			}
		}
		if (level.beetles) {
			for (var i = 0; i < level.beetles.length; i++) {
				let beetle = level.beetles[i];
				this.game.addEntity(new Beetle(this.game,
					beetle.x * PARAMS.TILE_WIDTH, beetle.y * PARAMS.TILE_WIDTH, beetle.prize, beetle.prizeRate));
			}
		} if (level.flyBeetles) {
			for (var i = 0; i < level.flyBeetles.length; i++) {
				let flyBeetle = level.flyBeetles[i];
				this.game.addEntity(new FlyBeetle(this.game,
					flyBeetle.x * PARAMS.TILE_WIDTH, flyBeetle.y * PARAMS.TILE_WIDTH, flyBeetle.prize, flyBeetle.prizeRate));
			}
		}
		if (level.hopper) {
			for (var i = 0; i < level.hopper.length; i++) {
				let hopper = level.hopper[i];
				this.game.addEntity(new Hopper(this.game,
					hopper.x * PARAMS.TILE_WIDTH, hopper.y * PARAMS.TILE_WIDTH, hopper.prize, hopper.prizeRate));
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

		if (level.powerups) {
			for (var i = 0; i < level.powerups.length; i++) {
				let powerup = level.powerups[i];
				this.game.addEntity(new RangedPowerUp(this.game, powerup.x * PARAMS.TILE_WIDTH, powerup.y * PARAMS.TILE_WIDTH));
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
		this.pos.x = Math.floor(this.pos.x);
		this.pos.y = Math.floor(this.pos.y);
	};

	draw() {

	};
}
