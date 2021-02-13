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
				if (entity instanceof Enemy) {
					if (!that.damagedEnemies.includes(entity)) {
						entity.takeDamage(that.attack);
						that.damagedEnemies.push(entity);
					}
					entity.knockback(that);
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

class BasicRangedAttack extends Agent {
	constructor(game, x, y, degree, radius) {
		super(game, x, y, "./Sprites/ball.png");
		this.setDimensions(2, radius * 2, radius * 2);

		var radian = degree * (Math.PI / 180);
		this.vel.x = Math.round((400 * Math.cos(radian)) * 100) / 100;
		this.vel.y = Math.round(-(400 * Math.sin(radian)) * 100) / 100;

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
					if ((that.vel.y < 0 && that.lastWorldBB.top < entity.worldBB.bottom)
						|| (that.vel.y > 0 && that.lastWorldBB.bottom > entity.worldBB.top)) {
						that.removeFromWorld = true;
					}
				}
			}
		});
	}
}

class SpecialRangedAttack {
	/**
	 * @param {any} game: this game
	 * @param {any} x: x
	 * @param {any} y: y
	 * @param {any} direction
	 * @param {any} radius: radius of the bounding circle
	 * @param {any} length: number of projectile
	 * @param {any} attackType: 0 is multi projectile in a line, 1 is vertical multi projectile, 2 is spreaded projectiles
	 */
	constructor(game, x, y, degree, radius, length, attackType) {
		this.game = game;
		this.x = x;
		this.y = y;
		this.degree = degree % 360;
		this.radius = radius;
		this.length = length;
		this.attackType = attackType;
		this.projectiles = [];
		this.createProjectileList();
		this.addEntityList();

		this.draw = function () { /* Do nothing. */ };
	}

	createProjectileList() {
		if (this.attackType == 0) {
			var radian = this.degree * (Math.PI / 180);
			var XDiff = this.radius * 2 * Math.cos(radian);
			var YDiff = -this.radius * 2 * Math.sin(radian);

			for (var i = 0; i < this.length; i++) {
				this.projectiles.push(new BasicRangedAttack(this.game,
					this.x + i * XDiff, this.y + i * YDiff,
					this.degree, this.radius));
			}
		} else if (this.attackType == 1) {
			for (var i = 0; i < this.length; i++) {
				this.projectiles.push(new BasicRangedAttack(this.game,
					this.x, this.y - i * this.radius * 2,
					this.degree, this.radius));
			}
		} else if (this.attackType == 2) {
			var degreeDiff = 180 / (this.length - 1);
			this.degree -= 90;
			for (var i = 0; i < this.length; i++) {
				this.projectiles.push(new BasicRangedAttack(this.game,
					this.x, this.y,
					this.degree + i * degreeDiff, this.radius));
			}
        }
	}

	addEntityList() {
		let that = this;
		this.projectiles.forEach(function (entity) {
			that.game.addEntity(entity);
		});
	}

	update() {
		if (this.attackType != 2) {
			for (var i = 0; i < this.projectiles.length; i++) {
				if (this.projectiles[i].removeFromWorld == true) {
					this.removeFromWorld = true;
					for (var j = 0; j < this.projectiles.length; j++) {
						this.projectiles[j].removeFromWorld = true;
					}
				}
			}
		} else {
			this.removeFromWorld = true;
        }
	}
}

/**
 * Basic attacks for ranged enemies. Flies at a fixed angle specified during construction.
 */
class EnemyRangedAttack extends Agent {
	constructor(game, x, y, xdist, ydist) {
		super(game, x, y, "./Sprites/TestEnemyAttack.png");
		this.setDimensions(1.5, 16, 16);
		this.force = 450;
		this.attack = 25;
		this.startX = x;
		this.startY = y;
		this.maxDist = 1200;
		if (ydist === 0) {
			this.vel.y = this.force;
		} else {
			let angle = Math.atan2(ydist, xdist);
			this.vel.y = this.force * Math.sin(angle);
			this.vel.x = this.force * Math.cos(angle);
		}
	}

	/** @override */
	loadAnimations() {
		this.animations[0] = new Animator(
			this.spritesheet, 0, 0, 16, 16, 1, 1, 0, false, true, false);
		this.animations[1] = new Animator(
			this.spritesheet, 0, 0, 16, 16, 1, 1, 0, false, true, false);
	}

	/** @override */
	update() {
		if (this.maxDist < Math.sqrt(Math.pow(this.startX - this.pos.x, 2) + Math.pow(this.startY - this.pos.y, 2))) {
			this.removeFromWorld = true;
		}
		this.move(this.game.clockTick);

	}

	/** @override */
	checkCollisions() {
		let that = this;
		this.game.entities.forEach(function (entity) {
			if (entity.agentBB && that.agentBB.collide(entity.agentBB) && that !== entity) {
				if (entity instanceof Druid) {
					entity.takeDamage(that.attack);
					that.removeFromWorld = true;
				}
			}
			if (entity.worldBB && that.worldBB.collide(entity.worldBB) && that !== entity) {
				if (entity instanceof Ground || entity instanceof Door) {
					if (that.vel.y > 0
						&& that.lastWorldBB.bottom <= entity.worldBB.top
						&& (that.lastWorldBB.left) < entity.worldBB.right
						&& (that.lastWorldBB.right) > entity.worldBB.left) {
						that.removeFromWorld = true;
					}
					if (that.vel.y < 0
						&& (that.lastWorldBB.top) >= entity.worldBB.bottom
						&& (that.lastWorldBB.left) != entity.worldBB.right
						&& (that.lastWorldBB.right) != entity.worldBB.left) {
						that.removeFromWorld = true;
					}
					if (that.vel.x < 0
						&& (that.lastWorldBB.left) >= entity.worldBB.right
						&& (that.lastWorldBB.top) != entity.worldBB.bottom
						&& (that.lastWorldBB.bottom) != entity.worldBB.top) {
						that.removeFromWorld = true;
					}
					if (that.vel.x > 0
						&& (that.lastWorldBB.right) <= entity.worldBB.left
						&& (that.lastWorldBB.top) < entity.worldBB.bottom
						&& (that.lastWorldBB.bottom) > entity.worldBB.top) {
						that.removeFromWorld = true;
					}
				}
			}
		});
	}
}

