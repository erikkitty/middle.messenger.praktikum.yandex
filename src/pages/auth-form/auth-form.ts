import template from "./auth-form.hbs?raw";
import "./auth-form.scss";
import { Block } from "../../core/Block";
import { Input } from "../../components/input/input";
import { Button } from "../../components/button/button";
import { formDataToObject } from "../../utils/form";
import {
  collectStringValues,
  setFieldError,
  validateField,
} from "../../utils/validation";

export interface AuthFormProps {
  onSubmit?: (data: { login: string; password: string }) => void;
  onRegister?: () => void;
  error?: string;
}

type AuthFormViewProps = AuthFormProps & {
  loginInput: Input;
  passwordInput: Input;
  submitButton: Button;
  registerButton: Button;
};

export class AuthForm extends Block<AuthFormViewProps> {
  constructor(props: AuthFormProps) {
    super({
      ...props,
      loginInput: new Input({
        id: "auth-login",
        name: "login",
        label: "Логин",
        type: "text",
        wrapperClass: "auth-form__input-wrapper",
        labelClass: "auth-form__input-label",
        inputClass: "auth-form__input",
        errorClass: "auth-form__input-error",
        autocomplete: "username",
      }),
      passwordInput: new Input({
        id: "auth-password",
        name: "password",
        label: "Пароль",
        type: "password",
        wrapperClass: "auth-form__input-wrapper",
        labelClass: "auth-form__input-label",
        inputClass: "auth-form__input",
        errorClass: "auth-form__input-error",
        autocomplete: "current-password",
      }),
      submitButton: new Button({
        text: "Авторизоваться",
        type: "submit",
        className: "auth-form__button",
      }),
      registerButton: new Button({
        text: "Регистрация",
        type: "button",
        className: "auth-form__link auth-form__link--register",
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
      ".auth-form__form",
    ) as HTMLFormElement | null;
    if (!form) return;

    const loginInput = form.querySelector('input[name="login"]') as
      | HTMLInputElement
      | null;
    const passwordInput = form.querySelector('input[name="password"]') as
      | HTMLInputElement
      | null;
    if (!loginInput || !passwordInput) return;

    const validateOne = (input: HTMLInputElement): boolean => {
      const all = collectStringValues(form);
      const r = validateField(input.name, input.value, all);
      const msg = r.ok ? "" : r.message;
      setFieldError(
        input,
        msg,
        ".auth-form__input-wrapper",
        ".auth-form__input-error",
      );
      return r.ok;
    };

    [loginInput, passwordInput].forEach((input) => {
      input.addEventListener("blur", () => validateOne(input));
    });

    form.addEventListener("submit", (e) => {
      e.preventDefault();

      const ok = [loginInput, passwordInput].every((i) => validateOne(i));
      const data = formDataToObject(form);
      console.log("auth submit", data);

      if (!ok) return;
      this.props.onSubmit?.({
        login: String(data.login ?? ""),
        password: String(data.password ?? ""),
      });
    });

    const registerButton = this.element?.querySelector(
      ".auth-form__link--register",
    ) as HTMLButtonElement | null;

    registerButton?.addEventListener("click", (e) => {
      e.preventDefault();
      this.props.onRegister?.();
    });
  }

  protected componentDidUpdate(oldProps: AuthFormViewProps, newProps: AuthFormViewProps): void {
    super.componentDidUpdate(oldProps, newProps);

    if (!this.element) return;
    if (!newProps.error || newProps.error === oldProps.error) return;

    const form = this.element.querySelector(".auth-form__form") as HTMLFormElement | null;
    if (!form) return;

    const inputs = form.querySelectorAll<HTMLInputElement>(".auth-form__input");
    inputs.forEach((input) => {
      const wrapper = input.closest(".auth-form__input-wrapper");
      const errEl = wrapper?.querySelector(".auth-form__input-error");
      wrapper?.classList.add("has-error");
      if (errEl) {
        errEl.textContent = newProps.error || "Неверный логин или пароль";
      }
    });
  }
}

