class SwordAttack extends Agent {
	constructor(game, x, y, duration) {
		super(game, x, y, "./Sprites/sword.png");
		this.setDimensions(2.5, 34, 15);
		this.duration = 0.5;
		this.attack = 1;
		this.damagedEnemies = [];
		this.force = 600;
		// Walter: copied repositioning from update to fix incorrect draw on first draw cycle.
		const DRUID = this.game.druid;
		if (DRUID.facing === 0) { // facing left
			this.pos.x = DRUID.pos.x - this.scaleDim.x
				+ (this.duration * 75) + (this.scaleDim.x / 5);
			this.pos.y = DRUID.pos.y + DRUID.scaleDim.y / 2;
		} else { // facing right
			this.pos.x = DRUID.pos.x + DRUID.scaleDim.x
				- (this.duration * 75) - (this.scaleDim.x / 5);
			this.pos.y = DRUID.pos.y + DRUID.scaleDim.y / 2;
		}
		this.updateBB();
	}

	/** @override */
	loadAnimations() {
		this.animations[0] = new Animator(
			this.spritesheet, 0, 0, 34, 15, 4, 0.1, 1, false, true, true);
		this.animations[1] = new Animator(
			this.spritesheet, 0, 0, 34, 15, 4, 0.1, 1, false, true, false);
	}

	/** @override */
	update() {
		const DRUID = this.game.druid;
		const TICK = this.game.clockTick;

		this.duration -= TICK;
		if (this.duration < 0) {
			this.removeFromWorld = true;
		}

		if (DRUID.facing === 0) { // facing left
			this.pos.x = DRUID.pos.x - this.scaleDim.x
				+ (this.duration * 75) + (this.scaleDim.x / 5);
			this.pos.y = DRUID.pos.y + DRUID.scaleDim.y / 2;
		} else { // facing right
			this.pos.x = DRUID.pos.x + DRUID.scaleDim.x
				- (this.duration * 75) - (this.scaleDim.x / 5);
			this.pos.y = DRUID.pos.y + DRUID.scaleDim.y / 2;
		}

		this.move(this.game.clockTick);
	}

	/** @override */
	checkCollisions() {
		let that = this;
		this.game.entities.forEach(function (entity) {
			if (entity.agentBB && that.agentBB.collide(entity.agentBB) && that !== entity) {
				if (entity instanceof Enemy && !that.damagedEnemies.includes(entity)) {
					entity.takeDamage(that.attack);
					entity.knockback(that);
					that.damagedEnemies.push(entity);
				}
			}
		});
	}

	/** @override */
	draw(context) {
		this.animations[this.game.druid.facing].drawFrame(
			this.game.clockTick, context,
			this.pos.x, this.pos.y,
			this.scale, this.game.camera);
		this.worldBB.display(this.game);
		this.agentBB.display(this.game);
	}
}

class RangeAttack extends Agent {
	constructor(game, x, y, direction) {
		super(game, x, y, "./Sprites/ball.png");
		this.setDimensions(2, 32, 32);
		if (direction === 0) {
			this.vel.x = -400;
		} else {
			this.vel.x = 400;
		}
		this.attack = 1;
		this.hit = false
		this.loadAnimations();
	}

	/** @override */
	loadAnimations() {
		this.animations[0] = new Animator(
			this.spritesheet, 0, 16, 32, 32, 8, 0.05, 0, false, true, false);
		this.animations[1] = new Animator(
			this.spritesheet, 0, 16, 32, 32, 8, 0.05, 0, false, true, false);
	}

	/** @override */
	update() {
		this.move(this.game.clockTick);
	}

	/** @override */
	checkCollisions() {
		let that = this;
		this.game.entities.forEach(function (entity) {
			if (entity.agentBB && that.agentBB.collide(entity.agentBB) && that !== entity) {
				if (entity instanceof Enemy) {
					entity.takeDamage(that.attack);
					that.removeFromWorld = true;
				}
			}
			if (entity.worldBB && that.worldBB.collide(entity.worldBB) && that !== entity) {
				if (entity instanceof Ground) {
					// touching a entity on side way
					if ((that.vel.x < 0 && that.lastWorldBB.left < entity.worldBB.right)
						|| (that.vel.x > 0 && that.lastWorldBB.right > entity.worldBB.left)) {
						that.removeFromWorld = true;
					}
				}
			}
		});
	}
}

