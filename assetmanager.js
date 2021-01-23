class AssetManager {
    constructor() {
        this.successCount = 0;
        this.errorCount = 0;
        this.cache = [];
        this.downloadQueue = [];
    };

    /**
     * Adds the image source path to the download queue to be acquired.
     * @param {String} path String location of the image.
     */
    queueDownload(path) {
        console.log("Queueing " + path);
        this.downloadQueue.push(path);
    };

    /** Returns whether or not all downloads have been completed. */
    isDone() {
        return this.downloadQueue.length === this.successCount + this.errorCount;
    };

    /**
     * Downloads each image placed into the download queue.
     * @param {Function} callback Function to be called when all images are downloaded.
     */
    downloadAll(callback) {
        if (this.downloadQueue.length === 0) {
            setTimeout(callback, 10);
        }
        for (var i = 0; i < this.downloadQueue.length; i++) {
            var img = new Image();
            var that = this;
            var path = this.downloadQueue[i];
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
            this.cache[path] = img;
        }
    };

    /**
     * Returns the desired asset.
     * @param {String} path String location of the image. Same used to queue download.
     */
    getAsset(path) {
        return this.cache[path];
    };
};

