import { Container, Graphics, Text } from 'pixi.js';

export class LiveWins extends Container {
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

  private liveWinsText: Text;
  private onlineText: Text;
  private greenCircle: Graphics;
  private winMessageText: Text;
  private background: Graphics;

  constructor() {
    super();

    this.background = new Graphics();
    this.drawBackground();
    this.addChild(this.background);

    this.liveWinsText = new Text('Live wins. ', {
      fontFamily: 'Marvin400, Arial, sans-serif',
      fontSize: 16,
      fill: 0xffffff
    });
    this.liveWinsText.x = 10;
    this.liveWinsText.y = 10;

    this.greenCircle = new Graphics();
    this.greenCircle.circle(0, 0, 4);
    this.greenCircle.fill({ color: 0x00ff00 });
    this.greenCircle.x = 110;
    this.greenCircle.y = 15;

    this.onlineText = new Text(`Online: ${this.onlineCount}`, {
      fontFamily: 'Marvin400, Arial, sans-serif',
      fontSize: 16,
      fill: 0xffffff
    });
    this.onlineText.x = 120;
    this.onlineText.y = 10;

    this.winMessageText = new Text(this.winMessages[this.currentWinIndex], {
      fontFamily: 'Marvin400, Arial, sans-serif',
      fontSize: 14,
      fill: 0xffff00
    });
    this.winMessageText.x = 10;
    this.winMessageText.y = 35;

    this.addChild(this.liveWinsText, this.greenCircle, this.onlineText, this.winMessageText);
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

    const width = 260;
    const height = 60;
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
