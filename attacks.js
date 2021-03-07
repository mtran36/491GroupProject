class SwordAttack extends Agent {
	constructor(game, x, y, facing) {
		super(game, x, y - 30, "./Sprites/sword.png");
		this.setDimensions(2.5, 34, 15);

		this.facing = facing;
		this.duration = 0.5;
		this.currentTime = 0;
		this.vel = { x: 75, y: 0 };
		this.attack = 1;
		this.force = 600;
		this.damagedEnemies = [];
		this.agentBB = [
			new BoundingCircle(
				this.pos.x + this.scaleDim.x * 1 / 6,
				this.pos.y + this.scaleDim.y / 2, this.scaleDim.y / 2),
			new BoundingCircle(
				this.pos.x + this.scaleDim.x / 2,
				this.pos.y + this.scaleDim.y / 2, this.scaleDim.y / 2),
			new BoundingCircle(
				this.pos.x + this.scaleDim.x * 5 / 6,
				this.pos.y + this.scaleDim.y / 2, this.scaleDim.y / 2)];
		
		AUDIO_PLAYER.playSound("./Audio/SwordAttack.mp3");
		this.updatePos();
	}

	/** @override */
	loadAnimations() {
		this.animations[0] = new Animator(
			this.spritesheet, 0, 0, 34, 15, 4, 0.1, 1, false, true, true);
		this.animations[1] = new Animator(
			this.spritesheet, 0, 0, 34, 15, 4, 0.1, 1, false, true, false);
		// hit effect animation
		this.hitAnimation = new Animator(
			ASSET_LOADER.getImageAsset("./Sprites/HitEffect.png"),
			0, 0, 32, 32, 4, 0.1, 0, false, false, false);
	}

	/** @override */
	update() {
		const TICK = this.game.clockTick;

		this.currentTime += TICK;
		this.vel.y = this.game.druid.vel.y;
		this.duration -= TICK;
		if (this.duration <= 0) {
			this.removeFromWorld = true;
		}
		this.updatePos();
		this.move(TICK);
	}

	/** @override */
	updatePos() {
		let i, swordPos = this.currentTime * this.vel.x;
		let druidCenter = this.game.druid.worldBB.centerPoint();

		this.facing = this.game.druid.facing;
		if (this.facing === 0) {
			this.pos.x = druidCenter.x - swordPos - this.scaleDim.x;
			this.worldBB.shift(druidCenter.x - swordPos - this.worldBB.width,
				druidCenter.y - 30);
			for (i = 0; i < this.agentBB.length; i++) {
				this.agentBB[i].shift(
					druidCenter.x - swordPos - this.scaleDim.x * (2 * i + 1) / 6,
					this.pos.y + this.scaleDim.y / 2);
			}
		} else {
			this.pos.x = druidCenter.x + swordPos;
			this.worldBB.shift(druidCenter.x + swordPos,
				druidCenter.y - 30);
			for (i = 0; i < this.agentBB.length; i++) {
				this.agentBB[i].shift(
					druidCenter.x + swordPos + this.scaleDim.x * (2 * i + 1) / 6,
					this.pos.y + this.scaleDim.y / 2);
			}
		}
		this.pos.y = this.worldBB.y;
	}

	/** @override */
	defineAgentCollisions(entity) {
		if (entity instanceof Enemy) {
			if (!this.damagedEnemies.includes(entity)) {
				entity.takeDamage(this);
				this.damagedEnemies.push(entity);
				this.playHitAnimation();
			}
			entity.knockback(this);
		}
	}

	/** @override */
	defineWorldCollisions(entity, collisions) {
		if (entity instanceof HitBreakBlock && !this.damagedEnemies.includes(entity)) {
			entity.hitBlock(this.attack);
			this.damagedEnemies.push(entity);
			this.playHitAnimation();
		}
    }

	/** @override */
	draw(context) {
		this.animations[this.game.druid.facing].drawFrame(
			this.game.clockTick, context,
			this.pos.x, this.pos.y,
			this.scale, this.game.camera);
		this.worldBB.display(this.game);
		this.agentBB.forEach((BB) => {
			BB.display(this.game);
		});
	}

	playHitAnimation() {
		if (this.facing == 0) {
			this.game.addEntity(
				new Effect(this.game, this.pos.x - this.scaleDim.x, this.pos.y,
					this.hitAnimation, 0.4, 2));
		} else {
			this.game.addEntity(
				new Effect(this.game, this.pos.x + this.scaleDim.x, this.pos.y,
					this.hitAnimation, 0.4, 2));
		}
	}
}

