/** 
 * Player character 
 */
class Druid extends Agent {
	constructor(game, x, y) {
		super(game, x, y, "./Sprites/druidmerge.png");
		this.setDimensions(1, 176, 128);
		this.worldBB = new BoundingBox(
			this.pos.x + 65, this.pos.y + 23, this.scaleDim.x - 120, this.scaleDim.y - 23);
		this.agentBB = [
			new BoundingCircle(
				this.worldBB.x + this.worldBB.width / 2,
				this.worldBB.y + this.worldBB.height / 4,
				this.worldBB.width / 2),
			new BoundingCircle(
				this.worldBB.x + this.worldBB.width / 2,
				this.worldBB.y + 3 * this.worldBB.height / 4,
				this.worldBB.width / 2
			)
		];
		this.game.druid = this;

		this.loadAnimations();
		this.isJumping = false;
		this.health = 100;
		this.maxHealth = 100;
		this.damage = 0;
		this.invincTime = 0;
		this.flashing = false;
		this.meleeAttackCooldown = 0;
		this.meleeAttackDuration = 0;
		this.potionCounter = 6;
		this.maxPotions = 10;
		this.keyCounter = 0;
		this.xOffset = 45;
		this.currentOffset = this.xOffset;
		this.attackSelection = null;
		this.attacks = [];
	}

	/** 
	 *
	 */
	meleeAttack() {
		this.meleeAttackCooldown -= this.game.clockTick;
		let druidCenter = this.worldBB.centerPoint();
		if (this.meleeAttackCooldown <= 0 && this.game.C) {
			// stab
			this.game.addEntity(new SwordAttack(this.game, druidCenter.x, druidCenter.y, this.facing));
			this.game.C = false;
			this.meleeAttackCooldown = 1;
		}
	}

	/** @override */
	takeDamage(damage) {
		if (!PARAMS.DEBUG && this.invincTime <= 0) {
			this.health -= damage;
			if (this.health <= 0) {
				this.health = 0;
				this.vel.x = 0;
				AUDIO_PLAYER.playSound("./Audio/DruidDeath.mp3");
				this.removeFromWorld = true;
			} else {
				AUDIO_PLAYER.playSound("./Audio/DruidDamage.mp3");
			}
		}
		this.invincTime = 1;
		this.flashing = true;
	}

	/** @override */
	defineAgentCollisions(entity) {
		if (entity instanceof Enemy && this.invincTime <= 0) {
			this.takeDamage(entity.attack);
		}
		if (entity instanceof Door) {
			if (this.keyCounter > 0) {
				entity.removeFromWorld = true;
				this.keyCounter -= 1;
            }
        }
	}

	/** @override */
	defineWorldCollisions(entity, collisions) {
		let x = this.worldBB.x;
		let y = this.worldBB.y;

		if (entity instanceof Ground || entity instanceof Door) {
			if (collisions.down) {
				y = entity.worldBB.top - this.worldBB.height;
				this.vel.y = 0;
				this.isJumping = false;
			}
			if (collisions.up) {
				y = entity.worldBB.bottom;
				this.vel.y = 0;
				this.isJumping = true;
			}
			if (collisions.right) {
				x = entity.worldBB.left - this.worldBB.width;
				this.vel.x = 0;
			}
			if (collisions.left) {
				x = entity.worldBB.right;
				this.vel.x = 0;
			}
		}
		if (entity instanceof StandingBreakBlock) {
			if (collisions.down) {
				entity.standOn();
			}
		}
		this.worldBB.shift(x, y);
    }

	/** @override */
	loadAnimations() {
		let i;
		for (i = 0; i < 2; i++) {
			this.animations.push([]);
		}
		this.storedAnimations = {
			standingRight: new Animator(this.spritesheet,
				0, 0, this.dim.x, this.dim.y,
				3, 0.7, 0, true, true, true, true),
			standingLeft: new Animator(this.spritesheet,
				0, 0, this.dim.x, this.dim.y,
				3, 0.7, 0, true, true, false, true),
			walkingRight: new Animator(this.spritesheet,
				0, 0, this.dim.x, this.dim.y,
				8, 0.1, 0, true, true, true),
			walkingLeft: new Animator(this.spritesheet,
				0, 0, this.dim.x, this.dim.y,
				8, 0.1, 0, true, true, false),
			jumpingRight: new Animator(this.spritesheet,
				0, 128, this.dim.x, this.dim.y,
				6, 0.3, 0, false, false, true),
			jumpingLeft: new Animator(this.spritesheet,
				0, 128, this.dim.x, this.dim.y,
				6, 0.3, 0, false, false, false),
			airHangRight: new Animator(this.spritesheet,
				this.dim.x * 4, 128, this.dim.x, this.dim.y,
				1, 1, 0, false, true, true),
			airHangLeft: new Animator(this.spritesheet,
				this.dim.x * 4, 128, this.dim.x, this.dim.y,
				1, 1, 0, false, true, false),
		};
		this.animations[0][0] = this.storedAnimations.walkingRight;
		this.animations[1][0] = this.storedAnimations.walkingLeft;
		this.animations[0][1] = this.storedAnimations.jumpingRight;
		this.animations[1][1] = this.storedAnimations.jumpingLeft;
	}

