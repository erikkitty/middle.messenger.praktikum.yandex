import template from "./input.hbs?raw";
import "./input.scss";
import { Block } from "../../core/Block";
import { toTemplateProps } from "../../utils/toTemplateProps";

export interface InputProps {
  name: string;
  label?: string;
  id?: string;
  type?: string;
  value?: string;
  error?: string;
  placeholder?: string;
  wrapperClass?: string;
  labelClass?: string;
  inputClass?: string;
  errorClass?: string;
  autocomplete?: string;
}

export class Input extends Block<InputProps> {
  protected render(): void {
    this.element = this.compile(template, toTemplateProps(this.props));
  }
}
