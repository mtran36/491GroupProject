/**
 * Displays the word pause on a black background. Pauses game and audio when pause
 * is pressed.
 */
class PauseScreen {
    constructor(game) {
        this.game = game;
        this.style = { fill: 'white', stroke: 'red' };
        this.pausePressed = false;
        this.screen = false;
        this.game.canvas.addEventListener('keydown', (e) => {
            switch (e.code) {
                case "KeyP":
                case "Escape":
                    if (!this.pausePressed) {
                        this.pausePressed = true;
                        if (this.game.screen === this) {
                            this.game.screen = this.screen;
                            this.screen = false;
                        } else {
                            this.screen = this.game.screen;
                            this.game.screen = this;
                        }
                    }
                    break;
            }
        })
        this.game.canvas.addEventListener('keyup', (e) => {
            switch (e.code) {
                case "KeyP":
                case "Escape":
                    this.pausePressed = false;
                    break;
            }
        });
    }

    /**
     * Display the pause screen.
     * @param {CanvasRenderingContext2D} context
     */
    display(context) {
        AUDIO_PLAYER.pauseMusic();
        AUDIO_PLAYER.pauseSounds();
        context.save();
        context.fillStyle = 'black';
        if (this.style.fill) {
            context.fillStyle = this.style.fill;
        }
        if (this.style.stroke) {
            context.strokeStyle = this.style.stroke;
        }
        context.font = "bold 64px sans-serif";
        context.fillText("Paused", PARAMS.CANVAS_WIDTH / 2 - 200, PARAMS.CANVAS_HEIGHT / 2);
        context.strokeText("Paused", PARAMS.CANVAS_WIDTH / 2 - 200, PARAMS.CANVAS_HEIGHT / 2);
        context.restore();
    }
}

/**
 * Start screen for the game. Displays the words click to start on a black background.
 * Game starts when canvas is clicked.
 */
class StartScreen {
    constructor(game) {
        this.game = game;
        this.style = { fill: 'white', stroke: 'red' };
        // Start upon first load.
        let clickStart = (e) => {
            this.game.canvas.removeEventListener('click', clickStart);
            this.game.canvas.removeEventListener('keydown', clickStart);
            this.game.camera.loadLevel(levelOne, 15, 115);
            this.game.start();
        };
        this.game.canvas.addEventListener('click', clickStart);
        this.game.canvas.addEventListener('keydown', clickStart);
        // Start after reset, win, or lose.
        this.game.canvas.addEventListener('click', (e) => {
            if (this.game.screen === this) {
                this.game.camera.loadLevel(levelOne, 15, 115);
                this.game.screen = false;
            }
        });
        this.game.canvas.addEventListener('keydown', (e) => {
            if (this.game.screen === this) {
                this.game.camera.loadLevel(
                    levelOne, 15, 115);
                this.game.screen = false;
            }
        });
        this.display(this.game.context);
    }

    /**
     * Display the start screen.
     * @param {CanvasRenderingContext2D} context
     */
    display(context) {
        context.save();
        this.fillStyle = 'black';
        context.fillRect(0, 0, PARAMS.CANVAS_WIDTH, PARAMS.CANVAS_HEIGHT);
        context.fillStyle = this.style.fill;
        context.strokeStyle = this.style.stroke;
        context.font = "bold 32px sans-serif";
        context.fillText(
            "Click or press any key to Start",
            PARAMS.CANVAS_WIDTH / 2 - 200, PARAMS.CANVAS_HEIGHT / 2);
        context.strokeText(
            "Click or press any key to Start",
            PARAMS.CANVAS_WIDTH / 2 - 200, PARAMS.CANVAS_HEIGHT / 2);
        context.restore();
    }
}

/**
 * The win screen for the game.
 */
class WinScreen {
    constructor(game) {
        this.game = game;
        this.style = { fill: 'white', stroke: 'blue' };
        this.game.canvas.addEventListener('click', (e) => {
            if (this.game.screen === this) {
                this.game.camera.pos = { x: 0, y: 0 };
                AUDIO_PLAYER.stopAll();
                setTimeout(() => { this.game.screen = this.game.camera.startScreen; }, 100);
            }
        });
        this.game.canvas.addEventListener('keydown', (e) => {
            if (this.game.screen === this && e.code == 'KeyR') {
                this.game.camera.pos = { x: 0, y: 0 };
                AUDIO_PLAYER.stopAll();
                setTimeout(() => this.game.screen = this.game.camera.startScreen, 100);
            }
        });
    }

