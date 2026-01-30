import * as PIXI from 'pixi.js';
import { sdk } from '@smoud/playable-sdk';
import { Character } from '../entities/Character';
import { StartIsland } from '../entities/StartIsland';
import { Ice } from '../entities/Ice';
import { RoundControls } from '../ui/organisms/RoundControls';
import { SoundManager } from '../core/SoundManager';
import { WinInfoUI } from '../ui/organisms/WinInfoUI';
import { ScoreManager } from '../core/ScoreManager';
import { PopupManager } from '../core/PopupManager';
import { StartBonusPopup } from '../ui/organisms/StartBonusPopup';
import { FinalResultPopup } from '../ui/organisms/FinalResultPopup';
import { FinalScene } from '../ui/organisms/FinalScene';

export class MainScene {
  private world: PIXI.Container;
  private waterBg: PIXI.TilingSprite;
  private skyBg: PIXI.TilingSprite;
  private character: Character;
  private startIsland: StartIsland;
  private ices: Ice[] = [];
  private roundControls!: RoundControls;
  private statsDisplay!: WinInfoUI;
  private scoreManager: ScoreManager;
  private popupManager: PopupManager;
  private finalScene: FinalScene | null = null;

  // 0 - start island, then platforms (ice)
  private currentPlatformIndex = 0;
  private readonly totalPlatforms = 7;
  private worldWidth = 0;
  private isJumping = false;

  constructor(private app: PIXI.Application) {
    this.world = new PIXI.Container();
    this.app.stage.addChild(this.world);
    this.scoreManager = ScoreManager.getInstance();
    this.popupManager = PopupManager.getInstance();

    this.createBackground();
    this.createEntities();
    this.createBottomUI();
    this.createStatsUI();
    this.setupInteraction();
    this.setupMusic();
    this.createPopups();

    // camera follow the character
    this.app.ticker.add(this.updateCamera, this);

    sdk.start();
  }

  public resize(width: number, height: number): void {
    if (this.finalScene) {
      this.finalScene.resize(width, height);
      return;
    }

    if (!this.waterBg || !this.skyBg) return;

    this.roundControls.updatePosition(width, height);
    this.statsDisplay.updatePosition(width, height);
    this.popupManager.resize(width, height);

    // heights: sky 60%, water 40%
    const skyHeight = height * 0.62;
    const waterHeight = height * 0.38;

    const entityScale = Math.min(width / 400, height / 600) * 0.5;

    const waterTopY = height - waterHeight;
    const centerOfWaterY = waterTopY + waterHeight / 2;

    this.character.scale.set(entityScale);
    this.startIsland.scale.set(entityScale);
    this.ices.forEach((ice) => ice.scale.set(entityScale));

    let targetIceWidth = 200;
    const minSpacing = 50;

    // if 2 ices + spacing fit
    if (2 * targetIceWidth + minSpacing > width) {
      targetIceWidth = width * 0.4;
    }

    const finalIceStepX = targetIceWidth + minSpacing;

    this.ices.forEach((ice) => {
      ice.scale.set(1);
      const originalWidth = ice.width;
      const scale = targetIceWidth / originalWidth;
      ice.scale.set(scale);
    });

    let targetIslandWidth = 420;
    const islandIceSpacing = minSpacing * 0.8;

    if (targetIslandWidth + islandIceSpacing + targetIceWidth > width) {
      // 60% of width
      targetIslandWidth = width * 0.6;
    }

    this.startIsland.scale.set(1);
    const originalIslandWidth = this.startIsland.width;
    const islandScale = targetIslandWidth / originalIslandWidth;
    this.startIsland.scale.set(islandScale);

    // horizontal placement of platforms
    // - at the first: start island and one ice
    // - next: 2 ices on the screen
    this.startIsland.x = 0;

    const iceY = centerOfWaterY - 50;
    this.startIsland.y = iceY + 100 * this.startIsland.scale.y;

    const firstIceX = this.startIsland.x + this.startIsland.width + islandIceSpacing + targetIceWidth / 2;

    this.ices.forEach((ice, index) => {
      if (index === 0) {
        ice.x = firstIceX;
      } else {
        ice.x = firstIceX + index * finalIceStepX;
      }
      ice.y = iceY;
    });

    const lastIce = this.ices[this.ices.length - 1];
    const paddingRight = width * 0.5;
    this.worldWidth = lastIce ? lastIce.x + lastIce.width / 2 + paddingRight : width;

    // background width = world width
    const skyScale = skyHeight / this.skyBg.texture.height;
    this.skyBg.tileScale.set(skyScale);
    this.skyBg.width = this.worldWidth;
    this.skyBg.height = skyHeight;
    this.skyBg.position.set(0, skyHeight);
    this.skyBg.anchor.set(0, 1);

    const waterScaleY = waterHeight / this.waterBg.texture.height;
    this.waterBg.tileScale.set(waterScaleY);
    this.waterBg.width = this.worldWidth;
    this.waterBg.height = waterHeight;
    this.waterBg.position.set(0, height);

    // start character position is start island
    if (this.currentPlatformIndex === 0) {
      // character position on island: 58% width, 67% height
      this.character.x = this.startIsland.x + this.startIsland.width * 0.58;

      const surfaceY = this.startIsland.y - this.startIsland.height * (1 - 0.67);
      this.character.placeOn(surfaceY);
    }

    // start camera position
    this.world.x = 0;
  }

