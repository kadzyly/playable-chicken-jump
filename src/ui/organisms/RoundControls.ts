import { Container, Text } from 'pixi.js';
import { ButtonUI } from '../atoms/ButtonUI';

export class RoundControls extends Container {
  private cashButton: ButtonUI;
  private goButton: ButtonUI;
  private hintText: Text;
  private baseScale = 1;

  constructor(screenWidth: number, screenHeight: number) {
    super();

    const buttonWidth = 220;
    const buttonHeight = 70;
    const horizontalGap = 14;
    const verticalGap = 18;
    const isDesktop = screenWidth >= 768;

    this.createHintText(screenWidth);
    this.setHintTextAdaptive(isDesktop);
    this.fitTextToWidth(this.hintText, screenWidth);
    this.createButtons(buttonWidth, buttonHeight);
    this.setupButtonEvents();
    this.layoutButtons(buttonWidth, horizontalGap);
    this.layoutUI(screenWidth, screenHeight, verticalGap, buttonHeight);
  }

  public updatePosition(screenWidth: number, screenHeight: number) {
    // for desktop: offset
    // for mobile: offset * 2
    const baseMargin = 30;
    const bottomMargin = this.baseScale < 1 ? baseMargin : baseMargin / 2;

    this.x = screenWidth / 2;
    this.y = screenHeight - bottomMargin;
  }

  public resize(width: number, height: number) {
    const buttonWidth = 220;
    const horizontalGap = 14;
    const totalContentWidth = buttonWidth + horizontalGap + buttonWidth;

    const maxW = width * 0.9;
    this.baseScale = totalContentWidth > maxW ? maxW / totalContentWidth : 1;

    const isDesktop = width >= 768;

    this.setHintTextAdaptive(isDesktop);
    this.fitTextToWidth(this.hintText, width);
    this.scale.set(this.baseScale);
    this.updatePosition(width, height);
  }

  public getCashButton(): ButtonUI {
    return this.cashButton;
  }

  public getGoButton(): ButtonUI {
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
    const isDesktop = screenWidth >= 768;
    const hintText = this.getHintTextAdaptive(isDesktop);

    this.hintText = new Text({
      text: hintText,
      style: {
        fontFamily: 'Marvin400, Arial, sans-serif',
        fontSize: 30,
        lineHeight: 30,
        fontWeight: '400',
        wordWrap: true,
        wordWrapWidth: screenWidth,
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

  private getHintTextAdaptive(isDesktop: boolean) {
    return isDesktop
      ? 'Click to make the chicken jump and collect money'
      : 'Click\u00A0to\u00A0make\u00A0the\u00A0chicken\njump\u00A0and\u00A0collect\u00A0money';
  }

  private setHintTextAdaptive(isDesktop: boolean) {
    const text = this.getHintTextAdaptive(isDesktop);

    if (this.hintText.text !== text) {
      this.hintText.text = text;
    }

    this.hintText.style.wordWrap = !isDesktop;
  }

  private fitTextToWidth(text: Text, maxWidth: number, minFontSize = 20, maxFontSize = 30) {
    let fontSize = minFontSize;

    // first step: set the smollest size
    text.style.fontSize = fontSize;
    text.style.lineHeight = fontSize;

    // try to make max size
    while (fontSize < maxFontSize) {
      const nextSize = fontSize + 1;

      text.style.fontSize = nextSize;
      text.style.lineHeight = nextSize;

      if (text.width > maxWidth) {
        text.style.fontSize = fontSize;
        text.style.lineHeight = fontSize;
        break;
      }

      fontSize = nextSize;
    }

    // min size
    while (text.width > maxWidth && fontSize > minFontSize) {
      fontSize--;

      text.style.fontSize = fontSize;
      text.style.lineHeight = fontSize;
    }
  }

  private createButtons(buttonWidth: number, buttonHeight: number) {
    this.cashButton = new ButtonUI({
      text: 'CASH OUT',
      fontSize: 38,
      width: buttonWidth,
      height: buttonHeight,
      backgroundColor: 0xffc501,
      isDisabled: true
    });

    this.goButton = new ButtonUI({
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

    this.cashButton.pivot.set(this.cashButton.width / 2, this.cashButton.height);
    this.goButton.pivot.set(this.goButton.width / 2, this.goButton.height);

    // position: center
    this.cashButton.x = -totalButtonWidth / 2 + buttonWidth / 2;
    this.goButton.x = totalButtonWidth / 2 - buttonWidth / 2;

    // position: bottom of container
    this.cashButton.y = 0;
    this.goButton.y = 0;

    buttons.addChild(this.cashButton, this.goButton);
    this.addChild(buttons);
  }

  private layoutUI(screenWidth: number, screenHeight: number, verticalGap: number, buttonHeight: number) {
    this.pivot.set(0.5, 1);

    this.hintText.anchor.set(0.5, 1);
    this.hintText.y = -verticalGap - buttonHeight;

    const buttonsContainer = this.children[0]; // First child is the buttons container
    if (buttonsContainer) {
      buttonsContainer.y = 0;
    }

    this.x = screenWidth / 2;

    const baseMargin = verticalGap;
    const bottomMargin = this.baseScale < 1 ? baseMargin : baseMargin / 2; // Half verticalGap for desktop

    this.y = screenHeight - bottomMargin;

    this.addChild(this.hintText);
  }
}
