/**
 * Superclass holding default code for all powerups. Checks collision with druid and
 * calls method to add power to druid upon collision.
 */
class PowerUp extends Agent {
	constructor(game, x, y, spritesheet) {
		super(game, x, y, spritesheet);
		this.mapPipColor = "yellow";
		this.cooldownSpritesheet = ASSET_LOADER.getImageAsset("./Sprites/greygem.png");
		this.cooldown = 0;
		this.cost = 0;
		this.level = 1;
		this.canLevelUp = true;
		this.levelDescription = [];
	} 

	/** Update the coodown of this powerup. */
	updateCooldown() {
		this.cooldown -= this.game.clockTick;
	}

	/** Level up this powerup. */
	levelUp() {
		if (this.canLevelUp) {
			this.level++;
			AUDIO_PLAYER.playSound("./Audio/LevelUp.mp3");
        }
		if (this.level >= 3) this.canLevelUp = false;
    }

	/** @override */
	update() {
		this.move(this.game.clockTick);
	}

	/** @override */
	defineWorldCollisions(entity, collisions) {
		if (entity instanceof Druid) {
			AUDIO_PLAYER.playSound("./Audio/Potion.mp3");
			this.removeFromWorld = true;
			if (this instanceof SwordPowerup) {
				entity.hasSword = true;
			} else if (this instanceof HealthPowerup) {
				entity.maxHealth += 20;
				entity.health += 20;
				entity.updateBackgroundGradient();
			} else {
				this.game.druid.attacks.push(this);
				if (this.game.druid.attackSelection == null) {
					this.game.druid.attackSelection = 0;
				} else {
					this.game.druid.attackSelection = this.game.druid.attacks.length - 1;
				}
			}
		}
	}

	/** @override */
	draw(context) {
		context.drawImage(this.spritesheet, 0, 0, 64, 64,
			this.pos.x - this.game.camera.pos.x, this.pos.y - this.game.camera.pos.y,
			this.scaleDim.x, this.scaleDim.y);
	}

	/** @override */
	defineAgentCollisions() {
		// Do nothing
	}

	/** @override */
	loadAnimations() {
		// Do nothing
    }
}

/**
 * Adds the basic ranged attack function to the druids list of attacks.
 */
class RangedPowerUp extends PowerUp {
	constructor(game, x, y) {
		super(game, x, y, "./Sprites/greengem.png");
		this.cost = 20;
		this.levelDescription = [
			"Energy Ball size increase.",
			"Energy Ball spell causes explosion on hit.",
			"This spell has already reached max level."
		]
	}

	static construct(game, params) {
		game.addEntity(new RangedPowerUp(game,
			params.x * PARAMS.TILE_WIDTH,
			params.y * PARAMS.TILE_WIDTH));
	}

	/**
	 * Creates a basic ranged attack for druid when called.
	 * @param {any} DRUID the main character.
	 */
	attack(DRUID) {
		if (this.cooldown <= 0 && this.game.A && DRUID.mana >= this.cost) {
			DRUID.mana -= this.cost;
			if (DRUID.facing === 0) { // shoot left
				this.game.addEntity(new EnergyBallAttack(
					DRUID.game,
					DRUID.pos.x - PARAMS.TILE_WIDTH,
					DRUID.pos.y + DRUID.scaleDim.y / 3,
					180, PARAMS.TILE_WIDTH / 2, 600, this.level));
			} else { // shoot right
				this.game.addEntity(new EnergyBallAttack(
					DRUID.game,
					DRUID.pos.x + DRUID.scaleDim.x,
					DRUID.pos.y + DRUID.scaleDim.y / 3,
					0, PARAMS.TILE_WIDTH / 2, 600, this.level));
			}
			this.game.A = false;
			this.cooldown = 0.3;
		} else if (this.game.A) {
			AUDIO_PLAYER.playSound("./Audio/DruidManaExhausted.wav");
        }
	}
}

/**
 * Adds the wind element power up to druid's attack
 */
class WindElement extends PowerUp {
	constructor(game, x, y) {
		super(game, x, y, "./Sprites/bluegem.png");
		this.cost = 35;
		this.levelDescription = [
			"Tornado spell attack increase.",
			"Tornado spell increases size as it moves.",
			"This spell has already reached max level."
		]
	}

	static construct(game, params) {
		game.addEntity(new WindElement(game,
			params.x * PARAMS.TILE_WIDTH,
			params.y * PARAMS.TILE_WIDTH));
	}

	/**
	* Creates a tornado attack for druid when called.
	* @param {any} DRUID the main character.
	*/
	attack(DRUID) {
		if (this.cooldown <= 0 && this.game.A && DRUID.mana >= this.cost) {
			DRUID.mana -= this.cost;
			if (DRUID.facing === 0) { // shoot left
				this.game.addEntity(new TornadoAttack(
								DRUID.game,
								DRUID.pos.x - PARAMS.TILE_WIDTH / 2,
								DRUID.pos.y - PARAMS.TILE_WIDTH - 2, 0, this.level));
			} else { // shoot right
				this.game.addEntity(new TornadoAttack(
							DRUID.game,
							DRUID.pos.x + PARAMS.TILE_WIDTH * 2,
							DRUID.pos.y - PARAMS.TILE_WIDTH - 2, 1, this.level));
			}
			this.game.A = false;
			this.cooldown = 0.5;
		}
	}
}

