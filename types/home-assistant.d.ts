export interface HomeAssistant {
  states: Record<string, {
    state: string;
    attributes: Record<string, any>;
  }>;
  themes?: {
    darkMode?: boolean;
  };
}