/**
 * Basic Ranged attack with changable shooting angel, speed, attack, and animation.
 */
class EnergyBallAttack extends Agent {
	/**
	 * Creates a new ranged attack to be extended.
	 * @param {GameEngine} game Instance of the game.
	 * @param {number} x Horizontal coordinate to place attack.
	 * @param {number} y Vertical coordinate to place attack.
	 * @param {number} degree Degree the attack is shooting out.
	 * @param {number} radius Size of the agent bounding box.
	 * @param {number} speed Speed of the attack.
	 * @param {number} attack Attack value to be subtracted from target health.
	 * @param {boolean} hasAnimation Determines if this ranged attack has an animation.
	 */
	constructor(game, x, y, degree, radius, speed) {
		super(game, x, y, "./Sprites/energyball.png");
		this.setDimensions(1, radius * 2, radius * 2);
		this.radius = radius;
		let radian = degree * (Math.PI / 180);
		this.vel.x = Math.round((speed * Math.cos(radian)) * 100) / 100;
		this.vel.y = Math.round(-(speed * Math.sin(radian)) * 100) / 100;
		this.attack = 1;
		this.force = 1500;
		this.hasExplosion = false;
	}

	/** @override */
	loadAnimations() {
		this.animations[0] = new Animator(
			this.spritesheet, 0, 0, 64, 64, 2, 0.05, 0, false, true, false);
		this.animations[1] = new Animator(
			this.spritesheet, 0, 0, 64, 64, 2, 0.05, 0, false, true, false);
	}

	/** @override */
	update() {
		this.move(this.game.clockTick);
	}

	/** @override */
	defineWorldCollisions(entity, collisions) {
		if (entity instanceof Ground) {
			this.removeFromWorld = true;
			this.playHitAnimation();
		} else if (entity instanceof HitBreakBlock) {
			entity.hitBlock(this.attack);
			this.removeFromWorld = true;
			this.playHitAnimation();
		}
	}

	/** @override */
	defineAgentCollisions(entity) {
		if (entity instanceof Enemy) {
			entity.takeDamage(this);
			this.removeFromWorld = true;
			this.playHitAnimation();
		}
	}

	playHitAnimation() {
		if (this.hasExplosion) {
			let explosion = new Explosion(this.game, this.pos.x - 48, this.pos.y - 48,
				PARAMS.TILE_WIDTH * 1.75, 0.75, 1, 0.8);
			explosion.agentBB[0].x += 20;
			explosion.agentBB[0].y += 20;
			this.game.addEntity(explosion);
		} else {
			// hit effect animation
			let hitAnimation = new Animator(
				ASSET_LOADER.getImageAsset("./Sprites/EnergyBallHitEffect.png"),
				32, 16, 32, 32, 4, 0.1, 0, false, false, false);
			this.game.addEntity(
				new Effect(this.game, this.pos.x, this.pos.y,
					hitAnimation, 0.4, 2 * this.scale));
        }
    }
}

/** 
 * A special attack consists of mutiple ranged attack bounding boxes that would knock up 
 * enemy and deal damage. 
 */
class TornadoAttack extends Agent {
	/**
	 * @param {GameEngine} game Instance of the game.
	 * @param {number} x Horizontal coordinate to place attack.
	 * @param {number} y Vertical coordinate to place attack.
	 * @param {number} degree Degree the attack is shooting out.
	 */
	constructor(game, x, y, facing, attack = 0.8, isLevel3) {
		super(game, x, y, "./Sprites/tornado.png");
		this.setDimensions(1, 96, 192);

		let RADIUS = this.dim.x / 2;
		this.facing = facing;
		this.vel.x = facing === 0 ? -400 : 400;
		this.attack = attack;
		this.isLevel3 = isLevel3;
		this.existTime = 2;
		this.force = 600;
		this.agentBB = [
			new BoundingCircle(
				this.pos.x + RADIUS,
				this.pos.y + RADIUS, RADIUS),
			new BoundingCircle(
				this.pos.x + RADIUS,
				this.pos.y + RADIUS * 3, RADIUS)];
		this.damagedEnemies = [];
	}

