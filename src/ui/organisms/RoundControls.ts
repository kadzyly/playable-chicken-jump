import { Container, Text } from 'pixi.js';
import { Button } from '../atoms/Button';

export class RoundControls extends Container {
  private cashButton: Button;
  private goButton: Button;
  private hintText: Text;

  constructor(screenWidth: number, screenHeight: number) {
    super();

    const buttonWidth = 220;
    const buttonHeight = 70;
    const horizontalGap = 14;
    const verticalGap = 18;

    this.createHintText(screenWidth);
    this.createButtons(buttonWidth, buttonHeight);
    this.setupButtonEvents();
    this.layoutButtons(buttonWidth, horizontalGap);
    this.layoutUI(screenWidth, screenHeight, verticalGap, buttonHeight);
  }

  public updatePosition(screenWidth: number, screenHeight: number) {
    this.x = screenWidth / 2;
    this.y = screenHeight - this.hintText.height - 52;
  }

  public getCashButton(): Button {
    return this.cashButton;
  }

  public getGoButton(): Button {
    return this.goButton;
  }

  public hideHintText() {
    this.hintText.visible = false;
  }

  public disableGoButton() {
    this.goButton.disable();
  }

  public enableCashOutButton() {
    this.cashButton.enable();
  }

  private createHintText(screenWidth: number) {
    this.hintText = new Text({
      text: 'Click to make the chicken\njump and collect money',
      style: {
        fontFamily: 'Marvin400, Arial, sans-serif',
        fontSize: 30,
        fontWeight: '400',
        wordWrap: true,
        wordWrapWidth: screenWidth * 0.95,
        fill: '#ffffff',
        stroke: { color: 0x000000, width: 2 },
        align: 'center',
        dropShadow: {
          alpha: 0.8,
          angle: Math.PI / 4,
          blur: 0,
          color: 0x4a4a4a,
          distance: 2
        }
      }
    });
  }

  private createButtons(buttonWidth: number, buttonHeight: number) {
    this.cashButton = new Button({
      text: 'CASH OUT',
      fontSize: 38,
      width: buttonWidth,
      height: buttonHeight,
      backgroundColor: 0xffc501,
      isDisabled: true
    });

    this.goButton = new Button({
      text: 'GO',
      fontSize: 44,
      width: buttonWidth,
      height: buttonHeight,
      backgroundColor: 0x13bc0b
    });
  }

  private setupButtonEvents() {
    this.cashButton.on('click', () => {
      this.cashButton.hideHand();
    });

    this.goButton.on('click', () => {
      this.goButton.hideHand();
    });
  }

  private layoutButtons(buttonWidth: number, horizontalGap: number) {
    const buttons = new Container();
    const totalButtonWidth = buttonWidth + horizontalGap + buttonWidth;

    this.cashButton.x = -totalButtonWidth / 2 + buttonWidth / 2;
    this.goButton.x = totalButtonWidth / 2 - buttonWidth / 2;

    buttons.addChild(this.cashButton, this.goButton);
    this.addChild(buttons);
  }

  private layoutUI(screenWidth: number, screenHeight: number, verticalGap: number, buttonHeight: number) {
    this.hintText.anchor.set(0.5, 1);
    this.hintText.y = -verticalGap - buttonHeight / 2;

    // Position: center & bottom of the screen
    this.pivot.set(0, 0);
    this.x = screenWidth / 2;
    this.y = screenHeight - verticalGap - this.hintText.height - buttonHeight / 2;

    this.addChild(this.hintText);
  }
}
