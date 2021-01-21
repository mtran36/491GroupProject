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

    drawFrame(tick, ctx, x, y, scale) {
        this.elapsedTime += tick;

        if (this.isDone()) {
            if (this.loop) {
                this.elapsedTime -= this.totalTime;
            } else {
                return;
            }
        }

        let frame = this.currentFrame();
        if (this.reverse) frame = this.frameCount - frame - 1;
        if (this.flip) {
            ctx.save();
            ctx.scale(-1, 1);
            x = 0 - x - width * scale;
        }

        ctx.drawImage(this.spritesheet,
            this.xStart + frame * (this.width + this.framePadding), this.yStart,
            this.width, this.height,
            x, y,
            this.width * scale,
            this.height * scale);

        if (this.flip) {
            ctx.restore();
        }

        /* if (PARAMS.DEBUG) {
            ctx.strokeStyle = 'Green';
            ctx.strokeRect(x, y, this.width * scale, this.height * scale);
        } */
    };

    currentFrame() {
        return Math.floor(this.elapsedTime / this.frameDuration);
    };

    isDone() {
        return (this.elapsedTime >= this.totalTime);
    };
};
