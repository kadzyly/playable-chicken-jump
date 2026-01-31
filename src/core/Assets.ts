import * as PIXI from 'pixi.js';

// simple images
import startIsland from 'assets/start_island.png';
import iceTextureAsset from 'assets/ice_texture.png';
import bgFloorAsset from 'assets/BG_seg_floor.png';
import bgWallAsset from 'assets/BG_seg_wall.png';
import handAsset from 'assets/hand.png';
import finalSceneBackgroundAsset from 'assets/bg_final_scene.png';
import decorHatAsset from 'assets/decor_hat.png';
import decorSnowAsset from 'assets/decor_snow.png';
import decorLiveWinsSnowAsset from 'assets/live_wins_snow.png';

// music
import bgMusicAsset from 'assets/bg.mp3';
import jumpMusicAsset from 'assets/jump.mp3';
import buttonClickMusic from 'assets/button_click.mp3';
import winMusic from 'assets/win_audio.mp3';
import startBonusMusic from 'assets/start_bonus_audio.mp3';
import addPointsMusicMusic from 'assets/add_points.mp3';

// for animation
import { PLAYER_IDLE_FRAMES } from '../data/player-idle-frames';
import playerIdleImage from 'assets/player_idle_texture.png';
import { PLAYER_JUMP_FRAMES } from '../data/player-jump-frames';
import playerJumpImage from 'assets/player_jump_texture.png';
import { PLAYER_WIN_FRAMES } from '../data/player-win-frames';
import playerWinImage from 'assets/player_win_texture.png';
import { ICE_FRAMES } from '../data/ice-frames';
import popupBgAnimation from 'assets/popup_bg_animation.png';
import { POPUP_BG_FRAMES } from '../data/popup-bg-frames';
import coinsAnimation from 'assets/coins_texture.png';
import { COINS_FRAMES } from '../data/coins-frames';

export async function loadAssets(): Promise<void> {
  await PIXI.Assets.load([
    { alias: 'bgFloor', src: bgFloorAsset },
    { alias: 'bgWall', src: bgWallAsset },
    { alias: 'hand', src: handAsset },
    { alias: 'finalSceneBg', src: finalSceneBackgroundAsset },
    { alias: 'startIsland', src: startIsland },
    { alias: 'iceTexture', src: iceTextureAsset },
    { alias: 'playerIdleTexture', src: playerIdleImage },
    { alias: 'playerJumpTexture', src: playerJumpImage },
    { alias: 'playerWinTexture', src: playerWinImage },
    { alias: 'popupBgTexture', src: popupBgAnimation },
    { alias: 'coinsTexture', src: coinsAnimation },
    { alias: 'bgMusic', src: bgMusicAsset },
    { alias: 'jumpMusic', src: jumpMusicAsset },
    { alias: 'buttonClickMusic', src: buttonClickMusic },
    { alias: 'winMusic', src: winMusic },
    { alias: 'startBonusMusic', src: startBonusMusic },
    { alias: 'addPointsMusicMusic', src: addPointsMusicMusic },
    { alias: 'decorHat', src: decorHatAsset },
    { alias: 'decorSnow', src: decorSnowAsset },
    { alias: 'decorLiveWinsSnow', src: decorLiveWinsSnowAsset }
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

  const iceTexture = PIXI.Assets.get('iceTexture');
  const iceSheet = new PIXI.Spritesheet(iceTexture, ICE_FRAMES);
  await iceSheet.parse();
  PIXI.Cache.set('iceSheet', iceSheet);

  const popupBgTexture = PIXI.Assets.get('popupBgTexture');
  const popupBgSheet = new PIXI.Spritesheet(popupBgTexture, POPUP_BG_FRAMES);
  await popupBgSheet.parse();
  PIXI.Cache.set('popupBgSheet', popupBgSheet);

  const coinsTexture = PIXI.Assets.get('coinsTexture');
  const coinsSheet = new PIXI.Spritesheet(coinsTexture, COINS_FRAMES);
  await coinsSheet.parse();
  PIXI.Cache.set('coinsSheet', coinsSheet);
}
