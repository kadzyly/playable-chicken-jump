import { Container } from 'pixi.js';
import { PanelUI } from '../atoms/PanelUI';

export class WinInfoUI extends Container {
  private summaPanel: PanelUI;
  private freeSpinPanel: PanelUI;

  constructor(screenWidth: number, screenHeight: number) {
    super();

    const buttonWidth = 160;
    const buttonHeight = 52;
    const horizontalGap = 14;

    this.createElements(buttonWidth, buttonHeight);
    this.layoutElements(buttonWidth, horizontalGap);
  }

  public updatePosition(screenWidth: number, screenHeight: number) {
    this.x = screenWidth / 2;
    this.y = screenHeight - 10 - 52 / 2;
  }

  public getCashButton(): PanelUI {
    return this.summaPanel;
  }

  public getGoButton(): PanelUI {
    return this.freeSpinPanel;
  }

  private createElements(buttonWidth: number, buttonHeight: number) {
    this.summaPanel = new PanelUI({
      text: '$1000',
      fontSize: 24,
      width: buttonWidth,
      height: buttonHeight,
      backgroundColor: 0x13bc0b
    });

    this.freeSpinPanel = new PanelUI({
      text: '100 FS',
      fontSize: 34,
      width: buttonWidth,
      height: buttonHeight,
      backgroundColor: 0x13bc0b
    });
  }

  private layoutElements(buttonWidth: number, horizontalGap: number) {
    const buttons = new Container();
    const totalButtonWidth = buttonWidth + horizontalGap + buttonWidth;

    this.summaPanel.x = -totalButtonWidth / 2 + buttonWidth / 2;
    this.freeSpinPanel.x = totalButtonWidth / 2 - buttonWidth / 2;

    buttons.addChild(this.summaPanel, this.freeSpinPanel);
    this.addChild(buttons);
  }
}