/**
 * Adds the light element power up to druid's attack
 */
class LightElement extends PowerUp {
	constructor(game, x, y) {
		super(game, x, y, "./Sprites/yellowgem.png");
		this.cost = 50;
		this.empowered = false;
		this.levelDescription = [
			"Thunder spell also shocks enemy with lightning bolt.",
			"Casting thunder spell will empower the next thunder spell.",
			"Spell has already reached max level."
		]
	}

	static construct(game, params) {
		game.addEntity(new LightElement(game,
			params.x * PARAMS.TILE_WIDTH,
			params.y * PARAMS.TILE_WIDTH));
	}

	/**
	* Creates a thunder attack for druid when called.
	* @param {any} DRUID the main character.
	*/
	attack(DRUID) {
		if (this.cooldown <= 0 && this.game.A && DRUID.mana >= this.cost) {
			DRUID.mana -= this.cost;
			let druidCenter = this.game.druid.worldBB.centerPoint();
			if (DRUID.facing === 0) { // shoot left
				if (this.level == 3 && this.empowered) {
					this.game.addEntity(new ThunderAttack(
						DRUID.game,
						druidCenter.x - PARAMS.TILE_WIDTH * 7,
						DRUID.pos.y + PARAMS.TILE_WIDTH / 2,
						0, this.level, this.empowered));
				} else {
					this.game.addEntity(new ThunderAttack(
						DRUID.game,
						druidCenter.x - PARAMS.TILE_WIDTH * 4.5,
						DRUID.pos.y + PARAMS.TILE_WIDTH / 2,
						0, this.level, this.empowered));
                }
			} else { // shoot right
				this.game.addEntity(new ThunderAttack(
					DRUID.game,
					DRUID.pos.x + DRUID.scaleDim.x - PARAMS.TILE_WIDTH / 2,
					DRUID.pos.y + PARAMS.TILE_WIDTH / 2, 1, this.level, this.empowered));
			}
			if (this.level == 3 && this.empowered == false) {
				this.empowered = true;
			} else {
				this.empowered = false;
            }
			DRUID.casting = true;
			DRUID.castFacing = DRUID.facing;
			this.game.A = false;
			this.cooldown = 0.5;
		} 
	}
}

class HealthPowerup extends PowerUp {
	constructor(game, x, y) {
		super(game, x, y, "./Sprites/HealthPowerup.png");
		this.colliding = false;
	}

	static construct(game, params) {
		game.addEntity(new HealthPowerup(game,
			params.x * PARAMS.TILE_WIDTH,
			params.y * PARAMS.TILE_WIDTH));
    }
}

class SwordPowerup extends PowerUp {
	constructor(game, x, y) {
		super(game, x, y, "./Sprites/sword.png");
		this.setDimensions(2.5, 34, 15);
		this.colliding = false;
	}

	static construct(game, params) {
		game.addEntity(new SwordPowerup(game,
			params.x * PARAMS.TILE_WIDTH,
			params.y * PARAMS.TILE_WIDTH));
	}

	/** @override */
	loadAnimations() {
		this.animations[0] = new Animator(
			this.spritesheet, 0, 0, 34, 15, 4, 0.5, 1, false, true, false);
	}

	/** @override */
	draw(context) {
		this.animations[0].drawFrame(
			this.game.clockTick, context,
			this.pos.x, this.pos.y,
			this.scale, this.game.camera);
		this.worldBB.display(this.game);
		this.agentBB.forEach((BB) => {
			BB.display(this.game);
		});
	}
}

class LevelUpStone extends Agent {
	constructor(game, x, y) {
		super(game, x, y, "./Sprites/Stone.png");
	}

	static construct(game, params) {
		game.addEntity(new LevelUpStone(game,
			params.x * PARAMS.TILE_WIDTH,
			params.y * PARAMS.TILE_WIDTH));
	}

	/** @override */
	defineWorldCollisions(entity, collisions) {
		if (entity instanceof Druid && !this.colliding) {
			AUDIO_PLAYER.playSound("./Audio/PowerupPickUp.mp3");
			this.game.camera.levelUpScreen.showScreen(this);
			this.colliding = true;
		}
	}

	/** @override */
	update() {
		let druid = this.game.druid;
		if (this.pos.x + PARAMS.TILE_WIDTH < druid.pos.x
			|| this.pos.x > druid.pos.x + druid.scaleDim.x
			|| this.pos.y + PARAMS.TILE_WIDTH < druid.pos.y
			|| this.pos.y > druid.pos.y + druid.scaleDim.y) {
			this.colliding = false;
		}
		this.move(this.game.clockTick);
	}

	/** @override */
	draw(context) {
		context.drawImage(this.spritesheet, 0, 0, 32, 32,
			this.pos.x - this.game.camera.pos.x, this.pos.y - this.game.camera.pos.y,
			this.scaleDim.x, this.scaleDim.y);
	}

	/** @override */
	loadAnimations() {
		// Do nothing
    }
}