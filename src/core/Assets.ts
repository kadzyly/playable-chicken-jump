import * as PIXI from 'pixi.js';

import charAsset from 'assets/character.png';
import shelfAsset from 'assets/shelf.png';
import sofaAsset from 'assets/chair.png';
import bgFloorAsset from 'assets/BG_seg_floor.png';
import bgWallAsset from 'assets/BG_seg_wall.png';

import { PLAYER_IDLE_FRAMES } from '../data/player-idle-frames';
import playerIdleImage from 'assets/player_idle_texture.png';
import { PLAYER_JUMP_FRAMES } from '../data/player-jump-frames';
import playerJumpImage from 'assets/player_jump_texture.png';
import { PLAYER_WIN_FRAMES } from '../data/player-win-frames';
import playerWinImage from 'assets/player_win_texture .png';

export async function loadAssets(): Promise<void> {
  await PIXI.Assets.load([
    { alias: 'bgFloor', src: bgFloorAsset },
    { alias: 'bgWall', src: bgWallAsset },
    { alias: 'char', src: charAsset },
    { alias: 'shelf', src: shelfAsset },
    { alias: 'sofa', src: sofaAsset },
    { alias: 'playerIdleTexture', src: playerIdleImage },
    { alias: 'playerJumpTexture', src: playerJumpImage },
    { alias: 'playerWinTexture', src: playerWinImage }
  ]);

  const playerIdleTexture = PIXI.Assets.get('playerIdleTexture');
  const playerIdleSheet = new PIXI.Spritesheet(playerIdleTexture, PLAYER_IDLE_FRAMES);
  await playerIdleSheet.parse();
  PIXI.Cache.set('playerIdleSheet', playerIdleSheet);

  const playerJumpTexture = PIXI.Assets.get('playerJumpTexture');
  const playerJumpSheet = new PIXI.Spritesheet(playerJumpTexture, PLAYER_JUMP_FRAMES);
  await playerJumpSheet.parse();
  PIXI.Cache.set('playerJumpSheet', playerJumpSheet);

  const playerWinTexture = PIXI.Assets.get('playerWinTexture');
  const playerWinSheet = new PIXI.Spritesheet(playerWinTexture, PLAYER_WIN_FRAMES);
  await playerWinSheet.parse();
  PIXI.Cache.set('playerWinSheet', playerWinSheet);
}
