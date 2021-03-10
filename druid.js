/** 
 * Player character 
 */
class Druid extends Agent {
	constructor(game, x, y) {
		super(game, x, y, "./Sprites/druidmerge.png");
		this.mapPipColor = 'green'
		this.setDimensions(1, 176, 128);
		this.worldBB = new BoundingBox(
			this.pos.x + 65, this.pos.y + 23,
			this.scaleDim.x - 120, this.scaleDim.y - 23);
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

		this.maxHealth = 60;
		this.maxMana = 60;
		this.health = this.maxHealth;
		this.mana = this.maxMana;
		this.lastHealth = this.health;

		this.updateGradient();
		this.updateHealthGradient();
		this.updateManaGradient();

		this.damage = 0;
		this.invincTime = 0;
		this.flashing = false;
		this.meleeAttackCooldown = 0;
		this.meleeAttackDuration = 0;

		this.potionCounter = 0;
		this.maxPotions = 10;
		this.keyCounter = 0;

		this.xOffset = 45;
		this.currentOffset = this.xOffset;
		this.attackSelection = null;
		this.attacks = [];
		this.items = [];
		this.itemSelection = null;
		this.knockbackTime = 0;
	}

	meleeAttack() {
		this.meleeAttackCooldown -= this.game.clockTick;
		let druidCenter = this.worldBB.centerPoint();
		if (this.meleeAttackCooldown <= 0 && this.game.C) {
			this.game.addEntity(new SwordAttack(
				this.game, druidCenter.x, druidCenter.y, this.facing));
			this.game.C = false;
			this.meleeAttackCooldown = 0.5;
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
				this.game.screen = this.game.camera.loseScreen;
			} else {
				AUDIO_PLAYER.playSound("./Audio/DruidDamage.mp3");
			}
		}
		this.invincTime = 1;
		this.flashing = true;
	}

