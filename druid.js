/** 
 * Player character 
 */
class Druid extends Agent {
	constructor(game, x, y) {
		super(game, x, y, "./Sprites/druidmerge.png");
		this.setDimensions(1, 176, 128);
		// Jump fields
		this.isJumping = false; 
		// Resource fields
		this.maxHealth = 60;
		this.maxMana = 60;
		this.health = this.maxHealth;
		this.mana = this.maxMana;
		this.lastHealth = this.health;
		this.lastMana = this.mana;
		this.casting = false;
		// Taking damage fields
		this.flashing = false;
		this.invincDuration = 0;
		// Item counting fields
		this.hasSword = true;
		this.keyCounter = 0;
		this.potionCounter = 0;
		this.maxPotions = 10;
		this.items = [];
		this.itemSelection = 0;
		// UI data fields
		this.mapPipColor = COLORS.HEALTH_GREEN;
		this.origin = {
			x: 117,
			y: 7,
			offset: 2,
			width: 20
		};
		this.xFrameOffset = 45;
		this.currentOffset = this.xFrameOffset;
		this.minimap = new Minimap(game, this.origin.y, this.origin.y, 100);
		// Attack data fields
		this.knockbackDuration = 0;
		this.meleeCooldown = 0;
		this.meleeDuration = 0;
		this.attackSelection = null;
		this.attacks = [];
		// Finish initialization
		this.loadAnimations();
		this.updateBoundingShapes();
		this.updateBackgroundGradient();
		this.updateHealthGradient();
		this.updateManaGradient();
	}

	static construct(game, params) {
		let x = params.x * PARAMS.TILE_WIDTH, y = params.y * PARAMS.TILE_WIDTH;
		game.addEntity(game.druid);
		game.druid.pos = { x: x, y: y };
		game.druid.updateBoundingShapes();
    }

	updateBoundingShapes() {
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
		this.knockbackDuration = 2;
	}

	updateBackgroundGradient() {
		let max = Math.max(this.maxHealth, this.maxMana);
		this.backgroundGradient = this.game.context.createLinearGradient(
			this.origin.x, this.origin.y,
			this.origin.x + max * 5 + this.origin.offset * 3,
			this.origin.y + this.origin.width * 2 + this.origin.offset * 5);
		this.backgroundGradient.addColorStop(0, COLORS.FRAME_BROWN);
		this.backgroundGradient.addColorStop(0.5, COLORS.FRAME_TAN);
		this.backgroundGradient.addColorStop(1, COLORS.FRAME_BROWN);
    }

	updateHealthGradient() {
		this.healthGradient = this.game.context.createLinearGradient(
			this.origin.x, this.origin.y,
			this.origin.x + this.health * 5 + this.origin.offset * 3,
			this.origin.y + this.origin.width * 2 + this.origin.offset * 5);
		this.healthGradient.addColorStop(0, COLORS.LIGHT_HEALTH_GREEN);
		this.healthGradient.addColorStop(1, COLORS.HEALTH_GREEN);

		this.lowHealthGradient = this.game.context.createLinearGradient(
			this.origin.x, this.origin.y,
			this.origin.x + this.health * 5 + this.origin.offset * 3,
			this.origin.y + this.origin.width * 2 + this.origin.offset * 5);
		this.lowHealthGradient.addColorStop(0, COLORS.LIGHT_HEALTH_RED);
		this.lowHealthGradient.addColorStop(1, COLORS.HEALTH_RED);
	}

	updateManaGradient() {
		this.manaGradient = this.game.context.createLinearGradient(
			this.origin.x, this.origin.y,
			this.origin.x + this.mana * 5 + this.origin.offset * 3,
			this.origin.y + this.origin.width * 2 + this.origin.offset * 5);
		this.manaGradient.addColorStop(0, COLORS.LIGHT_LAPIS);
		this.manaGradient.addColorStop(1, COLORS.LAPIS);

		this.lowManaGradient = this.game.context.createLinearGradient(
			this.origin.x, this.origin.y,
			this.origin.x + this.mana * 5 + this.origin.offset * 3,
			this.origin.y + this.origin.width * 2 + this.origin.offset * 5);
		this.lowManaGradient.addColorStop(0, COLORS.MANA_PURPLE);
		this.lowManaGradient.addColorStop(1, "indigo");
	}

