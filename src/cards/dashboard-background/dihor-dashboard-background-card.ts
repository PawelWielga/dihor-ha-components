import html from "./dihor-dashboard-background-card.html";
import css from "./dihor-dashboard-background-card.css";
import { BaseDihorCard } from "../base";

export interface DashboardBackgroundCardConfig {
  color?: string;
  image?: string;
  image_url?: string;
  debug_background_color?: string;
  gradient?: string;
  transition?: string;
  size?: string;
  position?: string;
  repeat?: string;
  blend_mode?: string;
  attachment?: string;
}

export class DashboardBackgroundCard extends BaseDihorCard<DashboardBackgroundCardConfig> {
  private _viewElement?: HTMLElement;
  private _lastStyle?: Record<string, string>;
  private _viewObserver?: MutationObserver;

  public setConfig(config: DashboardBackgroundCardConfig): void {
    super.setConfig(config);
    void this.waitForViewAndApply();
  }

  protected cardHtml() {
    return html;
  }

  protected cardCss() {
    return css;
  }

  protected onCardCreated() {
    void this.waitForViewAndApply();
  }

  protected update() {
    void this.waitForViewAndApply();
  }

  disconnectedCallback() {
    this.disconnectViewObserver();
  }

  private async waitForViewAndApply() {
    if (this._viewElement) {
      return;
    }

    const view = await this.waitForView();
    if (!view) {
      console.warn("dihor-dashboard-background-card: Nie znaleziono hui-view po wielu próbach");
      return;
    }

    this._viewElement = view;
    console.log("dihor-dashboard-background-card: Znalazłem hui-view");
    this._viewElement.style.backgroundImage = "url('https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1600&q=80')";
    this._viewElement.style.backgroundSize = "cover";
    this._viewElement.style.backgroundPosition = "center";
    this._viewElement.style.backgroundRepeat = "no-repeat";
    this.observeView(view);
    await this.applyBackgroundToView();
  }

  private queryDeep(selector: string, root: Node = document): HTMLElement | null {
    if ('querySelector' in root) {
      const hit = (root as Document | Element).querySelector(selector);
      if (hit) return hit as HTMLElement;
    }

    const all = 'querySelectorAll' in root ? Array.from((root as Document | Element).querySelectorAll("*")) : [];
    for (const el of all) {
      if (el.shadowRoot) {
        const hit = this.queryDeep(selector, el.shadowRoot);
        if (hit) return hit;
      }
    }

    return null;
  }

  private async waitForView(): Promise<HTMLElement | null> {
    const maxAttempts = 50;
    const delay = 300;

    for (let i = 0; i < maxAttempts; i++) {
      const view = this.queryDeep("hui-view");
      if (view) {
        console.log("dihor-dashboard-background-card: Znalazłem hui-view w shadow DOM:", view.tagName);
        return view;
      }

      let current = this.parentElement;
      while (current) {
        if (current.tagName && current.tagName.toLowerCase().includes("hui-view")) {
          return current as HTMLElement;
        }
        current = current.parentElement;
      }

      await new Promise(resolve => setTimeout(resolve, delay));
    }

    return null;
  }

  private async applyBackgroundToView() {
    if (!this._viewElement) return;

    const style = await this.buildBackgroundStyle();
    if (!style) {
      this.clearViewStyles();
      return;
    }

    this._lastStyle = { ...style };
    this.applyStyle(style);
  }

  private buildBackgroundStyle(): Promise<Record<string, string> | null> {
    return new Promise((resolve) => {
      const config = this._config;
      if (!config) return resolve(null);

      const style: Record<string, string> = {};
      if (config.transition) style.transition = config.transition;
      const layers: string[] = [];

      const directImage = config.image || config.image_url;
      if (directImage) {
        layers.push(`url("${this.safeUrl(directImage)}")`);
      }

      if (config.gradient) layers.push(config.gradient);
      if (layers.length) {
        style.backgroundImage = layers.join(", ");
      }

      if (config.color) style.backgroundColor = config.color;
      if (config.debug_background_color) {
        style.backgroundColor = config.debug_background_color;
      }
      if (config.position) style.backgroundPosition = config.position;
      if (config.size) style.backgroundSize = config.size;
      if (config.repeat) style.backgroundRepeat = config.repeat;
      if (config.blend_mode) style.backgroundBlendMode = config.blend_mode;
      if (config.attachment) style.backgroundAttachment = config.attachment;

      resolve(Object.keys(style).length ? style : null);
    });
  }

  private applyStyle(style: Record<string, string>) {
    if (!this._viewElement) return;
    Object.entries(style).forEach(([prop, value]) => {
      this._viewElement!.style.setProperty(prop, value);
    });
  }

  private clearViewStyles() {
    if (!this._viewElement) return;

    const propertiesToClear = [
      "backgroundImage",
      "backgroundColor",
      "backgroundPosition",
      "backgroundSize",
      "backgroundRepeat",
      "backgroundBlendMode",
      "backgroundAttachment",
      "transition"
    ];

    propertiesToClear.forEach(prop => {
      this._viewElement!.style.removeProperty(prop);
    });
  }

  private observeView(view: HTMLElement) {
    if (this._viewObserver) {
      this.disconnectViewObserver();
    }

    this._viewObserver = new MutationObserver(() => {
      if (this._lastStyle) {
        this.applyStyle({ ...this._lastStyle });
      }
    });

    this._viewObserver.observe(view, {
      attributes: true,
      attributeFilter: ["style", "class"],
    });
  }

  private disconnectViewObserver() {
    if (this._viewObserver) {
      this._viewObserver.disconnect();
      this._viewObserver = undefined;
    }
  }

  private safeUrl(value: string): string {
    const trimmed = value.trim();
    if (!trimmed) return "";
    return trimmed.replace(/"/g, '\\"');
  }

  getCardSize() {
    return 1;
  }
}

if (!customElements.get("dihor-dashboard-background-card")) {
  customElements.define("dihor-dashboard-background-card", DashboardBackgroundCard);
}

;(window as any).customCards = (window as any).customCards || [];
;(window as any).customCards.push({
  type: "dihor-dashboard-background-card",
  name: "Dihor Dashboard Background Card",
  preview: true,
  description: "Take over the view background using a configured color, gradient or image."
});
