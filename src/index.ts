import "./shared/styles/theme.css";
import "./shared/styles/core.css";
import "./shared/styles/font.css";

import "./cards/person/dihor-person-card";
import "./cards/minecraft/dihor-minecraft-card";
import "./cards/clock/dihor-clock-card";
import "./cards/toggle-button/dihor-toggle-button-card";
// Możesz dodawać kolejne komponenty bez zmian w konfiguracji

// Dodatkowo eksportujemy klasy, aby programiści mogli importować komponenty bezpośrednio
export { PersonCard } from "./cards/person/dihor-person-card";
export { MinecraftCard } from "./cards/minecraft/dihor-minecraft-card";
export { ClockCard } from "./cards/clock/dihor-clock-card";
export { ToggleButtonCard } from "./cards/toggle-button/dihor-toggle-button-card";
