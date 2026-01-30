type TBonus = { title: string; count?: number; multiplier?: number };

export class ScoreManager {
  private static instance: ScoreManager;

  private scoreDefault = 500;
  private freeSpinsDefault = 250;
  private maxJumpCount = 4;

  private currentScore: number;
  private currentFreeSpins: number;
  private iceJumpCount = 0;

  private _bonuses: TBonus[] = [
    { title: '$40', count: 40 },
    { title: '$150', count: 150 },
    { title: '$250', count: 250 },
    { title: 'x4', multiplier: 4 }
  ];

  private constructor() {
    this.resetScore();
  }

  get Bonuses(): TBonus[] {
    return this._bonuses;
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

    const currentBonus = this._bonuses[this.iceJumpCount - 1];
    const isAdd = currentBonus.count !== undefined;
    const isMultiplier = currentBonus.multiplier !== undefined;

    // regular jump
    if (isAdd && this.iceJumpCount <= this._bonuses.length) {
      this.currentFreeSpins -= 1;
      pointsToAdd = currentBonus.count || 0;
    }

    // jump with x4 points
    if (isMultiplier && this.iceJumpCount === this.maxJumpCount) {
      this.currentFreeSpins -= 1;
      const multiplier = currentBonus.multiplier || 1;
      this.currentScore = this.currentScore * multiplier;
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
