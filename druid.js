/** 
 * Player character 
 */
class Druid extends Agent {
	constructor(game, x, y) {
		super(game, x, y, "./Sprites/druid.png");
		this.setDimensions(1, 97, 157);
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
		if (!PARAMS.DEBUG) {
			this.health -= damage;
			if (this.health <= 0) {
				this.health = 0;
				this.vel.x = 0;
				this.removeFromWorld = true;
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
		if (this.flashing) return;
		super.draw(context);
	}
}