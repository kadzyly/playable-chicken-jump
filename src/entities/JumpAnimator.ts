export interface JumpConfig {
  from: { x: number; y: number };
  to: { x: number; y: number };
  duration: number;
  jumpHeight: number;
}

export class JumpAnimator {
  static getTransform(progress: number, config: JumpConfig) {
    const { from, to, jumpHeight } = config;

    // line between two points
    const x = from.x + (to.x - from.x) * progress;
    const lineY = from.y + (to.y - from.y) * progress;

    // jump's line 
    const arc = Math.sin(progress * Math.PI) * jumpHeight;
    const y = lineY - arc;

    return { x, y };
  }
}
