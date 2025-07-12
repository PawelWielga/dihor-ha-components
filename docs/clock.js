document.addEventListener('DOMContentLoaded', () => {
  const preview = document.getElementById('clock-card-preview');
  if (!preview) return;

  const updateTime = () => {
    const timeEl = preview.querySelector('#time');
    if (timeEl) {
      timeEl.textContent = new Date().toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      });
    }
  };

  const waitForTimeEl = () => {
    if (preview.querySelector('#time')) {
      updateTime();
      setInterval(updateTime, 1000);
    } else {
      requestAnimationFrame(waitForTimeEl);
    }
  };

  waitForTimeEl();
});

