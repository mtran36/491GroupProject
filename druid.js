/** Player character */
class Druid extends Agent {
	constructor(game, x, y) {
		super(game, x, y, "./Sprites/druid.png");
		this.setDimensions(1, 97, 157);
		this.game.druid = this;
		this.maxHealth = 400;

		this.loadAnimations();
		this.isJumping = false;
		this.health = 100;
		this.damage = 0;
		this.invincTime = 0;
		this.flashing = false;
		this.rangeAttackCooldown = 0;
		this.meleeAttackCooldown = 0;
		this.meleeAttackDuration = 0;
	}

	meleeAttack() {
		this.meleeAttackCooldown -= this.game.clockTick;
		if (this.meleeAttackCooldown <= 0 && this.game.C) {
			if (this.facing === 0) { // stab left
				this.game.addEntity(new SwordAttack(this.game, 0, 0, this.facing));
			} else { // stab right
				this.game.addEntity(new SwordAttack(this.game, 0, 0, this.facing));
			}
			this.game.C = false;
			this.meleeAttackCooldown = 1;
		}
	}

	rangedAttack() {
		this.rangeAttackCooldown -= this.game.clockTick;
		if (this.rangeAttackCooldown <= 0 && this.game.A) {
			if (this.facing === 0) { // shoot left
				this.game.addEntity(new RangeAttack(
					this.game,
					this.pos.x - PARAMS.TILE_WIDTH,
					this.pos.y + this.scaleDim.y / 2,
					this.facing));
			} else { // shoot right
				this.game.addEntity(new RangeAttack(
					this.game,
					this.pos.x + this.scaleDim.x,
					this.pos.y + this.scaleDim.y / 2,
					this.facing));
			}
			this.game.A = false;
			this.rangeAttackCooldown = 1;
		}
	}

	drawHealthBar(context) {
		context.fillStyle = "Red";
		context.fillRect(30, 30, this.health, 30);
		context.fillStyle = "White";
		context.fillRect(this.health + 30, 30, this.maxHealth - this.health, 30);
		context.beginPath();
		context.strokeStyle = "Black";
		context.rect(30, 30, this.maxHealth, 30)
		context.stroke();

		context.fillStyle = "black";
		context.font = "16px Verdana";
		context.fillText(this.health + "/" + this.maxHealth + "HP", 330, 50);
		context.fillStyle = "grey";
		context.font = "16px Verdana";
		context.fillText("LVL", 360, 25);
		context.fillText("Name Here if want", 30, 25);
    }

	/** @override */
	takeDamage(damage) {
		if (!PARAMS.DEBUG) {
			this.health -= damage;
			if (this.health <= 0) {
				this.removeFromWorld = true;
			}
			this.flashing = true;
		}
	}

	/** @override */
	defineAgentCollisions(entity) {
		if (entity instanceof Enemy && this.invincTime <= 0) {
			this.takeDamage(entity.attack);
			this.invincTime = 1;
		}
	}

	/** @override */
	defineWorldCollisions(entity, collisions) {
		if (entity instanceof Ground || entity instanceof Door) {
			if (collisions.down) {
				this.pos.y = entity.worldBB.top - this.scaleDim.y;
				this.vel.y = 0;
				this.isJumping = false;
			}
			if (collisions.up) {
				this.pos.y = entity.worldBB.bottom;
				this.vel.y = 0;
				this.isJumping = true;
			}
			if (collisions.left) {
				this.pos.x = entity.worldBB.right;
				this.vel.x = 0;
			}
			if (collisions.right) {
				this.pos.x = entity.worldBB.left - this.scaleDim.x;
				this.vel.x = 0;
			}
		}
		// Temporary collision detection for key and door
		if (entity instanceof Key) {
			this.hasKey = true;
			entity.removeFromWorld = true;
		}
		if (entity instanceof Door && this.hasKey === true) {
			entity.removeFromWorld = true;
		}
    }

	/** @override */
	loadAnimations() {
		this.animations[0] = new Animator(
			this.spritesheet, 740, 0, this.dim.x, this.dim.y, 1, 0.25, 1, false, true, false);
		this.animations[1] = new Animator(
			this.spritesheet, 740, 0, this.dim.x, this.dim.y, 1, 0.25, 1, false, true, true);
	}

	/** @override */
	update() {
		const FALL_ACC = 1500;
		const WALK_SPEED = 300;
		const JUMP_VEL = 900;
		const TICK = this.game.clockTick;

		if (this.invincTime > 0) {
			this.invincTime -= this.game.clockTick;
			this.flashing = !this.flashing;
		} else {
			this.flashing = false;
		}

		if (!this.isJumping && this.game.B) { 
			this.vel.y = -JUMP_VEL;
			this.isJumping = true;
			this.game.B = false;
		} else {
			this.vel.y += FALL_ACC * TICK;
			this.isJumping = true;
		}

		this.meleeAttack();
		this.rangedAttack();

		if (this.game.right) { 
			this.vel.x = WALK_SPEED;
		} else if (this.game.left) {
			this.vel.x = -WALK_SPEED;
		} else {
			this.vel.x = 0;
		}
		this.move(TICK);
	}

	/** @override */
	draw(context) {
		this.drawHealthBar(context);
		if (this.flashing) return;
		super.draw(context);
	}
}

class SwordAttack extends Agent {
	constructor(game, x, y, duration) {
		super(game, x, y, "./Sprites/sword.png");
		this.setDimensions(2.5, 34, 15);
		this.duration = 0.5;
		this.attack = 1;
		this.damagedEnemies = [];
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