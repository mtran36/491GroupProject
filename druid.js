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
		this.meleeAttackCooldown = 0;
		this.meleeAttackDuration = 0;
		this.potionCounter = 0;
		this.keyCounter = 0;

		this.attacks = [];
		this.attacks.push(this.meleeAttack);
	}

	takeDamage(damage) {
		if (!PARAMS.DEBUG) {
			this.health -= damage;
			if (this.health <= 0) {
				this.health = 0;
				this.removeFromWorld = true;
			}
		}
		this.invincTime = 1;
		this.flashing = true;
	}

	meleeAttack(DRUID) {
		DRUID.meleeAttackCooldown -= DRUID.game.clockTick;
		if (DRUID.meleeAttackCooldown <= 0 && DRUID.game.C) {
			if (DRUID.facing === 0) { // stab left
				DRUID.game.addEntity(new SwordAttack(DRUID.game, 0, 0, DRUID.facing));
			} else { // stab right
				DRUID.game.addEntity(new SwordAttack(DRUID.game, 0, 0, DRUID.facing));
			}
			DRUID.game.C = false;
			DRUID.meleeAttackCooldown = 1;
		}
	}


	/** @override */
	checkCollisions() {
		let that = this;
		this.game.entities.forEach(function (entity) {
			if (entity.agentBB && that.agentBB.collide(entity.agentBB)) {
				if (entity instanceof Enemy && that.invincTime <= 0) {
					that.takeDamage(entity.attack);
				}
			}
			if (entity.worldBB && that.worldBB.collide(entity.worldBB)
				&& that !== entity) {
				if (entity instanceof Ground || entity instanceof Door) {
					if (that.vel.y > 0) {
						if (that.lastWorldBB.bottom <= entity.worldBB.top
							&& (that.lastWorldBB.left) < entity.worldBB.right
							&& (that.lastWorldBB.right) > entity.worldBB.left) { // falling dowm
							that.pos.y = entity.worldBB.top - that.scaleDim.y;
							that.vel.y = 0;
							that.isJumping = false;
						}
						// bottom corners to entity's top corners collision
						if (that.lastWorldBB.bottom > entity.worldBB.top) {
							if (that.vel.x > 0 && that.lastWorldBB.right > entity.worldBB.left) {
								that.pos.x = entity.worldBB.left - that.scaleDim.x;
								that.vel.x = 0;
							} else if (that.vel.x < 0 && that.lastWorldBB.left < entity.worldBB.right) {
								that.pos.x = entity.worldBB.right;
								that.vel.x = 0;
							}
						}
					}
					if (that.vel.y < 0) {
						if ((that.lastWorldBB.top) >= entity.worldBB.bottom
							&& (that.lastWorldBB.left) != entity.worldBB.right
							&& (that.lastWorldBB.right) != entity.worldBB.left) { // jumping up
							that.pos.y = entity.worldBB.bottom;
							that.vel.y = 0;
							that.isJumping = true;
						}
						// top corners to entity's bottom corners
						if (that.vel.x > 0 && that.lastWorldBB.top < entity.worldBB.bottom
							&& that.lastWorldBB.right > entity.worldBB.left) {
							that.pos.x = entity.worldBB.left - that.scaleDim.x;
							that.vel.x = 0;
						} else if (that.vel.x < 0 && that.lastWorldBB.top < entity.worldBB.bottom
							&& that.lastWorldBB.left < entity.worldBB.right) {
							that.pos.x = entity.worldBB.right;
							that.vel.x = 0;
						}
					}
					if (that.vel.x < 0 && (that.lastWorldBB.left) >= entity.worldBB.right
						&& that.lastWorldBB.top < entity.worldBB.bottom
						&& that.lastWorldBB.bottom > entity.worldBB.top) { // going left
						that.pos.x = entity.worldBB.right;
						that.vel.x = 0;
					}
					if (that.vel.x > 0 && (that.lastWorldBB.right) <= entity.worldBB.left
						&& that.lastWorldBB.top < entity.worldBB.bottom
						&& that.lastWorldBB.bottom > entity.worldBB.top) { // going right
						that.pos.x = entity.worldBB.left - that.scaleDim.x;
						that.vel.x = 0;
					}
				}
				// Temporary collision detection for key and door
				if (entity instanceof Key) {
					that.hasKey = true;
					that.keyCounter += 1;
					entity.removeFromWorld = true;
				}
				if (entity instanceof Door) {
					if (that.hasKey == true) {
						entity.removeFromWorld = true;
						that.keyCounter -= 1;
					}
				}
				if (entity instanceof Potions) {
					that.hasPotions = true;
					if (that.health < that.maxHealth) {
						that.health += 10;
					} else if (that.health = that.maxHealth) {
						that.potionCounter += 10;
                    }
					entity.removeFromWorld = true;
                }
			}
		});
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

		// Calls each attack function to determine if an attack is made
		let that = this;
		this.attacks.forEach(function (attack) {
			attack(that);
		});

		if (this.game.right) { 
			this.vel.x = WALK_SPEED;
		} else if (this.game.left) {
			this.vel.x = -WALK_SPEED;
		} else {
			this.vel.x = 0;
		}
		this.move(TICK);
	}

	drawMinimap(ctx, mmX, mmY) {
		ctx.fillStyle = "Red";
		ctx.fillRect(mmX + this.x / 16, mmY + this.y / 16, 3, 3 * Math.min(0 + 1, 2));
	}


	/** @override */
	draw(context) {
		if (this.flashing) return;
		super.draw(context);
	}
}