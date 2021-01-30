var levelOne = {
	grounds: [
		// Ground
		{ x: 0, y: 1, size: 16 },
		{ x: 0, y: 2, size: 1 }, { x: 1, y: 2, size: 1 },

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

	flies: [{ x: 1, y: 1 }, { x: 1, y: 1 }],

	beetles: [{ x: 200, y: 2 }],

	hopper: [{ x: 700, y: 2}]
};