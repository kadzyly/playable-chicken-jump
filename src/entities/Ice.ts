import * as PIXI from 'pixi.js';

export type IceState = 'normal' | 'cracked';

const ICE_FRAME_NORMAL = 'ice.png';
const ICE_FRAME_CRACKED = 'ice_cracked.png';

export class Ice extends PIXI.Sprite {
  private _bonusText: PIXI.Text | null = null;

  constructor(bonusText?: string) {
    const iceSheet = PIXI.Cache.get('iceSheet') as PIXI.Spritesheet;
    super(iceSheet.textures[ICE_FRAME_NORMAL]);
    this.anchor.set(0.5, 0.5);

    if (bonusText) {
      this._bonusText = new PIXI.Text({
        text: bonusText,
        style: {
          fontFamily: 'Marvin400, Arial, sans-serif',
          fontSize: 70,
          fontWeight: 'bold',
          fill: 0xffffff,
          stroke: { color: 0x000000, width: 2 },
          align: 'center',

          dropShadow: {
            alpha: 0.5,
            angle: Math.PI / 4,
            blur: 0,
            color: 0x4a4a4a,
            distance: 6
          }
        }
      });
      this._bonusText.anchor.set(0.5, 1);
      this._bonusText.y = -10;
      this.addChild(this._bonusText);
    }
  }

  private _state: IceState = 'normal';

  get state(): IceState {
    return this._state;
  }

  public setCracked(): void {
    this.setState('cracked');
  }

  public hideBonusText(): void {
    if (this._bonusText) {
      this._bonusText.visible = false;
    }
  }

  private setState(state: IceState): void {
    if (this._state === state) return;
    this._state = state;
    const iceSheet = PIXI.Cache.get('iceSheet') as PIXI.Spritesheet;
    const frame = state === 'cracked' ? ICE_FRAME_CRACKED : ICE_FRAME_NORMAL;
    this.texture = iceSheet.textures[frame];
  }
}
