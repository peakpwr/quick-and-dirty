class Player extends Phaser.GameObjects.Container {
  constructor(scene, x, y, playerId, toolGroup, damageGroup) {
    super(scene, x, y);
    scene.add.existing(this);
    this.playerId = playerId;
    this.speed = 0.2;

    this.playerSprite = scene.add.image(0, 0, 'PlayerSprite');
    this.add(this.playerSprite);

    this.scene.physics.world.enable(this)

    this.playerText = scene.add.text(-this.playerSprite.width, -this.playerSprite.height, 'Player ' + (this.playerId + 1), {fixedWidth: this.playerSprite.width * 2, align: 'center'});
    this.add(this.playerText);

    scene.input.gamepad.on('down', this.onButtonPress, this);

    this.toolGroup = toolGroup;
    this.damageGroup = damageGroup;
    this.activeTool = null;
  }

  onButtonPress(pad, button, index) {
    if(pad.index != this.playerId) {
      return; // Ignore other controllers
    }
    else if(button.index == 2) { // X
      if(this.activeTool != null) {
        this.useTool();
      }
    }
    else if(button.index == 0) { // A
      if(this.activeTool == null) {
        this.pickupTool(this.scene);
      } else {
        this.dropTool();
      }
    }
  }

  useTool() {
    if (this.activeTool != null) {
      this.physics.arcade.overlap(this.activeTool, this.damageGroup, this.handleTool, null, this );
      this.activeTool.use();
    }
  } 

  handleToolPickup(player, tool) {
    this.add(tool);
    this.activeTool = tool;
    this.activeTool.setPosition (0, 0);
  }

  dropTool() {
    this.scene.add.existing(this.activeTool)
    this.remove(this.activeTool)
    this.activeTool.setPosition (this.x, this.y);
    this.activeTool = null;
  }

  pickupTool() {
    console.log(this.activeTool);
    if (this.activeTool == null) {
      this.scene.physics.overlap(this, this.toolGroup, this.handleToolPickup, null, this );
    }
  }

  preUpdate(time, delta) {
    if(!this.pad) {
      this.pad = this.scene.input.gamepad.getPad(this.playerId);
      return;
    }

    this.x += delta * this.speed * this.pad.axes[0].getValue();
    this.y += delta * this.speed * this.pad.axes[1].getValue();
    //sprite.flipX = (axisH > 0);
  }
}

export default Player;
