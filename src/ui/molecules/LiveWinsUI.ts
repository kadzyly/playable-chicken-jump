import * as PIXI from 'pixi.js';
import { Assets, Container, Graphics, Sprite, Spritesheet, Text } from 'pixi.js';

const flagsArray = ['01.png', '08.png', '09.png', '24.png', '32.png', '40.png', '00.png', '16.png', '48.png', '56.png'];

export class LiveWinsUI extends Container {
  private onlineCountValues: number[] = [13826, 13880, 13894, 13849, 13893, 13817, 13821, 13812, 13899, 13815];
  private onlineCount: number = 13826;
  private greenCircleAlpha: number = 1;
  private greenCircleDirection: number = -0.01;
  private winMessages: string[] = [
    'Milkko H. - +€900',
    'Daniel W. - +€4 250',
    'Sarah K. - +€1 500',
    'John D. - +€3 200',
    'Emma L. - +€750',
    'Michael R. - +€2 100',
    'Lisa M. - +€5 500',
    'David S. - +€1 800',
    'Anna B. - +€2 900',
    'Tom H. - +€6 750'
  ];
  private currentWinIndex: number = 0;
  private winMessageAlpha: number = 1;
  private winMessageTimer: number = 0;
  private winMessageDuration: number = 180;
  private isTransitioning: boolean = false;
  private baseScale = 1;

  private liveWinsText: Text;
  private onlineText: Text;
  private greenCircle: Graphics;
  private winMessageText: Text;
  private background: Graphics;
  private flagSheet: Spritesheet;
  private flagSprite: Sprite;

  constructor() {
    super();

    this.background = new Graphics();
    this.drawBackground();
    this.addChild(this.background);

    const firstLineTextY = 20;
    const secondLineTextY = 55;

    this.liveWinsText = new Text('Live wins. ', {
      fontFamily: 'Arial, sans-serif',
      fontSize: 20,
      fontWeight: 'bold',
      fill: 0xffffff
    });
    this.liveWinsText.x = 22;
    this.liveWinsText.y = firstLineTextY;

    this.greenCircle = new Graphics();
    this.greenCircle.circle(0, 0, 6);
    this.greenCircle.fill({ color: 0x00ff00 });
    this.greenCircle.x = 135;
    this.greenCircle.y = firstLineTextY + firstLineTextY / 2;

    this.onlineText = new Text(`Online: ${this.onlineCount}`, {
      fontFamily: 'Arial, sans-serif',
      fontSize: 20,
      fontWeight: 'bold',
      fill: 0xffffff
    });
    this.onlineText.x = 148;
    this.onlineText.y = firstLineTextY;

    this.winMessageText = new Text(this.winMessages[this.currentWinIndex], {
      fontFamily: 'Arial, sans-serif',
      fontSize: 18,
      fill: 0xffff00
    });
    this.winMessageText.x = 58;
    this.winMessageText.y = secondLineTextY;

    const decorSnowAsset = Assets.get('decorLiveWinsSnow');
    const decorSnow = new Sprite(decorSnowAsset);
    decorSnow.scale.set(0.5);
    decorSnow.anchor.set(1, 0);
    decorSnow.y = -10;
    decorSnow.x = 310;

    this.flagSheet = PIXI.Cache.get('flagsSheet') as PIXI.Spritesheet;
    const flagTexture = this.flagSheet.textures[flagsArray[this.currentWinIndex]];
    this.flagSprite = new Sprite(flagTexture);
    this.flagSprite.x = 22;
    this.flagSprite.y = secondLineTextY;
    this.flagSprite.scale.set(0.2);

    this.addChild(decorSnow, this.liveWinsText, this.greenCircle, this.onlineText, this.flagSprite, this.winMessageText);
  }

  public resize(width: number, height: number) {
    const contentWidth = 300;
    const maxW = width * 0.6; // 60% of screen width
    this.baseScale = contentWidth > maxW ? maxW / contentWidth : 1;

    this.scale.set(this.baseScale);
  }

  update(): void {
    // animate green circle
    this.greenCircleAlpha += this.greenCircleDirection;
    if (this.greenCircleAlpha <= 0.3 || this.greenCircleAlpha >= 1) {
      this.greenCircleDirection *= -1;
    }
    this.greenCircle.alpha = this.greenCircleAlpha;

    // animate win messages
    this.winMessageTimer++;

    if (this.winMessageTimer >= this.winMessageDuration) {
      this.isTransitioning = true;
      this.winMessageAlpha -= 0.1;

      if (this.winMessageAlpha <= 0) {
        this.currentWinIndex = (this.currentWinIndex + 1) % this.winMessages.length;
        this.winMessageText.text = this.winMessages[this.currentWinIndex];

        this.onlineCount = this.onlineCountValues[this.currentWinIndex];
        this.onlineText.text = `Online: ${this.onlineCount}`;

        this.flagSprite.texture = this.flagSheet.textures[flagsArray[this.currentWinIndex]];

        this.winMessageAlpha = 0;
        this.isTransitioning = false;
        this.winMessageTimer = 0;
      }
    } else if (!this.isTransitioning && this.winMessageAlpha < 1) {
      this.winMessageAlpha += 0.1;
    }
    this.winMessageText.alpha = this.winMessageAlpha;
  }

  private drawBackground(): void {
    this.background.clear();

    const width = 300;
    const height = 92;
    const borderRadius = 10;
    const borderWidth = 2;

    // rounded background
    this.background.fill({ color: 0x112d6e });
    this.background.setStrokeStyle({ width: borderWidth, color: 0xffffff });

    // top-left
    this.background.moveTo(0, borderRadius);
    this.background.lineTo(0, height - borderRadius);

    // bottom-left (no rounding)
    this.background.lineTo(0, height);
    this.background.lineTo(width - borderRadius, height);

    // bottom-right (rounded)
    this.background.quadraticCurveTo(width, height, width, height - borderRadius);

    // right side
    this.background.lineTo(width, borderRadius);

    // top-right (rounded)
    this.background.quadraticCurveTo(width, 0, width - borderRadius, 0);

    // top
    this.background.lineTo(0, 0);
    this.background.lineTo(0, borderRadius);

    this.background.fill();
    this.background.stroke();
  }
}
