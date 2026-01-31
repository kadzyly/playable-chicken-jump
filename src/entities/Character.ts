import * as PIXI from 'pixi.js';
import { Jump, JumpConfig } from './Jump';
import { CHARACTER_ANIMATIONS } from './CharacterConfig';
import { SoundManager } from '../core/SoundManager';

type CharacterState = keyof typeof CHARACTER_ANIMATIONS;

export class Character extends PIXI.AnimatedSprite {
  private readonly footOffsetY = 0;
  private isJumping = false;
  private textureCache: Record<string, PIXI.Texture[]> = {};

  constructor() {
    const playerIdleSheet = PIXI.Cache.get('playerIdleSheet') as PIXI.Spritesheet;
    const playerJumpSheet = PIXI.Cache.get('playerJumpSheet') as PIXI.Spritesheet;
    const playerWinSheet = PIXI.Cache.get('playerWinSheet') as PIXI.Spritesheet;

    // init with a default texture first
    super([PIXI.Texture.EMPTY]);
    this.anchor.set(0.5, 1);

    (Object.keys(CHARACTER_ANIMATIONS) as CharacterState[]).forEach((state) => {
      const config = CHARACTER_ANIMATIONS[state];

      const sheets = {
        idle: playerIdleSheet,
        jump: playerJumpSheet,
        win: playerWinSheet
      };

      const sheet = sheets[state] ?? playerIdleSheet;

      this.textureCache[state] = config.frames.map((frame) => sheet.textures[frame]).filter(Boolean);
    });

    // update textures after init
    this.textures = this.textureCache['idle'];
    this.setState('idle');
  }

  public get footY(): number {
    return this.y + this.footOffsetY * this.scale.y;
  }

  public set footY(value: number) {
    this.y = value + this.footOffsetY * this.scale.y;
  }

  public placeOn(surfaceY: number): void {
    this.footY = surfaceY;
  }

  public setState(state: CharacterState): void {
    const config = CHARACTER_ANIMATIONS[state];
    this.textures = this.textureCache[state];
    this.animationSpeed = config.speed;
    this.loop = config.loop;
    this.gotoAndPlay(0);
  }

  public playWin(): Promise<void> {
    // stop other animations, play win animation once
    this.isJumping = false;
    this.rotation = 0;
    this.setState('win');

    return new Promise((resolve) => {
      const onComplete = () => {
        this.off('complete', onComplete);
        resolve();
      };

      this.on('complete', onComplete);
    });
  }

  public async jumpTo(
    targetX: number,
    targetY: number,
    duration: number = 1000,
    options?: { startDelayFrames?: number; endDelayFrames?: number; jumpHeight?: number }
  ): Promise<void> {
    if (this.isJumping) return;
    this.isJumping = true;

    // anchor: change to center for the jump
    const startX = this.x;
    const startY = this.y;

    // switch to jump animation to know its frame count
    this.setState('jump');
    SoundManager.playJump();
    const totalFrames = this.textures.length || 1;

    const startDelayFrames = options?.startDelayFrames ?? 8;
    const endDelayFrames = options?.endDelayFrames ?? 4;
    const jumpHeightBase = options?.jumpHeight ?? 40;

    const config: JumpConfig = {
      from: { x: startX, y: startY },
      to: { x: targetX, y: targetY },
      duration,
      jumpHeight: jumpHeightBase * Math.abs(this.scale.y),
      totalFrames,
      startDelayFrames,
      endDelayFrames
    };

    return new Promise((resolve) => {
      const startTime = performance.now();

      const update = () => {
        const elapsed = performance.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);

        const { x, y } = Jump.getTransform(progress, config);

        this.x = x;
        this.y = y;

        if (progress < 1) {
          requestAnimationFrame(update);
        } else {
          this.onJumpComplete(targetX, targetY);
          resolve();
        }
      };

      update();
    });
  }

  private onJumpComplete(finalX: number, finalY: number): void {
    this.isJumping = false;
    this.x = finalX;
    this.y = finalY;
    this.setState('idle');
  }
}
