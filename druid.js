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

		this.attacks = [];
		this.attacks.push(this.meleeAttack);
	}

	takeDamage(damage) {
		if (!PARAMS.DEBUG) {
			this.health -= damage;
			if (this.health <= 0) {
				this.removeFromWorld = true;
			}
			this.flashing = true;
		}
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
					that.invincTime = 1;
				}
			}
			if (entity.worldBB && that.worldBB.collide(entity.worldBB)
				&& that !== entity) {
				if (entity instanceof Ground || entity instanceof Door) {
					if (that.vel.y > 0 && that.lastWorldBB.bottom <= entity.worldBB.top
						&& (that.lastWorldBB.left) < entity.worldBB.right
						&& (that.lastWorldBB.right) > entity.worldBB.left) { // falling dowm
						that.pos.y = entity.worldBB.top - that.scaleDim.y;
						that.vel.y = 0;
						that.isJumping = false;
					}
					if (that.vel.y < 0 && (that.lastWorldBB.top) >= entity.worldBB.bottom
						&& (that.lastWorldBB.left) != entity.worldBB.right
						&& (that.lastWorldBB.right) != entity.worldBB.left) { // jumping up
						that.pos.y = entity.worldBB.bottom;
						that.vel.y = 0;
						that.isJumping = true;
					}
					if (that.vel.x < 0 && (that.lastWorldBB.left) >= entity.worldBB.right
						&& that.lastWorldBB.top != entity.worldBB.bottom
						&& that.lastWorldBB.bottom != entity.worldBB.top) { // going left
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
					entity.removeFromWorld = true;
				}
				if (entity instanceof Door) {
					if (that.hasKey == true) entity.removeFromWorld = true;
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

	/** @override */
	draw(context) {

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

		if (this.flashing) return;

		super.draw(context);
	}
}