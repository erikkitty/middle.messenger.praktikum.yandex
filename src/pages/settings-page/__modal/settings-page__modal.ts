export function initSettingsModal(root: HTMLElement): void {
  const modal = document.querySelector(".settings-modal");
  const fileLink = root.querySelector(".settings-modal__file-link");
  const fileInput = modal?.querySelector<HTMLInputElement>(
    "#avatar-upload",
  );
  const fileNameEl = modal?.querySelector<HTMLElement>(
    "#settings-modal-file-name",
  );
  const closeBtn = root.querySelector('[data-action="close-modal"]');

  function clearFileName(): void {
    if (fileNameEl) fileNameEl.textContent = "";
  }

  function closeModal(): void {
    modal?.classList.remove("settings-modal--visible");
    if (fileInput) fileInput.value = "";
    clearFileName();
  }

  fileLink?.addEventListener("click", (e: Event) => {
    e.preventDefault();
    fileInput?.click();
  });

  fileInput?.addEventListener("change", () => {
    const file = fileInput.files?.[0];
    if (fileNameEl) fileNameEl.textContent = file ? file.name : "";
  });

  closeBtn?.addEventListener("click", closeModal);

  modal?.addEventListener("click", (e: Event) => {
    if (e.target === modal) {
      closeModal();
    }
  });
}