	/** @override */
	loadAnimations() {
		this.animations[0] = new Animator(
			this.spritesheet, 0, 20, 96, 192, 3, 0.15, 0, false, true, false);
		this.animations[1] = new Animator(
			this.spritesheet, 0, 20, 96, 192, 3, 0.15, 0, false, true, false);
	}

	/** 
	 * Add an attacked enemy to the attacked enemy list. 
	 */
	addAttackedEnemy(enemy) {
		this.damagedEnemies.push(enemy);
	}

	/** @override */
	defineWorldCollisions(entity, collisions) {
		if (collisions.left || collisions.right) {
			if (entity instanceof Ground) {
				this.playHitAnimation(this.pos.x, this.pos.y + this.scaleDim.y / 2, true);
				this.removeFromWorld = true;
			} else if (entity instanceof HitBreakBlock) {
				entity.hitBlock(this.attack);
				this.playHitAnimation(this.pos.x, this.pos.y + this.scaleDim.y / 2, true);
				this.removeFromWorld = true;

			}
		}
	}

	/** @override */
	defineAgentCollisions(entity) {
		if (entity instanceof Enemy && !this.damagedEnemies.includes(entity)) {
			entity.takeDamage(this);
			this.damagedEnemies.push(entity);
			entity.knockback(this, -Math.PI / 2);
			this.playHitAnimation(entity.pos.x, entity.pos.y, false); // knockup animation
		}
	}

	/** @override */
	update() {
		this.existTime -= this.game.clockTick
		if (this.existTime <= 0) {
			this.playHitAnimation(this.pos.x, this.pos.y + this.scaleDim.y / 2, true);
			this.removeFromWorld = true;
		}
		if (this.isLevel3) {
			// move x and y, increase dim x and y
			this.scale += this.game.clockTick / 2;
			this.pos = {
				x: this.pos.x - (this.dim.x * this.scale - this.scaleDim.x),
				y: this.pos.y - (this.dim.y * this.scale - this.scaleDim.y)
			}
			this.setDimensions(this.scale, this.dim.x, this.dim.y);
        }
		this.move(this.game.clockTick);
	}

	playHitAnimation(x, y, isEndAnimation = false) {
		let hitAnimation = new Animator(
			ASSET_LOADER.getImageAsset("./Sprites/TornadoHitEffect.png"),
			0, 0, 36, 32, 7, 0.06, 0, false, false, false);
		if (isEndAnimation == true) {
			this.game.addEntity(
				new Effect(this.game, x, y, hitAnimation, 0.4, 3 * this.scale));
		} else {
			this.game.addEntity(
				new Effect(this.game, x, y, hitAnimation, 0.4, 2));
		}
	}
}

/** 
 * A special attack consists of mutiple ranged attack bounding boxes that would deal a
 * one-time damage. 
 */
class ThunderAttack extends Agent{
	/**
	 * @param {GameEngine} game Instance of the game.
	 * @param {number} x Horizontal coordinate to place attack.
	 * @param {number} y Vertical coordinate to place attack.
	 * @param {number} degree Degree the attack is shooting out.
	 */
	constructor(game, x, y, facing, attack = 2) {
		super(game, x, y, "./Sprites/thunder.png");
		this.facing = facing;
		this.setDimensions(1, PARAMS.TILE_WIDTH * 2 , PARAMS.TILE_WIDTH / 2);
		this.vel.x = facing === 0 ? -660 : 660;
		this.attack = attack;	// attack value
		this.existTime = 5;	// how long the attack would last
		this.force = 600;
		let RADIUS = this.dim.y / 2;
		this.agentBB = [
			new BoundingCircle(
				this.pos.x + RADIUS,
				this.pos.y + RADIUS, RADIUS),
			new BoundingCircle(
				this.pos.x + RADIUS * 3,
				this.pos.y + RADIUS, RADIUS),
			new BoundingCircle(
				this.pos.x + RADIUS * 5,
				this.pos.y + RADIUS, RADIUS),
			new BoundingCircle(
				this.pos.x + RADIUS * 7,
				this.pos.y + RADIUS, RADIUS)];
	}

