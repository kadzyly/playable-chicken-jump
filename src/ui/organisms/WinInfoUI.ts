import { Assets, Container, Sprite } from 'pixi.js';
import { PanelUI } from '../atoms/PanelUI';
import { ScoreManager } from '../../core/ScoreManager';

const elementWidth = 330;
const elementHeight = 64;
const horizontalGap = 30;

export class WinInfoUI extends Container {
  private summaPanel: PanelUI;
  private freeSpinPanel: PanelUI;
  private baseScale = 1;
  private isHorizontalLayout = false;
  private useAutoPositioning = true;

  constructor() {
    super();

    this.createElements(elementWidth, elementHeight);
    this.layoutElements(elementHeight, horizontalGap);

    const scoreManager = ScoreManager.getInstance();
    this.setScore(scoreManager.getCurrentScore());
    this.setFreeSpins(scoreManager.getCurrentFreeSpins());
  }

  public updatePosition(screenWidth: number, screenHeight: number) {
    if (!this.useAutoPositioning) return;

    // center horizontally
    this.x = screenWidth / 2;
    // top of the screen
    this.y = 80;
  }

  public resize(width: number, height: number) {
    const totalContentWidth = elementWidth;
    const maxW = width * 0.9; // 90% of screen width

    this.baseScale = totalContentWidth > maxW ? maxW / totalContentWidth : 1;
    this.scale.set(this.baseScale);

    this.updatePosition(width, height);
  }

  public setLayout(horizontal: boolean): void {
    this.isHorizontalLayout = horizontal;
    this.updateLayout();
  }

  public setAutoPositioning(enabled: boolean): void {
    this.useAutoPositioning = enabled;
  }

  public updateLayout(): void {
    if (this.isHorizontalLayout) {
      // horizontal layout
      this.summaPanel.x = 0;
      this.summaPanel.y = 0;
      this.freeSpinPanel.x = elementWidth + horizontalGap;
      this.freeSpinPanel.y = 0;
    } else {
      // vertical layout
      this.summaPanel.x = 0;
      this.summaPanel.y = 0;
      this.freeSpinPanel.x = 0;
      this.freeSpinPanel.y = elementHeight + horizontalGap;
    }
  }

  public getCashButton(): PanelUI {
    return this.summaPanel;
  }

  public getGoButton(): PanelUI {
    return this.freeSpinPanel;
  }

  public setScore(score: number): void {
    const text = this.getFormattedScoreText(score.toString());
    this.summaPanel.setText(text);
  }

  public setFreeSpins(freeSpins: number): void {
    const text = this.getFormattedFreeSpinText(freeSpins.toString());
    this.freeSpinPanel.setText(text);
  }

  public updateScore(score: number): void {
    this.setScore(score);
    this.summaPanel.pulseScale();
  }

  public updateFreeSpins(freeSpins: number): void {
    this.setFreeSpins(freeSpins);
    this.freeSpinPanel.pulseScale();
  }

  private getFormattedScoreText(count: number | string) {
    return `€${count}`;
  }

  private getFormattedFreeSpinText(count: number | string) {
    return `${count} FS`;
  }

  private createElements(buttonWidth: number, buttonHeight: number) {
    this.summaPanel = new PanelUI({
      text: '',
      fontSize: 50,
      width: buttonWidth,
      height: buttonHeight,
      backgroundColor: 0x13bc0b
    });

    this.freeSpinPanel = new PanelUI({
      text: '',
      fontSize: 38,
      width: buttonWidth,
      height: buttonHeight,
      backgroundColor: 0xaf191a
    });
  }

  private layoutElements(elementHeight: number, horizontalGap: number) {
    const container = new Container();

    this.summaPanel.y = 0;
    this.freeSpinPanel.y = elementHeight + horizontalGap;

    const cookieTexture = Assets.get('cookieTexture');
    const giftTexture = Assets.get('giftTexture');
    const cookieImage = new Sprite(cookieTexture);
    const cookieImage2 = new Sprite(cookieTexture);
    const giftImage = new Sprite(giftTexture);
    const giftImage2 = new Sprite(giftTexture);

    giftImage.anchor.set(0.5, 0.5);
    giftImage2.anchor.set(0.5, 0.5);
    giftImage.scale.set(0.65, 0.65);
    giftImage2.scale.set(0.65, -0.65);

    giftImage.y = 32;
    giftImage2.y = 32;

    giftImage.x = 40;
    giftImage2.x = 280;

    cookieImage.anchor.set(0.5, 0.5);
    cookieImage2.anchor.set(0.5, 0.5);
    cookieImage.scale.set(-0.95, 0.95);
    cookieImage2.scale.set(0.95, 0.95);

    cookieImage.y = 32;
    cookieImage2.y = 32;

    cookieImage.x = 50;
    cookieImage2.x = 280;

    const decorSnowBigAsset = Assets.get('decorSnow');
    const decorSnowBig = new Sprite(decorSnowBigAsset);
    decorSnowBig.anchor.set(1, 0);
    decorSnowBig.scale.set(0.5, 0.5);
    decorSnowBig.y = -28;
    decorSnowBig.x = 340;

    const decorSnowAsset = Assets.get('decorLiveWinsSnow');
    const decorSnow = new Sprite(decorSnowAsset);
    decorSnow.anchor.set(0, 0);
    decorSnow.scale.set(-0.55, 0.55);
    decorSnow.y = -15;
    decorSnow.x = 55;

    this.summaPanel.addChild(giftImage, giftImage2, decorSnowBig);
    this.freeSpinPanel.addChild(cookieImage, cookieImage2, decorSnow);
    container.addChild(this.summaPanel, this.freeSpinPanel);

    this.addChild(container);
  }
}
