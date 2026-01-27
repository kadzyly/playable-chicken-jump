import { PLAYER_IDLE_FRAMES } from '../data/player-idle-frames';
import { PLAYER_JUMP_FRAMES } from '../data/player-jump-frames';
import { PLAYER_WIN_FRAMES } from '../data/player-win-frames';

export const CHARACTER_ANIMATIONS = {
  idle: {
    frames: Object.keys(PLAYER_IDLE_FRAMES.frames),
    speed: 0.3,
    loop: true
  },
  jump: {
    frames: Object.keys(PLAYER_JUMP_FRAMES.frames),
    speed: 0.5,
    loop: false
  },
  win: {
    frames: Object.keys(PLAYER_WIN_FRAMES.frames),
    speed: 0.5,
    loop: false
  }
};
