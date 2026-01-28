export class ScoreManager {
  private static instance: ScoreManager;

  private currentScore = 500;
  private iceJumpCount = 0;

  private readonly jumpRewards = [40, 150, 250];
  private readonly comboMultiplierJump = 4;

  private constructor() {}

  public static getInstance(): ScoreManager {
    if (!ScoreManager.instance) {
      ScoreManager.instance = new ScoreManager();
    }
    return ScoreManager.instance;
  }

  public getCurrentScore(): number {
    return this.currentScore;
  }

  public addScoreForIceJump(): number {
    this.iceJumpCount++;
    let pointsToAdd = 0;

    if (this.iceJumpCount <= this.jumpRewards.length) {
      pointsToAdd = this.jumpRewards[this.iceJumpCount - 1];
    }

    // jump with x4 points
    if (this.iceJumpCount === this.comboMultiplierJump) {
      this.currentScore = this.currentScore * 4;
      return this.currentScore;
    }

    this.currentScore += pointsToAdd;
    return this.currentScore;
  }
}
