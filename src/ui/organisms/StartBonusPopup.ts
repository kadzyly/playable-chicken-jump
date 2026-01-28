import { Text, TextStyle } from 'pixi.js';
import { PopupUI } from '../molecules/PopupUI';
import { Button } from '../atoms/Button';

export class StartBonusPopup extends PopupUI {
  constructor() {
    super();

    const style = new TextStyle({
      fontFamily: 'Marvin400, Arial',
      fontSize: 32,
      fill: 0xffffff,
      align: 'center'
    });

    const titleText = new Text({
      text: "New year's bonus",
      style
    });
    titleText.anchor.set(0.5);
    titleText.y = -40;

    const sumText = new Text({
      text: '$500 + 250',
      style
    });
    sumText.anchor.set(0.5);
    sumText.y = 0;

    const freeSpinsText = new Text({
      text: 'Free spins',
      style
    });
    freeSpinsText.anchor.set(0.5);
    freeSpinsText.y = 40;

    const button = new Button({ text: 'Claim bonus', width: 200 });
    button.y = 100;

    button.on('click', () => {
      this.emit('closeClick');
    });

    this.panel.addChild(titleText, sumText, freeSpinsText, button);
  }
}
