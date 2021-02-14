class SceneManager {
	constructor(game) {
		this.game = game;
		this.game.camera = this;
		this.pos = { x: 0, y: 0 };

		//this.minimap = new Minimap(this.game, 260, 100, 740);
		this.createScreens();
		this.game.start();
	};

	createScreens() {
		this.pauseScreen = new PauseScreen(this.game, { fill: 'white', stroke: 'red' });
		this.game.screen = new StartScreen(this.game, {fill: 'white', stroke: 'red'});
	}

	loadLevel(level, x, y) {
		this.pos = { x: 0, y: 0 };
		this.game.entities = [];
		AUDIO_PLAYER.stopAll();
		let i;

		// Author: tommy
		// backgroung testing
		// 4 layers, lowest layer doesn't have speed, layer speed increases as layer inceases, speed different for this set is 20
		this.game.addEntity(new Background(this.game, this.pos.x, this.pos.y, "./Sprites/layer1.png", 592, 272, 60));
		this.game.addEntity(new Background(this.game, this.pos.x, this.pos.y, "./Sprites/layer2.png", 592, 272, 40));
		this.game.addEntity(new Background(this.game, this.pos.x, this.pos.y, "./Sprites/layer3.png", 592, 272, 20));
		this.game.addEntity(new Background(this.game, this.pos.x, this.pos.y, "./Sprites/layer4.png", 592, 272, 0));

		if (level.music) {
			AUDIO_PLAYER.playMusic(level.music);
		}

		if (level.background) {
			document.getElementById("gameWorld").setAttribute('style', 'background: cyan');
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
					rangedFly.x * PARAMS.TILE_WIDTH, rangedFly.y * PARAMS.TILE_WIDTH, rangedFly.prize, rangedFly.prizeRate));
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
					flyBeetle.x * PARAMS.TILE_WIDTH, flyBeetle.y * PARAMS.TILE_WIDTH, flyBeetle.prize, flyBeetle.prizeRate));
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
				this.game.addEntity(new RangedPowerUp(this.game, powerup.x * PARAMS.TILE_WIDTH, powerup.y * PARAMS.TILE_WIDTH));
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

	draw(ctx) {
		ctx.fillStyle = "white";
		ctx.font = "16px Verdana";
		ctx.fillText("LVL", 360, 25);
		ctx.fillText("Name: ", 30, 25);
		ctx.fillText("Keys: " + this.game.druid.keyCounter, 30, 115);

		// Druid Health Bar
		ctx.fillStyle = "Red";
		ctx.fillRect(30, 30, this.game.druid.health, 30);
		ctx.fillStyle = "White";
		ctx.fillRect(this.game.druid.health + 30, 30, this.game.druid.maxHealth - this.game.druid.health, 30);
		ctx.beginPath();
		ctx.strokeStyle = "Black";
		ctx.rect(30, 30, this.game.druid.maxHealth, 30)
		ctx.stroke();
		ctx.fillStyle = "black";
		ctx.font = "16px Verdana";
		ctx.fillText(this.game.druid.health + "/" + this.game.druid.maxHealth + "HP", 330, 50);

		// Potion bar
		ctx.fillStyle = "Blue";
		ctx.fillRect(30, 65, this.game.druid.potionCounter, 30);
		ctx.fillStyle = "White";
		ctx.fillRect(this.game.druid.potionCounter + 30, 65, this.game.druid.maxHealth - this.game.druid.potionCounter, 30);
		ctx.beginPath();
		ctx.strokeStyle = "Black";
		ctx.rect(30, 65, this.game.druid.maxHealth, 30)
		ctx.stroke();
		ctx.fillStyle = "black";
		ctx.font = "16px Verdana";
		ctx.fillText(this.game.druid.potionCounter + "/" + this.game.druid.maxHealth + "HP", 330, 85);

		if (PARAMS.DEBUG) {
			//this.minimap.draw(ctx);
        }
	};
}

class Minimap {
	constructor(game, x, y, w) {
		Object.assign(this, { game, x, y, w });
	};

	update() {

	};

	draw(ctx) {
		ctx.strokeStyle = "Black";
		ctx.strokeRect(this.x, this.y, this.w, PARAMS.BLOCKWIDTH * 10);
		this.game.druid.drawMinimap(ctx, this.x, this.y);
		//for (var i = 0; i < this.game.entities.length; i++) {
		//	this.game.entities[i].drawMinimap(ctx, this.x, this.y);
		//}
	};
};