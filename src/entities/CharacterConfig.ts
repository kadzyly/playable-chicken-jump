import { PLAYER_IDLE_FRAMES } from '../data/player-idle-frames';

export const CHARACTER_ANIMATIONS = {
  idle: {
    frames: Object.keys(PLAYER_IDLE_FRAMES.frames),
    speed: 0.3,
    loop: true
  },
  jump: {
    frames: Array.from({ length: 19 }, (_, i) => `imp_${i}.png`),
    speed: 0.5,
    loop: true
  }
};
