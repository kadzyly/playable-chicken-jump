import * as PIXI from 'pixi.js';
import { Graphics, Sprite, Text, TextStyle } from 'pixi.js';
import { Character } from '../../entities/Character';
import { ButtonUI } from '../atoms/ButtonUI';
import { sdk } from '@smoud/playable-sdk';

export class FinalScene extends PIXI.Container {
  private character: Character;
  private installButton: ButtonUI;
  private background: PIXI.Sprite;
  private topContainer: PIXI.Container;
  private topText: PIXI.Text;
  private topBg: PIXI.Graphics;

  constructor(width: number, height: number) {
    super();

    this.background = new Sprite(PIXI.Assets.get('finalSceneBg'));
    this.background.anchor.set(0.5);
    this.addChild(this.background);

    this.character = new Character();
    this.character.playWin();
    this.addChild(this.character);

    this.installButton = new ButtonUI({
      text: 'Install',
      width: 200,
      height: 60,
      backgroundColor: 0x025537,
      textColor: 0xfaed6d,
      fontSize: 32
    });
    this.installButton.on('click', () => sdk.install());
    this.addChild(this.installButton);

    this.topContainer = new PIXI.Container();
    this.topBg = new Graphics();
    this.topText = new Text({
      text: 'Claim bonus €500\n+ 250 Freespins',
      style: new TextStyle({
        fontFamily: 'Marvin400, Arial, sans-serif',
        fill: 0xfaed6d,
        fontSize: 26,
        fontWeight: 'bold',
        align: 'center',
        lineHeight: 40
      })
    });
    this.topText.anchor.set(0.5);

    this.topContainer.addChild(this.topBg, this.topText);
    this.addChild(this.topContainer);

    this.resize(width, height);
  }

  public resize(width: number, height: number): void {
    const scale = Math.max(width / this.background.texture.width, height / this.background.texture.height);
    this.background.scale.set(scale);
    this.background.x = width / 2;
    this.background.y = height / 2;

    this.character.anchor.set(0.5);
    this.character.x = width / 2;
    this.character.y = height / 2;

    this.installButton.x = width / 2;
    this.installButton.y = this.character.y + this.character.height / 2 + 30;

    const topBgWidth = 300;
    const topBgHeight = 120;

    this.topBg.clear();
    this.topBg.roundRect(-topBgWidth / 2, -topBgHeight / 2, topBgWidth, topBgHeight, 15);
    this.topBg.fill({ color: 0x025537 });

    this.topContainer.x = width / 2;
    this.topContainer.y = 80;
  }
}