	/** @override */
	takeDamage(damage) {
		if (!PARAMS.DEBUG && this.invincDuration <= 0) {
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
		if (this.invincDuration <= 0) {
			this.invincDuration = 1;
			this.flashing = true;
		}
	}

	/** @override */
	defineAgentCollisions(entity) {
		if (entity instanceof Door) {
			if (this.keyCounter > 0) {
				entity.removeFromWorld = true;
				this.keyCounter -= 1;
			}
		}
	}

	/** @override */
	defineAgentCollisions(entity) {
		// Do nothing
	}

	/** @override */
	defineWorldCollisions(entity, collisions) {
		let x = this.worldBB.x;
		let y = this.worldBB.y;

		if (entity instanceof Ground
			|| entity instanceof Wood
			|| entity instanceof Door
			|| entity instanceof Leaves) {
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
				entity.open = true;
				AUDIO_PLAYER.playSound("./Audio/DoorOpen.mp3");
				this.keyCounter--;
				this.items.splice(this.items.findIndex((a) => {
					return a instanceof Key;
				}), 1);
			}
			this.knockbackDuration = 0;
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
		let i, druidCenter;

		// Change health bar
		if (this.invincDuration > 0) {
			this.invincDuration -= this.game.clockTick;
			this.flashing = !this.flashing;
		} else {
			this.flashing = false;
		}
		if (this.lastHealth != this.health) {
			this.updateHealthGradient();
		}
		this.lastHealth = this.health;
		// Mana regeneration
		this.lastMana = this.mana;
		if (this.mana < this.maxMana) {
			if (this.vel.x != 0 || this.vel.y != 0) {
				this.mana += 0.08;
			} else {
				this.mana += 0.26;
			}
		}
		if (this.mana > this.maxMana) {
			this.mana = this.maxMana;
		}
		if (this.mana != this.maxMana) {
			this.updateManaGradient();
		}
		if (this.lastMana != this.mana && this.mana == this.maxMana) {
			AUDIO_PLAYER.playSound("./Audio/DruidManaFull.wav");
        }
		// Knockback
		this.knockbackDuration -= TICK;
		// Movement
		if (this.game.right && this.knockbackDuration < 0) {
			this.animations[0][0] = this.storedAnimations.walkingRight;
			this.animations[1][0] = this.storedAnimations.walkingLeft;
			this.vel.x = WALK_SPEED;
		}
		if (this.game.left && this.knockbackDuration < 0) {
			this.animations[0][0] = this.storedAnimations.walkingRight;
			this.animations[1][0] = this.storedAnimations.walkingLeft;
			this.vel.x = -WALK_SPEED;
		}
		if (!this.game.left && !this.game.right && this.knockbackDuration < 0) {
			this.animations[0][0] = this.storedAnimations.standingRight;
			this.animations[1][0] = this.storedAnimations.standingLeft;
			this.vel.x = 0;
		}
		// Potion counter
		if (this.potionCounter > 0 && this.maxHealth - this.health > 20) {
			this.health += 20;
			this.potionCounter -= 1;
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
			AUDIO_PLAYER.playSound("./Audio/DruidJump.wav");
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
		// Melee attack
		this.meleeCooldown -= this.game.clockTick;
		druidCenter = this.worldBB.centerPoint();
		if (this.meleeCooldown <= 0 && this.game.C && this.hasSword) {
			this.game.addEntity(new SwordAttack(
				this.game, druidCenter.x, druidCenter.y, this.facing));
			this.game.C = false;
			this.meleeCooldown = 0.5;
		}
		// Check if player is casting spells
		if (this.attackSelection != null) {
			for (i = 0; i < this.attacks.length; i++) {
				this.attacks[i].updateCooldown();
			}
			this.attacks[this.attackSelection].attack(this);
		}
		// Check if player is switching spells
		if (this.game.SHIFT === true && this.attackSelection != null) {
			this.attackSelection = (this.attackSelection + 1) % this.attacks.length;
			this.game.SHIFT = false;
		}
		this.move(TICK);
		// when casting thunder attack
		if (this.casting) this.facing = this.castFacing;
	}

	/** @override */
	draw(context) {
		let max = Math.max(this.maxHealth, this.maxMana);
		context.save();
		// Draw minimap
		this.minimap.draw(context);
		// Outer black border of bars
		context.fillStyle = "black";
		context.fillRect( 
			this.origin.x, this.origin.y,
			max * 5 + this.origin.offset * 5,
			this.origin.width * 2 + this.origin.offset * 7);
		// Bars background gradient
		context.fillStyle = this.backgroundGradient;
		context.fillRect( 
			this.origin.x + this.origin.offset,
			this.origin.y + this.origin.offset,
			max * 5 + this.origin.offset * 3,
			this.origin.width * 2 + this.origin.offset * 5);
		// Health bar
		HUD.drawBar(context, 
			this.origin.x + this.origin.offset * 2,
			this.origin.y + this.origin.offset * 2,
			this.origin.width, this.origin.offset,
			{ current: this.health, max: this.maxHealth, name: "", tickWidth: 5 }, "DRUID",
			this.health / this.maxHealth <= 0.2 ?
				this.lowHealthGradient : this.healthGradient,
			this.health / this.maxHealth <= 0.2 ?
				COLORS.HEALTH_RED : COLORS.HEALTH_GREEN);
		if (this.attacks[this.attackSelection]) {
			// Mana bar
			HUD.drawBar(context,
				this.origin.x + this.origin.offset * 2,
				this.origin.y + this.origin.offset * 4 + this.origin.width,
				this.origin.width, this.origin.offset,
				{ current: this.mana, max: this.maxMana, name: "", tickWidth: 5 }, "MANA",
				this.mana < this.attacks[this.attackSelection].cost - 1 ?
					this.lowManaGradient : this.manaGradient,
				this.mana < this.attacks[this.attackSelection].cost - 1 ?
					"indigo" : COLORS.LAPIS);
			// Powerup UI
			HUD.drawPowerupUI(context, 117, 63, this.attacks, this.attackSelection, this);
		}
		// Druid frame selection
		if (this.flashing) {
			context.restore();
			return;
		}
		this.animations[this.facing][this.isJumping ? 1 : 0].drawFrame(
			this.game.clockTick, context,
			this.pos.x, this.pos.y,
			this.scale, this.game.camera, this.xFrameOffset);
		// Draw bounding shapes
		this.worldBB.display(this.game);
		this.agentBB.forEach((BB) => {
			BB.display(this.game);
		});
		context.restore();
	}
}