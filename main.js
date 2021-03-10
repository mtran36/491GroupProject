const GAME_ENGINE = new GameEngine();
const ASSET_LOADER = new AssetLoader();
const AUDIO_PLAYER = new AudioPlayer();
const IMAGE_PATHS = [
	"./Sprites/Fly.png",
	"./Sprites/Snail.png",
	"./Sprites/SnailAngry.png",
	"./Sprites/Bee.png",
	"./Sprites/HopperStart.png",
	"./Sprites/HopperJump.png",
	"./Sprites/Hopper.png",
	"./Sprites/Mantis.png",
	"./Sprites/druid.png",
	"./Sprites/DruidJumpEffect.png",
	"./Sprites/ground.png",
	"./Sprites/ball.png",
	"./Sprites/sword.png",
	"./Sprites/testpotion.png",
	"./Sprites/door.png",
	"./Sprites/key.png",
	"./Sprites/TestEnemyAttack.png",
	"./Sprites/TestEnemyHomingAttack.png",
	"./Sprites/layer1.png",
	"./Sprites/layer2.png",
	"./Sprites/layer3.png",
	"./Sprites/layer4.png",
	"./Sprites/greengem.png",
	"./Sprites/bluegem.png",
	"./Sprites/yellowgem.png",
	"./Sprites/greygem.png",
	"./Sprites/HealthPowerup.png",
	"./Sprites/Stone.png",
	"./Sprites/energyball.png",
	"./Sprites/EnergyBallExplosion.png",
	"./Sprites/tornado.png",
	"./Sprites/thunder.png",
	"./Sprites/LightningBolt.png",
	"./Sprites/HitEffect.png",
	"./Sprites/ThunderHitEffect.png",
	"./Sprites/TornadoHitEffect.png",
	"./Sprites/EnergyBallHitEffect.png",
	"./Sprites/crack.png",
	"./Sprites/druidmerge.png",
	"./Sprites/potions.png",
	"./Sprites/powerupsUI.png",
	"./Sprites/LevelUpScreen.png",
	"./Sprites/puffBoom.png",
	"./Sprites/select.png",
	"./Sprites/select2.png",
	"./Sprites/transparency.png",
	"./Sprites/tree.png"
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
	{ path: "./Audio/EnemyHoming.mp3", players: 4},
	{ path: "./Audio/EnemyBounce.mp3", players: 4 },
	{ path: "./Audio/FlyBuzz.mp3", players: 2 },
	{ path: "./Audio/PuffBoom.mp3", players: 2 },
	{ path: "./Audio/MantisCackle.mp3", players: 2 },
	{ path: "./Audio/Key.mp3", players: 1 }
]

// ENTRY POINT
window.onkeydown = function (e) {
	// Stop spacebar from scrolling screen
	return !(e.keyCode == 32);
};
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
