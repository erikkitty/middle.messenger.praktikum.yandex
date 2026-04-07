import template from "./form.hbs?raw";
import "./form.scss";
import { Block } from "../../core/Block";
import { toTemplateProps } from "../../utils/toTemplateProps";

export interface FormProps {
  title?: string;
  content?: string;
}

export class Form extends Block<FormProps> {
  protected render(): void {
    this.element = this.compile(template, toTemplateProps(this.props));
  }
}
