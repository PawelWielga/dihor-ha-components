const isLocal =
  location.hostname === "localhost" || location.protocol === "file:";
const basePath = isLocal ? "/cards" : "./cards";

// Dynamiczne dołączenie CSS
const css = document.createElement("link");
css.rel = "stylesheet";
css.href = `${basePath}/minecraft/dihor-minecraft-card.css`;
document.head.appendChild(css);

const cssClock = document.createElement("link");
cssClock.rel = "stylesheet";
cssClock.href = `${basePath}/clock/dihor-clock-card.css`;
document.head.appendChild(cssClock);

function loadCardPreview() {
  const mcPreview = document.getElementById("minecraft-card-preview");
  fetch(`${basePath}/minecraft/dihor-minecraft-card.html`)
    .then((res) => {
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return res.text();
    })
    .then((html) => {
      if (mcPreview) mcPreview.innerHTML = html;
    })
    .catch((error) => {
      console.error("Błąd ładowania podglądu:", error);
      if (mcPreview)
        mcPreview.innerHTML =
          '<div class="error-placeholder">Nie udało się załadować podglądu</div>';
    });

  const clockPreview = document.getElementById("clock-card-preview");
  fetch(`${basePath}/clock/dihor-clock-card.html`)
    .then((res) => {
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return res.text();
    })
    .then((html) => {
      if (clockPreview) clockPreview.innerHTML = html;
    })
    .catch((error) => {
      console.error("Błąd ładowania podglądu zegara:", error);
      if (clockPreview)
        clockPreview.innerHTML =
          '<div class="error-placeholder">Nie udało się załadować podglądu</div>';
    });
}

document.addEventListener("DOMContentLoaded", loadCardPreview);
