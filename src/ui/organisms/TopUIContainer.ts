import { Container } from 'pixi.js';
import { LiveWinsUI } from '../molecules/LiveWinsUI';
import { WinInfoUI } from '../molecules/WinInfoUI';

export class TopUIContainer extends Container {
  private liveWins: LiveWinsUI;
  private winInfoUI: WinInfoUI;

  constructor() {
    super();

    this.liveWins = new LiveWinsUI();
    this.winInfoUI = new WinInfoUI();

    this.addChild(this.liveWins, this.winInfoUI);
  }

  public resize(width: number, height: number): void {
    // Define breakpoints
    const liveWinsWidth = this.liveWins.width * 1.3;
    const winInfoPanelWidth = this.winInfoUI.width * 1.3;
    const winInfoPanelHeight = Math.max(this.winInfoUI.height, 64);
    const horizontalGap = 40;
    const containerGap = 100;

    const isDesktop = width >= 1024;
    const isTablet = width >= 768 && !isDesktop;

    if (isDesktop) {
      // Desktop: All elements horizontal
      this.layoutDesktop(width, height, liveWinsWidth, winInfoPanelWidth, winInfoPanelHeight, horizontalGap, containerGap);
    } else if (isTablet) {
      // Tablet: LiveWins and WinInfo horizontal
      this.layoutTablet(width, height, liveWinsWidth, winInfoPanelWidth, winInfoPanelHeight, containerGap);
    } else {
      // Mobile: Vertical layout (default)
      this.layoutMobile(width, height);
    }
  }

  public getLiveWins(): LiveWinsUI {
    return this.liveWins;
  }

  public getWinInfoUI(): WinInfoUI {
    return this.winInfoUI;
  }

  public update(): void {
    this.liveWins.update();
  }

  private layoutDesktop(
    width: number,
    height: number,
    liveWinsWidth: number,
    panelWidth: number,
    panelHeight: number,
    horizontalGap: number,
    containerGap: number
  ): void {
    this.winInfoUI.setAutoPositioning(false);

    this.liveWins.resize(width, height);
    this.winInfoUI.resize(width, height);

    this.liveWins.x = 0;
    this.liveWins.y = 50;

    this.winInfoUI.x = liveWinsWidth + containerGap;
    this.winInfoUI.y = 95;

    this.updateWinInfoLayout(true);

    this.x = 0;
    this.y = 0;
  }

  private layoutTablet(
    width: number,
    height: number,
    liveWinsWidth: number,
    panelWidth: number,
    panelHeight: number,
    containerGap: number
  ): void {
    this.winInfoUI.setAutoPositioning(false);

    this.liveWins.x = 0;
    this.liveWins.y = 50;

    this.liveWins.resize(width, height);
    this.winInfoUI.resize(width, height);

    const actualWinInfoWidth = this.winInfoUI.width;
    this.winInfoUI.x = liveWinsWidth + containerGap;
    this.winInfoUI.y = 50;

    this.updateWinInfoLayout(false);

    this.x = 0;
    this.y = 0;
  }

  private layoutMobile(width: number, height: number): void {
    this.winInfoUI.setAutoPositioning(true);

    this.liveWins.x = 0;
    this.liveWins.y = this.liveWins.height * 2.3;

    this.winInfoUI.x = width / 2;
    this.winInfoUI.y = 0;

    this.liveWins.resize(width, height);
    this.winInfoUI.resize(width, height);

    this.winInfoUI.updatePosition(width, height);
  }

  private updateWinInfoLayout(horizontal: boolean): void {
    this.winInfoUI.setLayout(horizontal);
  }
}
