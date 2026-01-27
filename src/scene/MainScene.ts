import * as PIXI from 'pixi.js';
import { sdk } from '@smoud/playable-sdk';
import { Character } from '../entities/Character';
import { Shelf } from '../entities/Shelf';
import { Sofa } from '../entities/Sofa';
import { RoundControls } from '../ui/organisms/RoundControls';

export class MainScene {
  private floorBg: PIXI.TilingSprite;
  private wallBg: PIXI.TilingSprite;
  private character: Character;
  private shelf: Shelf;
  private sofa: Sofa;
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
    this.shelf.scale.set(entityScale);
    this.sofa.scale.set(entityScale);

    // Делаем ширину sofa равной 30% ширины экрана
    const targetSofaWidth = width * 0.3;
    const sofaBaseWidth = this.sofa.width || 1;
    const sofaScale = targetSofaWidth / sofaBaseWidth;
    this.sofa.scale.set(sofaScale);

    // shelf слева внизу (на полу)
    this.shelf.x = 0;
    this.shelf.y = centerOfWaterY;

    // sofa справа внизу (на полу)
    this.sofa.x = width * 0.8;
    this.sofa.y = centerOfWaterY;

    if (this.interactionCount === 0) {
      // персонаж стартует на shelf
      this.character.x = this.shelf.x;
      this.character.y = this.shelf.y;
    } else {
      this.character.x = this.sofa.x;
      this.character.y = this.sofa.y;
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
    this.shelf = new Shelf();
    this.sofa = new Sofa();
    this.character = new Character();

    this.app.stage.addChild(this.shelf, this.sofa, this.character);
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
      // find coordinates for character to jump from shelf to sofa
      const toX = this.sofa.x;
      const tempY = this.character.y;
      const sofaTopSurfaceY = this.sofa.y - this.sofa.height;
      this.character.placeOn(sofaTopSurfaceY);
      const toY = this.character.y;
      this.character.y = tempY;

      void this.character.jumpTo(toX, toY);
    } else {
      sdk.install();
    }

    this.interactionCount++;
  }
}
