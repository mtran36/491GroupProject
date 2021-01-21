// SceneManager
class SceneManager {
	constructor(game) {
		this.game = game;

		this.loadTestLevel();
	}

	loadTestLevel() {
		var player = new Druid(this.game, randomInt(800), randomInt(600));
		this.game.addEntity(player)
		this.game.addEntity(new Fly(this.game, player, randomInt(800), randomInt(600)));
		this.game.addEntity(new Beetle(this.game, 0, this.game.surfaceHeight - 64));
		this.game.addEntity(new Hopper(this.game, player, 0, randomInt(600)))
	}
}
