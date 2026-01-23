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
    // Jeśli już mamy referencję do view, nie sprawdzaj ponownie
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
    // Dodaj styl testowy
    this._viewElement.style.backgroundColor = "pink";
    this.observeView(view);
    await this.applyBackgroundToView();
    this.renderConfigSummary();
  }

  private queryDeep(selector: string, root: Node = document): HTMLElement | null {
    // 1) Spróbuj bezpośrednio w tym root
    if ('querySelector' in root) {
      const hit = (root as Document | Element).querySelector(selector);
      if (hit) return hit as HTMLElement;
    }

    // 2) Przejdź po wszystkich elementach i wejdź w ich shadowRoot (jeśli jest)
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
      // Sposób 1: Przeszukiwanie głębokie z uwzględnieniem shadow DOM
      const view = this.queryDeep("hui-view");
      if (view) {
        console.log("dihor-dashboard-background-card: Znalazłem hui-view w shadow DOM:", view.tagName);
        return view;
      }

      // Sposób 2: Przeszukiwanie drzewa DOM od elementu karty w górę
      let current = this.parentElement;
      while (current) {
        if (current.tagName && current.tagName.toLowerCase().includes("hui-view")) {
          return current as HTMLElement;
        }
        current = current.parentElement;
      }

      await new Promise(resolve => setTimeout(resolve, delay));
    }

    console.debug("dihor-dashboard-background-card: Próbowano znaleźć widok w następujących miejscach:", {
      "queryDeep('hui-view')": !!this.queryDeep("hui-view"),
      "document.querySelectorAll('hui-view')": document.querySelectorAll("hui-view").length,
      "document.querySelector('[data-panel=\"lovelace\"]')": !!document.querySelector("[data-panel='lovelace']"),
      "card parent chain": this.parentElement ? Array.from(this.parentElement.children).map(el => el.tagName) : "brak parenta"
    });

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
    updateValue("[data-config-unsplash]", "brak");
    updateValue("[data-config-unsplash-status]", "brak");
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
