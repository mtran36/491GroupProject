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
ASSET_MANAGER.queueImgDownload("./Sprites/TestEnemyAttack.png");
ASSET_MANAGER.queueImgDownload("./Sprites/layer1.png");
ASSET_MANAGER.queueImgDownload("./Sprites/layer2.png");
ASSET_MANAGER.queueImgDownload("./Sprites/layer3.png");
ASSET_MANAGER.queueImgDownload("./Sprites/layer4.png");
ASSET_MANAGER.queueAudioDownload("./Audio/TestMusic.mp3", 1);
ASSET_MANAGER.queueAudioDownload("./Audio/TestSound.mp3", 4);

ASSET_MANAGER.downloadAll(function () {
	var canvas = document.getElementById('gameWorld');
	canvas.focus();

	GAME_ENGINE.init(canvas);
	new SceneManager(GAME_ENGINE);
});
