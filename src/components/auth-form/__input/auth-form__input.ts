export interface InputState {
  name: string;
  value: string;
  invalid?: boolean;
}

export function validateInput(el: HTMLInputElement): boolean {
  const isEmpty = el.value.trim() === '';
  el.classList.toggle('auth-form__input--invalid', isEmpty);
  return !isEmpty;
}