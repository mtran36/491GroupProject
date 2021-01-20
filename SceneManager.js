// SceneManager
class SceneManager {
	constructor(game) {
		this.game = game;

		this.loadTestLevel();
	}

	loadTestLevel() {
		var player = new druid(this.game, 300, 100);
		this.game.addEntity(player)
		this.game.addEntity(new fly(this.game, player, 200, 200));
	}
}
