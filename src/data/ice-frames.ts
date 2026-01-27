import type { SpritesheetData } from 'pixi.js';

export const ICE_FRAMES: SpritesheetData = {
  frames: {
    'ice_00.png': {
      frame: {
        x: 0,
        y: 0,
        w: 1526,
        h: 1024
      },
      rotated: false,
      trimmed: true,
      spriteSourceSize: {
        x: 0,
        y: 0,
        w: 1526,
        h: 1024
      },
      sourceSize: {
        w: 1536,
        h: 1024
      }
    },
    'ice_01.png': {
      frame: {
        x: 1526,
        y: 0,
        w: 1525,
        h: 1024
      },
      rotated: false,
      trimmed: true,
      spriteSourceSize: {
        x: 0,
        y: 0,
        w: 1525,
        h: 1024
      },
      sourceSize: {
        w: 1536,
        h: 1024
      }
    }
  },
  meta: {
    app: 'http://free-tex-packer.com',
    version: '0.6.7',
    image: 'ice_texture.png',
    format: 'RGBA8888',
    size: {
      w: 3051,
      h: 1024
    },
    scale: 1
  }
};
