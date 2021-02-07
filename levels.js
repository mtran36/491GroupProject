var levelOne = {
	grounds: [
		// Ground
		{ x: 0, y: 1, size: 100 },
		{ x: 0, y: 2, size: 1 },

		// Left Platform
		{ x: 0, y: 5, size: 3 }, { x: 0, y: 6, size: 2 },
		{ x: 0, y: 7, size: 1 }, { x: 0, y: 8, size: 1 },
		{ x: 0, y: 9, size: 1 }, { x: 0, y: 10, size: 1 },

		// Right Platform
		{ x: 1, y: 7, size: 1 }, { x: 1, y: 8, size: 1 },
		{ x: 1, y: 9, size: 1 }, { x: 1, y: 10, size: 1 }],

	middle: [
		// Middle Patform
		{ x: 6, y: 7, size: 5 }, { x: 8, y: 8, size: 1 },
		{ x: 6, y: 6, size: 1 }, { x: 10, y: 6, size: 1 },
		{ x: 13, y: 5, size: 3 }, { x: 14, y: 6, size: 2 }],

	flies: [{ x: 5, y: 10 }, { x: 5.5, y: 10 }, { x: 11, y: 4, prize: "Key", prizeRate: 1 }],

	rangedFlies: [{x:5, y:7, prizeRate: 0.75}],

	beetles: [{ x: 11, y: 10, prize: "Potion", prizeRate: 1 }],

	flyBeetles: [{x: 2, y: 5, prizeRate: 1}],

	hopper: [{ x: 1, y: 10 , prizeRate: 0.5}],

	potions: [{ x: 1, y: 1 }],  //Temporary

	keys: [{ x: 10, y: 4 }],	//Temporary

	doors: [{ x: 13, y: 8 }],		//Temporary

	powerups: [{x: 10, y: 1}]
};