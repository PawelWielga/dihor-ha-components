import html from "./dihor-dashboard-background-card.html";
import css from "./dihor-dashboard-background-card.css";
import { BaseDihorCard } from "../base";

type UnsplashOrientation = "landscape" | "portrait" | "squarish";

export interface DashboardBackgroundCardConfig {
  color?: string;
  image?: string;
  gradient?: string;
  transition?: string;
  size?: string;
  position?: string;
  repeat?: string;
  blend_mode?: string;
  attachment?: string;
  unsplash?: {
    api_key?: string;
    category?: string;
    query?: string;
    orientation?: UnsplashOrientation;
  };
}

const UNSPLASH_CACHE_KEY = "dihor-dashboard-background-last-unsplash";

export class DashboardBackgroundCard extends BaseDihorCard<DashboardBackgroundCardConfig> {
  private _viewElement?: HTMLElement;
  private _appliedProps = new Set<string>();
  private _prevStyles = new Map<string, string>();
  private _unsplashStatus = "brak";

  public setConfig(config: DashboardBackgroundCardConfig): void {
    super.setConfig(config);
    void this.applyBackground();
    this.renderConfigSummary();
  }

  protected cardHtml() {
    return html;
  }

  protected cardCss() {
    return css;
  }

  protected onCardCreated() {
    void this.applyBackground();
    this.renderConfigSummary();
  }

  protected update() {
    void this.applyBackground();
    this.renderConfigSummary();
  }

  disconnectedCallback() {
    this.restoreView();
  }

  private renderConfigSummary() {
    const updateValue = (selector: string, value?: string) => {
      const el = this.querySelector(selector);
      if (el) el.textContent = value || "brak";
    };
    updateValue("[data-config-color]", this._config?.color);
    updateValue("[data-config-image]", this._config?.image);
    updateValue("[data-config-gradient]", this._config?.gradient);
    updateValue(
      "[data-config-unsplash]",
      this._config?.unsplash?.category || this._config?.unsplash?.query
    );
    updateValue("[data-config-unsplash-status]", this._unsplashStatus);
  }

  private async applyBackground() {
    const view = this.findView();
    if (!view) return;

    if (this._viewElement && this._viewElement !== view) {
      this.restoreView();
    }

    this._viewElement = view;
    const style = await this.buildBackgroundStyle();
    if (!style) {
      this.clearAppliedStyles();
      this.renderConfigSummary();
      return;
    }

    this.syncStyle(style);
    this.renderConfigSummary();
  }

  private syncStyle(style: Record<string, string>) {
    if (!this._viewElement) return;

    for (const prop of Array.from(this._appliedProps)) {
      if (!(prop in style)) {
        this.restoreProperty(prop);
        this._appliedProps.delete(prop);
      }
    }

    for (const [prop, value] of Object.entries(style)) {
      if (!this._prevStyles.has(prop)) {
        this._prevStyles.set(prop, this._viewElement.style.getPropertyValue(prop));
      }
      this._viewElement.style.setProperty(prop, value);
      this._appliedProps.add(prop);
    }
  }

  private restoreProperty(prop: string) {
    if (!this._viewElement) return;
    const prev = this._prevStyles.get(prop);
    if (prev) {
      this._viewElement.style.setProperty(prop, prev);
    } else {
      this._viewElement.style.removeProperty(prop);
    }
    this._prevStyles.delete(prop);
  }

  private clearAppliedStyles() {
    if (!this._viewElement) return;
    for (const prop of Array.from(this._appliedProps)) {
      this.restoreProperty(prop);
    }
    this._appliedProps.clear();
    this._prevStyles.clear();
  }

  private restoreView() {
    this.clearAppliedStyles();
    this._viewElement = undefined;
  }

  private async buildBackgroundStyle(): Promise<Record<string, string> | null> {
    const config = this._config;
    if (!config) return null;

    const style: Record<string, string> = {};
    if (config.transition) style.transition = config.transition;
    const layers: string[] = [];
    if (config.gradient) layers.push(config.gradient);
    const backgroundImage = await this.resolveBackgroundImage();

    if (backgroundImage) {
      layers.push(`url("${this.safeUrl(backgroundImage)}")`);
    }
    if (layers.length) {
      style.backgroundImage = layers.join(", ");
    }

    if (config.color) style.backgroundColor = config.color;
    if (config.position) style.backgroundPosition = config.position;
    if (config.size) style.backgroundSize = config.size;
    if (config.repeat) style.backgroundRepeat = config.repeat;
    if (config.blend_mode) style.backgroundBlendMode = config.blend_mode;
    if (config.attachment) style.backgroundAttachment = config.attachment;

    return Object.keys(style).length ? style : null;
  }

  private async resolveBackgroundImage(): Promise<string | undefined> {
    if (!this._config) return undefined;

    if (this._config.image) {
      this._unsplashStatus = "nadpisane";
      return this._config.image;
    }

    const unsplash = this._config.unsplash;
    if (!unsplash) {
      this._unsplashStatus = "brak";
      return undefined;
    }

    const remote = await this.fetchUnsplashImage(unsplash);
    if (remote) {
      this._unsplashStatus = "pobrano";
      this.saveCachedUnsplashImage(remote);
      return remote;
    }

    const cached = this.loadCachedUnsplashImage();
    if (cached) {
      this._unsplashStatus = "ostatnie";
      return cached;
    }

    this._unsplashStatus = "blad";
    return undefined;
  }

  private async fetchUnsplashImage(
    unsplash: DashboardBackgroundCardConfig["unsplash"]
  ): Promise<string | null> {
    const query = (unsplash?.category?.trim() || unsplash?.query?.trim());
    if (!query) return null;

    const params = new URLSearchParams({
      query,
      content_filter: "high",
      w: "1920",
    });
    if (unsplash?.orientation) {
      params.set("orientation", unsplash.orientation);
    }

    const requestUrl = `https://api.unsplash.com/photos/random?${params.toString()}`;
    const headers: Record<string, string> = {};
    if (unsplash?.api_key) {
      headers.Authorization = `Client-ID ${unsplash.api_key.trim()}`;
    }

    try {
      const response = await fetch(requestUrl, { headers });
      if (!response.ok) {
        return null;
      }
      const payload = await response.json();
      const imageUrl =
        payload?.urls?.regular || payload?.urls?.full || payload?.urls?.raw;
      if (typeof imageUrl === "string" && imageUrl) {
        return imageUrl;
      }
    } catch {
      // ignore network issues
    }

    return null;
  }

  private saveCachedUnsplashImage(url: string) {
    try {
      window.localStorage.setItem(UNSPLASH_CACHE_KEY, url);
    } catch {
      // ignore storage failures
    }
  }

  private loadCachedUnsplashImage(): string | undefined {
    try {
      return window.localStorage.getItem(UNSPLASH_CACHE_KEY) || undefined;
    } catch {
      return undefined;
    }
  }

  private safeUrl(value: string): string {
    const trimmed = value.trim();
    if (!trimmed) return "";
    return trimmed.replace(/"/g, '\\"');
  }

  private findView(): HTMLElement | null {
    let node: Node | null = this;
    while (node) {
      if (node instanceof HTMLElement && node.tagName.toLowerCase() === "hui-view") {
        return node;
      }
      if (node instanceof ShadowRoot) {
        node = node.host;
      } else {
        node = node.parentNode;
      }
    }
    return null;
  }

  getCardSize() {
    return 2;
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
