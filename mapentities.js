class Block extends Entity {
	constructor(game, x, y, width = 1, height = 1, spritesheet) {
		super(game, x, y, spritesheet);
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
		this.worldBB = new BoundingBox(
			this.pos.x, this.pos.y,
			width * sideLen * this.scale,
			height * sideLen * this.scale);
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

	/** @override */
	update() {
		// Do nothing
	}
}

class Tree extends Block {
	constructor(game, x, y, width = 3, height = 8, xOffset = 0, yOffset = 0) {
		super(game, x, y, width, height, "./Sprites/tree.png");
		Object.assign(this, { xOffset, yOffset });
		this.setSize(width, height, 59);
		this.hidden = true;
	}

	static construct(game, params) {
		game.addEntity(new Tree(game,
			params.x * PARAMS.TILE_WIDTH,
			params.y * PARAMS.TILE_WIDTH,
			params.width, params.height));
	}

	/** @override */
	draw(context) {
		let col, row;
		for (col = this.xOffset; col < this.size.width + this.xOffset; col++) {
			for (row = this.yOffset; row < this.size.height + this.yOffset; row++) {
				context.drawImage(this.spritesheet,
					col * this.dim.x, row * this.dim.y, this.dim.x, this.dim.y,
					this.pos.x + col * this.scaleDim.x -
						this.game.camera.pos.x - this.xOffset * PARAMS.TILE_WIDTH,
					this.pos.y + row * this.scaleDim.y -
						this.game.camera.pos.y - this.yOffset * PARAMS.TILE_WIDTH,
					this.scaleDim.x, this.scaleDim.y);
			}
		}
		this.worldBB.display(this.game);
	}
}

class TreeTrunk extends Tree {
	constructor(game, x, y, height = 6) {
		super(game, x, y, 3, height, 3, 0);
	}

	static construct(game, params) {
		game.addEntity(new TreeTrunk(game,
			params.x * PARAMS.TILE_WIDTH,
			params.y * PARAMS.TILE_WIDTH,
			params.width, params.height));
    }
}

class Branch extends Tree {
	constructor(game, x, y, type = 0, isDark = 0) {
		super(game, x, y);
		Object.assign(this, { type, isDark });

		this.pickLook();
	}

	static construct(game, params) {
		game.addEntity(new Branch(game,
			params.x * PARAMS.TILE_WIDTH,
			params.y * PARAMS.TILE_WIDTH,
			params.type, params.isDark));
	}

	pickLook() {
		switch (this.type) {
			case 0:
				this.size.height = 2;
				this.size.width = 1;
				this.xOffset = 6;
				this.yOffset = 0;
				break;
			case 1:
				this.size.height = 2;
				this.size.width = 1;
				this.xOffset = 7;
				this.yOffset = 0;
				break;
			case 2:
				this.size.height = 2;
				this.size.width = 1;
				this.xOffset = 8;
				this.yOffset = 0;
				break;
			case 3:
				this.size.height = 1;
				this.size.width = 2;
				this.xOffset = 7;
				this.yOffset = 2;
				break;
			case 4:
				this.size.height = 3;
				this.size.width = 1;
				this.xOffset = 9;
				this.yOffset = 0;
				break;
			case 5:
				this.size.height = 2;
				this.size.width = 2;
				this.xOffset = 10;
				this.yOffset = 0;
				break;
		}
		if (!this.isDark) {
			this.yOffset += 3;
        }
	}
}

class Leaves extends Tree {
	constructor(game, x, y, type = 0) {
		super(game, x, y);

		this.type = type;
		this.pickLook();
	}

	static construct(game, params) {
		game.addEntity(new Leaves(game,
			params.x * PARAMS.TILE_WIDTH,
			params.y * PARAMS.TILE_WIDTH,
			params.type));
	}

	pickLook() {
		switch (this.type) {
			case 0:
				this.size.width = 4;
				this.size.height = 2;
				this.xOffset = 3;
				this.yOffset = 6;
				break;
			case 1:
				this.size.width = 4;
				this.size.height = 2;
				this.xOffset = 3;
				this.yOffset = 8;
				break;
			case 2:
				this.size.width = 2;
				this.size.height = 2;
				this.xOffset = 7;
				this.yOffset = 6;
				break;
			case 3:
				this.size.width = 2;
				this.size.height = 2;
				this.xOffset = 7;
				this.yOffset = 8;
				break;
			case 4:
				this.size.width = 2;
				this.size.height = 2;
				this.xOffset = 9;
				this.yOffset = 6;
				break;
        }
	}
}

class Ground extends Block {
	constructor(game, x, y, width, height) {
		super(game, x, y, width, height, "./Sprites/ground.png");
		this.setSize(width, height, 32);
		this.setBoundingBox();
		
		this.look = { x: 0, y: 0 };
	};

	static construct(game, params) {
		game.addEntity(new Ground(game,
			params.x * PARAMS.TILE_WIDTH,
			params.y * PARAMS.TILE_WIDTH,
			params.width, params.height));
	}

	setBoundingBox() {
		if (this.size.height > 1) {
			this.worldBB = new BoundingBox(
				this.pos.x + PARAMS.TILE_WIDTH - 15,
				this.pos.y,
				this.size.width * PARAMS.TILE_WIDTH - PARAMS.TILE_WIDTH - 35,
				this.size.height * PARAMS.TILE_WIDTH - PARAMS.TILE_WIDTH + 15);
		} else if (this.size.height = 1) {
			this.worldBB = new BoundingBox(
				this.pos.x + 10, this.pos.y,
				this.size.width * PARAMS.TILE_WIDTH - 20,
				this.size.height * PARAMS.TILE_WIDTH - 20);
		}
	}

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

class Mask extends Block {
	constructor(game, x, y, width, height) {
		super(game, x, y, width, height, "./Sprites/ground.png");
		this.setSize(width, height, 32);
		this.hidden = true;
	}

	static construct(game, params) {
		game.addEntity(new Mask(game,
			PARAMS.TILE_WIDTH * params.x,
			PARAMS.TILE_WIDTH * params.y,
			params.width, params.height));
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

class Mesh extends Ground {
	constructor(game, x, y, width, height) {
		super(game, x, y, width, height);
		this.spritesheet = ASSET_LOADER.getImageAsset("./Sprites/transparency.png");
	}

	static construct(game, params) {
		game.addEntity(new Mesh(game,
			params.x * PARAMS.TILE_WIDTH,
			params.y * PARAMS.TILE_WIDTH,
			params.width, params.height));
	}

	/** @override */
	setBoundingBox() {
		// Do nothing
    }

	/** @override */
	pickLook(row, col) {
		// Do nothing
	}
}

/**
 * Superclass for breakable blocks.
 */
class BreakBlock extends Entity {
	constructor(game, x, y, width, height, blockType) {
		super(game, x, y, "./Sprites/crack.png");
		this.block;
		switch (blockType) {
			case 'Ground':
				this.block = new Ground(game, x, y, width, height);
				break;
		}
		this.worldBB = this.block.worldBB;
		this.width = this.block.worldBB.right - this.block.worldBB.left;
		this.height = this.block.worldBB.bottom - this.block.worldBB.top;
		this.exists = true;
		this.collisionAmount = 0;
		this.breakPoint = 1;
		this.minCrack = 0;
		this.hidden = true;
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
			if (this.exists) {
				this.block.oldDraw(context);
				this.drawCrack(context);
			}
		}
	}

	/**
	 * Draws the crack texture.
	 * Crack texture size is based on the the amount of time the druid has been standing
	 * on the block. Crack is drawn on top of the worldBB box of this.block.
	 * Will be called by the block stored in this.block.
	 * @param {CanvasRenderingContext2D} context
	 */
	drawCrack(context) {
		let crackPercentage = this.collisionAmount / this.breakPoint;
		crackPercentage = Math.max(this.minCrack, crackPercentage);
		let sourceWidth = 2000 * crackPercentage;
		let sourceHeight = 1238 * crackPercentage;
		let sourcePosX = (2000 - sourceWidth) / 2;
		let sourcePosY = (1238 - sourceHeight) / 2;
		let drawWidth = this.worldBB.width * crackPercentage;
		let drawHeight = this.worldBB.height * crackPercentage;
		let drawX = this.worldBB.x + (this.worldBB.width - drawWidth) / 2;
		let drawY = this.worldBB.y + (this.worldBB.height - drawHeight) / 2;
		context.drawImage(this.spritesheet, sourcePosX, sourcePosY,
				sourceWidth, sourceHeight,
				drawX - this.game.camera.pos.x,
				drawY - this.game.camera.pos.y,
				drawWidth, drawHeight);
	}

	/** @override */
	draw(context) {
		// Do nothing
	}
}

/**
 * Block that breaks over time as the druid stands on it.
 * Will break after a set period of time.
 * Will respawn after a set period of time.
 */
class StandingBreakBlock extends BreakBlock {
	constructor(game, x, y, width, height, blockType) {
		super(game, x, y, width, height, blockType);
		this.breakPoint = 1.5;
		this.vanishedTime = 0;
		this.respawnTime = 3;
		this.druidOn = false;
	}

	/**
	* Druid entity should call this when standing on a block of this class.
	*/
	standOn() {
		this.druidOn = true;
		this.collisionAmount += this.game.clockTick;
		this.collisionAmount = Math.min(this.collisionAmount, this.breakPoint);
	}

	/** @override */
	update() {
		if (!this.druidOn) {
			this.collisionAmount -= this.game.clockTick;
			this.collisionAmount = Math.max(this.collisionAmount, 0);
		}
		this.druidOn = false;
		if (this.collisionAmount >= this.breakPoint) {
			this.vanishedTime += this.game.clockTick;
			this.collisionAmount = 0;
			this.minCrack = 0.25;
			this.block.removeFromWorld = true;
			this.exists = false;
		} else if (this.vanishedTime >= this.respawnTime) {
			this.block.removeFromWorld = false;
			this.game.entities.splice(this.game.entities.findIndex((entity) => {
				entity === this;
			}), 0, this.block);
			this.vanishedTime = 0;
			this.exists = true;
		} else if (this.vanishedTime > 0) {
			this.vanishedTime += this.game.clockTick;
		}
	}

	static construct(game, params) {
		let standingBreakBlock = new StandingBreakBlock(game,
			params.x * PARAMS.TILE_WIDTH,
			params.y * PARAMS.TILE_WIDTH,
			params.width, params.height,
			params.blockType);
		game.addEntity(standingBreakBlock);
		standingBreakBlock.addBlock();
    }
}

/**
 * Block that breaks as the player hits it with attacks. 
 */
class HitBreakBlock extends BreakBlock {
	constructor(game, x, y, width, height, blockType) {
		super(game, x, y, width, height, blockType);
		this.hitStep = 0.25;
		this.minCrack = 0.1;
		this.lingerTime = 0.05;
	}

	/**
	 * Breaks the block by an amount equal to the damage number times the hitStep of
	 * this block.
	 * For example a damage of 1 and a hitstep of 0.25 will cause the block to increase
	 * its break by a quarter.
	 * @param {number} damage
	 */
	hitBlock(damage) {
		this.collisionAmount += damage * this.hitStep;
	}

	/** @override */
	update() {
		if (this.lingerTime < 0) {
			this.block.removeFromWorld = true;
			this.removeFromWorld = true;
		}
		if (this.collisionAmount >= this.breakPoint) {
			this.lingerTime -= this.game.clockTick;
		}
	}

	static construct(game, params) {
		let hitBreakBlock = new HitBreakBlock(game,
			params.x * PARAMS.TILE_WIDTH,
			params.y * PARAMS.TILE_WIDTH,
			params.width, params.height,
			params.blockType);
		game.addEntity(hitBreakBlock);
		hitBreakBlock.addBlock();
	}
}

class Door extends Entity {
	constructor(game, x, y) {
		super(game, x, y, "./Sprites/door.png");
		this.setDimensions(1, PARAMS.TILE_WIDTH, PARAMS.TILE_WIDTH * 3);
	};

	static construct(game, params) {
		game.addEntity(new Door(game,
			params.x * PARAMS.TILE_WIDTH,
			params.y * PARAMS.TILE_WIDTH,));
	}

	/** @override */
	draw(context) {
		context.drawImage(this.spritesheet, 0, 0, 128, 384,
			this.pos.x - this.game.camera.pos.x,
			this.pos.y - this.game.camera.pos.y,
			this.dim.x, this.dim.y);
		this.worldBB.display(this.game);
	}

	/** @override */
	update(context) {
		// Do nothing
	}
}

class Minimap extends Entity {
	constructor(game, x, y, width) {
		super(game, x, y);
		this.width = width;
	};

	draw(context) {
		const SCALE = 16;

		context.save();
		context.strokeStyle = "black";
		context.lineWidth = 3;
		context.strokeRect(this.pos.x - 2, this.pos.y - 2, this.width + 4, this.width + 4);
		this.game.entities.forEach((entity) => {
			if (entity.hidden || entity instanceof Effect) return;
			context.fillStyle = entity.mapPipColor;
			let x = this.pos.x + (entity.pos.x - this.game.camera.pos.x) / SCALE;
			let width = entity.worldBB.width / SCALE;
			let y = this.pos.y + (entity.pos.y - this.game.camera.pos.y) / SCALE;
			let height = entity.worldBB.height / SCALE;
			if (x < this.pos.x) {
				width -= this.pos.x - x;
				x = this.pos.x;
			} else if (x > this.pos.x + this.width) {
				width = 0;
			} else if (width > this.width - (x - this.pos.x)) {
				width = this.width - (x - this.pos.x); 
			}
			if (y < this.pos.y) {
				height -= this.pos.y - y;
				y = this.pos.y;
			} else if (y > this.pos.y + this.width) {
				height = 0;
			} else if (height > this.width - (y - this.pos.y)) {
				height = this.width - (y - this.pos.y);
			}
			if (width < 0) width = 0;
			if (height < 0) height = 0;
			if (width > this.width) width = this.width;
			if (height > this.height) height = this.width;
			context.fillRect(x, y, width, height);
		});
		context.restore();
	};

	/** @override */
	update(context) {
		// Do nothing
	}
};

/**
 * Background entity with parallax scrolling. To make the horizontal parallax 
 * scrolling effect, we use three images leftImage, midImage, rightImage.
 */
class Background extends Entity {
	constructor(game, spriteSheetName, spriteWidth, spriteHeight, speedRate) {
		super(game, game.camera.pos.x, game.camera.pos.y, spriteSheetName);
		this.setDimensions(1, PARAMS.CANVAS_WIDTH, PARAMS.CANVAS_HEIGHT);
		
		this.speed = 0;
		/** Picture width (different backgrounds might have different ratios) */
		this.spriteWidth = spriteWidth;
		/** Picture length (different backgrounds might have different ratios) */
		this.spriteLength = spriteHeight;
		/** Background scrolling speed (different layers need different speeds) */
		this.speedRate = speedRate;
		/** Left to the camera */
		this.leftImagePos = {
			x: this.pos.x - PARAMS.CANVAS_WIDTH,
			y: this.game.camera.pos.y - 300
		};
		/** At the camera position */
		this.midImagePos = {
			x: this.game.camera.pos.x,
			y: this.game.camera.pos.y - 300
		};
		/** Right to the camera */
		this.rightImagePos = {
			x: this.pos.x + PARAMS.CANVAS_WIDTH,
			y: this.game.camera.pos.y - 300
		};
	};

	static construct(game, params) {
		game.addEntity(new Background(game,
			params.spriteSheetName,
			params.spriteWidth, params.spriteHeight,
			params.speedRate));
	}

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
		} else if (this.game.camera.pos.x <= this.leftImagePos.x) {
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
		context.drawImage(this.spritesheet, 0, 0,
			this.spriteWidth, this.spriteLength,
			this.leftImagePos.x - this.game.camera.pos.x + this.speed, 
			this.leftImagePos.y,
			this.dim.x, this.dim.y + 300);
		// midImage:
		context.drawImage(this.spritesheet, 0, 0,
			this.spriteWidth, this.spriteLength,
			this.midImagePos.x - this.game.camera.pos.x + this.speed,
			this.midImagePos.y,
			this.dim.x, this.dim.y + 300);
		// rightImage:
		context.drawImage(this.spritesheet, 0, 0,
			this.spriteWidth, this.spriteLength,
			this.rightImagePos.x - this.game.camera.pos.x + this.speed,
			this.rightImagePos.y,
			this.dim.x, this.dim.y + 300);
	}
}

class Effect {
	constructor(game, x, y, animation, existTime = 1, scale) {
		this.game = game;
		this.pos = {
			x: x,
			y: y
		};
		this.animation = animation;
		this.existTime = existTime;
		this.scale = scale;
	}

	update() {
		this.existTime -= this.game.clockTick;
		if (this.existTime <= 0) this.removeFromWorld = true;
	}

	draw(context) {
		this.animation.drawFrame(
			this.game.clockTick, context, this.pos.x, this.pos.y, this.scale, this.game.camera);
    }
}