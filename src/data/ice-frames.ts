import type { SpritesheetData } from 'pixi.js';

export const ICE_FRAMES: SpritesheetData = {
  frames: {
    'ice_cracked.png': {
      frame: {
        x: 0,
        y: 0,
        w: 298,
        h: 86
      },
      rotated: false,
      trimmed: true,
      spriteSourceSize: {
        x: 4,
        y: 14,
        w: 298,
        h: 86
      },
      sourceSize: {
        w: 310,
        h: 100
      }
    },
    'ice.png': {
      frame: {
        x: 0,
        y: 86,
        w: 297,
        h: 81
      },
      rotated: false,
      trimmed: true,
      spriteSourceSize: {
        x: 5,
        y: 11,
        w: 297,
        h: 81
      },
      sourceSize: {
        w: 310,
        h: 100
      }
    }
  },
  meta: {
    app: 'http://free-tex-packer.com',
    version: '0.6.7',
    image: 'ice_texture.png',
    format: 'RGBA8888',
    size: {
      w: 298,
      h: 167
    },
    scale: 1
  }
};
