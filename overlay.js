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
        context.fillRect(0, 0, PARAMS.CANVAS_WIDTH, PARAMS.CANVAS_HEIGHT);
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
            this.game.camera.loadLevel(levelOne);
            this.game.start();
        };
        this.game.canvas.addEventListener('click', clickStart);
        // Start after reset, win, or lose.
        this.game.canvas.addEventListener('click', (e) => {
            if (this.game.screen === this) {
                this.game.camera.loadLevel(levelOne);
                this.game.screen = null;
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
        context.fillRect(0, 0, PARAMS.CANVAS_WIDTH, PARAMS.CANVAS_HEIGHT);
        context.fillStyle = this.style.fill;
        context.strokeStyle = this.style.stroke;
        context.font = "bold 64px sans-serif";
        context.fillText(
            "Click to Start",
            PARAMS.CANVAS_WIDTH / 2 - 200, PARAMS.CANVAS_HEIGHT / 2);
        context.strokeText(
            "Click to Start",
            PARAMS.CANVAS_WIDTH / 2 - 200, PARAMS.CANVAS_HEIGHT / 2);
        context.restore();
    }
}

class WinScreen {
    constructor(game) {
        this.game = game;
        this.style = { fill: 'white', stroke: 'blue' };
        this.game.canvas.addEventListener('click', (e) => {
            if (this.game.screen === this) {
                this.game.camera.pos = { x: 0, y: 0 };
                setTimeout(() => this.game.screen = this.game.camera.StartScreen, 100);
            }
        })
    }

    display(context) {
        context.save();
        context.fillRect(0, 0, PARAMS.CANVAS_WIDTH, PARAMS.CANVAS_HEIGHT);
        context.fillStyle = this.style.fill;
        context.strokeStyle = this.style.stroke;
        context.font = "bold 64px sans-serif";
        context.fillText(
            "You Win!",
            PARAMS.CANVAS_WIDTH / 2 - 200, PARAMS.CANVAS_HEIGHT / 2);
        context.strokeText(
            "You Win!",
            PARAMS.CANVAS_WIDTH / 2 - 200, PARAMS.CANVAS_HEIGHT / 2);
        context.font = "bold 16px sans-serif";
        context.fillText(
            "Click to restart.",
            PARAMS.CANVAS_WIDTH / 2 - 200, PARAMS.CANVAS_HEIGHT / 2 + 200);
        context.strokeText(
            "Click to restart",
            PARAMS.CANVAS_WIDTH / 2 - 200, PARAMS.CANVAS_HEIGHT / 2 + 200);
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
        const TAB_WIDTH = 6;

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
        context.fillStyle = tabColor;
        context.fillRect(
            xOffset + borderOffset + resource.current * resource.tickWidth - borderOffset - TAB_WIDTH,
            yOffset + borderOffset,
            TAB_WIDTH, width - borderOffset);
        // Draw Text
        context.font = "bold 15px Castellar";
        context.fillStyle = tabColor;
        context.fillText(
            name,
            xOffset + X_TEXT_NUDGE + 1,
            yOffset + Y_TEXT_NUDGE + 1);
        context.fillStyle = "black";
        context.fillText(
            name,
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
        context.fillStyle = COLORS.FRAME_BROWN;
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
            if (entity.hidden) return;
            context.fillStyle = entity.mapPipColor;
            let pip = {
                x: this.pos.x + 25 + (entity.pos.x - this.game.camera.pos.x) / SCALE,
                y: this.pos.y + 25 + (entity.pos.y - this.game.camera.pos.y) / SCALE,
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