    display(context) {
        context.save();
        context.fillStyle = this.style.fill;
        context.strokeStyle = this.style.stroke;
        context.font = "bold 32px sans-serif";
        context.fillText(
            "You Win!",
            PARAMS.CANVAS_WIDTH / 2 - 200, PARAMS.CANVAS_HEIGHT / 2);
        context.strokeText(
            "You Win!",
            PARAMS.CANVAS_WIDTH / 2 - 200, PARAMS.CANVAS_HEIGHT / 2);
        context.font = "bold 20px sans-serif";
        context.fillText(
            "Click or press R to restart.",
            PARAMS.CANVAS_WIDTH / 2 - 200, PARAMS.CANVAS_HEIGHT / 2 + 200);
        context.strokeText(
            "Click or press R to restart",
            PARAMS.CANVAS_WIDTH / 2 - 200, PARAMS.CANVAS_HEIGHT / 2 + 200);
        context.restore();
    }
}


class LoseScreen {
    constructor(game) {
        this.game = game;
        this.style = { fill: 'red', stroke: 'black' };
        this.game.canvas.addEventListener('click', (e) => {
            if (this.game.screen === this) {
                this.game.camera.pos = { x: 0, y: 0 };
                AUDIO_PLAYER.stopAll();
                setTimeout(() => { this.game.screen = this.game.camera.StartScreen }, 100);
            }
        });
        this.game.canvas.addEventListener('keydown', (e) => {
            if (this.game.screen === this && e.code === 'KeyR') {
                this.game.camera.pos = { x: 0, y: 0 };
                AUDIO_PLAYER.stopAll();
                setTimeout(() => this.game.screen = this.game.camera.StartScreen, 100);
            }
        });
    }

    display(context) {
        context.save();
        context.fillStyle = this.style.fill;
        context.strokeStyle = this.style.stroke;
        context.font = "bold 32px sans-serif";
        context.fillText(
            "You are dead. Please try again.",
            PARAMS.CANVAS_WIDTH / 2 - 200, PARAMS.CANVAS_HEIGHT / 2);
        context.strokeText(
            "You are dead. Please try again.",
            PARAMS.CANVAS_WIDTH / 2 - 200, PARAMS.CANVAS_HEIGHT / 2);
        context.font = "bold 20px sans-serif";
        context.fillText(
            "Click or press R to restart.",
            PARAMS.CANVAS_WIDTH / 2 - 200, PARAMS.CANVAS_HEIGHT / 2 + 200);
        context.strokeText(
            "Click or press R to restart",
            PARAMS.CANVAS_WIDTH / 2 - 200, PARAMS.CANVAS_HEIGHT / 2 + 200);
        context.restore();
    }
    
}

class MenuScreen {
    constructor(game) {
        this.game = game;
        this.camera = new Object();
        this.camera.pos = { x: 0, y: 0 };
        this.style = { fill: 'beige', stroke: 'darkgreen' };
        this.menuPressed = false;
        this.selectLeft = false;
        this.selectRight = false;
        this.selectUp = false;
        this.selectDown = false;
        this.selectEnter = false;

        this.game.canvas.addEventListener('keydown', (e) => {
            switch (e.code) {
                case "KeyI":
                    if (!this.menuPressed) {
                        this.menuPressed = true;
                        if (this.game.screen === this) {
                            this.game.screen = false;
                        } else if (this.game.screen === false) {
                            this.game.screen = this;
                        }
                    }
                    if (this.game.druid.itemSelection >= this.game.druid.items.length ||
                        this.game.druid.itemSelection === -1) {
                        this.game.druid.itemSelection = this.game.druid.items.length - 1;
                    }
                    console.log(this.game.druid.itemSelection);
                    break;
                case "ArrowLeft":
                    this.selectLeft = true;
                    if (this.selectLeft == true && this.game.druid.itemSelection !== -1) {
                        this.game.druid.itemSelection = (this.game.druid.itemSelection - 1) % this.game.druid.items.length;
                        //this.game.druid.items[this.game.druid.itemSelection].addItemsToDruid(this.game.druid);
                        this.selectLeft = false;
                    }
                    break;
                case "ArrowRight":
                    this.selectRight = true;
                    if (this.selectRight == true && this.game.druid.itemSelection !== -1) {
                        this.game.druid.itemSelection = (this.game.druid.itemSelection + 1) % this.game.druid.items.length;
                        this.selectRight = false;
                    }
                    break;
                case "ArrowUp":
                    this.selectUp = true;
                    if (this.selectUp == true && this.game.druid.itemSelection !== -1) {
                        this.game.druid.itemSelection = (this.game.druid.itemSelection - 7) % this.game.druid.items.length;
                        this.selectUp = false;
                    }
                    break;
                case "ArrowDown":
                    this.selectDown = true;
                    if (this.selectDown == true && this.game.druid.itemSelection !== -1) {
                        this.game.druid.itemSelection = (this.game.druid.itemSelection + 7) % this.game.druid.items.length;
                        this.selectDown = false;
                    }
                    break;
                case "KeyR":
                    this.selectEnter = true;
                    this.game.druid.items[this.game.druid.itemSelection].useItemOnDruid(this.game.druid);
                    this.selectEnter = false;
                    break;
            }
        })
        this.game.canvas.addEventListener('keyup', (e) => {
            switch (e.code) {
                case "KeyI":
                    this.menuPressed = false;
                    break;
                case "ArrowLeft":
                    this.selectLeft = false;
                    break;
                case "ArrowRight":
                    this.selectRight = false;
                    break;
                case "ArrowLeft":
                    this.selectUp = false;
                    break;
                case "ArrowRight":
                    this.selectDown = false;
                    break;
                case "KeyR":
                    this.selectEnter = false;
                    break;
            }
        });
    }

