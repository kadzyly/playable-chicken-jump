export class ScoreManager {
  private static instance: ScoreManager;

  private scoreDefault = 500;
  private freeSpinsDefault = 250;
  private maxJumpCount = 4;

  private currentScore: number;
  private currentFreeSpins: number;
  private iceJumpCount = 0;

  private readonly jumpRewards = [40, 150, 250];
  private readonly comboMultiplierJump = 4;

  private constructor() {
    this.resetScore();
  }

  public static getInstance(): ScoreManager {
    if (!ScoreManager.instance) {
      ScoreManager.instance = new ScoreManager();
    }
    return ScoreManager.instance;
  }

  public getScoreDefault(): number {
    return this.scoreDefault;
  }

  public getFreeSpinsDefault(): number {
    return this.freeSpinsDefault;
  }

  public getMaxJumpCount(): number {
    return this.maxJumpCount;
  }

  public getCurrentScore(): number {
    return this.currentScore;
  }

  public getCurrentFreeSpins(): number {
    return this.currentFreeSpins;
  }

  public addScoreForIceJump() {
    this.iceJumpCount++;
    let pointsToAdd = 0;

    // regular jump
    if (this.iceJumpCount <= this.jumpRewards.length) {
      this.currentFreeSpins -= 1;
      pointsToAdd = this.jumpRewards[this.iceJumpCount - 1];
    }

    // jump with x4 points
    if (this.iceJumpCount === this.maxJumpCount) {
      this.currentFreeSpins -= 1;
      this.currentScore = this.currentScore * 4;
      return this.currentScore;
    }

    this.currentScore += pointsToAdd;
  }

  private resetScore() {
    this.currentScore = this.scoreDefault;
    this.currentFreeSpins = this.freeSpinsDefault;
    this.iceJumpCount = 0;
  }
}
