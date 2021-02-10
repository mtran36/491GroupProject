var GAME_ENGINE = new GameEngine();
var ASSET_MANAGER = new AssetManager();
var AUDIO_PLAYER = new AudioPlayer();

ASSET_MANAGER.queueImgDownload("./Sprites/TestFly.png");
ASSET_MANAGER.queueImgDownload("./Sprites/TestBeetle.png");
ASSET_MANAGER.queueImgDownload("./Sprites/TestHopper.png");
ASSET_MANAGER.queueImgDownload("./Sprites/druid.png");
ASSET_MANAGER.queueImgDownload("./Sprites/ground.png");
ASSET_MANAGER.queueImgDownload("./Sprites/ball.png");
ASSET_MANAGER.queueImgDownload("./Sprites/sword.png");
ASSET_MANAGER.queueImgDownload("./Sprites/testpotion.png");
ASSET_MANAGER.queueImgDownload("./Sprites/door.png");
ASSET_MANAGER.queueImgDownload("./Sprites/key.png");
ASSET_MANAGER.queueAudioDownload("./Audio/TestAudio.mp3", 1);

ASSET_MANAGER.downloadAll(function () {
	var canvas = document.getElementById('gameWorld');
	var context = canvas.getContext('2d');

	GAME_ENGINE.init(context);
	new SceneManager(GAME_ENGINE);
	GAME_ENGINE.start();
});
