import template from "./auth-form.hbs?raw";
import "./auth-form.scss";
import { Block } from "../../core/Block";
import { Input } from "../../components/input/input";
import { Button } from "../../components/button/button";
import { formDataToObject } from "../../utils/form";
import { setFieldError } from "../../utils/validation";
import { toTemplateProps } from "../../utils/toTemplateProps";

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
  private _blurHandlers: (() => void)[] = [];
  private _submitHandler: ((e: Event) => void) | null = null;
  private _registerHandler: (() => void) | null = null;

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
    this.element = this.compile(template, toTemplateProps(this.props));
  }

  protected componentDidMount(): void {
    const form =
      this.element?.querySelector<HTMLFormElement>(".auth-form__form");
    if (!form) return;

    const loginInput = form.querySelector<HTMLInputElement>(
      'input[name="login"]',
    );
    const passwordInput = form.querySelector<HTMLInputElement>(
      'input[name="password"]',
    );
    if (!loginInput || !passwordInput) return;

    const validateOne = (input: HTMLInputElement): boolean => {
      const msg = input.value.trim() ? "" : "Заполните поле";
      setFieldError(
        input,
        msg,
        ".auth-form__input-wrapper",
        ".auth-form__input-error",
      );
      return !msg;
    };

    if (this.props.error) {
      setFieldError(
        passwordInput,
        this.props.error,
        ".auth-form__input-wrapper",
        ".auth-form__input-error",
      );
    }

    this._blurHandlers = [
      () => validateOne(loginInput),
      () => validateOne(passwordInput),
    ];

    loginInput.addEventListener("blur", this._blurHandlers[0]);
    passwordInput.addEventListener("blur", this._blurHandlers[1]);
    loginInput.addEventListener("input", this._blurHandlers[0]);
    passwordInput.addEventListener("input", this._blurHandlers[1]);

    this._submitHandler = (e: Event) => {
      e.preventDefault();

      const ok = [loginInput, passwordInput].every((i) => validateOne(i));

      if (!ok) return;

      const data = formDataToObject(form);

      this.props.onSubmit?.({
        login: String(data.login ?? ""),
        password: String(data.password ?? ""),
      });
    };

    form.addEventListener("submit", this._submitHandler);

    this._registerHandler = () => {
      this.props.onRegister?.();
    };

    const registerButton = this.element?.querySelector(
      ".auth-form__link--register",
    ) as HTMLButtonElement | null;

    registerButton?.addEventListener("click", this._registerHandler);
  }

  protected componentWillUnmount(): void {
    const form =
      this.element?.querySelector<HTMLFormElement>(".auth-form__form");
    if (!form) return;

    const loginInput = form.querySelector<HTMLInputElement>(
      'input[name="login"]',
    );
    const passwordInput = form.querySelector<HTMLInputElement>(
      'input[name="password"]',
    );

    if (loginInput && this._blurHandlers[0]) {
      loginInput.removeEventListener("blur", this._blurHandlers[0]);
      loginInput.removeEventListener("input", this._blurHandlers[0]);
    }
    if (passwordInput && this._blurHandlers[1]) {
      passwordInput.removeEventListener("blur", this._blurHandlers[1]);
      passwordInput.removeEventListener("input", this._blurHandlers[1]);
    }

    if (this._submitHandler) {
      form.removeEventListener("submit", this._submitHandler);
    }

    const registerButton = this.element?.querySelector(
      ".auth-form__link--register",
    );
    if (registerButton && this._registerHandler) {
      registerButton.removeEventListener("click", this._registerHandler);
    }

    this._blurHandlers = [];
    this._submitHandler = null;
    this._registerHandler = null;
  }

  protected componentDidUpdate(
    oldProps: AuthFormViewProps,
    newProps: AuthFormViewProps,
  ): void {
    super.componentDidUpdate(oldProps, newProps);
  }
}
