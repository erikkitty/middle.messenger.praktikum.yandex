export type ValidationResult = { ok: true } | { ok: false; message: string };

const patterns = {
  login: /^(?=.*[a-zA-Z])[a-zA-Z0-9_-]{3,20}$/,
  password: /^(?=.*[A-ZА-Я])(?=.*\d).{8,40}$/,
  email: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]*[a-zA-Z][a-zA-Z0-9.-]*\.[a-zA-Z]{2,}$/,
  phone: /^(\+7|8|\+)?[\d\s()-]{10,15}$/,
  name: /^[A-ZА-Я][a-zA-Zа-яА-Я-]*$/,
  message: /^(?!\s*$).+/,
} as const;

export function validateField(
  name: string,
  value: string,
  allValues?: Record<string, string>,
): ValidationResult {
  const v = value.trim();

  switch (name) {
    case "login":
      if (!v) return { ok: false, message: "Введите логин" };
      return patterns.login.test(v)
        ? { ok: true }
        : { ok: false, message: "Логин 3–20 символов, латиница, не только цифры" };
    case "password":
      if (!v) return { ok: false, message: "Введите пароль" };
      return patterns.password.test(v)
        ? { ok: true }
        : { ok: false, message: "8–40 символов, заглавная буква и цифра" };
    case "confirm_password": {
      if (!v) return { ok: false, message: "Пароли не совпадают" };
      const p = allValues?.new_password ?? allValues?.password ?? "";
      return v === p
        ? { ok: true }
        : { ok: false, message: "Пароли не совпадают" };       
    }
    case "email":
      return patterns.email.test(v)
        ? { ok: true }
        : { ok: false, message: "Введите корректный email" };  
    case "phone":
      return patterns.phone.test(v)
        ? { ok: true }
        : { ok: false, message: "10–15 цифр, может начинаться с +" };
    case "first_name":
    case "second_name":
      return patterns.name.test(v)
        ? { ok: true }
        : { ok: false, message: "Первая буква заглавная, без пробелов" };
    case "old_password":
    case "new_password":
      return patterns.password.test(v)
        ? { ok: true }
        : { ok: false, message: "8–40 символов, заглавная буква и цифра" };
    case "message":
      return patterns.message.test(value) ? { ok: true } : { ok: false, message: "Введите сообщение" };
    default:
      return v ? { ok: true } : { ok: false, message: "Заполните поле" };
  }
}

export function collectStringValues(form: HTMLFormElement): Record<string, string> {
  const values: Record<string, string> = {};
  const inputs = form.querySelectorAll("input[name], textarea[name], select[name]");
  inputs.forEach((el) => {
    const input = el as HTMLInputElement;
    values[input.name] = (input.value ?? "").toString();
  });
  return values;
}

export function setFieldError(
  input: HTMLInputElement,
  message: string,
  wrapperSelector: string,
  errorSelector: string,
): void {
  const wrapper = input.closest(wrapperSelector);
  wrapper?.classList.toggle("has-error", !!message);
  const errEl = wrapper?.querySelector(errorSelector);
  if (errEl) errEl.textContent = message;
}