  private createPopups() {
    const startBonusPopup = new StartBonusPopup();

    this.app.stage.addChild(startBonusPopup);
    void this.popupManager.show(startBonusPopup);
    SoundManager.playStartBonusMusic();

    startBonusPopup.on('closeClick', () => {
      this.popupManager.hideCurrent().then(() => {
        this.roundControls.getGoButton().showHand();

        this.app.stage.removeChild(startBonusPopup);
      });
    });
  }

  private createBackground(): void {
    const waterTexture = PIXI.Assets.get('bgFloor');
    const skyTexture = PIXI.Assets.get('bgWall');

    // repeat water texture horizontally
    waterTexture.source.addressModeU = 'repeat';
    waterTexture.source.addressModeV = 'clamp-to-edge';

    // repeat sky texture horizontally
    skyTexture.source.addressModeU = 'repeat';
    skyTexture.source.addressModeV = 'clamp-to-edge';

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
      const bonus = this.scoreManager.Bonuses[i];

      this.ices.push(new Ice(bonus ? bonus.title : undefined));
    }

    this.world.addChild(this.startIsland, ...this.ices, this.character);
  }

  private createBottomUI() {
    const { width, height } = this.app.screen;
    this.roundControls = new RoundControls(width, height);
    this.app.stage.addChild(this.roundControls);
  }

  private createStatsUI() {
    this.statsDisplay = new WinInfoUI();
    this.app.stage.addChild(this.statsDisplay);
  }

  private setupInteraction(): void {
    const goButton = this.roundControls.getGoButton();
    goButton.on('click', this.onGoClick, this);

    const cashButton = this.roundControls.getCashButton();

    cashButton.on('click', () => {
      const finalResultPopup = new FinalResultPopup();

      this.app.stage.addChild(finalResultPopup);
      void this.popupManager.show(finalResultPopup);
      SoundManager.playWinMusic();

      setTimeout(() => {
        this.showFinalScene();
      }, 2000);
    });
  }

  private showFinalScene() {
    // clear stage
    this.app.stage.removeChildren();

    // create and add FinalScene
    const { width, height } = this.app.screen;
    this.finalScene = new FinalScene(width, height);
    this.app.stage.addChild(this.finalScene);
  }

  private setupMusic(): void {
    SoundManager.playBgMusic();
  }

  private onGoClick(): void {
    if (this.currentPlatformIndex <= 1) {
      this.roundControls.hideHintText();
    }

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

        // Add score for jumping on ice platform
        this.scoreManager.addScoreForIceJump();
        const score = this.scoreManager.getCurrentScore();
        const freeSpins = this.scoreManager.getCurrentFreeSpins();
        this.statsDisplay.updateScore(score);
        this.statsDisplay.updateFreeSpins(freeSpins);

        currentIce.hideBonusText();
        SoundManager.playAddPointsMusic();
      }

      this.isJumping = false;
      const isWin = this.currentPlatformIndex >= this.scoreManager.getMaxJumpCount();

      // show WIN animation on the last platform
      if (isWin) {
        void this.character.playWin();
        this.roundControls.disableGoButton();
        this.roundControls.enableCashOutButton();
        this.roundControls.getCashButton().showHand();
      } else {
        this.roundControls.getGoButton().showHand();
      }
    });
  }

  private getPlatformByIndex(index: number): PIXI.Sprite | null {
    if (index === 0) return this.startIsland;

    const iceIndex = index - 1;
    return this.ices[iceIndex] ?? null;
  }

  private updateCamera(): void {
    if (this.finalScene) return;
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
