function initRegisterForm() {
  const form = document.querySelector(
    ".register-form__form",
  ) as HTMLFormElement | null;
  if (!form) return;

  const fields = {
    firstName: form.querySelector(
      'input[name="first_name"]',
    ) as HTMLInputElement | null,
    lastName: form.querySelector(
      'input[name="second_name"]',
    ) as HTMLInputElement | null,
    login: form.querySelector('input[name="login"]') as HTMLInputElement | null,
    email: form.querySelector('input[name="email"]') as HTMLInputElement | null,
    phone: form.querySelector('input[name="phone"]') as HTMLInputElement | null,
    password: form.querySelector(
      'input[name="password"]',
    ) as HTMLInputElement | null,
    confirmPassword: form.querySelector(
      'input[name="confirm_password"]',
    ) as HTMLInputElement | null,
  };

  if (Object.values(fields).some((f) => !f)) {
    console.warn(
      "Одно или несколько полей не найдены. Проверьте name в шаблоне register-form.hbs",
    );
    return;
  }

  const getVal = (field: HTMLInputElement | null) => field?.value.trim() || "";

  let wasSubmitted = false;

  const validate = () => {
    const errors: Record<string, string> = {};

    errors.firstName = !getVal(fields.firstName) ? "Имя обязательно" : "";
    errors.lastName = !getVal(fields.lastName) ? "Фамилия обязательна" : "";

    errors.login = !getVal(fields.login)
      ? "Логин обязателен"
      : !/^[a-zA-Z0-9_-]{3,20}$/.test(getVal(fields.login))
        ? "Логин 3–20 символов"
        : "";

    errors.email = !getVal(fields.email)
      ? "Email обязателен"
      : !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(
            getVal(fields.email),
          )
        ? "Введите корректный email"
        : "";

    errors.phone = !getVal(fields.phone)
      ? "Телефон обязателен"
      : !/^(\+7|8|\+)[\s\-]?\(?[\d\s\-\)]{10,}$/.test(getVal(fields.phone))
        ? "Начните с +7, 8 или +"
        : "";

    errors.password = !getVal(fields.password)
      ? "Пароль обязателен"
      : getVal(fields.password).length < 8
        ? "Пароль ≥ 8 символов"
        : "";

    errors.confirmPassword = !getVal(fields.confirmPassword)
      ? "Повторите пароль"
      : getVal(fields.password) !== getVal(fields.confirmPassword)
        ? "Пароли не совпадают"
        : "";

    return errors;
  };
  const showErrors = (errors: Record<string, string>) => {
    Object.entries(errors).forEach(([name, msg]) => {
      const field = fields[name as keyof typeof fields];
      if (!field) return;

      const wrapper = field.closest(".register-form__input-wrapper");
      if (!wrapper) return;

      wrapper.classList.toggle("has-error", !!msg);
      const errEl = wrapper.querySelector(".register-form__input-error");
      if (errEl) errEl.textContent = msg;
    });
  };

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const errors = validate();
    wasSubmitted = true;
    showErrors(errors);
    if (!Object.values(errors).some((err) => !!err)) {
      alert("Регистрация успешна!");
    }
  });

  Object.values(fields).forEach((field) => {
    if (!field) return;
    field.addEventListener("input", () => {
      if (!wasSubmitted) return;
      const errors = validate();
      showErrors(errors);
    });
  });
}

initRegisterForm();

export {};
