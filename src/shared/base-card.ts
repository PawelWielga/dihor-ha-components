import { LitElement, html, CSSResultGroup, css, unsafeCSS, PropertyValues } from 'lit';
import { property, state } from 'lit/decorators.js';
import themeCss from './styles/theme.css';
import coreCss from './styles/core.css';
import fontCss from './styles/font.css';
import type { HomeAssistant, LovelaceCard } from '../../types/home-assistant';

export interface DashboardBackgroundConfig {
  color?: string;
  image?: string;
  image_url?: string;
  gradient?: string;
  transition?: string;
  size?: string;
  position?: string;
  repeat?: string;
  blend_mode?: string;
  attachment?: string;
}

export interface BaseCardConfig {
  background?: DashboardBackgroundConfig;
}

export function getBackgroundConfigSchema() {
  return [
    {
      type: 'expandable',
      name: '',
      title: 'Dashboard Background',
      schema: [
        {
          name: 'background.color',
          selector: { ui_color: {} },
        },
        {
          name: 'background.image_url',
          selector: { text: { type: 'url' } },
        },
        {
          name: 'background.gradient',
          selector: { text: { multiline: true } },
        },
        {
          name: 'background.transition',
          selector: { text: {} },
        },
        {
          type: 'grid',
          name: '',
          schema: [
            {
              name: 'background.size',
              selector: {
                select: {
                  options: [
                    { value: 'auto', label: 'Auto' },
                    { value: 'cover', label: 'Cover' },
                    { value: 'contain', label: 'Contain' },
                    { value: '100%', label: '100%' },
                  ],
                  custom_value: true,
                },
              },
            },
            {
              name: 'background.position',
              selector: {
                select: {
                  options: [
                    { value: 'center', label: 'Center' },
                    { value: 'top', label: 'Top' },
                    { value: 'bottom', label: 'Bottom' },
                    { value: 'left', label: 'Left' },
                    { value: 'right', label: 'Right' },
                  ],
                  custom_value: true,
                },
              },
            },
            {
              name: 'background.repeat',
              selector: {
                select: {
                  options: [
                    { value: 'no-repeat', label: 'No Repeat' },
                    { value: 'repeat', label: 'Repeat' },
                    { value: 'repeat-x', label: 'Repeat X' },
                    { value: 'repeat-y', label: 'Repeat Y' },
                  ],
                },
              },
            },
            {
              name: 'background.attachment',
              selector: {
                select: {
                  options: [
                    { value: 'scroll', label: 'Scroll' },
                    { value: 'fixed', label: 'Fixed' },
                    { value: 'local', label: 'Local' },
                  ],
                },
              },
            },
            {
              name: 'background.blend_mode',
              selector: { text: {} },
            },
          ],
        },
      ],
    },
  ];
}

export function getBackgroundConfigLabel(fieldName: string): string | undefined {
  switch (fieldName) {
    case 'background.color':
      return 'Background Color';
    case 'background.image_url':
      return 'Background Image URL';
    case 'background.gradient':
      return 'Background Gradient';
    case 'background.transition':
      return 'Background Transition';
    case 'background.size':
      return 'Background Size';
    case 'background.position':
      return 'Background Position';
    case 'background.repeat':
      return 'Background Repeat';
    case 'background.attachment':
      return 'Background Attachment';
    case 'background.blend_mode':
      return 'Background Blend Mode';
    default:
      return undefined;
  }
}

export function getBackgroundConfigHelper(fieldName: string): string | undefined {
  switch (fieldName) {
    case 'background.color':
      return 'Solid dashboard background color';
    case 'background.image_url':
      return 'URL of dashboard background image';
    case 'background.gradient':
      return 'CSS gradient, e.g. linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
    case 'background.transition':
      return 'CSS transition, e.g. background 0.3s ease';
    case 'background.size':
      return 'How background image is sized';
    case 'background.position':
      return 'Position of dashboard background image';
    case 'background.repeat':
      return 'Background repeat mode';
    case 'background.attachment':
      return 'Whether background scrolls with content';
    case 'background.blend_mode':
      return 'CSS blend mode, e.g. overlay or multiply';
    default:
      return undefined;
  }
}

const BACKGROUND_STYLE_PROPS = [
  'background-image',
  'background-color',
  'background-position',
  'background-size',
  'background-repeat',
  'background-blend-mode',
  'background-attachment',
  'transition',
] as const;
 
export abstract class BaseDihorCard<ConfigType extends BaseCardConfig> extends LitElement implements LovelaceCard {
  @property({ attribute: false }) public hass!: HomeAssistant;
  @state() protected _config!: ConfigType;
  private _viewElement?: HTMLElement;
  private _viewObserver?: MutationObserver;
  private _lastBackgroundStyle?: Record<string, string>;
  private readonly _backgroundOwnerId: string = `dihor-bg-${Math.random().toString(36).slice(2, 10)}`;

  public setConfig(config: ConfigType): void {
    this._config = config;
    this.requestUpdate();
  }

  // Legacy property for LovelaceCard interface compatibility
  public get card(): HTMLElement {
    return this;
  }

