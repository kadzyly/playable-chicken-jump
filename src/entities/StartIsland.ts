import * as PIXI from 'pixi.js';

export class StartIsland extends PIXI.Sprite {
  constructor() {
    super(PIXI.Assets.get('startIsland'));
    this.anchor.set(0.5, 0.5);
  }
}
