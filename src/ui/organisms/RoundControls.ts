import { Container, Text, TextStyle } from 'pixi.js';
import { Button } from '../atoms/Button';

export class RoundControls extends Container {
  private cashButton: Button;
  private goButton: Button;
  private hintText: Text;

  constructor(screenWidth: number, screenHeight: number) {
    super();

    const buttonWidth = 160;
    const buttonHeight = 52;
    const horizontalGap = 14;
    const verticalGap = 10;

    this.createHintText(screenWidth);
    this.createButtons(buttonWidth, buttonHeight);
    this.setupButtonEvents();
    this.layoutButtons(buttonWidth, horizontalGap);
    this.layoutUI(screenWidth, screenHeight, verticalGap, buttonHeight);
  }

  public updatePosition(screenWidth: number, screenHeight: number) {
    this.x = screenWidth / 2;
    this.y = screenHeight - 10 - this.hintText.height - 52 / 2;
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
    const hintStyle = new TextStyle({
      fontFamily: 'Marvin400, Arial, sans-serif',
      fontSize: 20,
      fontWeight: '400',
      wordWrap: true,
      wordWrapWidth: screenWidth * 0.8,
      fill: '#ffffff',
      stroke: '#000000',
      align: 'center'
    });

    this.hintText = new Text({
      text: 'Click to make the chicken jump and collect money',
      style: hintStyle
    });
  }

  private createButtons(buttonWidth: number, buttonHeight: number) {
    this.cashButton = new Button({
      text: 'CASH OUT',
      fontSize: 24,
      width: buttonWidth,
      height: buttonHeight,
      backgroundColor: 0xffc501,
      isDisabled: true
    });

    this.goButton = new Button({
      text: 'GO',
      fontSize: 34,
      width: buttonWidth,
      height: buttonHeight,
      backgroundColor: 0x13bc0b
    });
  }

  private setupButtonEvents() {
    this.cashButton.on('click', () => {
      console.log('Cash out');
    });

    this.goButton.on('click', () => {
      console.log('Go');
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
