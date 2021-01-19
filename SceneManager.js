// SceneManager
class SceneManager {
	constructor(game) {
		this.game = game;
	}

	loadTestLevel() {
		this.game.addEntity(new fly(this.game, Math.random() * this.game.surfaceWidth, Math.random() * this.game.surfaceHeight));
	}
}
