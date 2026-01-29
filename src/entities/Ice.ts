import * as PIXI from 'pixi.js';

export type IceState = 'normal' | 'cracked';

const ICE_FRAME_NORMAL = 'ice.png';
const ICE_FRAME_CRACKED = 'ice_cracked.png';

export class Ice extends PIXI.Sprite {
  constructor() {
    const iceSheet = PIXI.Cache.get('iceSheet') as PIXI.Spritesheet;
    super(iceSheet.textures[ICE_FRAME_NORMAL]);
    this.anchor.set(0.5, 0.5);
  }

  private _state: IceState = 'normal';

  get state(): IceState {
    return this._state;
  }

  public setCracked(): void {
    this.setState('cracked');
  }

  private setState(state: IceState): void {
    if (this._state === state) return;
    this._state = state;
    const iceSheet = PIXI.Cache.get('iceSheet') as PIXI.Spritesheet;
    const frame = state === 'cracked' ? ICE_FRAME_CRACKED : ICE_FRAME_NORMAL;
    this.texture = iceSheet.textures[frame];
  }
}
