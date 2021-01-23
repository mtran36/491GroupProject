// This game shell was happily modified from Googler Seth Ladd's "Bad Aliens" game and
// his Google IO talk in 2011

class Timer {
    constructor() {
        this.gameTime = 0;
        this.maxStep = 0.05;
        this.lastTimestamp = 0;
    };

    /** Updates the engine by one step. */
    tick() {
        // Measure time passed since last tick
        var current = Date.now();
        var delta = (current - this.lastTimestamp) / 1000;
        this.lastTimestamp = current;
        // If the game is running slow, ensure no ticks are skipped. This will slow the
        // game down because it means that the amount of time passed in game becomes less
        // than the amount of time passed in reality.
        var gameDelta = Math.min(delta, this.maxStep);
        // Log amount of time the tick took in game. This will be used for animation and 
        // update timing.
        this.gameTime += gameDelta;
        return gameDelta;
    };
};