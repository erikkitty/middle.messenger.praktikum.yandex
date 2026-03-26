import template from "./form.hbs?raw";
import "./form.scss";
import { Block } from "../../core/Block";

export interface FormProps {
  title?: string;
  content?: string;
}

export class Form extends Block<FormProps> {
  protected render(): void {
    this.element = this.compile(template, this.props as unknown as Record<string, unknown>);
  }
}
