import html from "./dihor-dashboard-background-card.html";
import css from "./dihor-dashboard-background-card.css";
import { BaseDihorCard } from "../base";

type UnsplashOrientation = "landscape" | "portrait" | "squarish";

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
  unsplash?: {
    api_key?: string;
    category?: string;
    query?: string;
    orientation?: UnsplashOrientation;
  };
}

const UNSPLASH_CACHE_KEY = "dihor-dashboard-background-last-unsplash";
const UNSPLASH_LAST_FETCH_KEY = "dihor-dashboard-background-last-unsplash-fetch";
const ONE_DAY_MS = 24 * 60 * 60 * 1000;

export class DashboardBackgroundCard extends BaseDihorCard<DashboardBackgroundCardConfig> {
  private _viewElement?: HTMLElement;
  private _appliedProps = new Set<string>();
  private _prevStyles = new Map<string, string>();
  private _unsplashStatus = "brak";
  private _lastStyle?: Record<string, string>;
  private _observedView?: HTMLElement;
  private _viewObserver?: MutationObserver;

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
    updateValue(
      "[data-config-image]",
      this._config?.image || this._config?.image_url
    );
    updateValue("[data-config-gradient]", this._config?.gradient);
    updateValue(
      "[data-config-unsplash]",
      this._config?.unsplash?.category || this._config?.unsplash?.query
    );
    updateValue("[data-config-unsplash-status]", this._unsplashStatus);
  }

  private async applyBackground() {
    let view = this.findView();
    let retries = 0;
    const maxRetries = 5;
    const retryDelay = 100;

    while (!view && retries < maxRetries) {
      await new Promise(resolve => setTimeout(resolve, retryDelay));
      view = this.findView();
      retries++;
    }

    if (!view) {
      console.warn("dihor-dashboard-background-card: Nie znaleziono elementu hui-view");
      return;
    }

    if (this._viewElement && this._viewElement !== view) {
      this.restoreView();
    }

    this._viewElement = view;
    this.observeView(view);
    const style = await this.buildBackgroundStyle();
    if (!style) {
      this._lastStyle = undefined;
      this.clearAppliedStyles();
      this.renderConfigSummary();
      return;
    }
    this._lastStyle = { ...style };

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
    this.disconnectViewObserver();
  }

  private async buildBackgroundStyle(): Promise<Record<string, string> | null> {
    const config = this._config;
    if (!config) return null;

    const style: Record<string, string> = {};
    if (config.transition) style.transition = config.transition;
    const layers: string[] = [];
    const backgroundImage = await this.resolveBackgroundImage();

    if (backgroundImage) {
      layers.push(`url("${this.safeUrl(backgroundImage)}")`);
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

    return Object.keys(style).length ? style : null;
  }

  private observeView(view: HTMLElement) {
    if (this._observedView === view) return;
    this.disconnectViewObserver();

    this._observedView = view;
    this._viewObserver = new MutationObserver(() => {
      if (this._lastStyle) {
        this.syncStyle({ ...this._lastStyle });
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
    this._observedView = undefined;
  }

  private async resolveBackgroundImage(): Promise<string | undefined> {
    if (!this._config) return undefined;

    const directImage = this._config.image || this._config.image_url;
    if (directImage) {
      this._unsplashStatus = "nadpisane";
      return directImage;
    }

    const unsplash = this._config.unsplash;
    if (!unsplash) {
      this._unsplashStatus = "brak";
      return undefined;
    }

    const cached = this.loadCachedUnsplashImage();
    const lastFetch = this.loadUnsplashLastFetchTimestamp();
    const recentlyFetched = lastFetch !== undefined && Date.now() - lastFetch < ONE_DAY_MS;

    if (cached && recentlyFetched) {
      this._unsplashStatus = "ostatnie";
      return cached;
    }

    const remote = await this.fetchUnsplashImage(unsplash);
    this.saveLastUnsplashFetchTimestamp(Date.now());
    if (remote) {
      this._unsplashStatus = "pobrano";
      this.saveCachedUnsplashImage(remote);
      return remote;
    }

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
      window.localStorage.setItem(
        UNSPLASH_CACHE_KEY,
        JSON.stringify({ url })
      );
    } catch {
      // ignore storage failures
    }
  }

  private loadCachedUnsplashImage(): string | undefined {
    try {
      const raw = window.localStorage.getItem(UNSPLASH_CACHE_KEY);
      if (!raw) return undefined;
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed.url === "string") {
        return parsed.url;
      }
    } catch {
      // ignore parsing/storage failures
    }
    return undefined;
  }

  private saveLastUnsplashFetchTimestamp(value: number) {
    try {
      window.localStorage.setItem(UNSPLASH_LAST_FETCH_KEY, value.toString());
    } catch {
      // ignore storage failures
    }
  }

  private loadUnsplashLastFetchTimestamp(): number | undefined {
    try {
      const raw = window.localStorage.getItem(UNSPLASH_LAST_FETCH_KEY);
      if (!raw) return undefined;
      const parsed = Number(raw);
      if (!Number.isNaN(parsed)) {
        return parsed;
      }
    } catch {
      // ignore parsing/storage failures
    }
    return undefined;
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
    return document.querySelector("hui-view");
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
