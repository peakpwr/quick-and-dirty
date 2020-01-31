import Phaser from 'phaser';

import PlayerSprite from "../assets/player.png";
import HammerSprite from "../assets/hammer.png";

class BootScene extends Phaser.Scene {
  constructor() {
    super({
      key: 'BootScene'
    })
  }

  preload() {
    

    var progressBar = this.add.graphics();
    var progressBox = this.add.graphics();
    progressBox.fillStyle(0x444444, 0.8);
    progressBox.fillRect(240, 270, 320, 50);
    this.load.on('progress', function (value) {
      console.log(value);
      progressBar.clear();
      progressBar.fillStyle(0xffffff, 1);
      progressBar.fillRect(250, 280, 300 * value, 30);
    });
                
    this.load.on('fileprogress', function (file) {
        console.log(file.src);
    });
    
    this.load.on('complete', function () {
      progressBar.destroy();
      progressBox.destroy();
      console.log('complete');
    });
    console.log('loading boot');
    //this.load.image('name', 'path.png');
    this.load.image('PlayerSprite', PlayerSprite);
    this.load.image('HammerSprite', HammerSprite);
  }

  create() {
    console.log('complete Boot, changing to TitleScene');
    // #TODO Add loading indicator
    this.scene.start('TitleScene');
  }
}

export default BootScene;
