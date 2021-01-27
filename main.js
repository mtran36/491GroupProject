var GAME_ENGINE = new GameEngine();
var ASSET_MANAGER = new AssetManager();

ASSET_MANAGER.queueDownload("./Sprites/TestFly.png");
ASSET_MANAGER.queueDownload("./Sprites/TestBeetle.png");
ASSET_MANAGER.queueDownload("./Sprites/TestHopper.png");
ASSET_MANAGER.queueDownload("./Sprites/druid.png");
ASSET_MANAGER.queueDownload("./Sprites/ground.png");
ASSET_MANAGER.queueDownload("./Sprites/ball.png");

ASSET_MANAGER.downloadAll(function () {
	var canvas = document.getElementById('gameWorld');
	var context = canvas.getContext('2d');

	GAME_ENGINE.init(context);
	new SceneManager(GAME_ENGINE);
	GAME_ENGINE.start();
});
