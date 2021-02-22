/** 
 * Player character 
 */
class Druid extends Agent {
	constructor(game, x, y) {
		super(game, x, y, "./Sprites/druidmerge.png");
		this.setDimensions(1, 176, 128);
		this.worldBB = new BoundingBox(
			this.pos.x + 65, this.pos.y + 23, this.scaleDim.x - 120, this.scaleDim.y - 23)
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
		this.animations[0][0] = new Animator( // Walking right
			this.spritesheet, 0, 0, this.dim.x, this.dim.y, 8, 0.1, 0, true, true, true);
		this.animations[1][0] = new Animator( // Walking left
			this.spritesheet, 0, 0, this.dim.x, this.dim.y, 8, 0.1, 0, true, true, false);
		this.animations[0][1] = new Animator( // Jumping right
			this.spritesheet, 0, 128, this.dim.x, this.dim.y, 7, 0.1, 0, false, true, true);
		this.animations[1][1] = new Animator( // Jumping left
			this.spritesheet, 0, 128, this.dim.x, this.dim.y, 7, 0.1, 0, false, true, false);
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
			AUDIO_PLAYER.playSound("./Audio/DruidJump.mp3");
			this.game.B = false;
		} else {
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