import * as PIXI from 'pixi.js';
import { Character } from '../../entities/Character';
import { Button } from '../atoms/Button';
import { sdk } from '@smoud/playable-sdk';

export class FinalScene extends PIXI.Container {
  private character: Character;
  private installButton: Button;
  private background: PIXI.Graphics;

  constructor(width: number, height: number) {
    super();

    this.background = new PIXI.Graphics();
    this.addChild(this.background);

    this.character = new Character();
    this.character.playWin();
    this.addChild(this.character);

    this.installButton = new Button({
      text: 'Install',
      width: 200,
      height: 60,
      backgroundColor: 0x33cc33,
      textColor: 0xffffff,
      fontSize: 32
    });
    this.installButton.on('click', () => sdk.install());
    this.addChild(this.installButton);

    this.resize(width, height);
  }

  public resize(width: number, height: number): void {
    this.background.clear();
    this.background.rect(0, 0, width, height);
    this.background.fill({ color: 0x000000, alpha: 0.7 });

    this.character.x = width / 2;
    this.character.y = height / 2 - 50;

    this.installButton.x = width / 2;
    this.installButton.y = this.character.y + 150;
  }
}
