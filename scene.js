class Scene {
	constructor(game) {
		this.game = game;
		this.game.camera = this;
		this.pos = { x: 0, y: 0 };
		this.draw = () => { /* Do nothing */ };

		this.createScreens();
	};

	createScreens() {
		this.pauseScreen = new PauseScreen(this.game, { fill: 'white', stroke: 'red' });
		new StartScreen(this.game, {fill: 'white', stroke: 'red'});
	}

	loadLevel(level, x, y) {
		this.game.entities = [];
		AUDIO_PLAYER.stopAll();
		let i;

		this.game.addEntity(new Background(this.game,
			this.pos.x, this.pos.y, "./Sprites/layer1.png", 592, 272, -60));
		this.game.addEntity(new Background(this.game,
			this.pos.x, this.pos.y, "./Sprites/layer2.png", 592, 272, -40));
		this.game.addEntity(new Background(this.game,
			this.pos.x, this.pos.y, "./Sprites/layer3.png", 592, 272, -20));
		this.game.addEntity(new Background(this.game,
			this.pos.x, this.pos.y, "./Sprites/layer4.png", 592, 272, 0));

		if (level.music) {
			AUDIO_PLAYER.playMusic(level.music);
		}
		if (level.background) {
			for (i = 0; i < level.background.length; i++) {
				let attribute = level.background.attribute;
				let value = level.background.value;
				document.getElementById("gameWorld").setAttribute(
					attribute, value);
			}
		}
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
		if (level.mesh) {
			for (i = 0; i < level.mesh.length; i++) {
				let mesh = level.mesh[i];
				this.game.addEntity(new Mesh(this.game,
					PARAMS.TILE_WIDTH * mesh.x,
					PARAMS.TILE_WIDTH * mesh.y,
					mesh.width, mesh.height));
			}
		}
		if (level.standingBreakBlock) {
			for (i = 0; i < level.standingBreakBlock.length; i++) {
				let standingBreakBlock = level.standingBreakBlock[i];
				standingBreakBlock = new StandingBreakBlock(this.game,
					PARAMS.TILE_WIDTH * standingBreakBlock.x,
					PARAMS.TILE_WIDTH * standingBreakBlock.y,
					standingBreakBlock.width, standingBreakBlock.height,
					standingBreakBlock.blockType);
				this.game.addEntity(standingBreakBlock);
				standingBreakBlock.addBlock();
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
		if (level.rangedFlies) {
			for (i = 0; i < level.rangedFlies.length; i++) {
				let rangedFly = level.rangedFlies[i];
				this.game.addEntity(new RangedFly(this.game,
					rangedFly.x * PARAMS.TILE_WIDTH,
					rangedFly.y * PARAMS.TILE_WIDTH,
					rangedFly.prize, rangedFly.prizeRate));
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
		} if (level.flyBeetles) {
			for (i = 0; i < level.flyBeetles.length; i++) {
				let flyBeetle = level.flyBeetles[i];
				this.game.addEntity(new FlyBeetle(this.game,
					flyBeetle.x * PARAMS.TILE_WIDTH,
					flyBeetle.y * PARAMS.TILE_WIDTH,
					flyBeetle.prize, flyBeetle.prizeRate));
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
		if (level.powerups) {
			for (i = 0; i < level.powerups.length; i++) {
				let powerup = level.powerups[i];
				this.game.addEntity(new RangedPowerUp(this.game,
					powerup.x * PARAMS.TILE_WIDTH,
					powerup.y * PARAMS.TILE_WIDTH));
			}
		}
		if (level.wingElement) {
			for (i = 0; i < level.wingElement.length; i++) {
				let powerup = level.wingElement[i];
				this.game.addEntity(new WindElement(this.game,
					powerup.x * PARAMS.TILE_WIDTH,
					powerup.y * PARAMS.TILE_WIDTH));
			}
		}
		if (level.lightElement) {
			for (i = 0; i < level.lightElement.length; i++) {
				let powerup = level.lightElement[i];
				this.game.addEntity(new LightElement(this.game,
					powerup.x * PARAMS.TILE_WIDTH,
					powerup.y * PARAMS.TILE_WIDTH));
			}
		}
		this.game.druid = new Druid(this.game, x - 6000, y + 2);
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
}
