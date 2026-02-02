import { Container } from 'pixi.js';
import { LiveWinsUI } from '../molecules/LiveWinsUI';
import { WinInfoUI } from '../molecules/WinInfoUI';
import { ScreenAdapter } from '../../core/ScreenAdapter';

export class TopUIContainer extends Container {
  private liveWins: LiveWinsUI;
  private winInfoUI: WinInfoUI;
  private screenAdapter: ScreenAdapter;

  constructor() {
    super();
    this.screenAdapter = ScreenAdapter.getInstance();

    this.liveWins = new LiveWinsUI();
    this.winInfoUI = new WinInfoUI();

    this.addChild(this.liveWins, this.winInfoUI);
    this.resize(this.screenAdapter.width, this.screenAdapter.height);
  }

  public resize(width: number, height: number): void {
    // Define breakpoints
    const liveWinsWidth = this.liveWins.width * 1.3;
    const winInfoPanelWidth = this.winInfoUI.width * 1.3;
    const winInfoPanelHeight = Math.max(this.winInfoUI.height, 64);
    const horizontalGap = 40;
    const containerGap = 100;

    if (this.screenAdapter.isLandscape() && !this.screenAdapter.isDesktop()) {
      // Landscape: All elements horizontal and smaller
      this.layoutLandscape(width, height, liveWinsWidth);
    } else if (this.screenAdapter.isDesktop()) {
      // Desktop: All elements horizontal
      this.layoutDesktop(width, height, liveWinsWidth, winInfoPanelWidth, winInfoPanelHeight, horizontalGap, containerGap);
    } else if (this.screenAdapter.isTablet()) {
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

  private layoutLandscape(width: number, height: number, liveWinsWidth: number): void {
    this.winInfoUI.setAutoPositioning(false);

    this.liveWins.resize(width, height);
    this.winInfoUI.resize(width, height);

    this.liveWins.x = 0;
    this.liveWins.y = 10;

    const gapX = this.screenAdapter.isTablet() ? 60 : 35;
    const offsetY = this.screenAdapter.isTablet() ? 40 : 35;
    this.winInfoUI.x = width * 0.42 + gapX;
    this.winInfoUI.y = offsetY;

    this.updateWinInfoLayout(true);

    this.x = 0;
    this.y = 0;
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

    this.winInfoUI.x = 400 + containerGap;
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
    this.liveWins.y = 220;

    this.winInfoUI.x = width / 2;
    this.winInfoUI.y = 80;

    this.liveWins.resize(width, height);
    this.winInfoUI.resize(width, height);

    this.winInfoUI.updatePosition(width, height);

    // if container height more 30% of screen height
    // make children smaller
    const containerHeight = this.liveWins.y + this.liveWins.height * this.liveWins.scale.y;
    const maxAllowedHeight = height * 0.3;

    this.updateWinInfoLayout(false);

    if (containerHeight > maxAllowedHeight) {
      const scaleRatio = maxAllowedHeight / containerHeight;
      this.liveWins.scale.set(scaleRatio);
      this.winInfoUI.scale.set(scaleRatio);
      this.liveWins.y = 220 * scaleRatio;
      this.winInfoUI.y = 80 * scaleRatio;
    } else {
      this.liveWins.scale.set(1);
      this.winInfoUI.scale.set(1);
      this.liveWins.y = 220;
      this.winInfoUI.y = 80;
    }
  }

  private updateWinInfoLayout(horizontal: boolean): void {
    this.winInfoUI.setLayout(horizontal);
  }
}