	/** @override */
	loadAnimations() {
		this.animations[0] = new Animator(
			this.spritesheet, 150, 35, 130, 35, 4, 0.2, 20, false, true, false);
		this.animations[1] = new Animator(
			this.spritesheet, 150, 35, 130, 35, 4, 0.2, 20, false, true, true);
	}

	/** @override */
	defineWorldCollisions(entity, collisions) {
		if (entity instanceof Ground) {
			this.removeFromWorld = true;
			this.playHitAnimation();
		} else if (entity instanceof HitBreakBlock) {
			entity.hitBlock(this.attack);
			this.removeFromWorld = true;
			this.playHitAnimation();
		}
	}

	/** @override */
	defineAgentCollisions(entity) {
		if (entity instanceof Enemy) {
			entity.takeDamage(this);
			this.removeFromWorld = true;
			this.playHitAnimation();
		}
	}

	/** @override */
	update() {
		this.existTime -= this.game.clockTick
		if (this.existTime <= 0) {
			this.removeFromWorld = true;
		}
		this.move(this.game.clockTick);
	}

	playHitAnimation() {
		// hit effect animation
		let hitAnimation = new Animator(
			ASSET_LOADER.getImageAsset("./Sprites/ThunderHitEffect.png"),
			0, 16, 32, 32, 4, 0.1, 0, false, false, false);
		if (this.facing == 0) {
			this.game.addEntity(
				new Effect(this.game, this.pos.x, this.pos.y,
					hitAnimation, 0.4, 2));
		} else {
			this.game.addEntity(
				new Effect(this.game, this.pos.x + this.dim.x * 0.75, this.pos.y,
					hitAnimation, 0.4, 2));
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
		this.attack = 5;
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
		AUDIO_PLAYER.playSound("./Audio/EnemyProjectile.mp3");
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
		if (this.maxDist < Math.sqrt(
			Math.pow(this.startX - this.pos.x, 2) +
			Math.pow(this.startY - this.pos.y, 2))) {
			this.removeFromWorld = true;
		}
		this.move(this.game.clockTick);
	}

	/** @override
	 * If the projectile hits the druid, then damage druid and remove projectile.
	 * @param {Entity} entity
	 */
	defineAgentCollisions(entity) {
		if (entity instanceof Druid) {
			entity.takeDamage(this);
			this.removeFromWorld = true;
		}
		if (entity instanceof SwordAttack) {
			this.removeFromWorld = true;
		}
	}

	/** @override
	 * If the projectile hits a solid wall or door, then remove the projectile.
	 * @param {Entity} entity
	 * @param {{boolean up, boolean down, boolean left, boolean right}} collisions
	 */
	defineWorldCollisions(entity, collisions) {
		if (entity instanceof Ground || entity instanceof Door) {
			if (collisions.up || collisions.down || collisions.left || collisions.right) {
				this.removeFromWorld = true;
			}
		}
	}
}

class Explosion extends Agent{
	/**
	* Creates a new ranged attack to be extended.
	* @param {GameEngine} game Instance of the game.
	* @param {number} x Horizontal coordinate to place attack.
	* @param {number} y Vertical coordinate to place attack.
	* @param {number} radius Size of the agent bounding box.
    * @param {number} attack attack value of this explosion.
	*/
	constructor(game, x, y, radius, scale, attack, existTime) {
		super(game, x, y, "./Sprites/EnergyBallExplosion.png");
		this.setDimensions(scale, radius * 2, radius * 2);
		this.radius = radius;
		this.scale = scale;
		this.vel.x = 0;
		this.vel.y = 0;
		this.attack = attack;
		this.existTime = existTime;
		this.damagedEnemies = [];
	}

	/** @override */
	loadAnimations() {
		// default animation
		this.animations[0] = new Animator(
			this.spritesheet, 0, 0, 256, 256, 8, 0.1, 0, false, false, false);
		this.animations[1] = new Animator(
			this.spritesheet, 0, 0, 256, 256, 8, 0.1, 0, false, false, false);
	}

	/**
	 * Change default animation.
	 * @param {any} leftAnimation animation going left.
	 * @param {any} rightAnimation animation going right.
	 */
	changeAnimations(leftAnimation, rightAnimation) {
		this.animations[0] = leftAnimation;
		this.animations[1] = rightAnimation;
	}

	/** @override */
	update() {
		this.move(this.game.clockTick);
		this.existTime -= this.game.clockTick;
		if (this.existTime <= 0) this.removeFromWorld = true;
	}

