
/**
 * Displays the word pause on a black background. Pauses game and audio when pause
 * is pressed.
 */
class PauseScreen {
    constructor(game, style) {
        this.game = game;
        this.style = style;
        this.pausePressed = false;
        this.game.canvas.addEventListener('keydown', (e) => {
            switch (e.code) {
                case "KeyP":
                case "Escape":
                    if (!this.pausePressed) {
                        this.pausePressed = true;
                        if (this.game.screen) {
                            this.game.screen = false;
                        } else {
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
 * */
class StartScreen {
    constructor(game, style) {
        this.game = game;
        this.style = style;
        var clickStart = () => {
            this.game.canvas.removeEventListener('click', clickStart);
            this.game.camera.loadLevel(levelOne, PARAMS.TILE_WIDTH * 5.5, PARAMS.TILE_WIDTH);
            this.game.start();
        }
        this.game.canvas.addEventListener('click', clickStart);
        this.display(this.game.context);
    }

    /**
     * Display the start screen.
     * @param {CanvasRenderingContext2D} context
     */
    display(context) {
        context.save();
        context.fillRect(0, 0, PARAMS.CANVAS_WIDTH, PARAMS.CANVAS_HEIGHT);
        if (this.style.fill) {
            context.fillStyle = this.style.fill;
        }
        if (this.style.stroke) {
            context.strokeStyle = this.style.stroke;
        }
        context.font = "bold 64px sans-serif";
        context.fillText("Click to Start", PARAMS.CANVAS_WIDTH / 2 - 200, PARAMS.CANVAS_HEIGHT / 2);
        context.strokeText("Click to Start", PARAMS.CANVAS_WIDTH / 2 - 200, PARAMS.CANVAS_HEIGHT / 2);
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
    static drawBar(context, xOffset, yOffset, width, borderOffset, resource, name, color) {
        const FONT = "italic bold 16px Castellar"
        const TEXT_COLOR = "black";
        const X_TEXT_NUDGE = 10;
        const X_TEXT_POS_SCALE = 0.65;
        const Y_TEXT_NUDGE = 2;
        const Y_TEXT_POS_SCALE = 1.5;

        context.save();
        // Draw Bars
        context.fillStyle = "black";
        context.fillRect(
            xOffset, yOffset,
            resource.max * resource.tickWidth + borderOffset,
            width + borderOffset);
        context.fillStyle = "white";
        context.fillRect(
            xOffset + borderOffset, yOffset + borderOffset,
            resource.max * resource.tickWidth - borderOffset,
            width - borderOffset);
        context.fillStyle = color;
        context.fillRect(
            xOffset + borderOffset, yOffset + borderOffset,
            resource.current * resource.tickWidth - borderOffset,
            width - borderOffset);
        // Draw Text
        context.fillStyle = TEXT_COLOR;
        context.font = FONT;
        context.fillText(
            resource.current + "/" + resource.max + resource.name,
            (xOffset + resource.max * resource.tickWidth) * X_TEXT_POS_SCALE,
            yOffset + (width / Y_TEXT_POS_SCALE) + Y_TEXT_NUDGE);
        context.fillText(
            name,
            xOffset + X_TEXT_NUDGE,
            yOffset + (width / Y_TEXT_POS_SCALE) + Y_TEXT_NUDGE);
        context.restore();
    }
}