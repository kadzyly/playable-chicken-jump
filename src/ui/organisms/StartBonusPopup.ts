import { Text } from 'pixi.js';
import { PopupUI } from '../molecules/PopupUI';
import { Button } from '../atoms/Button';

export class StartBonusPopup extends PopupUI {
  constructor() {
    super();

    const titleText = new Text({
      text: "New year's bonus",
      style: {
        fontFamily: 'Marvin400, Arial',
        fontSize: 40,
        fill: 0x19c70e,
        align: 'center'
      }
    });

    const sumText = new Text({
      text: '500€+250',
      style: {
        fontFamily: 'Marvin400, Arial',
        fontSize: 70,
        fill: 0xffffff,
        align: 'center',
        stroke: { color: 0x000000, width: 4 }
      }
    });

    const freeSpinsText = new Text({
      text: 'Free spins',
      style: {
        fontFamily: 'Marvin400, Arial',
        fontSize: 60,
        fill: 0x19c70e,
        align: 'center'
      }
    });

    titleText.anchor.set(0.5);
    titleText.y = -100;

    sumText.anchor.set(0.5);
    sumText.y = -40;

    freeSpinsText.anchor.set(0.5);
    freeSpinsText.y = 20;

    const button = new Button({
      text: 'Claim bonus',
      width: 370,
      height: 84,
      backgroundColor: 0x326d01,
      fontSize: 48,
      borderColor: 0xffc501,
      borderWidth: 2,
      // glowColor: 0xffc501,
      glowColor: 0xc6961a,
      glowAlpha: 0.3,
      glowSize: 10
    });
    button.y = 100;

    button.on('click', () => {
      this.emit('closeClick');
    });

    this.panel.addChild(titleText, sumText, freeSpinsText, button);

    button.showHand();
  }
}
