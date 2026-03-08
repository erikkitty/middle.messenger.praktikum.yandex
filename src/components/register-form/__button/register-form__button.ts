export function updateButtonState(button: HTMLButtonElement, isValid: boolean) {
  button.disabled = !isValid;
}