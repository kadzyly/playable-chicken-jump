import { Text, TextStyle } from 'pixi.js';
import { PopupUI } from '../molecules/PopupUI';

export class FinalResultPopup extends PopupUI {
  constructor() {
    super();

    const style = new TextStyle({
      fontFamily: 'Marvin400, Arial',
      fontSize: 32,
      fill: 0xffffff,
      align: 'center'
    });

    const style2 = new TextStyle({
      fontFamily: 'Marvin400, Arial',
      fontSize: 32,
      fill: 0xffe40f,
      align: 'center'
    });

    const line1 = new Text({ text: `New year`, style: style2 });
    line1.anchor.set(0.5);
    line1.y = -40;

    const line2 = new Text({ text: `Jackpot!`, style });
    line2.anchor.set(0.5);
    line2.y = 0;

    const line3 = new Text({ text: `+$3,760.0`, style: style2 });
    line3.anchor.set(0.5);
    line3.y = 40;

    this.panel.addChild(line1, line2, line3);
  }
}
