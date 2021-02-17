/**
 * Superclass holding default code for all powerups. Checks collision with druid and
 * calls method to add power to druid upon collision.
 */
class PowerUp extends Agent {
	constructor(game, x, y, spritesheet) {
		super(game, x, y, spritesheet);
		this.defineAgentCollisions = () => { };
		this.updateBB();
	} 

	/** @override */
	update() {
		this.move(this.game.clockTick);
	}

	/** @override */
	defineWorldCollisions(entity, collisions) {
		if (entity instanceof Druid) {
			this.removeFromWorld = true;
			this.addPowerToDruid(this.game.druid);
		}
	}
}

/**
 * Adds the basic ranged attack function to the druids list of attacks.
 */
class RangedPowerUp extends PowerUp {

	constructor(game, x, y) {
		super(game, x, y, "./Sprites/ball.png");
    }

	addPowerToDruid(DRUID) {
		DRUID.rangeAttackCooldown = 0;
		DRUID.attacks.push(function (DRUID) {
			DRUID.rangeAttackCooldown -= DRUID.game.clockTick;
			if (DRUID.rangeAttackCooldown <= 0 && DRUID.game.A) {
				if (DRUID.facing === 0) { // shoot left
					// basic ranged attack:
					//DRUID.game.addEntity(new BasicRangedAttack(
					//	DRUID.game,
					//	DRUID.pos.x - PARAMS.TILE_WIDTH,
					//	DRUID.pos.y + DRUID.scaleDim.y / 2,
					//	180, 16));

					// mutiple ranged arrack in any angle:
					DRUID.game.addEntity(new SpecialRangedAttack(
						DRUID.game,
						DRUID.pos.x - PARAMS.TILE_WIDTH,
						DRUID.pos.y + DRUID.scaleDim.y / 2,
						180, 16, 6, 0));

					// attack type 1:
					//DRUID.game.addEntity(new SpecialRangedAttack(
					//	DRUID.game,
					//	DRUID.pos.x - PARAMS.TILE_WIDTH,
					//	DRUID.pos.y + DRUID.scaleDim.y / 2,
					//	180, 16, 5, 1));

					// attack type 2:
					//DRUID.game.addEntity(new SpecialRangedAttack(
					//	DRUID.game,
					//	DRUID.pos.x + DRUID.scaleDim.x,
					//	DRUID.pos.y + DRUID.scaleDim.y / 2,
					//	180, 16, 6, 2));

				} else { // shoot right
					// basic ranged attack:
					//DRUID.game.addEntity(new BasicRangedAttack(
					//	DRUID.game,
					//	DRUID.pos.x + DRUID.scaleDim.x,
					//	DRUID.pos.y + DRUID.scaleDim.y / 2,
					//	0, 16));

					// mutiple ranged arrack in any angle:
					//DRUID.game.addEntity(new SpecialRangedAttack(
					//	DRUID.game,
					//	DRUID.pos.x + DRUID.scaleDim.x,
					//	DRUID.pos.y + DRUID.scaleDim.y / 2,
					//	0, 16, 6, 0));

					// attack type 1:
					//DRUID.game.addEntity(new SpecialRangedAttack(
					//	DRUID.game,
					//	DRUID.pos.x - PARAMS.TILE_WIDTH,
					//	DRUID.pos.y + DRUID.scaleDim.y / 2,
					//	0, 16, 5, 1));

					// attack type 2:
					DRUID.game.addEntity(new SpecialRangedAttack(
						DRUID.game,
						DRUID.pos.x + DRUID.scaleDim.x,
						DRUID.pos.y + DRUID.scaleDim.y / 2,
						0, 16, 6, 2));
				}
				DRUID.game.A = false;
				DRUID.rangeAttackCooldown = 1;
			}
		});

	}

	/** @override */
	draw(context) {
		context.drawImage(this.spritesheet, 0, 16, 32, 32,
			this.pos.x - this.game.camera.pos.x, this.pos.y - this.game.camera.pos.y,
			this.scaleDim.x, this.scaleDim.y);
	}

}