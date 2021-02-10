
class AudioPlayer {
    constructor() {
        this.indexArr = [];
    }

    playMusic(path) {
        if (!this.indexArr[path]) {
            this.indexArr[path] = 0;
        }
        let i = this.indexArr[path];
        let audio = ASSET_MANAGER.getAudioAsset(path);
        audio[i].loop = true;
        audio[i].play();
    }
}