    /**
     * Display the pause screen.
     * @param {CanvasRenderingContext2D} context
     */
    display(context) {
        let i;
        const OFFSET = 10;

        context.drawImage(
            ASSET_LOADER.getImageAsset("./Sprites/inventoryTemp.png"),
            PARAMS.CANVAS_WIDTH / 5,
            OFFSET * 4,
            122 * 5,
            137 * 5);

        context.save();

        if (this.style.fill) {
            context.fillStyle = this.style.fill;
        }
        if (this.style.stroke) {
            context.strokeStyle = this.style.stroke;
        }

        context.font = "bold 64px sans-serif";
        context.fillText(
            "Inventory",
            PARAMS.CANVAS_WIDTH / 2 - (OFFSET * 15),
            PARAMS.CANVAS_HEIGHT / 3 - (OFFSET * 13.5));

        context.strokeText(
            "Inventory",
            PARAMS.CANVAS_WIDTH / 2 - (OFFSET * 15),
            PARAMS.CANVAS_HEIGHT / 3 - (OFFSET * 13.5));

        for (i = 0; i < this.game.druid.items.length; i++) {
            this.game.druid.items[i].animations[0].drawFrame(
                0,
                context,
                ((i % 7) * (OFFSET * 8)) + 255,
                (Math.floor(i / 7) * (OFFSET * 8)) + 164,
                0.9,
                this.camera);

            if (i === this.game.druid.itemSelection) {
                context.drawImage(
                    ASSET_LOADER.getImageAsset("./Sprites/select2.png"),
                    ((i % 7) * (OFFSET * 8)) + 235,
                    (Math.floor(i / 7) * (OFFSET * 8)) + 155,
                    32 * 2.4,
                    32 * 2.4);
            }
        }

        context.restore();
    }
}

class HUD {
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
    static drawBar(context, xOffset, yOffset, width, borderOffset, resource, name, color, tabColor) {
        const X_TEXT_NUDGE = 8;
        const Y_TEXT_NUDGE = 17;

        context.save();
        // Draw Bars
        context.fillStyle = "black";
        context.fillRect( // Black border
            xOffset, yOffset,
            resource.max * resource.tickWidth + borderOffset,
            width + borderOffset);
        context.fillStyle = COLORS.FRAME_TAN;
        context.fillRect( // Depleted bar background
            xOffset + borderOffset, yOffset + borderOffset,
            resource.max * resource.tickWidth - borderOffset,
            width - borderOffset);
        context.fillStyle = color;
        context.fillRect( // Resource fill bar
            xOffset + borderOffset, yOffset + borderOffset,
            resource.current * resource.tickWidth - borderOffset,
            width - borderOffset);
        // Draw Text
        context.font = "bold 15px Castellar";
        context.fillStyle = tabColor;
        context.fillText(name,
            xOffset + X_TEXT_NUDGE + 1,
            yOffset + Y_TEXT_NUDGE + 1);
        context.fillStyle = "black";
        context.fillText(name,
            xOffset + X_TEXT_NUDGE,
            yOffset + Y_TEXT_NUDGE);
        context.restore();
    }

    /**
     * Draw a HUD for powerups that shows which ability the player is using and whether 
     * the ability is on cooldown.
     * @param {CanvasImageSource} context Canvas to draw to.
     * @param {number} xOffset Horizontal distance from origin.
     * @param {number} yOffset Vertical distance from origin.
     * @param {Array} powerups List of powerups.
     * @param {number} attackSelection Druid's attack selection.
     */
    static drawPowerupUI(context, xOffset, yOffset, powerups, attackSelection) {
        const imageY = yOffset + 12;
        const HEIGHT = 48;
        const WIDTH = 192;
        let i, imageX;

        // draw the interface
        context.drawImage(ASSET_LOADER.getImageAsset("./Sprites/powerupsUI.png"),
            0, 0, WIDTH, HEIGHT, xOffset, yOffset, WIDTH, HEIGHT);
        // draw text
        context.save();
        context.font = "bold 15px Castellar";
        context.fillStyle = COLORS.FRAME_BROWN;
        context.fillText("SPELLS", xOffset + 20, yOffset + 31);
        context.fillStyle = "black";
        context.fillText("SPELLS", xOffset + 19, yOffset + 30);
        context.restore();
        // draw each of the powerups in the interface
        for (i = 0; i < powerups.length; i++) {
            imageX = xOffset + 85 + 32 * i;
            if (powerups[i].cooldown > 0) { // if the powerup is on cooldown
                context.drawImage(powerups[i].cooldownSpritesheet,
                    0, 0, 64, 64, imageX, imageY, 24, 24);
            } else {                        // not on cooldown
                context.drawImage(powerups[i].spritesheet,
                    0, 0, 64, 64, imageX, imageY, 24, 24);
            }
            // draw power selection
            if (i === attackSelection) {
                context.drawImage(ASSET_LOADER.getImageAsset("./Sprites/select.png"),
                    0, 0, 32, 32, imageX - 1, imageY - 1, 26, 26);
            }
        }
    }
}