  // Lit element styles
  static get styles(): CSSResultGroup {
    return css`
      ${unsafeCSS(themeCss)}
      ${unsafeCSS(coreCss)}
      ${unsafeCSS(fontCss)}
    `;
  }

  // Helper to allow cards to add their own styles easily
  protected get styles(): CSSResultGroup {
    return [];
  }

  protected render() {
    if (!this._config || !this.hass) {
      return html``;
    }
    return this.renderCard();
  }

  protected updated(changedProperties: PropertyValues): void {
    super.updated(changedProperties);
    void this.syncDashboardBackground();
  }

  public disconnectedCallback(): void {
    super.disconnectedCallback();
    this.disconnectViewObserver();
    this.clearOwnedBackgroundStyles();
  }

  protected abstract renderCard(): unknown;

  public getCardSize(): number {
    return 1;
  }

  private async syncDashboardBackground(): Promise<void> {
    const backgroundConfig = this._config?.background;

    if (!backgroundConfig) {
      this._lastBackgroundStyle = undefined;
      this.clearOwnedBackgroundStyles();
      return;
    }

    const style = this.buildBackgroundStyle(backgroundConfig);
    if (!style) {
      this._lastBackgroundStyle = undefined;
      this.clearOwnedBackgroundStyles();
      return;
    }

    const view = this._viewElement ?? (await this.waitForView());
    if (!view) {
      return;
    }

    if (!this._viewElement) {
      this._viewElement = view;
      this.observeView(view);
    }

    this._lastBackgroundStyle = style;
    this.applyBackgroundStyle(style);
  }

  private buildBackgroundStyle(config: DashboardBackgroundConfig): Record<string, string> | null {
    const style: Record<string, string> = {};
    if (config.transition) style['transition'] = config.transition;

    const layers: string[] = [];
    const directImage = config.image || config.image_url;
    if (directImage) {
      layers.push(`url("${this.safeUrl(directImage)}")`);
    }
    if (config.gradient) {
      layers.push(config.gradient);
    }
    if (layers.length) {
      style['background-image'] = layers.join(', ');
    }

    if (config.color) style['background-color'] = config.color;
    if (config.position) style['background-position'] = config.position;
    if (config.size) style['background-size'] = config.size;
    if (config.repeat) style['background-repeat'] = config.repeat;
    if (config.blend_mode) style['background-blend-mode'] = config.blend_mode;
    if (config.attachment) style['background-attachment'] = config.attachment;

    return Object.keys(style).length > 0 ? style : null;
  }

  private applyBackgroundStyle(style: Record<string, string>): void {
    if (!this._viewElement) return;

    this._viewElement.dataset.dihorBgOwner = this._backgroundOwnerId;
    Object.entries(style).forEach(([prop, value]) => {
      this._viewElement!.style.setProperty(prop, value);
    });
  }

  private clearOwnedBackgroundStyles(): void {
    if (!this._viewElement) return;
    if (this._viewElement.dataset.dihorBgOwner !== this._backgroundOwnerId) return;

    BACKGROUND_STYLE_PROPS.forEach((prop) => {
      this._viewElement!.style.removeProperty(prop);
    });
    delete this._viewElement.dataset.dihorBgOwner;
  }

  private observeView(view: HTMLElement): void {
    this.disconnectViewObserver();
    this._viewObserver = new MutationObserver(() => {
      if (!this._viewElement || !this._lastBackgroundStyle) return;
      if (this._viewElement.dataset.dihorBgOwner !== this._backgroundOwnerId) return;
      if (this.isBackgroundApplied(this._lastBackgroundStyle)) return;
      this.applyBackgroundStyle(this._lastBackgroundStyle);
    });

    this._viewObserver.observe(view, {
      attributes: true,
      attributeFilter: ['style', 'class'],
    });
  }

  private disconnectViewObserver(): void {
    if (this._viewObserver) {
      this._viewObserver.disconnect();
      this._viewObserver = undefined;
    }
  }

  private isBackgroundApplied(style: Record<string, string>): boolean {
    if (!this._viewElement) return false;
    return Object.entries(style).every(([prop, value]) => {
      return this._viewElement!.style.getPropertyValue(prop).trim() === value.trim();
    });
  }

  private queryDeep(selector: string, root: Node = document): HTMLElement | null {
    if ('querySelector' in root) {
      const hit = (root as Document | Element).querySelector(selector);
      if (hit) return hit as HTMLElement;
    }

    const all = 'querySelectorAll' in root ? Array.from((root as Document | Element).querySelectorAll('*')) : [];
    for (const el of all) {
      if (el.shadowRoot) {
        const hit = this.queryDeep(selector, el.shadowRoot);
        if (hit) return hit;
      }
    }

    return null;
  }

  private async waitForView(): Promise<HTMLElement | null> {
    const maxAttempts = 30;
    const delayMs = 250;

    for (let attempt = 0; attempt < maxAttempts; attempt += 1) {
      const view = this.queryDeep('hui-view');
      if (view) return view;
      await new Promise((resolve) => setTimeout(resolve, delayMs));
    }

    return null;
  }

  private safeUrl(value: string): string {
    const trimmed = value.trim();
    if (!trimmed) return '';
    return trimmed.replace(/"/g, '\\"');
  }
}


