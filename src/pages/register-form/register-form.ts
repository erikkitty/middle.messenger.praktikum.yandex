import template from "./register-form.hbs?raw";
import "./register-form.scss";
import { Block } from "../../core/Block";
import { Input } from "../../components/input/input";
import { Button } from "../../components/button/button";
import { formDataToObject } from "../../utils/form";
import {
  collectStringValues,
  setFieldError,
  validateField,
} from "../../utils/validation";

export interface RegisterFormProps {
  onSubmit?: (data: {
    first_name: string;
    second_name: string;
    login: string;
    email: string;
    phone: string;
    password: string;
    confirm_password: string;
  }) => void;
  onLogin?: () => void;
  error?: string;
}

type RegisterFormViewProps = RegisterFormProps & {
  firstNameInput: Input;
  secondNameInput: Input;
  loginInput: Input;
  emailInput: Input;
  phoneInput: Input;
  passwordInput: Input;
  confirmPasswordInput: Input;
  submitButton: Button;
  loginButton: Button;
};

export class RegisterForm extends Block<RegisterFormViewProps> {
  constructor(props: RegisterFormProps) {
    super({
      ...props,
      firstNameInput: new Input({
        name: "first_name",
        label: "Имя",
        type: "text",
        wrapperClass: "register-form__input-wrapper",
        labelClass: "register-form__input-label",
        inputClass: "register-form__input",
        errorClass: "register-form__input-error",
      }),
      secondNameInput: new Input({
        name: "second_name",
        label: "Фамилия",
        type: "text",
        wrapperClass: "register-form__input-wrapper",
        labelClass: "register-form__input-label",
        inputClass: "register-form__input",
        errorClass: "register-form__input-error",
      }),
      loginInput: new Input({
        name: "login",
        label: "Логин",
        type: "text",
        wrapperClass: "register-form__input-wrapper",
        labelClass: "register-form__input-label",
        inputClass: "register-form__input",
        errorClass: "register-form__input-error",
        autocomplete: "username",
      }),
      emailInput: new Input({
        name: "email",
        label: "Email",
        type: "text",
        wrapperClass: "register-form__input-wrapper",
        labelClass: "register-form__input-label",
        inputClass: "register-form__input",
        errorClass: "register-form__input-error",
        autocomplete: "email",
      }),
      phoneInput: new Input({
        name: "phone",
        label: "Телефон",
        type: "text",
        wrapperClass: "register-form__input-wrapper",
        labelClass: "register-form__input-label",
        inputClass: "register-form__input",
        errorClass: "register-form__input-error",
        autocomplete: "tel",
      }),
      passwordInput: new Input({
        name: "password",
        label: "Пароль",
        type: "password",
        wrapperClass: "register-form__input-wrapper",
        labelClass: "register-form__input-label",
        inputClass: "register-form__input",
        errorClass: "register-form__input-error",
        autocomplete: "new-password",
      }),
      confirmPasswordInput: new Input({
        name: "confirm_password",
        label: "Подтверждение пароля",
        type: "password",
        wrapperClass: "register-form__input-wrapper",
        labelClass: "register-form__input-label",
        inputClass: "register-form__input",
        errorClass: "register-form__input-error",
        autocomplete: "new-password",
      }),
      submitButton: new Button({
        text: "ЗАРЕГИСТРИРОВАТЬСЯ",
        type: "submit",
        className: "register-form__button",
      }),
      loginButton: new Button({
        text: "Войти",
        type: "button",
        className: "register-form__link register-form__link--login",
      }),
    });
  }

  protected render(): void {
    this.element = this.compile(
      template,
      this.props as unknown as Record<string, unknown>,
    );
  }

  protected componentDidMount(): void {
    const form = this.element?.querySelector(
      ".register-form__form",
    ) as HTMLFormElement | null;
    if (!form) return;

    const inputs = Array.from(
      form.querySelectorAll("input[name]"),
    ) as HTMLInputElement[];

    const validateOne = (input: HTMLInputElement): boolean => {
      const all = collectStringValues(form);
      const r = validateField(input.name, input.value, all);
      const msg = r.ok ? "" : r.message;
      setFieldError(
        input,
        msg,
        ".register-form__input-wrapper",
        ".register-form__input-error",
      );
      return r.ok;
    };

    inputs.forEach((input) => {
      input.addEventListener("blur", () => validateOne(input));
    });

    form.addEventListener("submit", (e: SubmitEvent) => {
      e.preventDefault();
      const ok = inputs.every((i) => validateOne(i));
      const data = formDataToObject(form);
      console.log("register submit", data);
      if (!ok) return;
      const payload = data as unknown as Parameters<NonNullable<RegisterFormViewProps["onSubmit"]>>[0];
      this.props.onSubmit?.(payload);
    });

    const loginBtn = this.element?.querySelector(
      ".register-form__link--login",
    ) as HTMLButtonElement | null;
    loginBtn?.addEventListener("click", (e) => {
      e.preventDefault();
      this.props.onLogin?.();
    });
  }

  protected componentDidUpdate(oldProps: RegisterFormViewProps, newProps: RegisterFormViewProps): void {
    super.componentDidUpdate(oldProps, newProps);

    if (!this.element) return;
    if (!newProps.error || newProps.error === oldProps.error) return;

    const form = this.element.querySelector(".register-form__form") as HTMLFormElement | null;
    if (!form) return;

    const inputs = form.querySelectorAll<HTMLInputElement>(".register-form__input");
    inputs.forEach((input) => {
      const wrapper = input.closest(".register-form__input-wrapper");
      const errEl = wrapper?.querySelector(".register-form__input-error");
      wrapper?.classList.add("has-error");
      if (errEl && newProps.error) {
        errEl.textContent = newProps.error;
      }
    });
  }
}

