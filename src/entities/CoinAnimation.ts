import { AnimatedSprite, Cache, Spritesheet, Texture } from 'pixi.js';

export const COINS_ANIMATION = {
  frames: [
    'coins expl_001.png',
    'coins expl_002.png',
    'coins expl_003.png',
    'coins expl_004.png',
    'coins expl_005.png',
    'coins expl_007.png',
    'coins expl_009.png',
    'coins expl_010.png',
    'coins expl_011.png',
    'coins expl_013.png',
    'coins expl_015.png',
    'coins expl_017.png',
    'coins expl_018.png'
  ],
  speed: 0.3,
  loop: false
};

export class CoinAnimation extends AnimatedSprite {
  constructor() {
    super([Texture.EMPTY]);

    const coinsSheet = Cache.get('coinsSheet') as Spritesheet;
    this.anchor.set(0.5, 0.5);

    this.textures = COINS_ANIMATION.frames.map((frame) => coinsSheet.textures[frame]);
    this.animationSpeed = COINS_ANIMATION.speed;
    this.loop = COINS_ANIMATION.loop;
  }

  public async playCoinAnimation(callback?: () => void): Promise<void> {
    this.gotoAndPlay(0);

    if (callback) {
      this.onComplete = () => {
        callback();
        this.onComplete = undefined;
      };
    }
  }
}
