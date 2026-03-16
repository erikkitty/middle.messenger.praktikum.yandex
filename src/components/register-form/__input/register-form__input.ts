export interface InputValidationRule {
  field: string;
  validator: (value: string) => boolean;
  errorMessage: string;
}

export function validateInput(
  input: HTMLInputElement,
  rules: InputValidationRule[],
  fieldName: string,
): boolean {
  const value = input.value.trim();
  let isValid = true;

  for (const rule of rules) {
    if (rule.field === fieldName && !rule.validator(value)) {
      isValid = false;
      break;
    }
  }

  if (!isValid) {
    input.classList.add("register-form__input--invalid");
  } else {
    input.classList.remove("register-form__input--invalid");
  }

  return isValid;
}
