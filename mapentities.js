class Block extends Entity {
	constructor(game, x, y, width = 1, height = 1, spritesheet) {
		super(game, x, y, spritesheet);
	}

	/** @override */
	update() {
		// Do nothing
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
					this.look.x * this.dim.x,
					this.look.y * this.dim.y,
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
			case 0:
				switch (col) {
					case 0:
						this.look.x = this.size.width === 1 ? 6 : 0;
						break;
					case this.size.width - 1:
						this.look.x = 5;
						break;
					case 1:
						this.look.x = this.size.width === 3 ? 6 : 1;
						break;
					case this.size.width - 2:
						this.look.x = 4;
						break;
					default:
						this.look.x = col % 2 === 0 ? 2 : 3;
				}
				this.look.y = this.size.height === 1 ? 8 : 0;
				break;
			case this.size.height - 2:
				this.look.y = this.size.height === 3 ? 6 : 4;
				break;
			case this.size.height - 1:
				this.look.y = 5;
				break;
			default:
				if (row === 1) {
					this.look.y = 1;
				} else {
					this.look.y = row % 2 === 0 ? 2 : 3;
				}
		}
    }
}

/**
 * Block that when the druid stands on begins breaking.
 * Will break after a set period of time.
 * Will respawn after a set period of time.
 */
class StandingBreakBlock extends Entity {
	constructor(game, x, y, width, height, blockType) {
		super(game, x, y, "./Sprites/crack.png");
		this.block;
		switch (blockType) {
			case 'Ground':
				this.block = new Ground(game, x, y, width, height);
				break;
		}
		this.worldBB = this.block.worldBB;
		this.width = this.block.scaleDim.x * this.block.size.width;
		this.height = this.block.scaleDim.y * this.block.size.height;
		this.collideTime = 0;
		this.minCrack = 0;
		this.breakTime = 1.5;
		this.vanishedTime = 0;
		this.respawnTime = 3;
		this.fakeWorldBB = new BoundingBox(this.x, this.y, 0, 0);
		this.druidOn = false;
	}

	/**
	 * Adds the block associated with this breaking block into the entity list.
	 * Should be called immediately after the constructor.
	 * Changes blocks draw method so that it will also call the draw method for this block.
	 */
	addBlock() {
		this.game.addEntity(this.block);
		this.block.oldDraw = this.block.draw;
		this.block.draw = (context) => {
			if (this.vanishedTime === 0) {
				this.block.oldDraw(context);
				this.drawCrack(context);
			}
		}
	}

	/** @override */
	update() {
		if (!this.druidOn) {
			this.collideTime -= this.game.clockTick;
			this.collideTime = Math.max(this.collideTime, 0);
		}
		this.druidOn = false;
		if (this.collideTime >= this.breakTime) {
			this.vanishedTime += this.game.clockTick;
			this.collideTime = 0;
			this.minCrack = 0.25;
			this.block.removeFromWorld = true;
		} else if (this.vanishedTime >= this.respawnTime) {
			this.block.removeFromWorld = false;
			this.game.entities.splice(this.game.entities.findIndex(
				(entity) => { entity === this; }), 0, this.block);
			this.vanishedTime = 0;
			this.updateBB();
		} else if (this.vanishedTime > 0) {
			this.vanishedTime += this.game.clockTick;
		}
	}

	/**
	 * Druid calls this if the druid is standing on this block.
	 */
	standOn() {
		this.druidOn = true;
		this.collideTime += this.game.clockTick;
		this.collideTime = Math.min(this.collideTime, this.breakTime);
	}

	/**
	 * Empty draw method.
	 * @param {any} context
	 */
	draw(context) {

	}

	/**
	 * Draws the crack texture.
	 * Crack texture size is based on the 
	 * Will be called by the block stored in this.block.
	 * @param {CanvasRenderingContext2D} context
	 */
	drawCrack(context) {
		let crackPercentage = this.collideTime / this.breakTime;
		crackPercentage = Math.max(this.minCrack, crackPercentage);
		let sourceWidth = 2000 * crackPercentage;
		let sourceHeight = 1238 * crackPercentage;
		let sourcePosX = (2000 - sourceWidth) / 2;
		let sourcePosY = (1238 - sourceHeight) / 2;
		let drawWidth = this.width * crackPercentage;
		let drawHeight = this.height * crackPercentage;
		let drawX = this.pos.x + (this.width - drawWidth) / 2;
		let drawY = this.pos.y + (this.height - drawHeight) / 2;
		context.drawImage(this.spritesheet, sourcePosX, sourcePosY,
				sourceWidth, sourceHeight,
				drawX - this.game.camera.pos.x,
				drawY - this.game.camera.pos.y,
				drawWidth, drawHeight);
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
			this.pos.x - this.game.camera.pos.x,
			this.pos.y - this.game.camera.pos.y,
			this.dim.x, this.dim.y);
		this.worldBB.display(this.game);
	}
}

class Minimap extends Entity {
	constructor(game, x, y, width) {
		super(game, x, y);
		this.width = width;
		this.update = function () {  };
	};

	draw(context) {
		const SCALE = 16;
		const PIP_SIDE_LEN = 4;
		let that = this, entity;

		context.save();
		context.strokeStyle = "black";
		context.lineWidth = 3;
		context.strokeRect(this.pos.x, this.pos.y, this.width, this.width);
		this.game.entities.forEach(function (entity) {
			context.fillStyle = entity.mapPipColor;
			let x = that.pos.x + (entity.pos.x - that.game.camera.pos.x) / SCALE;
			let y = that.pos.y + (entity.pos.y - that.game.camera.pos.y) / SCALE;
			if (x > that.pos.x
				&& y > that.pos.y
				&& y < that.pos.y + that.width
				&& x < that.pos.x + that.width) {
				context.fillRect(x, y, PIP_SIDE_LEN, PIP_SIDE_LEN);
			}
		});
		context.restore();
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
		this.leftImagePos = { x: this.pos.x - PARAMS.CANVAS_WIDTH, y: y - 300};
		/** At the camera position */
		this.midImagePos = { x: x, y: y - 300};
		/** Right to the camera */
		this.rightImagePos = { x: this.pos.x + PARAMS.CANVAS_WIDTH, y: y - 300};
	};

	/** @override */
	update() {
		if (this.game.druid.vel.x > 0) {
			this.speed = this.game.clockTick * -this.speedRate;
		} else if (this.game.druid.vel.x < 0) {
			this.speed = this.game.clockTick * this.speedRate;
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
				this.dim.x, this.dim.y + 300);
			// midImage:
			context.drawImage(this.spritesheet, 0, 0, this.spriteWidth, this.spriteLength,
				this.midImagePos.x - this.game.camera.pos.x + this.speed, this.midImagePos.y,
				this.dim.x, this.dim.y + 300);
			// rightImage:
			context.drawImage(this.spritesheet, 0, 0, this.spriteWidth, this.spriteLength,
				this.rightImagePos.x - this.game.camera.pos.x + this.speed, this.rightImagePos.y,
				this.dim.x, this.dim.y + 300);
	}
}