export interface HomeAssistant {
  states: Record<string, {
    state: string;
    attributes: Record<string, any>;
  }>;
  themes?: {
    darkMode?: boolean;
  };
  callService(
    domain: string,
    service: string,
    serviceData?: Record<string, any>
  ): Promise<void>;
}

export interface LovelaceGridOptions {
  rows?: number;
  min_rows?: number;
  max_rows?: number;
  columns?: number | 'full';
  min_columns?: number;
  max_columns?: number;
}

export interface LovelaceCard {
  readonly card: HTMLElement;
  readonly hass: HomeAssistant;
  setConfig(config: any): void;
  getCardSize(): number;
  getGridOptions?(): LovelaceGridOptions;
}
