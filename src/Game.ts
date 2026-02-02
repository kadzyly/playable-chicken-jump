import * as PIXI from 'pixi.js';
import { createApp } from './core/App';
import { loadAssets } from './core/Assets';
import { SoundManager } from './core/SoundManager';
import { MainScene } from './scene/MainScene';
import { loadFonts } from './core/Fonts';
import { ScreenAdapter } from './core/ScreenAdapter';

export class Game {
  private app!: PIXI.Application;
  private scene!: MainScene;

  constructor(width: number, height: number) {
    void this.init(width, height);
  }

  public resize(width: number, height: number): void {
    if (!this.app || !this.scene) return;

    const screenAdapter = ScreenAdapter.getInstance();
    screenAdapter.updateDimensions(width, height);

    this.app.renderer.resize(width, height);
    this.scene.resize(width, height, screenAdapter.isLandscape());
  }

  private async init(width: number, height: number): Promise<void> {
    this.app = await createApp(width, height);
    
    const screenAdapter = ScreenAdapter.getInstance();
    screenAdapter.updateDimensions(width, height);
    
    await loadAssets();
    await loadFonts();

    SoundManager.init();

    this.scene = new MainScene(this.app);
    this.resize(width, height);
  }
}