	/** @override */
	update() {
		const FALL_ACC = 1500;
		const WALK_SPEED = 300;
		const JUMP_VEL = 900;
		const TICK = this.game.clockTick;
		let i, remainder = this.maxHealth - this.health;

		// Check if player is moving
		if (this.game.right) {
			this.animations[0][0] = this.storedAnimations.walkingRight;
			this.animations[1][0] = this.storedAnimations.walkingLeft;
			this.vel.x = WALK_SPEED;
		}
		if (this.game.left) {
			this.animations[0][0] = this.storedAnimations.walkingRight;
			this.animations[1][0] = this.storedAnimations.walkingLeft;
			this.vel.x = -WALK_SPEED;
		}
		if (!this.game.left && !this.game.right) {
			this.animations[0][0] = this.storedAnimations.standingRight;
			this.animations[1][0] = this.storedAnimations.standingLeft;
			this.vel.x = 0;
		}
		// Update potion counter
		if (this.potionCounter > 0 && remainder > 20) {
			this.health += 20;
			this.potionCounter -= 1;
		}
		// Damage flashing 
		if (this.invincTime > 0) {
			this.invincTime -= this.game.clockTick;
			this.flashing = !this.flashing;
		} else {
			this.flashing = false;
		}

		// Jump handling
		if (!this.isJumping && this.game.B) {
			this.vel.y = -JUMP_VEL;
			this.isJumping = true;
			AUDIO_PLAYER.playSound("./Audio/DruidJump.mp3");
			this.game.B = false;
			this.animations[0][1] = this.storedAnimations.jumpingRight;
			this.animations[1][1] = this.storedAnimations.jumpingLeft;
			this.animations[0][1].restart();
			this.animations[1][1].restart();
			AUDIO_PLAYER.playSound("./Audio/DruidJump.mp3");
		} else {
			if (this.animations[0][1].isDone() || this.animations[1][1].isDone) {
				this.animations[0][1] = this.storedAnimations.airHangRight;
				this.animations[1][1] = this.storedAnimations.airHangLeft;
			}
			this.isJumping = true;
			this.vel.y += FALL_ACC * TICK;
		}

		// check if melee attack is made
		this.meleeAttack();
		// check if switch attack
		if (this.game.SHIFT == true && this.attackSelection != null) {
			this.attackSelection = (this.attackSelection + 1) % this.attacks.length;
			this.game.SHIFT = false;
        }
		// check if any special attack if made
		if (this.attackSelection != null) {
			for (i = 0; i < this.attacks.length; i++) {
				this.attacks[i].updateCooldown();
            }
			this.attacks[this.attackSelection].attack(this);
        }
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
		HUD.drawBar(
			context, 10, 10, 30, 3,
			{ 
				current: this.health,
				max: this.maxHealth,
				name: "",
				tickWidth: 5
			},
			"DRUID", this.health / this.maxHealth <= 0.2 ? "red" : "green");
		HUD.drawBar(
			context, 10, 45, 30, 3,
			{
				current: this.potionCounter,
				max: this.maxPotions,
				name: "",
				tickWidth: 40
			},
			"POTIONS", "teal");

		context.fillStyle = "black";
		context.font = "italic bold 16px Castellar";
		context.fillText(
			"Key: " + this.keyCounter,
			10, 100);
		context.restore();
		// powerups UI
		HUD.drawPowerupUI(context,
			PARAMS.CANVAS_WIDTH - 288, PARAMS.CANVAS_HEIGHT - 48,
			this.attacks, this.attackSelection);

		if (this.flashing) return;
		this.animations[this.facing][this.isJumping ? 1 : 0].drawFrame(
			this.game.clockTick, context,
			this.pos.x, this.pos.y,
			this.scale, this.game.camera, this.xOffset);
		this.worldBB.display(this.game);
		this.agentBB.forEach((BB) => {
			BB.display(this.game);
		});
	}
}