// SceneManager
class SceneManager {
	constructor(game) {
		this.game = game;
		// connect sceneManager to game engine so game engine can update sceneManager
		this.game.camera = this;

		this.druid = new Druid(this.game, params.canvasWidth - 700, 50);

		this.loadTestLevel();
	}

	loadTestLevel() {
	
		//this.game.addEntity(new Fly(this.game, player, randomInt(800), randomInt(600)));
		//this.game.addEntity(new Beetle(this.game, 0, this.game.surfaceHeight - 64));
		//this.game.addEntity(new Hopper(this.game, player, 0, randomInt(600)))

		let ground = new Ground(this.game, 0, params.canvasHeight - params.tileWidth, 16);
		this.game.addEntity(ground);

		ground = new Ground(this.game, 0, params.canvasHeight - params.tileWidth * 2, 1);
		this.game.addEntity(ground);

		ground = new Ground(this.game, params.canvasWidth - params.tileWidth, params.canvasHeight - params.tileWidth *2, 1);
		this.game.addEntity(ground);

		ground = new Ground(this.game, params.canvasWidth - params.tileWidth * 5, params.canvasHeight - params.tileWidth * 5, 3);
		this.game.addEntity(ground);

		this.game.addEntity(this.druid);
	}

	update() {
		// debug check box detection
		params.debug = document.getElementById("debug").checked;
	};
}
