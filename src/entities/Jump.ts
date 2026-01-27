export interface JumpConfig {
  from: { x: number; y: number };
  to: { x: number; y: number };
  duration: number;
  jumpHeight: number;
  /**
   * Total frames of the jump animation (all phases).
   */
  totalFrames: number;
  /**
   * Optional delay at the beginning of the jump (in frames).
   * During this time the character stays at the start point
   * so we can play the "prepare" part of the animation.
   */
  startDelayFrames?: number;
  /**
   * Optional delay at the end of the jump (in frames).
   * During this time the character stays at the end point
   * so we can play the "landing" part of the animation.
   */
  endDelayFrames?: number;
}

export class Jump {
  static getTransform(progress: number, config: JumpConfig) {
    const { from, to, jumpHeight, totalFrames, startDelayFrames = 0, endDelayFrames = 0 } = config;

    const frames = Math.max(1, totalFrames);

    // delays expressed in frames -> fractions of the whole animation
    const rawStartFraction = startDelayFrames / frames;
    const rawEndFraction = 1 - endDelayFrames / frames;

    const startFraction = Math.max(0, Math.min(1, rawStartFraction));
    const endFraction = Math.max(startFraction, Math.min(1, rawEndFraction));

    const movementSpan = Math.max(0.0001, endFraction - startFraction);

    // stay at the start point
    if (progress <= startFraction) {
      return { x: from.x, y: from.y };
    }

    // stay after the jump at the end point
    if (progress >= endFraction) {
      return { x: to.x, y: to.y };
    }

    // progress on the jump
    const movementProgress = (progress - startFraction) / movementSpan;

    // line between two points
    const x = from.x + (to.x - from.x) * movementProgress;
    const lineY = from.y + (to.y - from.y) * movementProgress;

    // jump's line
    const arc = Math.sin(movementProgress * Math.PI) * jumpHeight;
    const y = lineY - arc;

    return { x, y };
  }
}
