import { Container } from 'pixi.js';
import { PanelUI } from '../atoms/PanelUI';
import { ScoreManager } from '../../core/ScoreManager';

const elementWidth = 280;
const elementHeight = 52;
const horizontalGap = 20;

export class WinInfoUI extends Container {
  private summaPanel: PanelUI;
  private freeSpinPanel: PanelUI;

  constructor() {
    super();

    this.createElements(elementWidth, elementHeight);
    this.layoutElements(elementHeight, horizontalGap);

    const scoreManager = ScoreManager.getInstance();
    this.setScore(scoreManager.getCurrentScore());
    this.setFreeSpins(scoreManager.getCurrentFreeSpins());
  }

  public updatePosition(screenWidth: number, screenHeight: number) {
    // center horizontally
    this.x = screenWidth / 2;
    // top of the screen
    this.y = horizontalGap + elementHeight / 2;
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
      fontSize: 40,
      width: buttonWidth,
      height: buttonHeight,
      backgroundColor: 0x13bc0b
    });

    this.freeSpinPanel = new PanelUI({
      text: '',
      fontSize: 34,
      width: buttonWidth,
      height: buttonHeight,
      backgroundColor: 0xaf191a
    });
  }

  private layoutElements(elementHeight: number, horizontalGap: number) {
    const container = new Container();

    this.summaPanel.y = 0;
    this.freeSpinPanel.y = elementHeight + horizontalGap;

    container.addChild(this.summaPanel, this.freeSpinPanel);

    this.addChild(container);
  }
}
