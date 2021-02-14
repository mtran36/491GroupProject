class Block extends Entity {
	constructor(game, x, y, width = 1, height = 1, spritesheet) {
		super(game, x, y, spritesheet);
		this.update = function () { /* Do nothing. */ };
	}

	/**
	 * Automatically sets the size of the tile to be equal to the tile width parameter 
	 * (you don't have to scale the block to the correct size). Use instead of setDimensions
	 * for block constructors.
	 * @param {number} width Number of tiles this block will cover horizontally from the origin.
	 * @param {number} height Number of tiles this block will cover vertically from the origin.
	 * @param {number} sideLen Length of one side of the block's graphic in pixels.
	 */
	setSize(width = 1, height = 1, sideLen) {
		this.size = {
			width: width,
			height: height
		};
		// Use algebra to find correct scale value
		this.setDimensions(PARAMS.TILE_WIDTH / sideLen, sideLen, sideLen);
    }

	/** @override */
	updateBB(context) {
		this.worldBB = new BoundingBox(
			this.pos.x, this.pos.y,
			this.size.width * this.scaleDim.x,
			this.size.height * this.scaleDim.y);
		this.lastWorldBB = this.worldBB;
	}

	/** @override */
	draw(context) {
		let col, row;
		for (col = 0; col < this.size.width; col++) {
			for (row = 0; row < this.size.height; row++) {
				context.drawImage(
					this.spritesheet, 0, 0, this.dim.x, this.dim.y,
					this.pos.x + col * this.scaleDim.x - this.game.camera.pos.x,
					this.pos.y + row * this.scaleDim.y - this.game.camera.pos.y,
					this.scaleDim.y, this.scaleDim.y);
			}
		}
		this.worldBB.display(this.game);
	}
}

class Ground extends Block {
	constructor(game, x, y, width, height) {
		super(game, x, y, width, height, "./Sprites/ground.png");
		this.setSize(width, height, 32);
		this.look = { x: 0, y: 0 };
	};

	/** @override */
	draw(context) {
		let col, row;
		for (col = 0; col < this.size.width; col++) {
			for (row = 0; row < this.size.height; row++) {
				this.pickLook(row, col);
				context.drawImage(
					this.spritesheet,
					this.look.x * this.dim.x, this.look.y * this.dim.y,
					this.dim.x, this.dim.y,
					this.pos.x + col * this.scaleDim.x - this.game.camera.pos.x,
					this.pos.y + row * this.scaleDim.y - this.game.camera.pos.y,
					this.scaleDim.y, this.scaleDim.y);
			}
		}
		this.worldBB.display(this.game);
	}

	/**
	 * Given the placement within the block group, picks the correct look for the ground
	 * block. Magic numbers in this method are related to the spritesheet, do not alter
	 * the positions of blocks already in the sheet.
	 * @param {number} row Vertical position of this block section.
	 * @param {number} col Horizontal position of this block sction.
	 */
	pickLook(row, col) {
		switch (row) {
			// Pick sprite column
			case 0:
				if (this.size.height === 1) {
					this.look.y = 8;
				} else {
					this.look.y = 0;
				}
				switch (col) {
					case 0:
						this.look.x = 0;
						break;
					case this.size.width - 1:
						this.look.x = 5;
						break;
					case 1:
						if (this.size.width === 3) {
							this.look.x = 6;
						} else {
							this.look.x = 1;
						}
						break;
					case this.size.width - 2:
						this.look.x = 4;
						break;
					default:
						if (col % 2 === 0) {
							this.look.x = 2;
						} else {
							this.look.x = 3;
						}
				}
				break;
			// Otherwise pick sprite row
			case this.size.height - 2:
				if (this.size.height === 3) {
					this.look.y = 6;
				} else {
					this.look.y = 4;
				}
				break;
			case this.size.height - 1:
				this.look.y = 5;
				break;
			default:
				if (row === 1) {
					this.look.y = 1;
				} else {
					if (row % 2 === 0) {
						this.look.y = 2;
					} else {
						this.look.y = 3;
					}
				}
		}
    }
}

class BreakBlock extends Block {
	constructor(game, x, y, width, height) {
		super(game, x, y, width, height, "");
		this.setSize(width, height, );
    }
}

class Mask extends Block {
	constructor(game, x, y, width, height) {
		super(game, x, y, width, height, "./Sprites/ground.png");
		this.setSize(width, height, 32);
	}

	/** @override */
	draw(context) {
		let col, row;
		for (col = 0; col < this.size.width; col++) {
			for (row = 0; row < this.size.height; row++) {
				context.drawImage(
					this.spritesheet, 64, 32, this.dim.x, this.dim.y,
					this.pos.x + col * this.scaleDim.x - this.game.camera.pos.x,
					this.pos.y + row * this.scaleDim.y - this.game.camera.pos.y,
					this.scaleDim.y, this.scaleDim.y);
			}
		}
		this.worldBB.display(this.game);
    }
}

