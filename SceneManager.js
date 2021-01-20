// SceneManager
class SceneManager {
	constructor(game) {
		this.game = game;

		this.loadTestLevel();
	}

	loadTestLevel() {
		var player = new druid(this.game, randomInt(800), randomInt(600));
		this.game.addEntity(player)
		this.game.addEntity(new fly(this.game, player, randomInt(800), randomInt(600)));
	}
}
