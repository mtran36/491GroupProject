var levelOne = {
	music: "./Audio/Abstraction - Three Red Hearts - Rumble at the Gates.mp3",
	background: [{attribute: 'style', value: 'background: cyan'}],
	ground: [
		// Entrance
		{ x: -1, y: -1, width: 3, height: 3 },
		{ x: -10, y: 6, width: 22, height: 22 },
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
		{ x: 55, y: 13, height: 4 }
	],
	mask: [
		{ x: 9, y: 11, width: 2 },
		{ x: 33, y: 5, width: 3, height: 6 }
	],
	standingBreakBlock: [
		{ x: 15, y: 7, width: 2, blockType: 'Ground'}
	],
	flies: [
		{ x: -5, y: 1, prizeRate: 0.2 }
	],
	rangedFlies: [
		{ x: 11, y: 3 }
	],
	beetles: [
		{ x: -3, y: 4, prizeRate: 1 }
	],
	flyBeetles: [
		{ x: 10, y: 1, prizeRate: 1 }
	],
	hopper: [
		{ x: -2, y: 3 }
	],
	powerups: [
		{ x: 25, y: 5 }
	]
}