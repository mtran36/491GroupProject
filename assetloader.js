class AssetLoader {
    constructor() {
        this.successCount = 0;
        this.errorCount = 0;
        this.playerCount = 0;
        // Asset storage arrays
        this.imageCache = [];
        this.audioCache = [];
        // Asset download paths parallel with storage arrays
        this.imageQueue = [];
        this.audioQueue = [];
    };

    /**
     * Adds the image source path to the download queue to be acquired.
     * @param {String} path Location of the image asset.
     */
    queueImageDownload(path) {
        console.log("Queueing " + path);
        this.imageQueue.push(path);
    };

    /**
     * Adds the audio source path and amount of audio players to be created 
     * to the download queue.
     * @param {String} path Location of the audio asset.
     * @param {number} amount Integer amount of audio players to create.
     */
    queueAudioDownload(path, amount) {
        console.log("Queueing " + path);
        this.audioQueue.push({ path, amount });
    }

    /** 
     * Returns whether or not all downloads have been completed. 
     */
    isDone() {
        return this.imageQueue.length + this.playerCount
            === this.successCount + this.errorCount;
    };

    /**
     * Downloads each image and audio placed into the download queues.
     * @param {Function} callback Function to be called when all downloads are done.
     */
    downloadAll(callback) {
        let download, player;
        let that = this;
        let players = null;
        let image = null;
        let audio = null;
        let path = null;

        if (this.imageQueue.length === 0) {
            setTimeout(callback, 10);
        }
        AUDIO_PATHS.forEach((params) => {
            this.playerCount += params.players;
        });
        // Download images.
        for (download = 0; download < this.imageQueue.length; download++) {
            image = new Image();
            path = this.imageQueue[download];
            console.log(path);
            image.addEventListener("load", function () {
                console.log("Loaded " + this.src);
                that.successCount++;
                if (that.isDone()) {
                    callback();
                }
            });
            image.addEventListener("error", () => {
                console.log("Error loading " + this.src);
                this.errorCount++;
                if (that.isDone()) {
                    callback();
                }
            });
            image.src = path;
            this.imageCache[path] = image;
        }
        // Download audio files.
        if (this.audioQueue.length === 0) {
            setTimeout(callback, 10);
        }
        for (download = 0; download < this.audioQueue.length; download++) {
            players = [];
            path = this.audioQueue[download].path;
            for (player = 0; player < this.audioQueue[download].amount; player++) {
                audio = new Audio();
                audio.hidden = true;
                audio.autoplay = false;
                console.log(path);
                audio.addEventListener("loadeddata", function () {
                    console.log("Loaded " + this.src);
                    that.successCount++;
                    if (that.isDone()) {
                        callback();
                    }
                });
                audio.addEventListener("error", function () {
                    console.log("Error loading " + this.src);
                    that.errorCount++;
                    if (that.isDone()) {
                        callback();
                    }
                });
                audio.setAttribute('src', path);
                players.push(audio);
            }
            this.audioCache[path] = players;
        }
    };

    /**
     * Returns the desired image asset.
     * @param {String} path String location of the image. Same used to queue download.
     */
    getImageAsset(path) {
        return this.imageCache[path];
    };

    /**
     * Returns the desired audio asset.
     * @param {String} path String location of the audio file. Same used to queue download.
     */
    getAudioAsset(path) {
        return this.audioCache[path];
    }
};

