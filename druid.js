/** 
 * Player character 
 */
class Druid extends Agent {
	constructor(game, x, y) {
		super(game, x, y, "./Sprites/druidmerge.png");
		this.setDimensions(1, 176, 128);
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

		this.attackSelection = null;
		this.attacks = [];
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

	/**
	 * Draws a standard resource bar which can be depleted.
	 * @param {CanvasImageSource} context Canvas to draw to.
	 * @param {number} xOffset Horizontal distance from origin.
	 * @param {number} yOffset Vertical distance from origin.
	 * @param {number} width Height of the bar.
	 * @param {number} borderOffset Width of the black border around the bar.
	 * @param {Object} resource Resource this bar will display, has current and max values.
	 * @param {String} name Text to be placed on the left side of the bar.
	 * @param {String} color Color to use for bar fill.
	 */
	drawBar(context, xOffset, yOffset, width, borderOffset, resource, name, color) {
		const FONT = "italic bold 16px Castellar"
		const TEXT_COLOR = "black";
		const X_TEXT_NUDGE = 10;
		const X_TEXT_POS_SCALE = 0.65;
		const Y_TEXT_NUDGE = 2;
		const Y_TEXT_POS_SCALE = 1.5;

		context.save();
		// Draw Bars
		context.fillStyle = "black";
		context.fillRect(
			xOffset, yOffset,
			resource.max * resource.tickWidth + borderOffset,
			width + borderOffset);
		context.fillStyle = "white";
		context.fillRect(
			xOffset + borderOffset, yOffset + borderOffset,
			resource.max * resource.tickWidth - borderOffset,
			width - borderOffset);
		context.fillStyle = color;
		context.fillRect(
			xOffset + borderOffset, yOffset + borderOffset,
			resource.current * resource.tickWidth - borderOffset,
			width - borderOffset);
		// Draw Text
		context.fillStyle = TEXT_COLOR;
		context.font = FONT;
		context.fillText(
			resource.current + "/" + resource.max + resource.name,
			(xOffset + resource.max * resource.tickWidth) * X_TEXT_POS_SCALE,
			yOffset + (width / Y_TEXT_POS_SCALE) + Y_TEXT_NUDGE);
		context.fillText(
			name,
			xOffset + X_TEXT_NUDGE,
			yOffset + (width / Y_TEXT_POS_SCALE) + Y_TEXT_NUDGE);
		context.restore();
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
			if (collisions.right) {
				this.pos.x = entity.worldBB.left - this.scaleDim.x;
				this.vel.x = 0;
			}
			if (collisions.left) {
				this.pos.x = entity.worldBB.right;
				this.vel.x = 0;
			}
		}
		if (entity instanceof StandingBreakBlock) {
			if (collisions.down) {
				entity.standOn();
			}
		}
    }

	/** @override */
	loadAnimations() {
		// Walking right
		this.animations[0] = new Animator(
			this.spritesheet, 0, 0, this.dim.x, this.dim.y, 8, 0.1, 0, true, true, true);
		// Walking left
		this.animations[1] = new Animator(
			this.spritesheet, 0, 0, this.dim.x, this.dim.y, 8, 0.1, 0, true, true, false);
		/*
		// Jumping right
		this.animations[0] = new Animator(
			this.spritesheet, 0, 128, this.dim.x, this.dim.y, 7, 0.25, 1, false, true, true);
		// Jumping left
		this.animations[1] = new Animator(
			this.spritesheet, 0, 128, this.dim.x, this.dim.y, 7, 0.25, 1, false, true, false);
		*/
	}

	/** @override */
	update() {
		const FALL_ACC = 1500;
		const WALK_SPEED = 300;
		const JUMP_VEL = 900;
		const TICK = this.game.clockTick;
		this.remainder = this.maxHealth - this.health;

		if (this.potionCounter > 0 && this.remainder > 20) {
			this.health += 20;
			this.potionCounter -= 1;
		}

		if (this.invincTime > 0) {
			this.invincTime -= this.game.clockTick;
			this.flashing = !this.flashing;
		} else {
			this.flashing = false;
		}

		if (!this.isJumping && this.game.B) { 
			this.vel.y = -JUMP_VEL;
			this.isJumping = true;
			AUDIO_PLAYER.playSound("./Audio/DruidJump.mp3");
			this.game.B = false;
		} else {
			this.vel.y += FALL_ACC * TICK;
		}

		// check if melee attack is made
		this.meleeAttack(this);
		// check if switch attack
		if (this.game.SHIFT == true && this.attackSelection != null) {
			this.attackSelection = (this.attackSelection + 1) % this.attacks.length;
			this.game.SHIFT = false;
        }
		// check if any special attack if made
		if (this.attackSelection != null) {
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
		this.drawBar(
			context, 10, 10, 30, 3,
			{ 
				current: this.health,
				max: this.maxHealth,
				name: "",
				tickWidth: 5
			},
			"DRUID", this.health / this.maxHealth <= 0.2 ? "red" : "green");
		this.drawBar(
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

		if (this.flashing) return;
		super.draw(context);

		/*
		if (this.vel.y > 0 || this.vel)
		this.animations[this.facing].drawFrame(
			this.game.clockTick, context,
			this.pos.x, this.pos.y,
			this.scale, this.game.camera);
		this.worldBB.display(this.game);
		this.agentBB.display(this.game);
		*/
	}
}