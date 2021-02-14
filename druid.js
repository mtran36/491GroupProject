/** 
 * Player character 
 */
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

		this.attacks = [];
		this.attacks.push(this.meleeAttack);
	}

	/**
	 * 
	 * @param {any} DRUID
	 */
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
	 * 
	 */
	rangedAttack() {
		this.rangeAttackCooldown -= this.game.clockTick;
		if (this.rangeAttackCooldown <= 0 && this.game.A) {
			if (this.facing === 0) { // shoot left
				this.game.addEntity(new RangeAttack(this.game,
					this.pos.x - PARAMS.TILE_WIDTH,
					this.pos.y + this.scaleDim.y / 2,
					this.facing));
			} else { // shoot right
				this.game.addEntity(new RangeAttack(this.game,
					this.pos.x + this.scaleDim.x,
					this.pos.y + this.scaleDim.y / 2,
					this.facing));
			}
			this.game.A = false;
			this.rangeAttackCooldown = 1;
		}
	}

	/**
	 * 
	 * @param {any} context
	 */
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

	/** @override */
	draw(context) {
		this.drawHealthBar(context);
		if (this.flashing) return;
		super.draw(context);
	}
}