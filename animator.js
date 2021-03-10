class Animator {
    constructor(spritesheet, xStart, yStart, width, height, frameCount,
        frameDuration, framePadding, reverse, loop, flip, bounce, stay) {
        Object.assign(this, {
            spritesheet, xStart, yStart, height, width, frameCount,
            frameDuration, framePadding, reverse, loop, flip, bounce, stay
        });
        this.elapsedTime = 0;
        this.totalTime = this.frameCount * this.frameDuration;
    };

    /**
     * Draws the current frame of the animation to the screen with the designated 
     * parameters. Calls to drawFrame occur once per tick, which may be more than once 
     * per frame due to the way the engine scales animation speeds.
     * @param {number} tick Amount of time which has passed since the last tick.
     * @param {CanvasImageSource} context Canvas to draw on.
     * @param {number} x The x-axis coordinate in the canvas at which to place the top
     * left corner of the source image.
     * @param {number} y The y-axis coordinate in the canvas at which to place the top
     * left corner of the source image.
     * @param {number} scale
     */
    drawFrame(tick, context, x, y, scale, camera, xOffset = 0, yOffset = 0) {
        if (this.spritesheet === undefined) {
            console.error(
                "Entity at x =", x, "y =", y, "scale value =", scale,
                "passed undefined context to drawFrame");
        }
        x -= camera.pos.x;
        y -= camera.pos.y;
        // Check if animation is done
        this.elapsedTime += tick; 
        if (this.isDone()) {
            if (this.loop) {
                this.elapsedTime -= this.totalTime;
                if (this.bounce) {
                    this.reverse = !this.reverse;
                    this.elapsedTime += this.frameDuration;
                }
            } else if (this.stay) {
                this.elapsedTime = this.totalTime - this.frameDuration;
            } else return;
        }
        // Prepare current frame
        let frame = this.currentFrame();
        if (this.reverse) frame = this.frameCount - frame - 1;
        if (this.flip) {
            context.save();
            context.scale(-1, 1);
            x = 0 - x - this.width * scale;
        } 
        // Draw current frame
        context.drawImage(this.spritesheet,
            this.xStart + frame * (this.width + this.framePadding), this.yStart,
            this.width, this.height,
            x + xOffset, y + yOffset,
            this.width * scale,
            this.height * scale);

        if (this.flip) {
            context.restore();
        }
    };

    /** 
     * Returns the frame step the animation is on. This may not be the same number
     * as the frame being displayed if reverse is enabled.
     */
    currentFrame() {
        return Math.floor(this.elapsedTime / this.frameDuration);
    };

    /** 
     * Returns whether or not this animation has completed. 
     */
    isDone() {
        return (this.elapsedTime >= this.totalTime);
    };

    /** 
     * Restarts this animation. 
     */
    restart() {
        this.elapsedTime = 0;
    }
};