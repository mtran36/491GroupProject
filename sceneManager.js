// SceneManager
class SceneManager {
	constructor(game) {
		this.game = game;

		this.loadTestLevel();
	}

	loadTestLevel() {
		var player = new Druid(this.game, randomInt(800), randomInt(600));
		this.game.addEntity(player)
		this.game.addEntity(new fly(this.game, player, randomInt(800), randomInt(600)));
		this.game.addEntity(new beetle(this.game, 0, this.game.surfaceHeight - 64));
		this.game.addEntity(new hopper(this.game, player, 100, randomInt(600)))
	}
}
