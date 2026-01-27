import * as PIXI from 'pixi.js';
import { sdk } from '@smoud/playable-sdk';
import { Character } from '../entities/Character';
import { StartIsland } from '../entities/StartIsland';
import { Ice } from '../entities/Ice';
import { RoundControls } from '../ui/organisms/RoundControls';

export class MainScene {
  private world: PIXI.Container;
  private waterBg: PIXI.TilingSprite;
  private skyBg: PIXI.TilingSprite;
  private character: Character;
  private startIsland: StartIsland;
  private ices: Ice[] = [];
  private roundControls!: RoundControls;

  // 0 - start island, then platforms (ice)
  private currentPlatformIndex = 0;
  private readonly totalPlatforms = 7;
  private worldWidth = 0;
  private isJumping = false;

  constructor(private app: PIXI.Application) {
    this.world = new PIXI.Container();
    this.app.stage.addChild(this.world);

    this.createBackground();
    this.createEntities();
    this.createBottomUI();
    this.setupInteraction();

    // camera follow the character
    this.app.ticker.add(this.updateCamera, this);

    sdk.start();
  }

  public resize(width: number, height: number): void {
    if (!this.waterBg || !this.skyBg) return;

    this.roundControls.updatePosition(width, height);

    // heights: sky 60%, water 40%
    const skyHeight = height * 0.62;
    const waterHeight = height * 0.38;

    const entityScale = Math.min(width / 400, height / 600) * 0.5;

    const waterTopY = height - waterHeight;
    const centerOfWaterY = waterTopY + waterHeight / 2;

    this.character.scale.set(entityScale);
    this.startIsland.scale.set(entityScale);
    this.ices.forEach((ice) => ice.scale.set(entityScale));

    // ice width = 30% of screen
    const targetIceWidth = width * 0.3;
    this.ices.forEach((ice) => {
      const iceBaseWidth = ice.width || 1;
      const iceScale = targetIceWidth / iceBaseWidth;
      ice.scale.set(iceScale);
    });

    // horizontal placement of platforms
    // - at the first: start island and one ice
    // - next: 2 ices on the screen
    this.startIsland.x = 0;
    this.startIsland.y = centerOfWaterY;

    const firstIceOffsetX = width * 0.6;
    const iceStepX = width * 0.6;

    this.ices.forEach((ice, index) => {
      ice.x = firstIceOffsetX + index * iceStepX;
      ice.y = centerOfWaterY;
    });

    const lastIce = this.ices[this.ices.length - 1];
    const paddingRight = width * 0.5;
    this.worldWidth = lastIce ? lastIce.x + lastIce.width / 2 + paddingRight : width;

    // background width = world width
    this.skyBg.scale.set(1);
    this.skyBg.width = this.worldWidth;
    this.skyBg.height = skyHeight;
    this.skyBg.position.set(0, skyHeight);

    this.waterBg.scale.set(1);
    this.waterBg.width = this.worldWidth;
    this.waterBg.height = waterHeight;
    this.waterBg.position.set(0, height);

    // start character position is start island
    if (this.currentPlatformIndex === 0) {
      const startSurfaceY = this.startIsland.y;
      this.character.x = this.startIsland.x;
      this.character.placeOn(startSurfaceY);
    }

    // start camera position
    this.world.x = 0;
  }

  private createBackground(): void {
    const waterTexture = PIXI.Assets.get('bgFloor');
    const skyTexture = PIXI.Assets.get('bgWall');

    waterTexture.source.addressModeX = 'repeat';
    skyTexture.source.addressModeX = 'repeat';

    this.waterBg = new PIXI.TilingSprite({
      texture: waterTexture,
      width: 1,
      height: waterTexture.height
    });

    this.skyBg = new PIXI.TilingSprite({
      texture: skyTexture,
      width: 1,
      height: skyTexture.height
    });

    this.waterBg.anchor.set(0, 1);
    this.skyBg.anchor.set(0, 1);

    this.world.addChild(this.skyBg, this.waterBg);
  }

  private createEntities(): void {
    this.startIsland = new StartIsland();
    this.character = new Character();

    // create 6 ices
    this.ices = [];
    for (let i = 0; i < 6; i++) {
      this.ices.push(new Ice());
    }

    this.world.addChild(this.startIsland, ...this.ices, this.character);
  }

  private createBottomUI() {
    const { width, height } = this.app.screen;
    this.roundControls = new RoundControls(width, height);
    this.app.stage.addChild(this.roundControls);
  }

  private setupInteraction(): void {
    const goButton = this.roundControls.getGoButton();
    goButton.on('click', this.onGoClick, this);
  }

  private onGoClick(): void {
    // if the last ice => open Google / Apple store
    if (this.currentPlatformIndex >= this.totalPlatforms - 1) {
      sdk.install();
      return;
    }

    if (this.isJumping) return;
    this.isJumping = true;

    const nextPlatformIndex = this.currentPlatformIndex + 1;
    const targetPlatform = this.getPlatformByIndex(nextPlatformIndex);

    if (!targetPlatform) {
      this.isJumping = false;
      return;
    }

    const toX = targetPlatform.x;

    const tempY = this.character.y;
    const surfaceY = targetPlatform.y;
    this.character.placeOn(surfaceY);
    const toY = this.character.y;
    this.character.y = tempY;

    void this.character.jumpTo(toX, toY).then(() => {
      this.currentPlatformIndex = nextPlatformIndex;

      const currentIce = this.ices[this.currentPlatformIndex - 1];
      if (currentIce) {
        currentIce.setCracked();
      }

      this.isJumping = false;

      // show WIN animation on the last platform
      if (this.currentPlatformIndex >= this.totalPlatforms - 1) {
        void this.character.playWin();
      }
    });
  }

  private getPlatformByIndex(index: number): PIXI.Sprite | null {
    if (index === 0) return this.startIsland;

    const iceIndex = index - 1;
    return this.ices[iceIndex] ?? null;
  }

  private updateCamera(): void {
    if (!this.character || this.worldWidth <= 0) return;

    const screenWidth = this.app.screen.width;
    const worldVisibleWidth = Math.max(this.worldWidth, screenWidth);

    const desiredWorldX = screenWidth / 2 - this.character.x;

    const minX = screenWidth - worldVisibleWidth;
    const maxX = 0;

    let newWorldX = desiredWorldX;
    newWorldX = Math.min(maxX, Math.max(minX, newWorldX));

    // smooth camera movement
    const lerp = 0.1;
    this.world.x += (newWorldX - this.world.x) * lerp;
  }
}
