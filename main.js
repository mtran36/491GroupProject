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
	"./Sprites/layer4.png",
	"./Sprites/greengem.png",
	"./Sprites/energyball.png",
	"./Sprites/bluegem.png",
	"./Sprites/tornado.png",
	"./Sprites/yellowgem.png",
	"./Sprites/thunder.png",
	"./Sprites/crack.png",
	"./Sprites/druidmerge.png",
	"./Sprites/potions.png"
]
const AUDIO_PATHS = [
	{ path: "./Audio/Abstraction - Three Red Hearts - Rumble at the Gates.mp3", players: 1 },
	{ path: "./Audio/Potion.mp3", players: 1 },
	{ path: "./Audio/DruidJump.mp3", players: 1 },
	{ path: "./Audio/DruidDeath.mp3", players: 1 },
	{ path: "./Audio/SwordAttack.mp3", players: 1 },
	{ path: "./Audio/DruidDamage.mp3", players: 1 },
	{ path: "./Audio/EnemyDeath.mp3", players: 4 },
	{ path: "./Audio/EnemyDamage.mp3", players: 4 },
	{ path: "./Audio/Hopper.mp3", players: 4 },
	{ path: "./Audio/EnemyProjectile.mp3", players: 4 },
	{ path: "./Audio/EnemyBounce.mp3", players: 4 },
	{ path: "./Audio/FlyBuzz.mp3", players: 2 }
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
	canvas.focus();
	GAME_ENGINE.init(canvas);
	new Scene(GAME_ENGINE);
});
