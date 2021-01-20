var gameEngine = new GameEngine();

var ASSET_MANAGER = new AssetManager();

ASSET_MANAGER.queueDownload("./Sprites/TestEnemy.png");
ASSET_MANAGER.queueDownload("./Sprites/TestPlayer.png");

ASSET_MANAGER.downloadAll(function () {
	var canvas = document.getElementById('gameWorld');
	var ctx = canvas.getContext('2d');

	new SceneManager(gameEngine);

	gameEngine.init(ctx);

	gameEngine.start();
});
