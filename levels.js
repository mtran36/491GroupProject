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
		// A6 (boss room):
		{ x: 45, y: 25, width: 5, height: 12 },
		{ x: 45, y: 10, width: 5, height: 13 },

		// A5:
		// secret room:
		{ x: -8, y: 58, width: 5, height: 3 },
		{ x: -10, y: 60, width: 50, height: 1 },
		{ x: 5, y: 55, width: 33, height: 1 },
		{ x: -11, y: 45, width: 3, height: 16 },
		{ x: 4, y: 45, width: 3, height: 11 },
		{ x: -11, y: 45, width: 18, height: 3 },

		{ x: 54, y: 42, width: 3, height: 11 },
		{ x: 53, y: 51, width: 2, height: 1 },
		{ x: 58, y: 50, width: 3, height: 7 },
		// right platform:
		{ x: 75, y: 57, width: 8, height: 7 },
		// top left platform:
		{ x: 37, y: 50, width: 13, height: 1 },
		// ladder:
		{ x: 38, y: 46, width: 3, height: 1 },
		{ x: 41, y: 42, width: 2, height: 1 },
		{ x: 43, y: 38, width: 3, height: 1 },
		{ x: 41, y: 34, width: 2, height: 1 },
		{ x: 38, y: 30, width: 3, height: 1 },
		{ x: 43, y: 28, width: 3, height: 1 },
		{ x: 38, y: 22, width: 3, height: 1 },
		{ x: 43, y: 18, width: 3, height: 1 },
		{ x: 38, y: 14, width: 3, height: 1 },
		{ x: 35, y: 9, width: 4, height: 49 },
		// ceiling:
		{ x: 45, y: 35, width: 55, height: 9},

		// A4:
		// left platform:
		{ x: 45, y: 77, width: 5, height: 5 },
		{ x: 49, y: 74, width: 10, height: 8 },
		// right platform:
		{ x: 78, y: 77, width: 5, height: 5 },
		{ x: 70, y: 74, width: 10, height: 8 },
		// ladder:
		{ x: 88, y: 61, width: 3, height: 1 },
		{ x: 88, y: 65, width: 4, height: 1 },
		{ x: 85, y: 60, width: 4, height: 13 },
		{ x: 95, y: 53, width: 2, height: 1 },
		{ x: 94, y: 57, width: 3, height: 1 },
		{ x: 95, y: 69, width: 2, height: 1 },
		{ x: 94, y: 73, width: 3, height: 1 },
		{ x: 93, y: 77, width: 4, height: 1 },
		{ x: 96, y: 20, width: 4, height: 60 },
		// ceiling:
		{ x: 35, y: 60, width: 52, height: 5 },

		// A3:
		// lower tunnel:
		{ x: 10, y: 95, width: 29, height: 1 },
		{ x: 15, y: 90, width: 22, height: 1 },
		{ x: 8, y: 92, width: 3, height: 4 },
		{ x: 14, y: 87, width: 3, height: 4 },
		{ x: 0, y: 92, width: 11, height: 1 },
		{ x: 5, y: 87, width: 12, height: 1 },
		// lower tunnel ladder:
		{ x: -2, y: 78, width: 3, height: 16 },
		{ x: 4, y: 83, width: 3, height: 5 },
		{ x: 0, y: 90, width: 2, height: 1 },
		{ x: 3, y: 86, width: 2, height: 1 },
		// upper tunnel:
		{ x: 4, y: 83, width: 21, height: 1 },
		{ x: -2, y: 78, width: 21, height: 1 },
		// upper tunnel ladder:
		{ x: 17, y: 70, width: 3, height: 10 },
		{ x: 23, y: 80, width: 3, height: 4 },
		// upper tunnel:
		{ x: 17, y: 70, width: 20, height: 1 },
		{ x: 23, y: 80, width: 15, height: 2 },
		{ x: 35, y: 60, width: 4, height: 12 },

		// A2:
		// left platforms:
		{ x: 37, y: 97, width: 6, height: 4 },
		{ x: 37, y: 99, width: 8, height: 2 },
		{ x: 35, y: 95, width: 4, height: 6 },
		{ x: 35, y: 80, width: 4, height: 12 },
		// celling:
		{ x: 35, y: 80, width: 24, height: 5 },
		{ x: 70, y: 80, width: 30, height: 5 },
		// left pillar:
		{ x: 50, y: 94, width: 3, height: 7 },
		// right pillar:
		{ x: 70, y: 94, width: 3, height: 7 },

		// A1:
		// left pillar:
		{ x: 39, y: 117, width: 2, height: 1 },
		{ x: 42, y: 118, width: 2, height: 1 },
		{ x: 40, y: 114, width: 3, height: 10 },
		// right pillar:
		{ x: 59, y: 116, width: 2, height: 1 },
		{ x: 62, y: 117, width: 2, height: 1 },
		{ x: 60, y: 113, width: 3, height: 10 },
		// ladder:
		{ x: 82, y: 112, width: 4, height: 1 },
		{ x: 82, y: 104, width: 4, height: 1 },
		{ x: 80, y: 100, width: 4, height: 15 },
		{ x: 86, y: 116, width: 3, height: 1 },
		{ x: 86, y: 108, width: 3, height: 1 },
		{ x: 88, y: 80, width: 4, height: 42 },
		// ground:
		{ x: 0, y: 105, width: 15, height: 20 },
		{ x: 0, y: 120, width: 92, height: 15 },
		// celling:
		{ x: 0, y: 105, width: 30, height: 9 },
		{ x: 20, y: 100, width: 34, height: 8 },
		{ x: 70, y: 100, width: 15, height: 8 },
	],
	mask: [
		(game, params) => Mask.construct(game, params),
		{ x: 6, y: 113, width: 7, height: 10 }
	],
	standingBreakBlock: [
		(game, params) => StandingBreakBlock.construct(game, params),
		// A2:
		{ x: 48, y: 97, width: 2, blockType: 'Ground' },
		{ x: 55, y: 94, width: 2, blockType: 'Ground' },
		{ x: 60, y: 94, width: 2, blockType: 'Ground' },
		{ x: 65, y: 94, width: 2, blockType: 'Ground' },
		{ x: 69, y: 97, width: 2, blockType: 'Ground' },
		{ x: 72, y: 97, width: 2, blockType: 'Ground' },
		// breaking ground:
		{ x: 53, y: 100, width: 3, blockType: 'Ground' },
		{ x: 56, y: 100, width: 3, blockType: 'Ground' },
		{ x: 59, y: 100, width: 3, blockType: 'Ground' },
		{ x: 62, y: 100, width: 3, blockType: 'Ground' },
		{ x: 65, y: 100, width: 3, blockType: 'Ground' },
		{ x: 68, y: 100, width: 3, blockType: 'Ground' },
		// A4:
		{ x: 62, y: 74, width: 5, blockType: 'Ground' },
		// A5:
		{ x: 89, y: 50, width: 2, blockType: 'Ground' },
		{ x: 84, y: 49, width: 2, blockType: 'Ground' },
		{ x: 79, y: 50, width: 2, blockType: 'Ground' },
		{ x: 74, y: 50, width: 2, blockType: 'Ground' },
		{ x: 69, y: 50, width: 2, blockType: 'Ground' },
		{ x: 64, y: 50, width: 2, blockType: 'Ground' },
		{ x: 56, y: 50, width: 3, blockType: 'Ground' },
		{ x: 53, y: 55, width: 6, blockType: 'Ground' },
	],
	hitBreakBlock: [
		(game, params) => HitBreakBlock.construct(game, params),
		// secret room:
		{ x: 35, y: 56, width: 4, height: 4, blockType: 'Ground' },

	],
	door: [
		(game, params) => Door.construct(game, params),
		{ x: 47, y: 22},
	],
	flies: [
		(game, params) => Fly.construct(game, params),
		// A2:
		{ x: 80, y: 87 },
		{ x: 70, y: 85 },
		{ x: 60, y: 85 },
		{ x: 50, y: 85 },
		{ x: 45, y: 85 }
	],
	rangedFlies: [
		(game, params) => RangedFly.construct(game, params),
		// A2:
		{ x: 40, y: 90 },
		// A3:
		{ x: 25, y: 72 },
		// A4:
		{ x: 60, y: 65, prizeRate: 0.5, prize: "PotionMid" },
		{ x: 70, y: 65, prizeRate: 0.5, prize: "PotionMid" }
	],
	beetles: [
		(game, params) => Beetle.construct(game, params),
		// A1:
		{ x: 40, y: 118 },
		{ x: 50, y: 118, prizeRate: 1 },
		{ x: 70, y: 118 },
		// A3:
		{ x: 15, y: 93 },
		{ x: 10, y: 90, prizeRate: 1 },
		{ x: 6, y: 81 },
		// A4:
		{ x: 50, y: 72 },
		{ x: 70, y: 72, prizeRate: 1 },
		// A5:
		{ x: 40, y: 45, prizeRate: 1, prize: "Key" }
	],
	flyBeetles: [
		(game, params) => FlyBeetle.construct(game, params),
		// A1:
		{ x: 60, y: 115 },
		{ x: 70, y: 117 },
		{ x: 75, y: 115 },
		// A3:
		{ x: 6, y: 80 },
		// A4:
		{ x: 90, y: 72 },
		{ x: 90, y: 64 },
		{ x: 90, y: 61 },
		// A5:
		{ x: 60, y: 44, prizeRate: 1, prize: "PotionMid" },
		{ x: 60, y: 45 },
		{ x: 70, y: 46 },
		{ x: 80, y: 47 },
	],
	hopper: [
		(game, params) => Hopper.construct(game, params),
		// A4:
		{ x: 40, y: 75, prizeRate: 0.3, prize: "PotionMid" },
		// A5:
		{ x: 75, y: 50 },
		{ x: 65, y: 55 },
		{ x: 40, y: 55 },
	],
	mantis: [
		(game, params) => Mantis.construct(game, params),
		{ x: 74, y: 97, prizeRate: 0.5, prize: "PotionHigh" },
		{ x: 42, y: 54, prizeRate: 1, prize: "PotionHigh" }
	],
	earthElement: [
		(game, params) => RangedPowerUp.construct(game, params),
		{ x: 15, y: 119 }
	],
	wingElement: [
		(game, params) => WindElement.construct(game, params),
		{ x: 83, y: 99 }
	],
	lightElement: [
		(game, params) => LightElement.construct(game, params),
		{ x: 28, y: 79 },
		{ x: 45, y: 30 },
	],
	healthPowerup: [
		(game, params) => HealthPowerup.construct(game, params),
		{ x: 1, y: 89 }
	],
	boss: [
		(game, params) => LionBoss.construct(game, params),
		{x: 70, y: 30}
  ],
	levelUpStone: [
		(game, params) => LevelUpStone.construct(game, params),
		{ x: 53, y: 99 },
		{ x: 93, y: 79 },
		{ x: -6, y: 57 },
		{ x: 39, y: 13 }
	]
}

