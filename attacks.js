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
	constructor(game, x, y, degree, radius, speed, level) {
		if (level >= 2) {
			super(game, x, y - PARAMS.TILE_WIDTH / 3, "./Sprites/energyball.png");
			this.setDimensions(1.5, radius * 2, radius * 2)
		} else {
			super(game, x, y, "./Sprites/energyball.png");
			this.setDimensions(1, radius * 2, radius * 2);
		}
		this.radius = radius;
		let radian = degree * (Math.PI / 180);
		this.vel.x = Math.round((speed * Math.cos(radian)) * 100) / 100;
		this.vel.y = Math.round(-(speed * Math.sin(radian)) * 100) / 100;
		this.level = level;
		this.attack = 1;
		this.force = 1500;
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
		} else if (entity instanceof LionBossAttack) {
			this.playHitAnimation();
			this.removeFromWorld = true;
		}
	}

	playHitAnimation() {
		if (this.level == 3) {
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
	constructor(game, x, y, facing, level) {
		super(game, x, y, "./Sprites/tornado.png");
		this.setDimensions(1, 96, 192);

		let RADIUS = this.dim.x / 2;
		this.facing = facing;
		this.vel.x = facing === 0 ? -400 : 400;
		if (level == 1) {
			this.attack = 0.8
		} else {
		this.attack = 1.6;
		}
		this.level = level;
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

	/** 
	 * Add an attacked enemy to the attacked enemy list. 
	 */
	addAttackedEnemy(enemy) {
		this.damagedEnemies.push(enemy);
	}

	/** @override */
	loadAnimations() {
		this.animations[0] = new Animator(
			this.spritesheet, 0, 20, 96, 192, 3, 0.15, 0, false, true, false);
		this.animations[1] = new Animator(
			this.spritesheet, 0, 20, 96, 192, 3, 0.15, 0, false, true, false);
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
		} else if (entity instanceof LionBossAttack) {
			this.removeFromWorld = true;
		}
	}

	/** @override */
	update() {
		this.existTime -= this.game.clockTick
		if (this.existTime <= 0) {
			this.playHitAnimation(this.pos.x, this.pos.y + this.scaleDim.y / 2, true);
			this.removeFromWorld = true;
		}
		if (this.level == 3) {
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
class ThunderAttack extends Agent {
	/**
	 * @param {GameEngine} game Instance of the game.
	 * @param {number} x Horizontal coordinate to place attack.
	 * @param {number} y Vertical coordinate to place attack.
	 * @param {number} degree Degree the attack is shooting out.
	 */
	constructor(game, x, y, facing, level, isEmpowered) {
		super(game, x, y, "./Sprites/thunder.png");
		this.facing = facing;
		this.level = level;
		this.scale = 1.75
		if (isEmpowered) this.scale = 3;
		this.setDimensions(this.scale, PARAMS.TILE_WIDTH * 2, PARAMS.TILE_WIDTH / 2);
		//this.vel.x = facing === 0 ? -660 : 660;
		this.attack = 2;
		if (isEmpowered) this.attack = 3;
		this.existTime = 1;
		this.force = 600;
		let RADIUS = this.scaleDim.y / 2;
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
		this.damagedEnemies = [];
	}

	/** 
	 * Add an attacked enemy to the attacked enemy list. 
	 */
	addAttackedEnemy(enemy) {
		this.damagedEnemies.push(enemy);
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
		} else if (entity instanceof HitBreakBlock) {
			entity.hitBlock(this.attack);
			this.damagedEnemies.push(entity);
			this.playHitAnimation(entity.pos.x + entity.scaleDim.x / 3,
				entity.pos.y + entity.scaleDim.y / 3);
		}
	}

	/** @override */
	defineAgentCollisions(entity) {
		if (entity instanceof Enemy) {
			if (!this.damagedEnemies.includes(entity)) {
				entity.takeDamage(this);
				this.damagedEnemies.push(entity);
				this.playHitAnimation(entity.pos.x + entity.scaleDim.x / 4,
				  	entity.pos.y + entity.scaleDim.y / 4);
				if (this.level >= 2) {
						this.game.addEntity(new LightingBolt(this.game,
							entity.pos.x, entity.pos.y - PARAMS.TILE_WIDTH * 1.5, entity));
				}
		  	}
		}
	}

	/** @override */
	update() {
		this.existTime -= this.game.clockTick
		if (this.existTime <= 0 || this.facing != this.game.druid.facing) {
			this.game.druid.casting = false;
			this.removeFromWorld = true;
		} else {
			this.updatePos();
		}
		this.move(this.game.clockTick);
	}

	updatePos() {
		this.vel.y = this.game.druid.vel.y;
		let druidCenter = this.game.druid.worldBB.centerPoint();
		if (this.game.druid.facing == 0) {
			this.pos.x = druidCenter.x - this.scaleDim.x - PARAMS.TILE_WIDTH * 1.2;
			this.facing = 0;
		} else {
			this.pos.x = druidCenter.x + PARAMS.TILE_WIDTH * 1.2;
			this.facing = 1
		}
		this.worldBB.shift(this.pos.x, this.pos.y);
		let RADIUS = this.scaleDim.y / 2;
		for (var i = 0; i < this.agentBB.length; i++) {
			this.agentBB[i].shift(
				this.pos.x + RADIUS * (1 + i * 2),
				this.pos.y + RADIUS, RADIUS);
		}
    }

	playHitAnimation(x, y) {
		// hit effect animation
		let hitAnimation = new Animator(
			ASSET_LOADER.getImageAsset("./Sprites/ThunderHitEffect.png"),
			0, 16, 32, 32, 4, 0.1, 0, false, false, false);
		this.game.addEntity(new Effect(this.game, x, y, hitAnimation, 0.4, 2));
	}
}

class Explosion extends Agent {
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
		this.existTime -= this.game.clockTick;
		if (this.existTime <= 0) this.removeFromWorld = true;
		this.move(this.game.clockTick);
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

class LightingBolt extends Agent {
	/**
	* Creates a new ranged attack to be extended.
	* @param {GameEngine} game Instance of the game.
	* @param {number} x Horizontal coordinate to place attack.
	* @param {number} y Vertical coordinate to place attack.
	* @param {number} radius Size of the agent bounding box.
	* @param {number} attack attack value of this explosion.
	*/
	constructor(game, x, y, target) {
		super(game, x, y, "./Sprites/LightningBolt.png");
		this.setDimensions(1.5, PARAMS.TILE_WIDTH, PARAMS.TILE_WIDTH * 2);
		this.target = target;
		this.vel.x = 0;
		this.vel.y = 0;
		this.attack = 1;
		this.existTime = 0.75;
		this.delayTime = 1.1;
		this.damagedEnemies = [];
	}

	/** @override */
	loadAnimations() {
		// default animation
		this.animations[0] = new Animator(
			this.spritesheet, 0, 0, 64, 128, 15, 0.05, 0, false, false, false);
		this.animations[1] = new Animator(
			this.spritesheet, 0, 0, 64, 128, 15, 0.05, 0, false, false, false);
	}

	/** @override */
	update() {
		this.delayTime -= this.game.clockTick
		if (this.delayTime <= 0) this.existTime -= this.game.clockTick;
		if (this.existTime <= 0) this.removeFromWorld = true;
		this.move(this.game.clockTick);
	}

	/** @override */
	defineWorldCollisions(entity, collisions) {
		// do nothing
	}

	/** @override */
	defineAgentCollisions(entity) {
		if (entity instanceof Enemy && !this.damagedEnemies.includes(entity)
			&& this.existTime <= 0.70) {
			entity.takeDamage(this);
			this.damagedEnemies.push(entity);
		}
	}

/** @override */
	draw(context) {
		if (this.delayTime <= 0) {
			if (this.target instanceof LionBoss) {
				this.pos = {
					x: this.target.pos.x + this.target.scaleDim.x / 3,
					y: this.target.pos.y + this.target.scaleDim.y - this.scaleDim.y - PARAMS.TILE_WIDTH
				};
			} else {
				this.pos = {
					x: this.target.pos.x,
					y: this.target.pos.y + this.target.scaleDim.y - this.scaleDim.y
				};
            }

			this.worldBB.shift(this.pos.x, this.pos.y);
			let RADIUS = this.scaleDim.x / 2;
			this.agentBB = [
				new BoundingCircle(
					this.pos.x + RADIUS,
					this.pos.y + RADIUS, RADIUS),
				new BoundingCircle(
					this.pos.x + RADIUS,
					this.pos.y + RADIUS * 3, RADIUS)];
			super.draw(context);
		}
	}
}

///** 
// * A special attack consists of mutiple ranged attack bounding boxes that would deal a
// * one-time damage. 
// */
//class ThunderAttack extends Agent{
//	/**
//	 * @param {GameEngine} game Instance of the game.
//	 * @param {number} x Horizontal coordinate to place attack.
//	 * @param {number} y Vertical coordinate to place attack.
//	 * @param {number} degree Degree the attack is shooting out.
//	 */
//	constructor(game, x, y, facing, level) {
//		super(game, x, y, "./Sprites/thunder.png");
//		this.facing = facing;
//		this.level = level;
//		this.setDimensions(1, PARAMS.TILE_WIDTH * 2 , PARAMS.TILE_WIDTH / 2);
//		this.vel.x = facing === 0 ? -660 : 660;
//		this.attack = 2;
//		this.existTime = 5;
//		this.force = 600;
//		let RADIUS = this.dim.y / 2;
//		this.agentBB = [
//			new BoundingCircle(
//				this.pos.x + RADIUS,
//				this.pos.y + RADIUS, RADIUS),
//			new BoundingCircle(
//				this.pos.x + RADIUS * 3,
//				this.pos.y + RADIUS, RADIUS),
//			new BoundingCircle(
//				this.pos.x + RADIUS * 5,
//				this.pos.y + RADIUS, RADIUS),
//			new BoundingCircle(
//				this.pos.x + RADIUS * 7,
//				this.pos.y + RADIUS, RADIUS)];
//	}

//	/** @override */
//	loadAnimations() {
//		this.animations[0] = new Animator(
//			this.spritesheet, 150, 35, 130, 35, 4, 0.2, 20, false, true, false);
//		this.animations[1] = new Animator(
//			this.spritesheet, 150, 35, 130, 35, 4, 0.2, 20, false, true, true);
//	}

//	/** @override */
//	defineWorldCollisions(entity, collisions) {
//		if (entity instanceof Ground) {
//			this.removeFromWorld = true;
//			this.playHitAnimation();
//		} else if (entity instanceof HitBreakBlock) {
//			entity.hitBlock(this.attack);
//			this.removeFromWorld = true;
//			this.playHitAnimation();
//		}
//	}

//	/** @override */
//	defineAgentCollisions(entity) {
//		if (entity instanceof Enemy) {
//			entity.takeDamage(this);
//			this.removeFromWorld = true;
//			this.playHitAnimation();
//		}
//	}

//	/** @override */
//	update() {
//		this.existTime -= this.game.clockTick
//		if (this.existTime <= 0) {
//			this.removeFromWorld = true;
//		}
//		this.move(this.game.clockTick);
//	}

//	playHitAnimation() {
//		// hit effect animation
//		let hitAnimation = new Animator(
//			ASSET_LOADER.getImageAsset("./Sprites/ThunderHitEffect.png"),
//			0, 16, 32, 32, 4, 0.1, 0, false, false, false);
//		if (this.facing == 0) {
//			this.game.addEntity(
//				new Effect(this.game, this.pos.x, this.pos.y,
//					hitAnimation, 0.4, 2));
//		} else {
//			this.game.addEntity(
//				new Effect(this.game, this.pos.x + this.dim.x * 0.75, this.pos.y,
//					hitAnimation, 0.4, 2));
//        }
//	}
//}

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
			entity.takeDamage(this.attack);
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
			entity.takeDamage(this.attack);
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
			entity.takeDamage(this.attack);
			entity.knockback(this, angle);
		}
	}

	defineWorldCollisions(entity, collisions) { };
}
