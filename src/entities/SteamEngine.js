const dropZoneSize = 50;

class SteamFurnace extends Phaser.GameObjects.Container {
  constructor(scene, id) {
    super(scene, 218 - dropZoneSize, id === 1 ? 0 : 376 - 125);

    this.dropZone = scene.add
      .zone(dropZoneSize / 2, 125 / 2)
      .setSize(dropZoneSize, 125);
    this.add(this.dropZone);
    scene.physics.world.enable(this.dropZone, 0);
  }
}

export default class SteamEngine extends Phaser.GameObjects.Container {
  constructor(scene) {
    super(scene, 106, 352);

    const graphics = scene.make.graphics(218, 376);
    graphics.fillStyle(0xff0000, 0.2);
    graphics.fillRect(0, 0, 218, 376);
    this.add(graphics);

    this.furnace1 = new SteamFurnace(scene, 1);
    this.add(this.furnace1);
    this.furnace2 = new SteamFurnace(scene, 2);
    this.add(this.furnace2);

    scene.add.existing(this);
  }
}
