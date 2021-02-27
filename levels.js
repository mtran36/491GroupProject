var levelOne = {
	music: [
		(game, params) => AUDIO_PLAYER.playMusic(params),
		"./Audio/Abstraction - Three Red Hearts - Rumble at the Gates.mp3"
	],
	parallax: [
		(game, params) => Background.construct(game, params),
		{
			spriteSheetName: "./Sprites/layer1.png",
			spriteWidth: 592,
			spriteHeight: 272,
			speedRate: -60
		},
		{
			spriteSheetName: "./Sprites/layer2.png",
			spriteWidth: 592,
			spriteHeight: 272,
			speedRate: -40
		},
		{
			spriteSheetName: "./Sprites/layer3.png",
			spriteWidth: 592,
			spriteHeight: 272,
			speedRate: -20
		},
		{
			spriteSheetName: "./Sprites/layer4.png",
			spriteWidth: 592,
			spriteHeight: 272,
			speedRate: 0
		}
	],
	ground: [
		(game, params) => Ground.construct(game, params),
		// Beginning
		{ x: -130, y: -15, width: 7, height: 20 },
		{ x: -130, y: -17, width: 32, height: 9 },
		{ x: -130, y: -2, width: 35, height: 15 },
		{ x: -76, y: -2, width: 3, height: 10 },
		{ x: -98, y: 2, width: 6, height: 1 },
		// Beginning platforms
		{ x: -80, y: -9, width: 4, height: 3 },
		{ x: -89, y: -2, width: 6, height: 3 },
		// Entrance
		{ x: -1, y: -1, width: 1, height: 2 },
		{ x: -100, y: 6, width: 112, height: 22 },
		{ x: 3, y: -9, width: 3, height: 12 },
		{ x: 32, y: -9, height: 22, width: 9 },
		{ x: 3, y: -9, width: 33, height: 8 },
		{ x: 20, y: 6, height: 15, width: 5 },
		{ x: 20, y: 6, height: 6, width: 15 },
		// Shaft platforms
		{ x: 9, y: 11, width: 6 },
		{ x: 18, y: 15, width: 2 },
		{ x: 15, y: 19, width: 2 },
		{ x: 12, y: 23, width: 2 },
		// Lower Area
		{ x: 11, y: 27, width: 45, height: 8 },
		{ x: 20, y: 20, width: 9 },
		{ x: 28, y: 20, height: 4 },
		{ x: 28, y: 23, width: 3 },
		{ x: 49, y: 20, width: 7 },
		{ x: 55, y: 20, height: 8 },
		{ x: 55, y: 13, height: 4 },

		{ x: -55, y: -9, width: 3, height: 13 },
		{ x: -54, y: 2, width: 3 },
		{ x: -50, y: 0, width: 3 },
		{ x: -54, y: -3, width: 3 },
		{ x: -50, y: -6, width: 3 },
	],
	tree: [
		(game, params) => Tree.construct(game, params),
		{ x: -92, y: -2 },
		{ x: -48, y: -2 }
	],
	treeTrunk: [
		(game, params) => TreeTrunk.construct(game, params),
		{ x: -92, y: -8 },
		{ x: -48, y: -8 }
	],
	branch: [
		(game, params) => Branch.construct(game, params),
		{ x: -93, y: -6, type: 5, isDark: true }
	],
	leaves: [
		(game, params) => Leaves.construct(game, params),
		{ x: -92, y: -8, type: 0 },
		{ x: -48, y: -9, type: 0 }
	],
	mask: [
		(game, params) => Mask.construct(game, params),
		{ x: 9, y: 11, width: 2 },
		{ x: 33, y: 5, width: 3, height: 6 },
		{ x: -99, y: 2, width: 3, height: 1 },
		{ x: -155, y: -15, width: 30, height: 20 },
		{ x: -101, y: 4, width: 4, height: 6 }
	],
	mesh: [
		(game, params) => Mesh.construct(game, params),
		{ x: -96, y: -2, width: 0.9, height: 0.5 },
		{ x: -88.9, y: -2, width: 0.9, height: 0.5 },
		{ x: -84, y: -2, width: 0.9, height: 0.5 },
		{ x: -79.9, y: -2, width: 0.9, height: 0.5 },
		{ x: -78, y: -2, width: 0.9, height: 0.5 },
		{ x: -76, y: -2, width: 0.9, height: 0.5 },
		{ x: -74, y: -2, width: 0.9, height: 0.5 },
		{ x: -77, y: -9, width: 0.9, height: 0.5 },
		{ x: -80, y: -9, width: 0.9, height: 0.5 },
		{ x: -53, y: -9, width: 0.9, height: 0.5 },
		{ x: -55, y: -9, width: 0.9, height: 0.5 }
	],
	standingBreakBlock: [
		(game, params) => StandingBreakBlock.construct(game, params),
		{ x: 15, y: 7, width: 2, blockType: 'Ground' },
		{ x: -84, y: -6, width: 2, blockType: 'Ground' },
		{ x: -70, y: 2, width: 2, blockType: 'Ground' }
	],
	flies: [
		(game, params) => Fly.construct(game, params),
		{ x: -5, y: 1, prizeRate: 0.2 }
	],
	rangedFlies: [
		(game, params) => RangedFly.construct(game, params),
		{ x: 11, y: 3 }
	],
	beetles: [
		(game, params) => Beetle.construct(game, params),
		{ x: -3, y: 4, prizeRate: 1 },
		{ x: -110, y: -5, prizeRate: 1, prize: 'PotionMid' }
	],
	flyBeetles: [
		(game, params) => FlyBeetle.construct(game, params),
		{ x: 10, y: 1, prizeRate: 1 },
		{ x: -92, y: 3, prizeRate: 1, prize: 'PotionHigh' }
	],
	hopper: [
		(game, params) => Hopper.construct(game, params),
		{ x: -2, y: 3 },
		{ x: -122, y: -5 }
	],
	powerups: [
		(game, params) => RangedPowerUp.construct(game, params),
		{ x: -122, y: -3 }
	],
	wingElement: [
		(game, params) => WindElement.construct(game, params),
		{ x: -78.5, y: -10 }
	],
	lightElement: [
		(game, params) => LightElement.construct(game, params),
		{ x: 29, y: 5 }
	],
}