/**
 * Superclass holding default code for all powerups. Checks collision with druid and
 * calls method to add power to druid upon collision.
 */
class PowerUp extends Agent {
	constructor(game, x, y, spritesheet) {
		super(game, x, y, spritesheet);
		this.cooldownSpritesheet = ASSET_LOADER.getImageAsset("./Sprites/greygem.png");
		this.cooldown = 0;
	} 

	/** Update the coodown of this powerup. */
	updateCooldown() {
		this.cooldown -= this.game.clockTick;
	}

	/** @override */
	update() {
		this.move(this.game.clockTick);
	}

	/** @override */
	defineWorldCollisions(entity, collisions) {
		if (entity instanceof Druid) {
			this.removeFromWorld = true;
			this.game.druid.attacks.push(this);
			if (this.game.druid.attackSelection == null) {
				this.game.druid.attackSelection = 0;
			} else {
				this.game.druid.attackSelection = this.game.druid.attacks.length - 1;
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
		if (this.cooldown <= 0 && this.game.A) {
			if (DRUID.facing === 0) { // shoot left
				// basic ranged attack:
				this.game.addEntity(new BasicRangedAttack(
					DRUID.game,
					DRUID.pos.x - PARAMS.TILE_WIDTH,
					DRUID.pos.y + DRUID.scaleDim.y / 3,
					180, PARAMS.TILE_WIDTH / 2,
					600, 1, true));
			} else { // shoot right
				// basic ranged attack:
				this.game.addEntity(new BasicRangedAttack(
					DRUID.game,
					DRUID.pos.x + DRUID.scaleDim.x,
					DRUID.pos.y + DRUID.scaleDim.y / 3,
					0, PARAMS.TILE_WIDTH / 2,
					600, 1, true));
			}
			this.game.A = false;
			this.cooldown = 1;
		}
	}
}

/**
 * Adds the wind element power up to druid's attack
 */
class WindElement extends PowerUp {
	constructor(game, x, y) {
		super(game, x, y, "./Sprites/bluegem.png");
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
		if (this.cooldown <= 0 && this.game.A) {
			if (DRUID.facing === 0) { // shoot left
				this.game.addEntity(new TornadoAttack(
					DRUID.game,
					DRUID.pos.x - PARAMS.TILE_WIDTH,
					DRUID.pos.y - PARAMS.TILE_WIDTH, 0));
			} else { // shoot right
				this.game.addEntity(new TornadoAttack(
					DRUID.game,
					DRUID.pos.x + DRUID.scaleDim.x,
					DRUID.pos.y - PARAMS.TILE_WIDTH, 1));
			}
			this.game.A = false;
			this.cooldown = 2;
		}
	}
}

/**
 * Adds the light element power up to druid's attack
 */
class LightElement extends PowerUp {
	constructor(game, x, y) {
		super(game, x, y, "./Sprites/yellowgem.png");
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
		if (this.cooldown <= 0 && this.game.A) {
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
			this.cooldown = 3;
		}
	}
}