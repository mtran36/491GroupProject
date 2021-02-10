/**
 * Controls the playing and pausing of music and sounds.
 */
class AudioPlayer {
    constructor() {
        this.indexArr = [];
        this.playing = [];
    }

    /**
     * Plays the sound file at the specified path. Loop = true. Will play from where the sound 
     * was last paused.
     * @param {string} path
     */
    playMusic(path) {
        // If no index for the audio array, then create one.
        if (!this.indexArr[path]) {
            this.indexArr[path] = 0;
        }
        let i = this.indexArr[path];
        let audioArr = ASSET_MANAGER.getAudioAsset(path);
        let audio = audioArr[i];
        audio.loop = true;
        audio.play();
        // Check to ensure only one copy of an audio element is allowed in the playing list.
        if (!this.playing.includes(audio)) {
            this.playing.push(audio);
        }
        this.indexArr[path] = (this.indexArr[path] + 1) % audioArr.length;
    }

    /**
     * Plays the sound at the specified path. Loop = false. Always plays from start.
     * @param {any} path
     */
    playSound(path) {
        // If no index for the audio array, then create one.
        if (!this.indexArr[path]) {
            this.indexArr[path] = 0;
        }
        let i = this.indexArr[path];
        let audioArr = ASSET_MANAGER.getAudioAsset(path);
        let audio = audioArr[i];
        // Precision is not critical, so fastSeek is used.
        audio.fastSeek(0);
        audio.play();
        // Check to ensure only one copy of an audio element is allowed in the playing list.
        if (!this.playing.includes(audio)) {
            this.playing.push(audio);
        }
        this.indexArr[path] = (this.indexArr[path] + 1) % audioArr.length;
    }

    /**
     * Pauses all currently playing audio.
     */
    pauseAudio() {
        this.playing.forEach((audio) => {
            audio.pause();
        });
    }

    /**
     * Causes all paused audio to begin playing again.
     */
    unpauseAudio() {
        this.playing.forEach((audio) => {
            audio.play();
        });
    }

    /**
     * Stops music by pausing all currently playing audio and then makes a fresh playing array.
     */
    stopAll() {
        this.pauseAudio();
        this.playing = [];
    }

    /**
     * Checks to see if any audio clips have ended. If they have they are remove from the
     * playing list.
     */
    update() {
        this.playing.forEach((audio) => {
            if (audio.ended) {
                this.playing.splice(this.playing.findIndex((a) => {
                    return a === audio;
                }), 1);
            }
        });
    }
}