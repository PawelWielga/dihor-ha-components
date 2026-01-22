export interface HomeAssistant {
  states: Record<string, {
    state: string;
    attributes: Record<string, any>;
  }>;
  themes?: {
    darkMode?: boolean;
  };
}

export interface LovelaceCard {
  readonly card: HTMLElement;
  readonly hass: HomeAssistant;
  setConfig(config: any): void;
  getCardSize(): number;
}