class Key extends Entity {
	constructor(game, x, y) {
		super(game, x, y, "./Sprites/key.png");
		this.update = function () { };
	};

	/** @override */
	draw(context) {
		context.drawImage(this.spritesheet, 0, 0, 128, 128,
			this.pos.x - this.game.camera.pos.x, this.pos.y - this.game.camera.pos.y,
			this.dim.x, this.dim.y);
		this.worldBB.display(this.game);
	}
}

class Door extends Entity {
	constructor(game, x, y) {
		super(game, x, y, "./Sprites/door.png");
		this.setDimensions(1, PARAMS.TILE_WIDTH, PARAMS.TILE_WIDTH * 3);
		this.updateBB();
		this.update = function () { /* Do nothing. */ };
	};

	/** @override */
	draw(context) {
		context.drawImage(this.spritesheet, 0, 0, 128, 384,
			this.pos.x - this.game.camera.pos.x, this.pos.y - this.game.camera.pos.y,
			this.dim.x, this.dim.y);
		this.worldBB.display(this.game);
	}
}

class Minimap {
	constructor(game, x, y, width) {
		Object.assign(this, { game, x, y, width });
		this.update = function () { /* Do nothing */ };
	};

	draw(context) {
		let entity;
		context.save();
		context.strokeStyle = "Black";
		context.strokeRect(this.x, this.y, this.w, PARAMS.BLOCKWIDTH * 10);
		context.restore();
		this.game.druid.drawMinimap(context, this.x, this.y);
		for (entity = 0; entity < this.game.entities.length; entity++) {
			this.game.entities[entity].drawMinimap(context, this.x, this.y);
		}
	};
};

/**
 * Background entity with parallax scrolling. To make the horizontal parallax 
 * scrolling effect, we use three images leftImage, midImage, rightImage.
 */
class Background extends Entity {
	constructor(game, x, y, spriteSheetName, spriteWidth, spriteHeight, speedRate) {
		super(game, x, y, spriteSheetName);
		this.setDimensions(1, PARAMS.CANVAS_WIDTH, PARAMS.CANVAS_HEIGHT);

		/** Picture width (different backgrounds might have different ratios) */
		this.spriteWidth = spriteWidth;
		/** Picture length (different backgrounds might have different ratios) */
		this.spriteLength = spriteHeight;
		/** Background scrolling speed (different layers need different speeds) */
		this.speedRate = speedRate;
		this.speed = 0;

		/** Left to the camera */
		this.leftImagePos = { x: this.pos.x - PARAMS.CANVAS_WIDTH, y: y };
		/** At the camera position */
		this.midImagePos = { x: x, y: y };
		/** Right to the camera */
		this.rightImagePos = { x: this.pos.x + PARAMS.CANVAS_WIDTH, y: y };
	};

	/** @override */
	update() {
		if (this.game.druid.vel.x > 0) {
			this.speed = this.game.clockTick * this.speedRate;
		} else if (this.game.druid.vel.x < 0) {
			this.speed = this.game.clockTick * -this.speedRate;
		} else {
			this.speed = 0;
		}

		this.leftImagePos.x = this.leftImagePos.x + this.speed;
		this.midImagePos.x = this.midImagePos.x + this.speed;
		this.rightImagePos.x = this.rightImagePos.x + this.speed;

		// If camera reaches the left or right image, reposition the three images
		if (this.game.camera.pos.x >= this.rightImagePos.x) {
			this.leftImagePos = this.midImagePos;
			this.midImagePos = this.rightImagePos;
			this.rightImagePos = {
				x: this.midImagePos.x + PARAMS.CANVAS_WIDTH,
				y: this.midImagePos.y
			};	
		}else if (this.game.camera.pos.x <= this.leftImagePos.x) {
			this.rightImagePos = this.midImagePos;
			this.midImagePos = this.leftImagePos;
			this.leftImagePos = {
				x: this.midImagePos.x - PARAMS.CANVAS_WIDTH,
				y: this.midImagePos.y
			};	
        }
    }

	/** @override */
	draw(context) {
			// leftImage:
			context.drawImage(this.spritesheet, 0, 0, this.spriteWidth, this.spriteLength,
				this.leftImagePos.x - this.game.camera.pos.x + this.speed, this.leftImagePos.y,
				this.dim.x, this.dim.y);
			// midImage:
			context.drawImage(this.spritesheet, 0, 0, this.spriteWidth, this.spriteLength,
				this.midImagePos.x - this.game.camera.pos.x + this.speed, this.midImagePos.y,
				this.dim.x, this.dim.y);
			// rightImage:
			context.drawImage(this.spritesheet, 0, 0, this.spriteWidth, this.spriteLength,
				this.rightImagePos.x - this.game.camera.pos.x + this.speed, this.rightImagePos.y,
				this.dim.x, this.dim.y);
	}
}