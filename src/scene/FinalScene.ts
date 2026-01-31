import * as PIXI from 'pixi.js';
import { Assets, Graphics, Sprite, Text, TextStyle } from 'pixi.js';
import { Character } from '../entities/Character';
import { ButtonUI } from '../ui/atoms/ButtonUI';
import { sdk } from '@smoud/playable-sdk';

export class FinalScene extends PIXI.Container {
  private character: Character;
  private installButton: ButtonUI;
  private background: PIXI.Sprite;
  private topBanner: PIXI.Sprite;
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
      width: 300,
      height: 80,
      backgroundColor: 0x025537,
      textColor: 0xfaed6d,
      fontSize: 56
    });
    this.installButton.on('click', () => sdk.install());

    const decorSnowAsset = Assets.get('decorSnow');
    const decorSnow = new Sprite(decorSnowAsset);
    decorSnow.scale.set(0.5);
    decorSnow.anchor.set(0.5, 0);
    decorSnow.y = -30;
    decorSnow.x = 150;

    this.installButton.addChild(decorSnow);

    this.addChild(this.installButton);

    this.topContainer = new PIXI.Container();
    this.topBg = new Graphics();
    this.topText = new Text({
      text: 'Claim bonus €500\n+ 250 Freespins',
      style: new TextStyle({
        fontFamily: 'Marvin400, Arial, sans-serif',
        fill: 0xfaed6d,
        fontSize: 40,
        fontWeight: 'bold',
        align: 'center',
        lineHeight: 60
      })
    });
    this.topText.anchor.set(0.5);
    this.topBanner = new Sprite(PIXI.Assets.get('installBannerImage'));

    this.topContainer.addChild(this.topBg, this.topBanner, this.topText);
    this.addChild(this.topContainer);

    this.resize(width, height);
  }

  public resize(width: number, height: number): void {
    const scale = Math.max(width / this.background.texture.width, height / this.background.texture.height);
    this.background.scale.set(scale);
    this.background.x = width / 2;
    this.background.y = height / 2;

    this.character.anchor.set(0.5, 0);
    this.character.scale.set(1.4);
    this.character.x = width / 2;
    this.character.y = height / 2 - 80;

    this.installButton.x = width / 2;
    this.installButton.y = this.character.y + this.character.height + 30;

    const topBgWidth = 450;
    const topBgHeight = 220;

    this.topBg.clear();
    this.topBg.roundRect(-topBgWidth / 2, -topBgHeight / 2, topBgWidth, topBgHeight, 15);
    this.topBg.fill({ color: 0x025537 });

    this.topBanner.anchor.set(0, 0);
    this.topBanner.x = -topBgWidth / 2 - 24;
    this.topBanner.y = -topBgHeight / 2 - 24;
    this.topBanner.scale.set(1.1);

    this.topContainer.x = width / 2;
    this.topContainer.y = 170;
  }
}
