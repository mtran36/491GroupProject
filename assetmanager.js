class AssetManager {
    constructor() {
        this.successCount = 0;
        this.errorCount = 0;
        this.imgCache = [];
        this.audioCache = [];
        this.downloadImgQueue = [];
        this.downloadAudioQueue = [];
    };

    /**
     * Adds the image source path to the download queue to be acquired.
     * @param {String} path String location of the image.
     */
    queueImgDownload(path) {
        console.log("Queueing " + path);
        this.downloadImgQueue.push(path);
    };

    /**
     * Adds the audio source path and amount of audio players to be created 
     * to the download queue.
     * @param {string} path
     * @param {int} amt
     */
    queueAudioDownload(path, amt) {
        console.log("Queueing " + path);
        this.downloadAudioQueue.push({path, amt});
    }

    /** Returns whether or not all downloads have been completed. */
    isDone() {
        return this.downloadImgQueue.length + this.downloadAudioQueue.length
            === this.successCount + this.errorCount;
    };

    /**
     * Downloads each image and audio placed into the download queues.
     * @param {Function} callback Function to be called when all downloads are done.
     */
    downloadAll(callback) {
        if (this.downloadImgQueue.length === 0) {
            setTimeout(callback, 10);
        }
        // Download images.
        for (var i = 0; i < this.downloadImgQueue.length; i++) {
            var img = new Image();
            var that = this;
            var path = this.downloadImgQueue[i];
            console.log(path);
            img.addEventListener("load", function () {
                console.log("Loaded " + this.src);
                that.successCount++;
                if (that.isDone()) callback();
            });
            img.addEventListener("error", function () {
                console.log("Error loading " + this.src);
                that.errorCount++;
                if (that.isDone()) callback();
            });
            img.src = path;
            this.imgCache[path] = img;
        }
        // Download audio files.
        if (this.downloadAudioQueue.length === 0) {
            setTimeout(callback, 10);
        }
        for (var i = 0; i < this.downloadAudioQueue.length; i++) {
            var audioArr = [];
            var path = this.downloadAudioQueue[i].path;
            for (var j = 0; j < this.downloadAudioQueue[i].amt; j++) {
                var audio = new Audio();
                audio.hidden = true;
                audio.autoplay = false;
                var that = this;
                console.log(path);
                audio.addEventListener("loadeddata", function () {
                    console.log("Loaded " + this.src);
                    that.successCount++;
                    if (that.isDone()) callback();
                });
                audio.addEventListener("error", function () {
                    console.log("Error loading " + this.src);
                    that.errorCount++;
                    if (that.isDone()) callback();
                });
                audio.setAttribute('src', path);
                audioArr.push(audio);
            }
            this.audioCache[path] = audioArr;
        }
    };

    /**
     * Returns the desired image asset.
     * @param {String} path String location of the image. Same used to queue download.
     */
    getImgAsset(path) {
        return this.imgCache[path];
    };

    /**
     * Returns the desired audio asset.
     * @param {string} path String location of the audio file. Same used to queue download.
     */
    getAudioAsset(path) {
        return this.audioCache[path];
    }
};

