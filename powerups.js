/**
 * Superclass holding default code for all powerups. Checks collision with druid and
 * calls method to add power to druid upon collision.
 */
class PowerUp extends Agent {
	constructor(game, x, y, spritesheet) {
		super(game, x, y, spritesheet);
		this.cooldownSpritesheet = ASSET_LOADER.getImageAsset("./Sprites/greygem.png");
		this.cooldown = 0;
		this.cost = 0;
		this.level = 1;
		this.canLevelUp = true;
	} 

	/** Update the coodown of this powerup. */
	updateCooldown() {
		this.cooldown -= this.game.clockTick;
	}

	/** Level up this powerup. */
	levelUp() {
		if (this.canLevelUp) {
			this.level++;
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
			this.removeFromWorld = true;
			if (this instanceof HealthPowerup) {
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
			if (this.level == 1) {
				if (DRUID.facing === 0) { // shoot left
					this.game.addEntity(new EnergyBallAttack(
						DRUID.game,
						DRUID.pos.x - PARAMS.TILE_WIDTH,
						DRUID.pos.y + DRUID.scaleDim.y / 3,
						180, PARAMS.TILE_WIDTH / 2, 600));
				} else { // shoot right
					this.game.addEntity(new EnergyBallAttack(
						DRUID.game,
						DRUID.pos.x + DRUID.scaleDim.x,
						DRUID.pos.y + DRUID.scaleDim.y / 3,
						0, PARAMS.TILE_WIDTH / 2, 600));
				}
			} else if (this.level >= 2) {
				if (DRUID.facing === 0) {
					var attack = new EnergyBallAttack(
						DRUID.game,
						DRUID.pos.x - PARAMS.TILE_WIDTH,
						DRUID.pos.y,
						180, PARAMS.TILE_WIDTH / 2 * 1.5, 600);
				} else {
					var attack = new EnergyBallAttack(
						DRUID.game,
						DRUID.pos.x + DRUID.scaleDim.x,
						DRUID.pos.y,
						0, PARAMS.TILE_WIDTH / 2 * 1.5, 600);
				}
				attack.scale = 1.5;
				if (this.level == 3) attack.hasExplosion = true;
				this.game.addEntity(attack);
			}
			this.game.A = false;
			this.cooldown = 0.3;
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
			if (this.level <= 2) {
				if (DRUID.facing === 0) { // shoot left
					this.game.addEntity(new TornadoAttack(
						DRUID.game,
						DRUID.pos.x - PARAMS.TILE_WIDTH / 2,
						DRUID.pos.y - PARAMS.TILE_WIDTH - 2, 0, 0.8 * this.level));
				} else { // shoot right
					this.game.addEntity(new TornadoAttack(
						DRUID.game,
						DRUID.pos.x + PARAMS.TILE_WIDTH * 2,
						DRUID.pos.y - PARAMS.TILE_WIDTH - 2, 1, 0.8 * this.level));
				}
			} else if (this.level == 3) {
				if (DRUID.facing === 0) { // shoot left
					this.game.addEntity(new TornadoAttack(
						DRUID.game,
						DRUID.pos.x - PARAMS.TILE_WIDTH / 2,
						DRUID.pos.y - PARAMS.TILE_WIDTH - 2, 0, 1.6, true));
				} else { // shoot right
					this.game.addEntity(new TornadoAttack(
						DRUID.game,
						DRUID.pos.x + PARAMS.TILE_WIDTH * 2,
						DRUID.pos.y - PARAMS.TILE_WIDTH - 2, 1, 1.6, true));
				}
            }
			this.game.A = false;
			this.cooldown = 1;
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
			if (DRUID.facing === 0) { // shoot left
				this.game.addEntity(new ThunderAttack(
					DRUID.game,
					DRUID.pos.x - PARAMS.TILE_WIDTH * 2,
					DRUID.pos.y + PARAMS.TILE_WIDTH, 0));
			} else { // shoot right
				this.game.addEntity(new ThunderAttack(
					DRUID.game,
					DRUID.pos.x + DRUID.scaleDim.x,
					DRUID.pos.y + PARAMS.TILE_WIDTH, 1));
			}
			this.game.A = false;
			this.cooldown = 0.5;
		}
	}
}

class HealthPowerup extends PowerUp {
	constructor(game, x, y) {
		super(game, x, y, "./Sprites/HealthPowerup.png");
	}

	static construct(game, params) {
		game.addEntity(new HealthPowerup(game,
			params.x * PARAMS.TILE_WIDTH,
			params.y * PARAMS.TILE_WIDTH));
    }
}