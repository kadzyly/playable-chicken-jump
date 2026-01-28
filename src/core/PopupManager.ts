export interface IPopup {
  show(): Promise<void> | void;
  hide(): Promise<void> | void;
  destroy?(): void;
}

export class PopupManager {
  private static instance: PopupManager;
  private currentPopup: IPopup | null = null;

  private constructor() {}

  public static getInstance(): PopupManager {
    if (!PopupManager.instance) {
      PopupManager.instance = new PopupManager();
    }
    return PopupManager.instance;
  }

  async show(popup: IPopup): Promise<void> {
    if (this.currentPopup) {
      await this.hideCurrent();
    }

    this.currentPopup = popup;
    await popup.show();
  }

  async hideCurrent(): Promise<void> {
    if (!this.currentPopup) return;

    await this.currentPopup.hide();
    this.currentPopup.destroy?.();
    this.currentPopup = null;
  }

  isPopupOpened(): boolean {
    return this.currentPopup !== null;
  }
}