var levelTwo = {
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
		{ x: 20, y: 15, width: 2 },
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
		{ x: -76, y: -2, width: 0.9, height: 0.5 },
		{ x: -74, y: -2, width: 0.9, height: 0.5 },
		{ x: -77, y: -9, width: 0.9, height: 0.5 },
		{ x: -80, y: -9, width: 0.9, height: 0.5 },
		{ x: -53, y: -9, width: 0.9, height: 0.5 },
		{ x: -55, y: -9, width: 0.9, height: 0.5 }
	],
	standingBreakBlock: [
		(game, params) => StandingBreakBlock.construct(game, params),
		{ x: -84, y: -6, width: 2, blockType: 'Ground' },
		{ x: -70, y: 2, width: 2, blockType: 'Ground' }
	],
	flies: [
		(game, params) => Fly.construct(game, params),
		{ x: -5, y: 10, prizeRate: 0.2 }
	],
	rangedFlies: [
		(game, params) => RangedFly.construct(game, params),
		{ x: 11, y: 3 }
	],
	beetles: [
		(game, params) => Beetle.construct(game, params),
		{ x: -110, y: -5, prizeRate: 1, prize: 'PotionMid' }
	],
	flyBeetles: [
		(game, params) => FlyBeetle.construct(game, params),
		{ x: -92, y: 5, prizeRate: 1, prize: 'PotionHigh' }
	],
	hopper: [
		(game, params) => Hopper.construct(game, params),
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
	]
}