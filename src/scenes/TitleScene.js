import Phaser from 'phaser';

class TitleScene extends Phaser.Scene {
  constructor() {
    super({
      key: 'TitleScene'
    })
  }

  preload() {
    console.log('loading title');
  }

  create() {
    this.playerCount = 4;
    this.make.text({
      x: this.game.config.width/2,
      y: 100,
      text: "Press any button to start",
      style: { font: "65px Arial", fill: "#CCC", align: "center"},
      origin: { x: 0.5, y: 0.5 },
      add: true
    });

    this.playerTexts = [];

    for(let i = 0; i < this.playerCount; i++) {
      this.playerTexts.push(this.createPlayerText(i));
    }
    this.scene.start('GameScene');
  }

  createPlayerText(playerId) {
    return this.make.text({
      x: 100,
      y: 400 + 100 * playerId,
      text: "Player " + (playerId + 1),
      style: { font: "50px Arial", fill: "#CCC", align: "left"},
      add: true
    });
  }
}

export default TitleScene;
