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

    const floorTexture = this.floorBg.texture;
    const wallTexture = this.wallBg.texture;

    const totalTextureHeight = floorTexture.height + wallTexture.height;
    const bgScale = height / totalTextureHeight;

    this.floorBg.scale.set(bgScale);
    this.wallBg.scale.set(bgScale);

    const wallHeight = wallTexture.height * bgScale;
    const floorHeight = floorTexture.height * bgScale;

    this.floorBg.width = width / bgScale;
    this.floorBg.position.set(0, height);

    this.wallBg.width = width / bgScale;
    this.wallBg.position.set(0, height - floorHeight);

    const entityScale = Math.min(width / 400, height / 600) * 0.5;

    // position between wall and floor
    const floorY = height - floorHeight;

    this.character.scale.set(entityScale);
    this.shelf.scale.set(entityScale);
    this.sofa.scale.set(entityScale);

    // place on center of the wall
    this.shelf.x = width * 0.25;
    this.shelf.placeOn(wallHeight / 2);

    // place sofa on top of the floor
    const sofaHeight = this.sofa.height;
    const sofaTargetY = floorY + sofaHeight * 0.3;

    this.sofa.x = width * 0.7;
    this.sofa.placeOn(sofaTargetY);

    if (this.interactionCount === 0) {
      this.character.x = this.shelf.x;
      this.character.placeOn(this.shelf.y);
    } else {
      const sofaTopY = sofaTargetY - this.sofa.height;
      this.character.x = this.sofa.x;
      this.character.placeOn(sofaTopY);
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
