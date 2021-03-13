/**
 * Displays the word pause on a black background. Pauses game and audio when pause
 * is pressed.
 */
class PauseScreen {
    constructor(game) {
        this.game = game;
        this.style = {
            fill: "black", shadow: COLORS.FRAME_BROWN
        };
        this.pausePressed = false;
        this.screen = false;
        this.game.canvas.addEventListener("keydown", (e) => {
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
        this.game.canvas.addEventListener("keyup", (e) => {
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
        const ORIGIN_X = PARAMS.CANVAS_WIDTH / 2 - 140;
        const ORIGIN_Y = PARAMS.CANVAS_HEIGHT / 2 + 20;
        const TEXT_NUDGE_X = 48;
        const TEXT_NUDGE_Y = -7;
        const HEIGHT = 96;
        const WIDTH = 384;

        AUDIO_PLAYER.pauseMusic();
        AUDIO_PLAYER.pauseSounds();
        context.save();
        drawUIBackground(context);
        context.drawImage(ASSET_LOADER.getImageAsset("./Sprites/powerupsUI.png"),
            ORIGIN_X - 53, ORIGIN_Y - 70, WIDTH, HEIGHT);
        context.font = "bold 38px sans-serif";
        context.fillStyle = this.style.shadow;
        context.fillText("- PAUSE -", ORIGIN_X + TEXT_NUDGE_X + 2, ORIGIN_Y + TEXT_NUDGE_Y + 2);
        context.fillStyle = this.style.fill;
        context.fillText("- PAUSE -", ORIGIN_X + TEXT_NUDGE_X, ORIGIN_Y + TEXT_NUDGE_Y);
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
        this.style = { fill: COLORS.FRAME_TAN, stroke: COLORS.FRAME_BROWN };
        this.titleTree = ASSET_LOADER.getImageAsset("./Sprites/titleTree.png");
        // Start upon first load.
        let clickStart = (e) => {
            this.game.canvas.removeEventListener("click", clickStart);
            this.game.canvas.removeEventListener("keydown", clickStart);
            this.game.camera.loadLevel(levelOne);
            this.game.start();
        };
        this.game.canvas.addEventListener("click", clickStart);
        this.game.canvas.addEventListener("keydown", clickStart);
        // Start after reset, win, or lose.
        this.game.canvas.addEventListener("click", () => {
            if (this.game.screen === this) {
                this.game.camera.loadLevel(levelOne, 15, 115);
                this.game.screen = false;
            }
        });
        this.game.canvas.addEventListener("keydown", () => {
            if (this.game.screen === this) {
                this.game.camera.loadLevel(levelOne);
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
        const SCALE = 1.5;

        context.save();
        context.fillStyle = "black";
        context.fillRect(0, 0, PARAMS.CANVAS_WIDTH, PARAMS.CANVAS_HEIGHT);
        context.drawImage(this.titleTree, 25, 25, 500 * SCALE, 477 * SCALE);
        context.fillStyle = this.style.fill;
        context.strokeStyle = this.style.stroke;
        context.font = "bold 32px sans-serif";
        context.fillText("- Click to Begin -",
            PARAMS.CANVAS_WIDTH / 2 + 185, PARAMS.CANVAS_HEIGHT / 2 + 175);
        context.strokeText("- Click to Begin -",
            PARAMS.CANVAS_WIDTH / 2 + 185, PARAMS.CANVAS_HEIGHT / 2 + 175);
        context.font = "bold 47px castellar";
        context.fillStyle = COLORS.FRAME_BROWN;
        context.fillText("Hollow Tree",
            PARAMS.CANVAS_WIDTH / 2 + 100 + 4, PARAMS.CANVAS_HEIGHT / 2 + 30 + 4);
        context.fillText("Hollow Tree",
            PARAMS.CANVAS_WIDTH / 2 + 100 + 4, PARAMS.CANVAS_HEIGHT / 2 + 30 + 4);
        context.fillStyle = COLORS.FRAME_TAN;
        context.fillText("Hollow Tree",
            PARAMS.CANVAS_WIDTH / 2 + 100, PARAMS.CANVAS_HEIGHT / 2 + 30);
        context.fillText("Hollow Tree",
            PARAMS.CANVAS_WIDTH / 2 + 100, PARAMS.CANVAS_HEIGHT / 2 + 30);
        context.restore();
    }
}

/**
 * The win screen for the game.
 */
class WinScreen {
    constructor(game) {
        this.game = game;
        this.style = { fill: "white", stroke: "blue" };
        this.game.canvas.addEventListener("click", (e) => {
            if (this.game.screen === this) {
                this.game.camera.pos = { x: 0, y: 0 };
                AUDIO_PLAYER.stopAll();
                setTimeout(() => { this.game.screen = this.game.camera.StartScreen; }, 100);
            }
        });
        this.game.canvas.addEventListener("keydown", (e) => {
            if (this.game.screen === this && e.code == "KeyR") {
                this.game.camera.pos = { x: 0, y: 0 };
                AUDIO_PLAYER.stopAll();
                setTimeout(() => this.game.screen = this.game.camera.StartScreen, 100);
            }
        });
    }

    display(context) {
        context.save();
        drawUIBackground(context);
        context.fillStyle = this.style.fill;
        context.strokeStyle = this.style.stroke;
        context.font = "bold 32px sans-serif";
        context.fillText("You Win!",
            PARAMS.CANVAS_WIDTH / 2 - 200, PARAMS.CANVAS_HEIGHT / 2);
        context.strokeText("You Win!",
            PARAMS.CANVAS_WIDTH / 2 - 200, PARAMS.CANVAS_HEIGHT / 2);
        context.font = "bold 20px sans-serif";
        context.fillText("Click or press R to restart.",
            PARAMS.CANVAS_WIDTH / 2 - 200, PARAMS.CANVAS_HEIGHT / 2 + 200);
        context.strokeText("Click or press R to restart",
            PARAMS.CANVAS_WIDTH / 2 - 200, PARAMS.CANVAS_HEIGHT / 2 + 200);
        context.restore();
    }
}

class LoseScreen {
    constructor(game) {
        this.game = game;
        this.style = { fill: "black", stroke: COLORS.FRAME_BROWN };
        this.game.canvas.addEventListener("click", (e) => {
            if (this.game.screen === this) {
                this.game.camera.pos = { x: 0, y: 0 };
                AUDIO_PLAYER.stopAll();
                setTimeout(() => { this.game.screen = this.game.camera.StartScreen }, 100);
            }
        });
        this.game.canvas.addEventListener("keydown", (e) => {
            if (this.game.screen === this && e.code === "KeyR") {
                this.game.camera.pos = { x: 0, y: 0 };
                AUDIO_PLAYER.stopAll();
                setTimeout(() => this.game.screen = this.game.camera.StartScreen, 100);
            }
        });
    }

    display(context) {
        const ORIGIN_X = PARAMS.CANVAS_WIDTH / 2 - 330;
        const ORIGIN_Y = PARAMS.CANVAS_HEIGHT / 2 - 10;
        const TEXT_NUDGE_X = 15;
        const TEXT_NUDGE_Y = 0;
        const HEIGHT = 192;
        const WIDTH = 768;

        context.save();
        drawUIBackground(context);
        context.drawImage(ASSET_LOADER.getImageAsset("./Sprites/powerupsUI.png"),
            ORIGIN_X - 53, ORIGIN_Y - 70, WIDTH, HEIGHT);

        context.font = "bold 32px castellar";
        context.fillStyle = COLORS.FRAME_BROWN;
        context.fillText(
            "You were overwhelmed",
            ORIGIN_X + TEXT_NUDGE_X + 2, ORIGIN_Y + TEXT_NUDGE_Y + 2);
        context.fillStyle = "black";
        context.fillText(
            "You were overwhelmed",
            ORIGIN_X + TEXT_NUDGE_X, ORIGIN_Y + TEXT_NUDGE_Y);
        context.fillStyle = COLORS.FRAME_BROWN;
        context.fillText(
            "by the infestation...",
            ORIGIN_X + TEXT_NUDGE_X + 210 + 2, ORIGIN_Y + TEXT_NUDGE_Y + 40 + 2);
        context.fillStyle = "black";
        context.fillText(
            "by the infestation...",
            ORIGIN_X + TEXT_NUDGE_X + 210, ORIGIN_Y + TEXT_NUDGE_Y + 40);

        context.fillStyle = this.style.fill;
        context.strokeStyle = this.style.stroke;
        context.font = "bold 20px sans-serif";
        context.fillText(
            "Try again? (Click or press R)",
            ORIGIN_X + 195, ORIGIN_Y + 80);
        context.strokeText(
            "Try again? (Click or press R)",
            ORIGIN_X + 195, ORIGIN_Y + 80);
        context.restore();
    }
    
}

class MenuScreen {
    constructor(game) {
        const DRUID = game.druid;
        const ROW = 7;
        let moveCursor = (amount) => {
            if (DRUID.itemSelection + amount >= DRUID.items.length) {
                DRUID.itemSelection = DRUID.items.length - 1;
            } else if (DRUID.itemSelection + amount < 0) {
                DRUID.itemSelection = 0;
            } else {
                DRUID.itemSelection = (DRUID.itemSelection + amount);
            }
        }

        this.game = game;
        this.camera = new Object();
        this.camera.pos = { x: 0, y: 0 };
        this.style = { fill: "beige", stroke: "darkgreen" };
        this.menuPressed = false;

        this.game.canvas.addEventListener("keydown", (e) => {
            if (!DRUID) return;
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
                    if (DRUID.itemSelection >= DRUID.items.length
                        || DRUID.itemSelection === -1) {
                        DRUID.itemSelection = DRUID.items.length - 1;
                    }
                    break;
                case "ArrowLeft":
                case "KeyA":
                    if (DRUID.itemSelection !== -1) {
                        moveCursor(-1);
                    }
                    break;
                case "ArrowRight":
                case "KeyD":
                    if (DRUID.itemSelection !== -1) {
                        moveCursor(1);
                    }
                    break;
                case "ArrowUp":
                case "KeyW":
                    if (DRUID.itemSelection !== -1) {
                        moveCursor(-ROW);
                    }
                    break;
                case "ArrowDown":
                case "KeyS":
                    if (DRUID.itemSelection !== -1) {
                        moveCursor(ROW);
                    }
                    break;
                case "KeyR":
                    if (DRUID.items[DRUID.itemSelection]) {
                        DRUID.items[DRUID.itemSelection].useItemOnDruid(DRUID);
                    }
                    break;
            }
        });
        this.game.canvas.addEventListener("keyup", (e) => {
            switch (e.code) {
                case "KeyI":
                    this.menuPressed = false;
                    break;
                case "ArrowLeft":
                case "KeyA":
                    this.selectLeft = false;
                    break;
                case "ArrowRight":
                case "KeyD":
                    this.selectRight = false;
                    break;
                case "ArrowUp":
                case "KeyW":
                    this.selectUp = false;
                    break;
                case "ArrowDown":
                case "KeyS":
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
        drawUIBackground(context);
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

class LevelUpScreen {
    constructor(game) {
        const DRUID = game.druid;

        this.game = game;
        this.camera = new Object();
        this.camera.pos = { x: 0, y: 0 };
        this.style = { fill: "beige", stroke: "darkgreen" };
        this.screen = false;
        this.levelUpScreen = false;
        this.selectLeft = false;
        this.selectRight = false;


        this.game.canvas.addEventListener("keydown", (e) => {
            switch (e.code) {
                case "ArrowLeft":
                case "KeyA":
                    if (!this.left && this.levelUpScreen
                        && DRUID.attacks.length > 0) {
                        if (DRUID.attackSelection == 0) {
                            DRUID.attackSelection = DRUID.attacks.length - 1;
                        } else {
                            DRUID.attackSelection =
                                (DRUID.attackSelection - 1) % DRUID.attacks.length;
                        }
                        this.left = true;
                    }
                    break;
                case "ArrowRight":
                case "KeyD":
                    if (!this.right && this.levelUpScreen
                        && DRUID.attacks.length > 0) {
                        DRUID.attackSelection =
                            (DRUID.attackSelection + 1) % DRUID.attacks.length;
                        this.right = true;
                    }
                    break;
                case "KeyX":
                case "KeyJ":
                    if (this.levelUpScreen
                        && DRUID.attacks.length > 0) {
                        if (DRUID.attacks[DRUID.attackSelection].canLevelUp) {
                            DRUID.attacks[DRUID.attackSelection].levelUp();
                            this.item.removeFromWorld = true;
                            this.item = null;
                            this.levelUpScreen = false;
                            this.game.A = false;
                            this.game.screen = false;
                        }
                    }
                    break;
                case "KeyQ":
                    if (this.levelUpScreen) {
                        this.levelUpScreen = false;
                        this.game.screen = false;
                    }
                break;
            }
        });
        this.game.canvas.addEventListener("keyup", (e) => {
            switch (e.code) {
                case "ArrowLeft":
                case "KeyA":
                    this.left = false;
                    break;
                case "ArrowRight":
                case "KeyD":
                    this.right = false;
                    break;
            }
        });
    }

    showScreen(item) {
        this.levelUpScreen = true;
        this.game.screen = this;
        this.item = item;
    }

    /**
     * Display the level up screen.
     * @param {CanvasRenderingContext2D} context
     */
    display(context) {
        let powerups, imageX, level;

        // draw the interface
        context.save();
        context.drawImage(ASSET_LOADER.getImageAsset("./Sprites/LevelUpScreen.png"),
            0, 0, 192, 128, 140, 160, 768, 512);
        context.font = "bold 30px Arial";
        context.fillStyle = "black";
        context.fillText("Spell Upgrade", 425, 220);
        context.font = "bold 20px Arial";
        context.fillText("Select one spell to level up using key [X/J], [Q] to cancel.", 200, 300);
        // draw each of the powerups in the interface
        powerups = this.game.druid.attacks;
        for (i = 0; i < powerups.length; i++) {
            imageX = 250 + 220 * i;
            context.drawImage(powerups[i].spritesheet, 0, 0, 64, 64, imageX, 500, 64, 64);
            // draw power selection
            if (i === this.game.druid.attackSelection) {
                context.font = "bold 20px Arial";
                context.fillStyle = "black";
                level = powerups[i].level;
                level === 3 ?
                    context.fillText("Max Level.", 200, 350):
                    context.fillText("Level " + level + " -> Level " + (level + 1) + ":", 200, 350);
                context.fillText(powerups[i].levelDescription[powerups[i].level - 1], 200, 400);
                context.drawImage(ASSET_LOADER.getImageAsset("./Sprites/select2.png"),
                    0, 0, 32, 32, imageX - 8, 500 - 8, 80, 80);
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
     * @param {number} attackSelection Druid"s attack selection.
     */
    static drawPowerupUI(context, xOffset, yOffset, powerups, attackSelection, DRUID) {
        const IMAGE_Y = yOffset + 9;
        const HEIGHT = 52;
        const WIDTH = 192;
        const TEXT_NUDGE_Y = 32;
        const TEXT_NUDGE_X = 14;
        let powerup, imageX;

        context.save();
        context.drawImage(ASSET_LOADER.getImageAsset("./Sprites/powerupsUI.png"),
            0, 0, WIDTH, HEIGHT, xOffset, yOffset, WIDTH, HEIGHT);
        context.font = "bold 17px Castellar";
        context.fillStyle = COLORS.FRAME_BROWN;
        context.fillText("SPELLS", xOffset + TEXT_NUDGE_X + 1, yOffset + TEXT_NUDGE_Y + 1);
        context.fillStyle = "black";
        context.fillText("SPELLS", xOffset + TEXT_NUDGE_X, yOffset + TEXT_NUDGE_Y);
        // Draw each of the powerups 
        for (powerup = 0; powerup < powerups.length; powerup++) {
            imageX = xOffset + 85 + 34 * powerup;
            (powerups[powerup].cost > DRUID.mana && powerup == attackSelection) ?
                context.drawImage(powerups[powerup].cooldownSpritesheet,
                    0, 0, 64, 64, imageX, IMAGE_Y, 26, 26):
                context.drawImage(powerups[powerup].spritesheet,
                    0, 0, 64, 64, imageX, IMAGE_Y, 26, 26);
            // display powerups level
            context.font = "bold 10px Arial";
            context.fillStyle = "black";
            context.fillText("Lv." + powerups[powerup].level, imageX, IMAGE_Y + 36);
            // draw power selection
            if (powerup === attackSelection) {
                context.drawImage(ASSET_LOADER.getImageAsset("./Sprites/select2.png"),
                    0, 0, 32, 32, imageX - 1, IMAGE_Y - 1, 28, 28);
            }
        }
        context.restore();
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
        const CENTER_OFFSET = 25;
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
                x: this.pos.x + CENTER_OFFSET
                    + (entity.pos.x - this.game.camera.pos.x) / SCALE,
                y: this.pos.y + CENTER_OFFSET
                    + (entity.pos.y - this.game.camera.pos.y) / SCALE,
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