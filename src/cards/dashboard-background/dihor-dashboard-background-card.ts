import { html, css, unsafeCSS } from "lit";
import { BaseDihorCard } from "../base";
import cardCssStr from "./dihor-dashboard-background-card.css";

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

  static get styles() {
    return [super.styles, css`${unsafeCSS(cardCssStr)}`];
  }

  public setConfig(config: DashboardBackgroundCardConfig): void {
    super.setConfig(config);
    // Trigger update not needed as super calls requestUpdate
  }

  protected updated(changedProperties: Map<string | number | symbol, unknown>) {
    super.updated(changedProperties);
    void this.waitForViewAndApply();
  }

  protected renderCard() {
    // This card has no visual content of its own, it behaves as a controller
    return html`
      <ha-card style="display:none"></ha-card>
    `;
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.disconnectViewObserver();
  }

  private async waitForViewAndApply() {
    if (this._viewElement) {
      // Re-apply if config changed
      await this.applyBackgroundToView();
      return;
    }

    const view = await this.waitForView();
    if (!view) {
      console.warn("dihor-dashboard-background-card: Nie znaleziono hui-view po wielu próbach");
      return;
    }

    this._viewElement = view;
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
      // Try to find the view from the root (document) or relative to this element
      // Since we are inside shadow DOM now, calling queryDeep from document is preferred for HA structure
      const view = this.queryDeep("hui-view");
      if (view) {
        return view;
      }

      // Fallback: traverse up if we are deep
      // LitElement host is 'this'
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

; (window as any).customCards = (window as any).customCards || [];
; (window as any).customCards.push({
  type: "dihor-dashboard-background-card",
  name: "Dihor Dashboard Background Card",
  preview: true,
  description: "Take over the view background using a configured color, gradient or image."
});