class Minimap extends Entity {
    constructor(game, x, y, width) {
        super(game, x, y);
        this.width = width;
        this.gradient = this.game.context.createLinearGradient(
            this.pos.x, this.pos.y,
            this.pos.x + this.width + 2 * 4,
            this.pos.y);
        this.gradient.addColorStop(0, COLORS.FRAME_BROWN);
        this.gradient.addColorStop(0.5, COLORS.FRAME_TAN);
        this.gradient.addColorStop(1, COLORS.FRAME_BROWN);
    };

    draw(context) {
        const SCALE = 16;
        const OFFSET = 2;
        const PIP_OFFSET = OFFSET * 3;
        const ORIGIN_X = this.pos.x;
        const ORIGIN_Y = this.pos.y;
        const WIDTH = this.width + OFFSET * 4;
        
        // Draw minimap frame
        context.save();
        context.lineWidth = OFFSET;
        context.fillStyle = "black";
        context.fillRect(ORIGIN_X, ORIGIN_Y, WIDTH, WIDTH);
        context.fillStyle = this.gradient;
        context.fillRect(
            ORIGIN_X + OFFSET, ORIGIN_Y + OFFSET,
            WIDTH - OFFSET * 2, WIDTH - OFFSET * 2);
        context.fillStyle = "black";
        context.fillRect(
            ORIGIN_X + OFFSET * 2, ORIGIN_Y + OFFSET * 2,
            WIDTH - OFFSET * 4, WIDTH - OFFSET * 4);
        context.fillStyle = COLORS.FRAME_TAN;
        context.fillRect(
            ORIGIN_X + OFFSET * 3, ORIGIN_Y + OFFSET * 3,
            WIDTH - OFFSET * 6, WIDTH - OFFSET * 6);
        // Draw each pip
        this.game.entities.forEach((entity) => {
            if (entity.hidden || entity instanceof Effect) return;
            context.fillStyle = entity.mapPipColor;
            let pip = {
                x: this.pos.x + 25 + (entity.worldBB.x - this.game.camera.pos.x) / SCALE,
                y: this.pos.y + 25 + (entity.worldBB.y - this.game.camera.pos.y) / SCALE,
                width: entity.worldBB.width / SCALE,
                height: entity.worldBB.height / SCALE
            };
            // Set pip width and/or x position
            if (pip.x < this.pos.x + PIP_OFFSET) {
                pip.width -= this.pos.x - pip.x + PIP_OFFSET;
                pip.x = this.pos.x + PIP_OFFSET;
            } else if (pip.x > this.pos.x + this.width + PIP_OFFSET) {
                pip.width = 0;
            } else if (pip.width > this.width - (pip.x - this.pos.x) + OFFSET) {
                pip.width = this.width - (pip.x - this.pos.x) + OFFSET;
            }
            // Set pip height and/or y position
            if (pip.y < this.pos.y + PIP_OFFSET) {
                pip.height -= this.pos.y - pip.y + PIP_OFFSET;
                pip.y = this.pos.y + PIP_OFFSET;
            } else if (pip.y > this.pos.y + this.width + PIP_OFFSET) {
                pip.height = 0;
            } else if (pip.height > this.width - (pip.y - this.pos.y) + OFFSET) {
                pip.height = this.width - (pip.y - this.pos.y) + OFFSET;
            }
            // Enforce map boundaries on pip
            if (pip.width < 0) {
                pip.width = 0;
            }
            if (pip.height < 0) {
                pip.height = 0;
            }
            if (pip.width > WIDTH - PIP_OFFSET * 2) {
                pip.width = WIDTH - PIP_OFFSET * 2;
            }
            if (pip.height > WIDTH - PIP_OFFSET * 2) {
                pip.height = WIDTH - PIP_OFFSET * 2;
            }
            context.fillRect(pip.x, pip.y, pip.width, pip.height);
        });
        context.restore();
    };

    /** @override */
    update(context) {
        // Do nothing
    }
};