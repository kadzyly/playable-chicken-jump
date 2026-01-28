import { Container, Sprite, Texture, Ticker } from 'pixi.js';

export abstract class PopupUI extends Container {
  protected bg: Sprite;
  protected panel: Container;

  private ticker?: Ticker;
  private animTime = 0;
  private animDuration = 0.25;
  private animFrom = 0;
  private animTo = 0;
  private onComplete?: () => void;

  constructor() {
    super();

    this.bg = new Sprite(Texture.WHITE);
    this.bg.tint = 0x000000;
    this.bg.alpha = 0;
    this.bg.interactive = true;
    this.addChild(this.bg);

    this.panel = new Container();
    this.panel.alpha = 0;
    this.addChild(this.panel);
  }

  public resize(width: number, height: number) {
    this.bg.width = width;
    this.bg.height = height;

    this.panel.x = width * 0.5;
    this.panel.y = height * 0.5;
  }

  show() {
    this.startAnim(0, 1);
  }

  hide(onHidden?: () => void) {
    this.startAnim(1, 0, () => {
      this.startAnim(1, 0, onHidden);
    });
  }

  private startAnim(from: number, to: number, cb?: () => void) {
    this.animFrom = from;
    this.animTo = to;
    this.animTime = 0;
    this.onComplete = cb;

    this.bg.alpha = from * 0.8;
    this.panel.alpha = from;

    this.ticker?.destroy();
    this.ticker = new Ticker();
    this.ticker.add(this.updateAnim);
    this.ticker.start();
  }

  private updateAnim = (ticker: Ticker) => {
    const dt = ticker.deltaTime;

    this.animTime += dt / 60;
    const t = Math.min(this.animTime / this.animDuration, 1);
    const eased = t * t * (3 - 2 * t);

    const v = this.animFrom + (this.animTo - this.animFrom) * eased;
    this.bg.alpha = v * 0.8;
    this.panel.alpha = v;

    if (t === 1) {
      ticker.destroy();
      this.ticker = undefined;
      this.onComplete?.();
    }
  };
}
