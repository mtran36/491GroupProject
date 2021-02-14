const GAME_ENGINE = new GameEngine();
const ASSET_LOADER = new AssetLoader();
const AUDIO_PLAYER = new AudioPlayer();
const IMAGE_PATHS = [
	"./Sprites/TestFly.png",
	"./Sprites/TestBeetle.png",
	"./Sprites/TestHopper.png",
	"./Sprites/druid.png",
	"./Sprites/ground.png",
	"./Sprites/ball.png",
	"./Sprites/sword.png",
	"./Sprites/testpotion.png",
	"./Sprites/door.png",
	"./Sprites/key.png",
	"./Sprites/TestEnemyAttack.png",
	"./Sprites/layer1.png",
	"./Sprites/layer2.png",
	"./Sprites/layer3.png",
	"./Sprites/layer4.png"
]
const AUDIO_PATHS = [
	{ path: "./Audio/TestMusic.mp3", players: 1 },
	{ path: "./Audio/TestSound.mp3", players: 4 }
]

// ENTRY POINT
IMAGE_PATHS.forEach(function (path) {
	ASSET_LOADER.queueImageDownload(path);
});
AUDIO_PATHS.forEach(function (params) {
	ASSET_LOADER.queueAudioDownload(params.path, params.players);
});
ASSET_LOADER.downloadAll(function () {
	let canvas = document.getElementById('gameWorld');
	GAME_ENGINE.init(canvas);
	new Scene(GAME_ENGINE);
});
