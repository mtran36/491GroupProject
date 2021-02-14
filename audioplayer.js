/**
 * Controls the playing and pausing of music and sounds.
 */
class AudioPlayer {

    constructor() {
        this.indexArr = [];
        this.music = [];
        this.playing = [];
        this.volume = 0.5;
        this.mute = false;
    }

    /**
     * Plays the music file at the specified path. Loop = true. Will play from where the sound 
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
        audio.muted = this.mute;
        audio.play();
        // Check to ensure only one copy of an audio element is allowed in the playing list.
        if (!this.music.includes(audio)) {
            this.music.push(audio);
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
        audio.muted = this.mute;
        audio.currentTime = 0;
        audio.play();
        // Check to ensure only one copy of an audio element is allowed in the playing list.
        if (!this.playing.includes(audio)) {
            this.playing.push(audio);
        }
        this.indexArr[path] = (this.indexArr[path] + 1) % audioArr.length;
    }

    /**
     * Pauses all currently playing sounds.
     */
    pauseSounds() {
        this.playing.forEach((audio) => {
            audio.pause();
        });
    }

    /**
    * Pauses all currently playing music.
    */
    pauseMusic() {
        this.music.forEach((audio) => {
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
        this.music.forEach((audio) => {
            audio.play();
        });
    }

    /**
     * Stops music by pausing all currently playing audio and then makes a fresh playing array.
     */
    stopAll() {
        this.pauseSounds();
        this.pauseMusic();
        this.playing = [];
        this.music = [];
    }

    /**
     * Checks to see if any audio clips have ended. If they have they are removed from the
     * list they belong to.
     */
    update() {
        this.volume = document.getElementById("volume").value;
        this.playing.forEach((audio) => {
            if (audio.ended) {
                this.playing.splice(this.playing.findIndex((a) => {
                    return a === audio;
                }), 1);
            }
            audio.volume = this.mute ? 0 : this.volume;
        });
        this.music.forEach((audio) => {
            if (audio.ended) {
                this.music.splice(this.music.findIndex((a) => {
                    return a === audio;
                }), 1);
            }
            audio.volume = this.mute ? 0 : this.volume;
        });
    }
}