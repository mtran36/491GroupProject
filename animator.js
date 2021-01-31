class Animator {
    constructor(spritesheet, xStart, yStart, width, height, frameCount,
        frameDuration, framePadding, reverse, loop, flip) {
        Object.assign(this, {
            spritesheet, xStart, yStart, height, width,
            frameCount, frameDuration, framePadding, reverse, loop, flip
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
    drawFrame(tick, context, x, y, scale, camera) {
        x -= camera.pos.x;
        y -= camera.pos.y;
        // Check if animation is done
        this.elapsedTime += tick; 
        if (this.isDone()) {
            if (this.loop) {
                this.elapsedTime -= this.totalTime;
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
            x, y,
            this.width * scale,
            this.height * scale); 
        // Restore canvas context to previous settings.
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

    /** Returns whether or not this animation has completed. */
    isDone() {
        return (this.elapsedTime >= this.totalTime);
    };
};
