import * as PIXI from 'pixi.js';
import { AnimatedSprite, Cache, Spritesheet } from 'pixi.js';

export const POPUP_ANIMATION = {
  frames: [
    'Bonus panel_00000.png',
    'Bonus panel_00001.png',
    'Bonus panel_00002.png',
    'Bonus panel_00003.png',
    'Bonus panel_00004.png',
    'Bonus panel_00005.png',
    'Bonus panel_00006.png',
    'Bonus panel_00007.png',
    'Bonus panel_00008.png',
    'Bonus panel_00009.png',
    'Bonus panel_00010.png',
    'Bonus panel_00011.png',
    'Bonus panel_00012.png',
    'Bonus panel_00013.png',
    'Bonus panel_00014.png',
    'Bonus panel_00015.png',
    'Bonus panel_00016.png',
    'Bonus panel_00017.png',
    'Bonus panel_00018.png',
    'Bonus panel_00019.png',
    'Bonus panel_00020.png',
    'Bonus panel_00021.png',
    'Bonus panel_00022.png',
    'Bonus panel_00023.png',
    'Bonus panel_00024.png',
    'Bonus panel_00025.png',
    'Bonus panel_00026.png',
    'Bonus panel_00027.png',
    'Bonus panel_00028.png'
  ],
  speed: 1.0,
  loop: true
};

export class PopupBackground extends AnimatedSprite {
  constructor() {
    super([PIXI.Texture.EMPTY]);

    const popupBgSheet = Cache.get('popupBgSheet') as Spritesheet;

    this.anchor.set(0.5, 0.5);

    this.textures = POPUP_ANIMATION.frames.map((frame) => popupBgSheet.textures[frame]);
    this.animationSpeed = POPUP_ANIMATION.speed;
    this.loop = POPUP_ANIMATION.loop;
    this.gotoAndPlay(0);
  }
}
