import { Container, Sprite, Texture, Ticker } from 'pixi.js';
import { PopupBackground } from '../atoms/PopupBackground';

export abstract class PopupUI extends Container {
  protected bg: Sprite;
  protected panel: Container;

  private popupBackground: PopupBackground;

  private ticker?: Ticker;
  private animTime = 0;
  private animDuration = 0.25;
  private animFrom = 0;
  private animTo = 0;
  private onComplete?: () => void;
  private scalePhase = 0; // 0: 0->1.2, 1: 1.2->1.0

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

    this.addChild(this.bg, this.popupBackground, this.panel);
  }

  public resize(width: number, height: number) {
    this.bg.width = width;
    this.bg.height = height;

    this.panel.x = width * 0.5;
    this.panel.y = height * 0.5;

    this.popupBackground.x = width * 0.5;
    this.popupBackground.y = height * 0.5;
  }

  show() {
    this.scalePhase = 0;
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

    // Calculate scale animation
    let scale = 1;
    if (this.animFrom === 0 && this.animTo === 1) {
      // Show animation: 0 -> 1.2 (fast) -> 1.0 (slow)
      const phase1Duration = 0.15; // Fast phase (0 to 1.2)
      const phase2Duration = 0.35; // Slow phase (1.2 to 1.0)
      const totalDuration = phase1Duration + phase2Duration;

      if (this.animTime < phase1Duration) {
        // Phase 1: 0 to 1.2 (fast)
        const t = this.animTime / phase1Duration;
        scale = t * 1.2;
      } else {
        // Phase 2: 1.2 to 1.0 (slow)
        const t = (this.animTime - phase1Duration) / phase2Duration;
        scale = 1.2 - 0.2 * t;
      }
    } else if (this.animFrom === 1 && this.animTo === 0) {
      // Hide animation: 1.0 -> 0 (simple fade)
      scale = 1 - this.animTime / this.animDuration;
    }

    // Calculate alpha animation
    const t = Math.min(this.animTime / this.animDuration, 1);
    const eased = t * t * (3 - 2 * t);
    const v = this.animFrom + (this.animTo - this.animFrom) * eased;

    this.bg.alpha = v * 0.8;
    this.panel.alpha = v;
    this.panel.scale.set(scale);

    if (t === 1) {
      ticker.destroy();
      this.ticker = undefined;
      this.onComplete?.();
    }
  };
}
