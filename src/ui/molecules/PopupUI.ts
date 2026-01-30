import { Container, Sprite, Texture, Ticker } from 'pixi.js';
import { PopupBackground } from '../atoms/PopupBackground';

export abstract class PopupUI extends Container {
  protected bg: Sprite;
  protected panel: Container;

  private popupBackground: PopupBackground;

  private ticker?: Ticker;
  private animTime = 0;
  private animDuration = 0.5;
  private animFrom = 0;
  private animTo = 0;
  private onComplete?: () => void;

  constructor() {
    super();

    this.bg = new Sprite(Texture.WHITE);
    this.bg.tint = 0x000000;
    this.bg.alpha = 0;
    this.bg.interactive = true;

    this.panel = new Container();
    this.panel.alpha = 0;
    this.panel.scale.set(0);

    this.popupBackground = new PopupBackground();
    this.popupBackground.anchor.set(0.5, 0.5);
    this.panel.addChild(this.popupBackground);

    this.addChild(this.bg, this.panel);
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
    this.startAnim(1, 0, onHidden);
  }

  private startAnim(from: number, to: number, cb?: () => void) {
    this.animFrom = from;
    this.animTo = to;
    this.animTime = 0;
    this.onComplete = cb;

    if (from === 0 && to === 1) {
      this.animDuration = 0.5;
    } else {
      this.animDuration = 0.2;
    }

    this.bg.alpha = from * 0.8;
    this.panel.alpha = from;

    if (from === 0 && to === 1) {
      this.panel.scale.set(0);
    } else if (from === 1 && to === 0) {
      this.panel.scale.set(1);
    }

    this.ticker?.destroy();
    this.ticker = new Ticker();
    this.ticker.add(this.updateAnim);
    this.ticker.start();
  }

  private updateAnim = (ticker: Ticker) => {
    const dt = ticker.deltaTime;

    this.animTime += dt / 60;

    const t = Math.min(this.animTime / this.animDuration, 1);

    // calculate scale animation
    let scale = 1;
    if (this.animFrom === 0 && this.animTo === 1) {
      // show animation: 0 -> 1.2 (fast) -> 1.0 (slow)
      const phase1 = 0.7; // 70% of duration

      if (t < phase1) {
        const pt = t / phase1;
        scale = (1 - (1 - pt) * (1 - pt)) * 1.2;
      } else {
        const pt = (t - phase1) / (1 - phase1);
        // from 1.2 -> 1.0
        scale = 1.2 - pt * 0.2;
      }
    } else if (this.animFrom === 1 && this.animTo === 0) {
      // from 1.0 -> 0
      scale = 1 - t;
    }

    const v = this.animFrom + (this.animTo - this.animFrom) * t;

    this.bg.alpha = v * 0.8;
    this.panel.alpha = v;
    this.panel.scale.set(scale);

    if (t >= 1) {
      ticker.destroy();
      this.ticker = undefined;
      this.onComplete?.();
    }
  };
}
