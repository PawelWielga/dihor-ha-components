import "./cards/theme.css";
import "./cards/core.css";

import "./cards/person/dihor-person-card";
import "./cards/minecraft/dihor-minecraft-card";
import "./cards/clock/dihor-clock-card";
import "./cards/dashboard-background/dihor-dashboard-background-card";
import "./cards/toggle/dihor-toggle-card";
// Możesz dodawać kolejne komponenty bez zmian w konfiguracji

// Dodatkowo eksportujemy klasy, aby programiści mogli importować komponenty bezpośrednio
export { PersonCard } from "./cards/person/dihor-person-card";
export { MinecraftCard } from "./cards/minecraft/dihor-minecraft-card";
export { ClockCard } from "./cards/clock/dihor-clock-card";
export { DashboardBackgroundCard } from "./cards/dashboard-background/dihor-dashboard-background-card";
export { ToggleCard } from "./cards/toggle/dihor-toggle-card";
