var levelOne = {
	music: [
		(game, params) => AUDIO_PLAYER.playMusic(params),
		"./Audio/Abstraction - Three Red Hearts - Rumble at the Gates.mp3"
	],
	parallax: [
		(game, params) => Background.construct(game, params), {
			spriteSheetName: "./Sprites/layer1.png",
			spriteWidth: 592,
			spriteHeight: 272,
			speedRate: -60
		}, {
			spriteSheetName: "./Sprites/layer2.png",
			spriteWidth: 592,
			spriteHeight: 272,
			speedRate: -40
		}, {
			spriteSheetName: "./Sprites/layer3.png",
			spriteWidth: 592,
			spriteHeight: 272,
			speedRate: -20
		}, {
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
		{ x: 45, y: 35, width: 55, height: 9 },

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
		
	// A1:
		// Right and left ladder wall:
		{ x: 88, y: 80, width: 20, height: 55 },
		{ x: 79, y: 100, width: 6, height: 15 },
		// Ceiling:
		{ x: 0, y: 105, width: 30, height: 9 },
		{ x: 20, y: 100, width: 34, height: 8 },
		{ x: 70, y: 100, width: 15, height: 8 },
		// Left pillar:
		{ x: 37, y: 114, width: 6, height: 10 },
		{ x: 36, y: 117, width: 8, height: 1 },
		// Mana heart platform:
		{ x: 60, y: 114, width: 5, height: 4 },
		// Ladder:
		{ x: 82, y: 112, width: 5, height: 1 },
		{ x: 82, y: 104, width: 5, height: 1 },
		{ x: 86, y: 116, width: 6, height: 1 },
		{ x: 86, y: 108, width: 6, height: 1 },
		// Ground:
		{ x: 0, y: 120, width: 92, height: 15 },
	// Pre A1:
		{ x: -65, y: 113, width: 13, height: 10 },
		{ x: -67, y: 117, width: 6, height: 4 },
		{ x: -41, y: 100, width: 4, height: 30 },
		{ x: -41, y: 100, width: 17, height: 30 },
		{ x: -100, y: 120, width: 102, height: 13 },

		{ x: -56, y: 116, width: 7, height: 1 },
		{ x: -44, y: 114, width: 6, height: 3 },
		{ x: -49, y: 106, width: 4, height: 3 },
		{ x: -28, y: 103, width: 10, height: 3 },

		{ x: -15, y: 98, width: 7, height: 16 },
		{ x: -13, y: 112, width: 9, height: 3 },
		{ x: -22, y: 98, width: 14, height: 3 }
	],
	groundMask: [
		(game, params) => Mask.construct(game, params),
		// Pre A1
		{ x: -100, y: 104, width: 10, height: 15 },
		{ x: -63, y: 114, width: 4, height: 6 },
		{ x: -65, y: 119, width: 11, height: 2 },
		{ x: -39, y: 120, width: 13, height: 1 },
		{ x: -56, y: 116, width: 3, height: 1 },
		{ x: -40, y: 114, width: 3, height: 3 },
		{ x: -49, y: 100, width: 9, height: 6 },
		{ x: -49, y: 70, width: 11, height: 30 },
		{ x: -28, y: 103, width: 3, height: 3 },
		{ x: -13, y: 112, width: 3, height: 1 },
		{ x: -11, y: 114, width: 6, height: 6 },
		// A1
		{ x: 39, y: 115, width: 2, height: 5 },
		{ x: 89, y: 108, width: 3, height: 1 },
		{ x: 89, y: 116, width: 3, height: 1 },
		{ x: 81, y: 112, width: 3, height: 1 },
		{ x: 81, y: 104, width: 3, height: 1 }
	],
	mesh: [
		(game, params) => Mesh.construct(game, params),
		{ x: -61.75, y: 97.15, width: 7, height: 1 }
	],
	wood: [
		(game, params) => Wood.construct(game, params),
	// A2
		// Right and left pillar:
		{ x: 70, y: 94, length: 6, type: 1, isVertical: 1 },
		{ x: 51, y: 94, length: 6, type: 1, isVertical: 1 },
		// Filler blocks
		{ x: 71, y: 100, length: 1, type: 0, isVertical: 0 },
		{ x: 51, y: 100, length: 2, type: 0, isVertical: 0 },
	// A1
		// Entrance:
		{ x: 0, y: 92, length: 22, type: 4, isVertical: 1 },
		{ x: 0, y: 120, length: 10, type: 4, isVertical: 1 },
		{ x: 0, y: 119, length: 12, type: 0, isVertical: 0 },
		{ x: 0, y: 114, length: 12, type: 0, isVertical: 0 },
		{ x: 4, y: 115, length: 3, type: 1, isVertical: 0 },
		{ x: 3, y: 115, length: 1, type: 0, isVertical: 0 },
		{ x: 7, y: 115, length: 1, type: 0, isVertical: 0 },
		// Planks:
		{ x: 24, y: 113, length: 2, type: 1, isVertical: 1 },
		{ x: 20, y: 118, length: 2, type: 0, isVertical: 1 },
		{ x: 20, y: 118, length: 2, type: 0, isVertical: 1 },
		{ x: 29, y: 118, length: 2, type: 0, isVertical: 1 },
		{ x: 61, y: 113, length: 3, type: 0, isVertical: 0 },
	// Pre A1
		// Starting house:
		{ x: -100, y: 114, length: 5, type: 0, isVertical: 1 },
		{ x: -91, y: 114, length: 3, type: 0, isVertical: 1 },
		{ x: -100, y: 119, length: 10, type: 0, isVertical: 0 },
		{ x: -100, y: 114, length: 5, type: 0, isVertical: 0 },
		{ x: -92, y: 114, length: 2, type: 0, isVertical: 0 },
		{ x: -96, y: 115, length: 2, type: 0, isVertical: 0 },
		{ x: -100, y: 110, length: 4, type: 0, isVertical: 1 },
		{ x: -100, y: 109, length: 11, type: 0, isVertical: 0 },
		{ x: -91, y: 110, length: 4, type: 0, isVertical: 1 },
		{ x: -100, y: 105, length: 4, type: 0, isVertical: 1 },
		{ x: -100, y: 104, length: 10, type: 0, isVertical: 0 },
		{ x: -91, y: 105, length: 2, type: 0, isVertical: 1 },
		{ x: -98, y: 108, length: 3, type: 0, isVertical: 0 },
		// Bridge building:
		{ x: -49, y: 70, length: 35, type: 0, isVertical: 1 },
		{ x: -48, y: 101, length: 1, type: 0, isVertical: 0 },
		{ x: -44, y: 100, length: 6, type: 1, isVertical: 0 },
		{ x: -45, y: 101, length: 1, type: 0, isVertical: 0 },
		{ x: -49, y: 105, length: 5, type: 0, isVertical: 0 },
		{ x: -40.5, y: 102, length: 4, type: 1, isVertical: 1 },
		{ x: -41.5, y: 105, length: 1, type: 0, isVertical: 0 },
		{ x: -39, y: 70, length: 26, type: 0, isVertical: 1 },
		{ x: -43, y: 96, length: 3, type: 0, isVertical: 0 },
		{ x: -40, y: 96, length: 2, type: 1, isVertical: 1 },
		{ x: -49, y: 92, length: 2, type: 1, isVertical: 1 },
		{ x: -47, y: 92, length: 6, type: 0, isVertical: 0 },
		{ x: -43, y: 88, length: 3, type: 0, isVertical: 0 },
		{ x: -40, y: 88, length: 2, type: 1, isVertical: 1 },
		{ x: -49, y: 84, length: 2, type: 1, isVertical: 1 },
		{ x: -44, y: 80, length: 4, type: 0, isVertical: 0 },
		{ x: -40, y: 80, length: 2, type: 1, isVertical: 1 },
		{ x: -44, y: 76, length: 2, type: 0, isVertical: 0 },
		{ x: -49, y: 67, length: 11, type: 2, isVertical: 0 },
		{ x: -48, y: 72, length: 4, type: 0, isVertical: 0 },
		// Before entrance:
		{ x: -7, y: 114, length: 2, type: 1, isVertical: 1 },
		{ x: -7, y: 118, length: 2, type: 1, isVertical: 1 },
		{ x: -12, y: 114, length: 6, type: 0, isVetical: 1 },
		{ x: -11, y: 119, length: 4, type: 0, isVertical: 0 },
		{ x: -11, y: 114, length: 4, type: 0, isVertical: 0 },
		{ x: -16, y: 94, length: 4, type: 2, isVertical: 1 }
	],
	pedestal: [
		(game, params) => Wood.constructPedestal(game, params),
		{ x: -79.5, y: 119 },
		{ x: -33, y: 99 }
	],
	tree: [
		(game, params) => Tree.construct(game, params),
		// Tree 1
		{ x: -85, y: 112 },
		// Tree 2
		{ x: -75, y: 112 },
		// Tree 3
		{ x: -70, y: 112 },
		// Tree 4
		{ x: -63, y: 105 },
		// Tree 5
		{ x: -60, y: 105 },
		// Tree 6
		{ x: -57, y: 105 },
		// Tree 7
		{ x: -44, y: 106 },
		// Tree ?? last
		{ x: -4, y: 112 },

		{ x: -8, y: 104 },

		{ x: -24, y: 112 }, 

		{ x: -20, y: 112 },

		{ x: -17, y: 112 }
	],
	trunk: [
		(game, params) => TreeTrunk.construct(game, params),
		// Tree 1
		{ x: -85, y: 106 },
		// Tree 3
		{ x: -70, y: 106 },
		// Tree 4
		{ x: -63, y: 99 },
		// Tree 5
		{ x: -60, y: 99 },
		// Tree 6
		{ x: -57, y: 99 },
		// Tree ?? last
		{ x: -4, y: 106 },

		{ x: -8, y: 98 },

		{ x: -20, y: 106 }
	],
	branch: [
		(game, params) => Branch.construct(game, params),
		// Tree 1
		{ x: -86, y: 116.5, type: 5, isDark: true },
		{ x: -83, y: 113, type: 5, isDark: false },
		{ x: -85, y: 109.5, type: 4, isDark: true },
		// Tree 2
		{ x: -75, y: 115, type: 1, isDark: true },
		{ x: -73, y: 113, type: 2, isDark: false },
		// Tree 3
		{ x: -70, y: 115, type: 0, isDark: true },
		{ x: -68, y: 110, type: 3, isDark: false },
		{ x: -71, y: 110, type: 3, isDark: true },
		// Tree 4
		{ x: -63, y: 107, type: 2, isDark: true },
		{ x: -64, y: 104, type: 5, isDark: true },
		{ x: -64, y: 100, type: 5, isDark: true },
		{ x: -61, y: 104, type: 5, isDark: false },
		// Tree 5
		{ x: -60, y: 109, type: 4, isDark: true },
		// Tree 6
		{ x: -55, y: 105.5, type: 5, isDark: false },
		{ x: -55, y: 108, type: 2, isDark: false },
		{ x: -57, y: 102, type: 2, isDark: true },
		// Tree 7
		{ x: -42, y: 111, type: 2, isDark: false },
		{ x: -45, y: 107, type: 5, isDark: true },
		// Tree ?? last
		{ x: -2, y: 116, type: 3, isDark: false },

		{ x: -9, y: 109, type: 3, isDark: true },
		{ x: -6, y: 101, type: 4, isDark: false },

		{ x: -21, y: 116, type: 5, isDark: true },
		{ x: -22, y: 114, type: 3, isDark: false },

		{ x: -18, y: 107, type: 2, isDark: false },
	],
	leaves: [
		(game, params) => Leaves.construct(game, params),
		// Tree 1
		{ x: -87, y: 116, type: 1 },
		{ x: -86.75, y: 109.25, type: 1 },
		{ x: -83.75, y: 112.5, type: 0 },
		// Tree 3
		{ x: -67.95, y: 109.25, type: 4 },
		{ x: -71.05, y: 109.25, type: 2 },
		// Tree 4
		{ x: -61.75, y: 103.5, type: 0 },
		{ x: -65, y: 103.5, type: 1 },
		{ x: -65, y: 99.5, type: 1 },
		// Tree 5
		{ x: -61.5, y: 109, type: 1 },
		// Tree 6
		{ x: -55.9, y: 105, type: 0 },
		{ x: -57.9, y: 101.5, type: 2 },
		// Tree 7
		{ x: -42.25, y: 110.5, type: 4 },
		{ x: -46.25, y: 106.5, type: 1 },
		// Tree ?? last
		{ x: -2, y: 115.25, type: 4 },
		{ x: -9, y: 108.25, type: 2 },
		{ x: -7.25, y: 100.75, type: 0 },
		{ x: -22.25, y: 115.25, type: 1 },
		{ x: -22, y: 113.25, type: 4 },
		{ x: -18.25, y: 106.5, type: 4 }
	],
	treeTop: [
		(game, params) => Leaves.constructTop(game, params),
		// Tree 1
		{ x: -75.3, y: 109.5 },
		// Tree 2
		{ x: -85.3, y: 103.5 },
		// Tree 3
		{ x: -70.4, y: 103.5 },
		// Tree 4
		{ x: -57.3, y: 96.5 },
		// Tree 5
		{ x: -60.3, y: 96.5 },
		// Tree 6
		{ x: -63.3, y: 96.5 },
		// Tree ?? last
		{ x: -4.3, y: 104 },

		{ x: -17.5, y: 109.25 }
	],
	standingBreakBlock: [
		(game, params) => StandingBreakBlock.construct(game, params),
	// A5:
		{ x: 89, y: 50, width: 2, blockType: "Ground" },
		{ x: 84, y: 49, width: 2, blockType: "Ground" },
		{ x: 79, y: 50, width: 2, blockType: "Ground" },
		{ x: 74, y: 50, width: 2, blockType: "Ground" },
		{ x: 69, y: 50, width: 2, blockType: "Ground" },
		{ x: 64, y: 50, width: 2, blockType: "Ground" },
		{ x: 56, y: 50, width: 3, blockType: "Ground" },
		{ x: 53, y: 55, width: 6, blockType: "Ground" },
	// A4:
		{ x: 62, y: 74, width: 5, blockType: "Ground" },
	// A2:
		// Platforms:
		{ x: 48, y: 97, width: 2, blockType: "Wood3" },
		{ x: 55, y: 94, width: 2, blockType: "Wood2" },
		{ x: 60, y: 94, width: 2, blockType: "Wood2" },
		{ x: 65, y: 94, width: 2, blockType: "Wood2" },
		{ x: 68, y: 97, width: 2, blockType: "Wood2" },
		{ x: 72, y: 97, width: 2, blockType: "Wood2" },
		// Breaking ground:
		{ x: 53, y: 100, width: 3, blockType: "Wood3" },
		{ x: 56, y: 100, width: 3, blockType: "Wood3" },
		{ x: 59, y: 100, width: 3, blockType: "Wood3" },
		{ x: 62, y: 100, width: 3, blockType: "Wood3" },
		{ x: 65, y: 100, width: 3, blockType: "Wood3" },
		{ x: 68, y: 100, width: 3, blockType: "Wood3" }
	],
	potion: [
		(game, params) => Potion.construct(game, params),
		{ x: -74, y: 100, type: 0 },
		{ x: -52, y: 119, type: 1 },
		{ x: -14.5, y: 93, type: 2 }
	],
	levelUpStone: [
		(game, params) => LevelUpStone.construct(game, params),
		// A1
		{ x: 37, y: 119 },

		{ x: 53, y: 99 },
		{ x: 93, y: 79 },
		{ x: -6, y: 57 },
		{ x: 39, y: 13 },
	],
	hitBreakBlock: [
		(game, params) => HitBreakBlock.construct(game, params),
		// Pre A1
		{ x: -7, y: 116, width: 1, height: 1, blockType: "Wood0" },
		{ x: -12, y: 96, width: 1, height: 1, blockType: "Wood0" },
		{ x: -18, y: 96, width: 1, height: 1, blockType: "Wood0" },

		{ x: -14, y: 119, width: 1, height: 1, blockType: "Wood1" },
		{ x: -13, y: 118, width: 1, height: 1, blockType: "Wood1" },
		{ x: -14.5, y: 93, width: 1, height: 1, blockType: "Wood1" },

		// A1
		{ x: 36, y: 117, width: 5, height: 5, blockType: "Ground" },

		// secret room:
		{ x: 35, y: 56, width: 4, height: 4, blockType: "Ground" }
	],
	maskGround: [
		(game, params) => Ground.construct(game, params),
		{ x: 0, y: 120, width: 92, height: 15 }
	],
	breakMask: [
		(game, params) => Mask.construct(game, params),
		{ x: 39, y: 115, width: 2, height: 5 },
		{ x: 90, y: 120, width: 4, height: 6 }
	],
	door: [
		(game, params) => Door.construct(game, params),
		{ x: 47, y: 22 },
		{ x: 5, y: 117 },
		{ x: -91, y: 117 },
		{ x: -91, y: 107 },
		{ x: -39, y: 98 }
	],
	key: [
		(game, params) => Key.construct(game, params),
		{ x: -98, y: 113 },
		{ x: -47, y: 70 },
		{ x: -13, y: 118 }
	],
	flies: [
		(game, params) => Fly.construct(game, params),
		// A2:
		{ x: 80, y: 87 },
		{ x: 70, y: 85 },
		{ x: 60, y: 85 },
		{ x: 50, y: 85 },
		{ x: 45, y: 85 },
		{ x: -17, y: 104 },
		{ x: -6, y: 108 },
		{ x: -7, y: 108 },
		{ x: -23, y: 118 }
	],
	rangedFlies: [
		(game, params) => RangedFly.construct(game, params),
		{ x: -23, y: 118 },
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
		// Pre A1
		{ x: -61, y: 111, prizeRate: 0 },
		{ x: -61, y: 95, prizeRate: 1, prize: "Key" },
		{ x: -20, y: 96, prizeRate: 0 },
		// A1:
		{ x: 15, y: 118 },
		{ x: 23, y: 118 },
		{ x: 35, y: 118, prizeRate: 1 },
		{ x: 50, y: 118 },
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
		// Pre A1
		{ x: -59, y: 100, prizeRate: 0.1, prize: "Potion" },
		{ x: -49, y: 118, prizeRate: 0.1, prize: "Potion" },
		{ x: -47, y: 95.5, prizeRate: 0.1, prize: "Potion" },
		{ x: -48, y: 87.5, prizeRate: 0.1, prize: "Potion" },
		{ x: -46, y: 79.5, prizeRate: 0.1, prize: "Potion" },
		{ x: -47, y: 83.5, prizeRate: 0.1, prize: "Potion" },
		{ x: -42, y: 75.5, prizeRate: 0.1, prize: "Potion" },
		{ x: -44, y: 71.5, prizeRate: 0.1, prize: "Potion" },
		{ x: -16, y: 115, prizeRate: 0.1, prize: "Potion" },
		// A1:
		{ x: 60, y: 115, prizeRate: 0.1, prize: "Potion" },
		{ x: 60, y: 117, prizeRate: 0.1, prize: "Potion" },
		{ x: 70, y: 117, prizeRate: 0.1, prize: "Potion" },
		{ x: 75, y: 115, prizeRate: 0.1, prize: "Potion" },
		// A3:
		{ x: 6, y: 80 },
		// A4:
		{ x: 90, y: 72, prizeRate: 0.1, prize: "Potion" },
		{ x: 90, y: 64, prizeRate: 0.1, prize: "Potion" },
		{ x: 90, y: 61, prizeRate: 0.1, prize: "Potion" },
		// A5:
		{ x: 60, y: 44, prizeRate: 0.1, prize: "Potion" },
		{ x: 60, y: 45, prizeRate: 0.1, prize: "Potion" },
		{ x: 70, y: 46, prizeRate: 0.1, prize: "Potion" },
		{ x: 80, y: 47, prizeRate: 0.1, prize: "Potion" }
	],
	hopper: [
		(game, params) => Hopper.construct(game, params),
		{ x: 2, y: 117 },
		// A4:
		{ x: 40, y: 75, prizeRate: 0.3, prize: "PotionMid" },
		// A5:
		{ x: 75, y: 50 },
		{ x: 65, y: 55 },
		{ x: 40, y: 55 },
		{ x: 76, y: 118 }
	],
	mantis: [
		(game, params) => Mantis.construct(game, params),
		{ x: 74, y: 97, prizeRate: 0.5, prize: "PotionHigh" },
		{ x: 42, y: 54, prizeRate: 1, prize: "PotionHigh" }
	],
	sword: [
		(game, params) => SwordPowerup.construct(game, params),
		{ x: -79.2, y: 118 }
	],
	earthElement: [
		(game, params) => RangedPowerUp.construct(game, params),
		{ x: -32.5, y: 98 }
	],
	wingElement: [
		(game, params) => WindElement.construct(game, params),
		//{ x: 83, y: 99 }
	],
	lightElement: [
		(game, params) => LightElement.construct(game, params),
		{ x: 28, y: 79 },
	],
	healthPowerup: [
		(game, params) => HealthPowerup.construct(game, params),
		{ x: 1, y: 89 },
		{ x: -97, y: 107 }
	],
	manaPowerup: [
		(game, params) => ManaPowerup.construct(game, params),
		{ x: -10, y: 118 },
		{ x: 62, y: 112 }
	],
	boss: [
		(game, params) => LionBoss.construct(game, params),
		{x: 70, y: 30}
	],
	secretMask: [
		(game, params) => SecretMask.construct(game, params),
		{ x: -11, y: 114, width: 4, height: 6 }
	],
	druid: [
		(game, params) => Druid.construct(game, params),
		// Druid start
		//{ x: -97, y: 117 }
		// Test start
		{ x: 11, y: 92 }
	]
};

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
		{ x: -50, y: -6, width: 3 }
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
		{ x: -84, y: -6, width: 2, blockType: "Ground" },
		{ x: -70, y: 2, width: 2, blockType: "Ground" }
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
		{ x: -110, y: -5, prizeRate: 1, prize: "PotionMid" }
	],
	flyBeetles: [
		(game, params) => FlyBeetle.construct(game, params),
		{ x: -92, y: 5, prizeRate: 1, prize: "PotionHigh" }
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
};