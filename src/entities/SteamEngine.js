const engineWorldPositionX = 106;
const engineWorldPositionY = 352;

const engineAreaWidth = 218;
const engineAreaHeight = 376;

const dropZoneWidth = 50;
const dropZoneHeight = 125;

export default class SteamEngine extends Phaser.GameObjects.Container {
  constructor(scene, zoneGroup, damageGroup) {
    super(scene, engineWorldPositionX, engineWorldPositionY);

    this.scene = scene;
    this.damageGroup = damageGroup;

    this.generateAnimations(scene);

    this.furnaceArray = [
      this.createFurnace(0, scene, zoneGroup),
      this.createFurnace(1, scene, zoneGroup),
    ];

    scene.add.existing(this);

    this.lastUpdate = new Date();
    setTimeout(() => this.updateGameLogic(), 500);
  }

  updateGameLogic() {
    const now = new Date();
    const timeDelta = now - this.lastUpdate;

    // Update global game state
    const {
      engineTemperatureDecreaseFactor,
      engineTemperatureMaximum,
      engineTemperatureOptimal,
    } = this.scene.game.settings;

    const nextEngineTemperature =
      this.scene.game.state.engineTemperature -
      timeDelta * engineTemperatureDecreaseFactor
      * this.damageGroup.children.entries.filter((d) => { return d.damageType == 'PIPE_WRENCH'}).length;

    // Clip temp between 0 and max-temp
    if (nextEngineTemperature <= 0) {
      this.scene.game.state.engineTemperature = 0;
    } else if (nextEngineTemperature >= engineTemperatureMaximum) {
      this.scene.game.state.engineTemperature = engineTemperatureMaximum;
    } else {
      this.scene.game.state.engineTemperature = nextEngineTemperature;
    }

    // Calculate engine efficency, ranges between 0 and 1.25
    this.scene.game.state.engineEfficency =
      this.scene.game.state.engineTemperature / engineTemperatureOptimal;

    this.lastUpdate = now;
    setTimeout(() => this.updateGameLogic(), 500);
  }

  teleportTool(zone, tool) {
    const { identifier } = zone;
    const { toolType } = tool;
    const { engineTemperaturePerCoalDrop } = this.scene.game.settings;

    const furnace = this.furnaceArray[identifier];

    if (toolType === 'COAL') {
      furnace.anims.play('open-engine-door');
      console.log('feed the engine #', identifier, 'with', toolType);

      this.scene.game.state.engineTemperature += engineTemperaturePerCoalDrop;

      tool.destroy();
    }
  }

  generateAnimations(scene) {
    scene.anims.create({
      key: 'open-engine-door',
      frames: scene.anims.generateFrameNumbers('EngineDoorSpriteSheet', {
        start: 0,
        end: 31,
        first: 0,
      }),
      frameRate: 30,
      repeat: false,
    });
  }

  createFurnace(identifier, scene, zoneGroup) {
    const positionX = engineAreaWidth - dropZoneWidth;
    // First starts from top, the second from bottom
    const positionY = identifier === 0 ? 0 : engineAreaHeight - dropZoneHeight;

    const dropZoneCenterX = dropZoneWidth / 2;
    const dropZoneCenterY = dropZoneHeight / 2;

    const dropZone = scene.add
      .zone(dropZoneCenterX + positionX, dropZoneCenterY + positionY)
      .setSize(dropZoneWidth, dropZoneHeight);
    dropZone.identifier = identifier;
    this.add(dropZone);
    scene.physics.world.enable(dropZone, 0);
    zoneGroup.add(dropZone);

    const furnaceSprite = scene.add.sprite(
      positionX,
      positionY + dropZoneCenterY,
      'EngineDoorSpriteSheet',
    );
    this.add(furnaceSprite);
    furnaceSprite.anims.play('open-engine-door');

    return furnaceSprite;
  }
}