	/** @override */
	defineWorldCollisions(entity, collisions) {
		// do nothing
	}

	/** @override */
	defineAgentCollisions(entity) {
		if (entity instanceof Enemy && !this.damagedEnemies.includes(entity)) {
			entity.takeDamage(this);
			this.damagedEnemies.push(entity);
		}
	}
}

class EnemyHomingAttack extends Agent {
	constructor(game, x, y, xdist, ydist) {
		super(game, x, y, "./Sprites/TestEnemyHomingAttack.png");
		this.setDimensions(1.5, 16, 16);
		this.force = 250;
		this.attack = 7;
		this.maxDist = 1500;
		this.angle = Math.atan2(ydist, xdist);
		this.vel.y = this.force * Math.sin(this.angle);
		this.vel.x = this.force * Math.cos(this.angle);
		this.turnAmount = Math.PI / 2;
		AUDIO_PLAYER.playSound("./Audio/EnemyHoming.mp3");
	}

	loadAnimations() {
		this.animations[0] = new Animator(
			this.spritesheet, 0, 0, 16, 16, 1, 1, 0, false, true, false);
		this.animations[1] = new Animator(
			this.spritesheet, 0, 0, 16, 16, 1, 1, 0, false, true, false);
	}

	/** @override
	 * If the projectile hits the druid, then damage druid and remove projectile.
	 * @param {Entity} entity
	 */
	defineAgentCollisions(entity) {
		if (entity instanceof Druid) {
			entity.takeDamage(this);
			this.removeFromWorld = true;
		}
		if (entity instanceof SwordAttack) {
			this.removeFromWorld = true;
		}
	}

	defineWorldCollisions(entity) {

	}

	update() {
		let turnAmount = this.turnAmount * this.game.clockTick;
		let thisCenter = this.worldBB.centerPoint();
		let druidCenter = this.game.druid.worldBB.centerPoint();
		let angle = Math.atan2(druidCenter.y - thisCenter.y, druidCenter.x - thisCenter.x);
		if (angle > Math.PI / 2 && this.angle < 0) {
			this.angle -= turnAmount;
		} else if (angle < -Math.PI / 2 && this.angle > 0) {
			this.angle += turnAmount;
		} else {
			if (this.angle < angle) {
				this.angle += turnAmount;
			}
			if (this.angle > angle) {
				this.angle -= turnAmount;
			}
		}
		if (this.angle > Math.PI) {
			this.angle = -(Math.PI - (this.angle - Math.PI));
		}
		if (this.angle < -Math.PI) {
			this.angle = Math.PI + (this.angle + Math.PI);
		}
		this.vel.y = this.force * Math.sin(this.angle);
		this.vel.x = this.force * Math.cos(this.angle);
		let dist = Math.sqrt(Math.pow(this.vel.x, 2) + Math.pow(this.vel.y, 2));
		dist *= this.game.clockTick;
		this.maxDist -= dist;
		if (this.maxDist < 0) {
			this.removeFromWorld = true;
		}
		this.move(this.game.clockTick);
	}
}

class EnemyPuff extends Agent {

	constructor(game, x, y, facing) {
		super(game, x, y, "./Sprites/puffBoom.png");
		this.setDimensions(1.3, 120, 120);
		this.force = 1200;
		this.attack = 10;
		this.facing = facing;
		AUDIO_PLAYER.playSound("./Audio/PuffBoom.mp3");
	}

	loadAnimations() {
		this.animations[0] = new Animator(this.spritesheet, 16, 10, 120, 120, 6, 0.05, 10, false, false, false, false);
		this.animations[1] = new Animator(this.spritesheet, 16, 10, 120, 120, 6, 0.05, 10, false, false, true, false);
	}

	update() {
		if (this.animations[this.facing].isDone()) this.removeFromWorld = true;
		this.move(this.game.clockTick);
	}

	defineAgentCollisions(entity) {
		if (entity instanceof Druid) {
			let angle;
			if (this.facing === 0) {
				angle = Math.atan2(-1, -1);
			} else {
				angle = Math.atan2(-1, 1);
			}
			entity.takeDamage(this);
			entity.knockback(this, angle);
		}
	}

	defineWorldCollisions(entity, collisions) {
