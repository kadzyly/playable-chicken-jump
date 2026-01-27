import * as PIXI from 'pixi.js';
import { sdk } from '@smoud/playable-sdk';
import { Character } from '../entities/Character';
import { StartIsland } from '../entities/StartIsland';
import { Ice } from '../entities/Ice';
import { RoundControls } from '../ui/organisms/RoundControls';

export class MainScene {
  private floorBg: PIXI.TilingSprite;
  private wallBg: PIXI.TilingSprite;
  private character: Character;
  private startIsland: StartIsland;
  private ice: Ice;
  private interactionCount = 0;
  private roundControls!: RoundControls;

  constructor(private app: PIXI.Application) {
    this.createBackground();
    this.createEntities();
    this.createBottomUI();
    this.setupInteraction();
  }

  public resize(width: number, height: number): void {
    if (!this.floorBg || !this.wallBg) return;

    this.roundControls.updatePosition(width, height);

    // Высоты зон: стена 60%, пол 40%
    const wallHeight = height * 0.6;
    const floorHeight = height * 0.4;

    // Настраиваем фон стены (сверху, занимает 60% высоты)
    this.wallBg.scale.set(1);
    this.wallBg.width = width;
    this.wallBg.height = wallHeight;
    this.wallBg.position.set(0, wallHeight);

    // Настраиваем фон пола (снизу, занимает 40% высоты)
    this.floorBg.scale.set(1);
    this.floorBg.width = width;
    this.floorBg.height = floorHeight;
    this.floorBg.position.set(0, height);

    const entityScale = Math.min(width / 400, height / 600) * 0.5;

    const waterTopY = height - floorHeight;
    const centerOfWaterY = waterTopY + floorHeight / 2;

    this.character.scale.set(entityScale);
    this.startIsland.scale.set(entityScale);
    this.ice.scale.set(entityScale);

    // Делаем ширину ice равной 30% ширины экрана
    const targetIceWidth = width * 0.3;
    const iceBaseWidth = this.ice.width || 1;
    const iceScale = targetIceWidth / iceBaseWidth;
    this.ice.scale.set(iceScale);

    // startIsland слева внизу (на полу)
    this.startIsland.x = 0;
    this.startIsland.y = centerOfWaterY;

    // ice справа внизу (на полу)
    this.ice.x = width * 0.8;
    this.ice.y = centerOfWaterY;

    if (this.interactionCount === 0) {
      // персонаж стартует на startIsland
      this.character.x = this.startIsland.x;
      this.character.y = this.startIsland.y;
    } else {
      this.character.x = this.ice.x;
      this.character.y = this.ice.y;
    }
  }

  private createBackground(): void {
    const floorTexture = PIXI.Assets.get('bgFloor');
    const wallTexture = PIXI.Assets.get('bgWall');

    floorTexture.source.addressModeX = 'repeat';
    wallTexture.source.addressModeX = 'repeat';

    this.floorBg = new PIXI.TilingSprite({
      texture: floorTexture,
      width: 1,
      height: floorTexture.height
    });

    this.wallBg = new PIXI.TilingSprite({
      texture: wallTexture,
      width: 1,
      height: wallTexture.height
    });

    this.floorBg.anchor.set(0, 1);
    this.wallBg.anchor.set(0, 1);

    this.app.stage.addChild(this.wallBg, this.floorBg);
  }

  private createEntities(): void {
    this.startIsland = new StartIsland();
    this.ice = new Ice();
    this.character = new Character();

    this.app.stage.addChild(this.startIsland, this.ice, this.character);
  }

  private createBottomUI() {
    const { width, height } = this.app.screen;
    this.roundControls = new RoundControls(width, height);
    this.app.stage.addChild(this.roundControls);
  }

  private setupInteraction(): void {
    this.app.stage.eventMode = 'static';
    this.app.stage.hitArea = this.app.screen;

    this.app.stage.on('pointerdown', () => this.onClick());

    sdk.start();
  }

  private onClick(): void {
    if (this.interactionCount === 0) {
      // find coordinates for character to jump from startIsland to ice
      const toX = this.ice.x;
      const tempY = this.character.y;
      const iceTopSurfaceY = this.ice.y - this.ice.height;
      this.character.placeOn(iceTopSurfaceY);
      const toY = this.character.y;
      this.character.y = tempY;

      void this.character.jumpTo(toX, toY);
    } else {
      sdk.install();
    }

    this.interactionCount++;
  }
}
