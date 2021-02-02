/**
 * Superclass holding default code for all powerups. Checks collision with druid and
 * calls method to add power to druid upon collision.
 */
class PowerUp extends Entity {
	constructor(game, x, y, spritesheet) {
		super(game, x, y, spritesheet);
	} 

	/** @override */
	update() {
		this.checkDruidCollision();
	}

	checkDruidCollision() {
		const DRUID = this.game.druid;

		if (this.worldBB.collide(DRUID.worldBB)) {
			this.removeFromWorld = true;
			this.addPowerToDruid(DRUID);
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
		DRUID.attacks.push(function () {
			DRUID.rangeAttackCooldown -= DRUID.game.clockTick;
			if (DRUID.rangeAttackCooldown <= 0 && DRUID.game.A) {
				if (DRUID.facing === 0) { // shoot left
					DRUID.game.addEntity(new RangeAttack(
						DRUID.game,
						DRUID.pos.x - PARAMS.TILE_WIDTH,
						DRUID.pos.y + DRUID.scaleDim.y / 2,
						DRUID.facing));
				} else { // shoot right
					DRUID.game.addEntity(new RangeAttack(
						DRUID.game,
						DRUID.pos.x + DRUID.scaleDim.x,
						DRUID.pos.y + DRUID.scaleDim.y / 2,
						DRUID.facing));
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
			this.dim.x, this.dim.y);
	}

}