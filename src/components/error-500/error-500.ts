document.addEventListener('DOMContentLoaded', () => {
  const refreshBtn = document.querySelector('[data-action="refresh"]');

  refreshBtn?.addEventListener('click', () => {
    window.location.reload();
  });
});

export {};