/**
 * Uses an attack agent to knock this the druid in a direction. The angle of the collision
 * is determined and then the force is used as a force vector with that angle to 
 * detemine the x and y components of the force vector. The x and y components of the 
 * force vector are then applied to the druids x and y velocities respectively.
 * @param {Agent} attack Agent that has a knockback force value defined.
 */
	knockback(attack, angle) {
		let thisCenter = this.worldBB.centerPoint();
		let attackCenter = attack.worldBB.centerPoint();
		if (!angle) {
			angle = Math.atan2(
				thisCenter.y - attackCenter.y,
				thisCenter.x - attackCenter.x);
		}
		this.vel.y = attack.force * Math.sin(angle);
		this.vel.x = attack.force * Math.cos(angle);
		this.knockbackTime = 2;
	}

	updateGradient() {
		const ORIGIN_X = 117;
		const ORIGIN_Y = 7;
		const OFFSET = 2;
		const WIDTH = 20;

		this.gradient = this.game.context.createLinearGradient(
			ORIGIN_X, ORIGIN_Y,
			ORIGIN_X + this.maxHealth * 5 + OFFSET * 3,
			ORIGIN_Y + WIDTH * 2 + OFFSET * 5);
		this.gradient.addColorStop(0, COLORS.FRAME_BROWN);
		this.gradient.addColorStop(0.5, COLORS.FRAME_TAN);
		this.gradient.addColorStop(1, COLORS.FRAME_BROWN);
    }

	updateHealthGradient() {
		const ORIGIN_X = 117;
		const ORIGIN_Y = 7;
		const OFFSET = 2;
		const WIDTH = 20;

		this.healthGradient = this.game.context.createLinearGradient(
			ORIGIN_X, ORIGIN_Y,
			ORIGIN_X + this.health * 5 + OFFSET * 3,
			ORIGIN_Y + WIDTH * 2 + OFFSET * 5);
		this.healthGradient.addColorStop(0, COLORS.LIGHT_HEALTH_GREEN);
		this.healthGradient.addColorStop(1, COLORS.HEALTH_GREEN);

		this.lowHealthGradient = this.game.context.createLinearGradient(
			ORIGIN_X, ORIGIN_Y,
			ORIGIN_X + this.health * 5 + OFFSET * 3,
			ORIGIN_Y + WIDTH * 2 + OFFSET * 5);
		this.lowHealthGradient.addColorStop(0, COLORS.LIGHT_HEALTH_RED);
		this.lowHealthGradient.addColorStop(1, COLORS.HEALTH_RED);
	}

	updateManaGradient() {
		const ORIGIN_X = 117;
		const ORIGIN_Y = 7;
		const OFFSET = 2;
		const WIDTH = 20;

		this.manaGradient = this.game.context.createLinearGradient(
			ORIGIN_X, ORIGIN_Y,
			ORIGIN_X + this.mana * 5 + OFFSET * 3,
			ORIGIN_Y + WIDTH * 2 + OFFSET * 5);
		this.manaGradient.addColorStop(0, COLORS.LIGHT_LAPIS);
		this.manaGradient.addColorStop(1, COLORS.LAPIS);

		this.lowManaGradient = this.game.context.createLinearGradient(
			ORIGIN_X, ORIGIN_Y,
			ORIGIN_X + this.mana * 5 + OFFSET * 3,
			ORIGIN_Y + WIDTH * 2 + OFFSET * 5);
		this.lowManaGradient.addColorStop(0, COLORS.MANA_PURPLE);
		this.lowManaGradient.addColorStop(1, "indigo");
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
			if (entity instanceof Door && this.keyCounter > 0) {
				entity.removeFromWorld = true;
				this.keyCounter--;
			}
			this.knockbackTime = 0;
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
			jumpEffect: new Animator(
				ASSET_LOADER.getImageAsset("./Sprites/DruidJumpEffect.png"),
				0, 0, 32, 32, 4, 0.1, 0, false, true, false),
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
		this.animations[1][2] = this.storedAnimations.jumpEffect;
	}

	/** @override */
	update() {
		const FALL_ACC = 1500;
		const WALK_SPEED = 300;
		const JUMP_VEL = 900;
		const TICK = this.game.clockTick;
		let i, remainder = this.maxHealth - this.health;

		if (this.lastHealth != this.health) {
			this.updateHealthGradient();
		}
		this.lastHealth = this.health;
		// Mana regen
		if (this.mana < this.maxMana) {
			if (this.vel.x != 0 || this.vel.y != 0) {
				this.mana += 0.07;
			} else {
				this.mana += 0.21;
			}
		}
		if (this.mana > this.maxMana) {
			this.mana = this.maxMana;
		}

		this.knockbackTime -= TICK;
		// Check if player is moving
		if (this.game.right && this.knockbackTime < 0) {
			this.animations[0][0] = this.storedAnimations.walkingRight;
			this.animations[1][0] = this.storedAnimations.walkingLeft;
			this.vel.x = WALK_SPEED;
		}
		if (this.game.left && this.knockbackTime < 0) {
			this.animations[0][0] = this.storedAnimations.walkingRight;
			this.animations[1][0] = this.storedAnimations.walkingLeft;
			this.vel.x = -WALK_SPEED;
		}
		if (!this.game.left && !this.game.right && this.knockbackTime < 0) {
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
			this.game.B = false;
			this.animations[0][1] = this.storedAnimations.jumpingRight;
			this.animations[1][1] = this.storedAnimations.jumpingLeft;
			this.animations[0][1].restart();
			this.animations[1][1].restart();
			AUDIO_PLAYER.playSound("./Audio/DruidJump.mp3");
			// Jump effect
			this.game.addEntity(
				new Effect(this.game,
					this.pos.x + PARAMS.TILE_WIDTH,
					this.pos.y + this.dim.y / 2,
					this.animations[1][2], 0.4, 2));
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
		// for spell upgrade testing:
		if (this.game.Q == true) {
			if (this.attacks[this.attackSelection].canLevelUp == true) {
				this.attacks[this.attackSelection].levelUp();
			}
			this.game.Q = false;
        }
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
		this.move(TICK);
	}

	/** @override */
	draw(context) {
		const ORIGIN_X = 117;
		const ORIGIN_Y = 7;
		const OFFSET = 2;
		const WIDTH = 20;
		
		// Draw hud elements
		if (this.mana != this.maxMana) {
			this.updateManaGradient();
        }
		context.save();
		context.fillStyle = "black";
		context.fillRect(
			ORIGIN_X, ORIGIN_Y,
			this.maxHealth * 5 + OFFSET * 5,
			WIDTH * 2 + OFFSET * 7);
		context.fillStyle = this.gradient;
		context.fillRect(
			ORIGIN_X + OFFSET, ORIGIN_Y + OFFSET,
			this.maxHealth * 5 + OFFSET * 3,
			WIDTH * 2 + OFFSET * 5);
		HUD.drawBar(context,
			ORIGIN_X + OFFSET * 2,
			ORIGIN_Y + OFFSET * 2,
			WIDTH, OFFSET, { 
				current: this.health,
				max: this.maxHealth,
				name: "",
				tickWidth: 5
		}, "DRUID",
			this.health / this.maxHealth <= 0.2 ? this.lowHealthGradient : this.healthGradient,
			this.health / this.maxHealth <= 0.2 ? COLORS.HEALTH_RED : COLORS.HEALTH_GREEN);
		if (this.attacks[this.attackSelection]) {
			HUD.drawBar(context,
				ORIGIN_X + OFFSET * 2,
				ORIGIN_Y + OFFSET * 4 + WIDTH,
				WIDTH, OFFSET, {
					current: this.mana,
					max: this.maxMana,
					name: "",
					tickWidth: 5
				}, "MANA",
				this.mana < this.attacks[this.attackSelection].cost - 1 ? this.lowManaGradient : this.manaGradient,
				this.mana < this.attacks[this.attackSelection].cost - 1 ? "indigo" : COLORS.LAPIS);
			HUD.drawPowerupUI(context, 120, 65, this.attacks, this.attackSelection);
		}
		if (this.flashing) return;
		// Draw druid
		this.animations[this.facing][this.isJumping ? 1 : 0].drawFrame(
			this.game.clockTick, context,
			this.pos.x, this.pos.y,
			this.scale, this.game.camera, this.xOffset);
		this.worldBB.display(this.game);
		this.agentBB.forEach((BB) => {
			BB.display(this.game);
		});
		context.restore();
	}
}