let config = {
    type: Phaser.AUTO, // webgl or canvas
    width: 1280,
    height: 720,
    scene: new GameScene("Game", {
			rows: 2,
			cols: 5,
			cards: [1, 2, 3, 4, 5],
			spacing:5,
			levelTime:30,
		})
};

let game = new Phaser.Game(config);