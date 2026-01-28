import { Container, Text, TextStyle, Ticker } from 'pixi.js';

type PanelOptions = {
  text: string;
  width?: number;
  height?: number;
  radius?: number;
  fontSize?: number;
  textColor?: number;
  backgroundColor?: number;
  pressedScale?: number;
};

const DEFAULTS: Required<PanelOptions> = {
  text: '',
  width: 160,
  height: 52,
  radius: 10,
  fontSize: 24,
  textColor: 0xffffff,
  backgroundColor: 0x000000,
  pressedScale: 0.9
};

export class PanelUI extends Container {
  private textField: Text;
  private opts: Required<PanelOptions>;

  private targetScale = 1;
  private currentScale = 1;
  private animationSpeed = 0.15;

  constructor(options: PanelOptions) {
    super();

    this.opts = {
      ...DEFAULTS,
      ...options
    };

    this.eventMode = 'static';
    this.pivot.set(0.5, 0.5);

    this.textField = this.createLabel();

    this.addChild(this.textField);

    this.setupAnimation();
  }

  public setText(text: string) {
    this.textField.text = text;
  }

  private setupAnimation() {
    Ticker.shared.add(() => {
      const diff = this.targetScale - this.currentScale;
      this.currentScale += diff * this.animationSpeed;

      if (Math.abs(diff) < 0.001) {
        this.currentScale = this.targetScale;
      }

      this.scale.set(this.currentScale);
    });
  }

  private createLabel() {
    const style = new TextStyle({
      fontFamily: 'Marvin400, Arial, sans-serif',
      fill: this.opts.textColor,
      fontSize: this.opts.fontSize,
      fontWeight: '400',
      align: 'center'
    });

    const text = new Text({
      text: this.opts.text,
      style
    });

    text.anchor.set(0.5);
    text.position.set(this.opts.width / 2, this.opts.height / 2);

    return text;
  }
}
