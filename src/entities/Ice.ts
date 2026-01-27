import * as PIXI from 'pixi.js';

export class Ice extends PIXI.Sprite {
  constructor() {
    super(PIXI.Assets.get('ice'));
    this.anchor.set(0.5, 0.5);
  }
}
