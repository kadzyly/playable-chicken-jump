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
  private characterContainer: PIXI.Container;
  private buttonInnerBorder: PIXI.Graphics;
  private baseScale = 1;
  private characterBaseScale = 1;

  constructor(width: number, height: number) {
    super();

    this.background = new Sprite(PIXI.Assets.get('finalSceneBg'));
    this.background.anchor.set(0.5);
    this.addChild(this.background);

    this.characterContainer = new PIXI.Container();

    this.character = new Character();
    this.character.playWin();
    this.characterContainer.addChild(this.character);

    this.installButton = new ButtonUI({
      text: 'Install',
      width: 300,
      height: 80,
      backgroundColor: 0x025537,
      textColor: 0xfaed6d,
      fontSize: 56
    });
    this.installButton.on('click', () => sdk.install());

    // inner border for install button
    this.buttonInnerBorder = new Graphics();
    this.buttonInnerBorder.roundRect(5, 5, 289, 69, 7);
    this.buttonInnerBorder.stroke({ color: 0xfaed6d, width: 3 });
    this.installButton.addChild(this.buttonInnerBorder);

    const decorSnowAsset = Assets.get('decorSnow');
    const decorSnow = new Sprite(decorSnowAsset);
    decorSnow.scale.set(0.5);
    decorSnow.anchor.set(0.5, 0);
    decorSnow.y = -30;
    decorSnow.x = 150;

    this.installButton.addChild(decorSnow);
    this.characterContainer.addChild(this.installButton);

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
    this.addChild(this.characterContainer);

    this.resize(width, height);
  }

  public resize(width: number, height: number): void {
    const scale = Math.max(width / this.background.texture.width, height / this.background.texture.height);
    this.background.scale.set(scale);
    this.background.x = width / 2;
    this.background.y = height / 2;

    this.character.anchor.set(0.5, 0);
    this.character.scale.set(1.4);
    this.character.x = 0;
    this.character.y = 0;

    this.installButton.x = 0;
    this.installButton.y = this.character.height + 30;

    const characterContentWidth = Math.max(this.character.width, this.installButton.width);
    const characterContentHeight = this.character.height + this.installButton.height + 30;
    const maxGameW = width * 0.8;
    const maxGameH = height * 0.6;

    this.characterBaseScale =
      characterContentWidth > maxGameW || characterContentHeight > maxGameH
        ? Math.min(maxGameW / characterContentWidth, maxGameH / characterContentHeight)
        : 1;

    this.characterContainer.scale.set(this.characterBaseScale);
    this.characterContainer.x = width / 2;
    this.characterContainer.y = height / 2 - 50;

    const topBgWidth = 450;
    const topBgHeight = 220;

    this.topBg.clear();
    this.topBg.roundRect(-topBgWidth / 2, -topBgHeight / 2, topBgWidth, topBgHeight, 15);
    this.topBg.fill({ color: 0x025537 });

    this.topBanner.anchor.set(0, 0);
    this.topBanner.x = -topBgWidth / 2 - 24;
    this.topBanner.y = -topBgHeight / 2 - 24;
    this.topBanner.scale.set(1.1);

    const contentWidth = topBgWidth + 48;
    const contentHeight = topBgHeight + 48;
    const maxW = width * 0.9; // 90% of screen width
    const maxH = height * 0.3; // 30% of screen height

    this.baseScale = contentWidth > maxW || contentHeight > maxH ? Math.min(maxW / contentWidth, maxH / contentHeight) : 1;
    this.topContainer.scale.set(this.baseScale);

    this.topContainer.x = width / 2;
    this.topContainer.y = 170 * this.baseScale;
  }
}
