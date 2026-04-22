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
import { toTemplateProps } from "../../utils/toTemplateProps";

export interface RegisterFormProps {
  onSubmit?: (data: {
    first_name: string;
    second_name: string;
    login: string;
    email: string;
    phone: string;
    password: string;
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
  private _blurHandlers: (() => void)[] = [];
  private _submitHandler: ((e: Event) => void) | null = null;
  private _loginHandler: (() => void) | null = null;

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
    this.element = this.compile(template, toTemplateProps(this.props));
  }

  protected componentDidMount(): void {
    const form = this.element?.querySelector<HTMLFormElement>(".register-form__form");
    if (!form) return;

    const inputs = Array.from(
      form.querySelectorAll<HTMLInputElement>("input[name]"),
    );

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

    this._blurHandlers = inputs.map((input) => {
      const handler = () => validateOne(input);
      input.addEventListener("blur", handler);
      return handler;
    });

    this._submitHandler = (e: Event) => {
      e.preventDefault();
      const ok = inputs.every((i) => validateOne(i));

      if (!ok) return;

      const data = formDataToObject(form);

      const payload = {
        first_name: data.first_name,
        second_name: data.second_name,
        login: data.login,
        email: data.email,
        phone: data.phone,
        password: data.password,
      };
      this.props.onSubmit?.(payload);
    };

    form.addEventListener("submit", this._submitHandler);

    this._loginHandler = () => {
      this.props.onLogin?.();
    };

    const loginBtn = this.element?.querySelector(
      ".register-form__link--login",
    ) as HTMLButtonElement | null;
    loginBtn?.addEventListener("click", this._loginHandler);
  }

  protected componentWillUnmount(): void {
    const form = this.element?.querySelector<HTMLFormElement>(".register-form__form");
    if (!form) return;

    const inputs = Array.from(
      form.querySelectorAll<HTMLInputElement>("input[name]"),
    );

    inputs.forEach((input, index) => {
      if (this._blurHandlers[index]) {
        input.removeEventListener("blur", this._blurHandlers[index]);
      }
    });

    if (this._submitHandler) {
      form.removeEventListener("submit", this._submitHandler);
    }

    const loginBtn = this.element?.querySelector(".register-form__link--login");
    if (loginBtn && this._loginHandler) {
      loginBtn.removeEventListener("click", this._loginHandler);
    }

    this._blurHandlers = [];
    this._submitHandler = null;
    this._loginHandler = null;
  }

  protected componentDidUpdate(oldProps: RegisterFormViewProps, newProps: RegisterFormViewProps): void {
    super.componentDidUpdate(oldProps, newProps);
  }
}

