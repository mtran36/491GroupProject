// This game shell was happily modified from Googler Seth Ladd's "Bad Aliens" game and 
// his Google IO talk in 2011

class GameEngine {
    constructor() {
        this.entities = [];
        this.showOutlines = false;
        this.canvas = null;
        this.context = null;
        this.click = null;
        this.mouse = null;
        this.wheel = null;
        this.surfaceWidth = null;
        this.surfaceHeight = null;
        this.left = false;
        this.right = false;
        this.up = false;
        this.down = false;
        this.C = false;
        this.B = false;
        this.A = false;
        this.pause = false;
        this.pausePressed = false;
    };

    /**
     * Sets up the game engine and gives it a reference to a canvas to use for drawing.
     * @param {CanvasImageSource} context Canvas to draw on.
     */
    init(canvas) {
        this.canvas = canvas;
        this.context = canvas.getContext('2d');
        this.surfaceWidth = this.context.canvas.width;
        this.surfaceHeight = this.context.canvas.height;
        this.startInput();
        this.timer = new Timer();
    };

    /** Starts the game engine by beginning the game loop. */
    start() {
        var that = this;
        (function gameLoop() {
            that.loop();
            requestAnimFrame(gameLoop, that.context.canvas);
        })();
    };

    /** Recieves input from the keyboard and mouse. */
    startInput() {
        var that = this;
        var getXandY = function (e) {
            var x = e.clientX - that.context.canvas.getBoundingClientRect().left;
            var y = e.clientY - that.context.canvas.getBoundingClientRect().top;
            return { x: x, y: y };
        }
        this.context.canvas.addEventListener("mousemove", function (e) {
            that.mouse = getXandY(e);
        }, false);
        this.context.canvas.addEventListener("click", function (e) {
            that.click = getXandY(e);
        }, false);
        this.context.canvas.addEventListener("wheel", function (e) {
            that.wheel = e;
            e.preventDefault();
        }, false);
        this.context.canvas.addEventListener("contextmenu", function (e) {
            that.rightclick = getXandY(e);
            e.preventDefault();
        }, false);
        this.context.canvas.addEventListener("keydown", function (e) {
            switch (e.code) {
                case "ArrowLeft":
                case "KeyA":
                    that.left = true;
                    break;
                case "ArrowRight":
                case "KeyD":
                    that.right = true;
                    break;
                case "ArrowUp":
                case "KeyW":
                    that.up = true;
                    break;
                case "ArrowDown":
                case "KeyS":
                    that.down = true;
                    break;
                case "KeyC":
                case "KeyL":
                    that.C = true;
                    break;
                case "KeyZ":
                case "KeyK":
                    that.B = true;
                    break;
                case "KeyX":
                case "KeyJ":
                    that.A = true;
                    break;
                case "KeyP":
                    if (!that.pausePressed) {
                        that.pause = !that.pause;
                        that.pausePressed = true;
                    }
                    break;
            }
        });
        this.context.canvas.addEventListener("keyup", function (e) {
            switch (e.code) {
                case "ArrowLeft":
                case "KeyA":
                    that.left = false;
                    break;
                case "ArrowRight":
                case "KeyD":
                    that.right = false;
                    break;
                case "ArrowUp":
                case "KeyW":
                    that.up = false;
                    break;
                case "ArrowDown":
                case "KeyS":
                    that.down = false;
                    break;
                case "KeyC":
                case "KeyL":
                    that.C = false;
                    break;
                case "KeyZ":
                case "KeyK":
                    that.B = false;
                    break;
                case "KeyX":
                case "KeyJ":
                    that.A = false;
                    break;
                case "KeyP":
                    that.pausePressed = false;
                    break;
            }
        });
    };

    /**
     * Adds the given entity to the game, allowing it to be drawn and updated.
     * @param {Entity} entity Entity to be added to the game world.
     */
    addEntity(entity) {
        this.entities.push(entity);
    };

    /** Draws all entities according to their draw functionality. */
    draw() {
        this.context.clearRect(0, 0, this.context.canvas.width, this.context.canvas.height);
        for (var i = 0; i < this.entities.length; i++) {
            this.entities[i].draw(this.context);
        }
    };

    /** 
     * Updates all entities according to their update functionality. Also moves the 
     * camera and removes entities from the world if they are set to be removed. 
     */
    update() {
        var entitiesCount = this.entities.length;
        for (var i = 0; i < entitiesCount; i++) {
            var entity = this.entities[i];
            if (!entity.removeFromWorld) {
                entity.update();
            }
        }
        this.camera.update();
        for (var i = this.entities.length - 1; i >= 0; --i) {
            if (this.entities[i].removeFromWorld) {
                this.entities.splice(i, 1);
            }
        }
    };

    /** Main game loop. Defines the update/render order of the engine. */
    loop() {
        if (this.pause || !document.hasFocus() || document.activeFocus !== this.canvas) {

            return;
        }
        this.clockTick = this.timer.tick();
        this.update();
        this.draw();
    };
};