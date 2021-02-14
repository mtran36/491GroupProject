class Items extends Agent {
    constructor(game, x, y, spritesheet) {
        super(game, x, y, spritesheet);
        this.emerging = false;
    }

    /** @override */
    update() {
        this.checkCollision();
    }

    //checkCollision() {
    //    const DRUID = this.game.druid;
    //    if (entity.worldBB && that.worldBB.collide(entity.worldBB)
    //        && that !== entity) {
    //        if (entity instanceof Ground) {
    //            if (that.vel.y > 0) {
    //                if (that.lastWorldBB.bottom <= entity.worldBB.top
    //                    && (that.lastWorldBB.left) < entity.worldBB.right
    //                    && (that.lastWorldBB.right) > entity.worldBB.left) { // falling dowm
    //                    that.pos.y = entity.worldBB.top - that.scaleDim.y;
    //                    that.vel.y = 0;
    //                }
    //            }
    //        }
    //    }

    //    if (this.worldBB.collide(DRUID.worldBB)) {
    //        this.removeFromWorld = true;
    //        this.addItemsToDruid(DRUID);
    //    }
    //}

    checkCollision() {
		let that = this;
		this.game.entities.forEach(function (entity) {
			if (entity.worldBB && that.worldBB.collide(entity.worldBB)
				&& that !== entity) {
				if (entity instanceof Ground || entity instanceof Door) {
					if (that.vel.y > 0) {
						if (that.lastWorldBB.bottom <= entity.worldBB.top
							&& (that.lastWorldBB.left) < entity.worldBB.right
							&& (that.lastWorldBB.right) > entity.worldBB.left) { // falling dowm
							that.pos.y = entity.worldBB.top - that.scaleDim.y;
							that.vel.y = 0;
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
				}
				// Temporary collision detection for key and door
				if (this.worldBB.collide(DRUID.worldBB)) {
					this.removeFromWorld = true;
					this.addItemsToDruid(DRUID);
				}
			}
		});
	}
}

class Potions extends Items {
    constructor(game, x, y) {
        super(game, x, y, "./Sprites/testpotion.png");
        //super(game, x, y, spriteSheetName);
        this.setDimensions(1, 32, 32);
    }

    /** @override */
    loadAnimations() {
        this.animations[0] = new Animator(
            this.spritesheet, 0, 0, 32, 32, 1, 1, 0, false, true, false);
    }

    /** @override */
    update() {
        const FALL_ACC = 1500;
        const TICK = this.game.clockTick;
        this.vel.y += FALL_ACC * TICK;
    }

    /** @override */
    updateBB() {
        super.updateBB();
    }
}