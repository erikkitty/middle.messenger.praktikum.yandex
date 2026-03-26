import template from "./button.hbs?raw";
import "./button.scss";
import { Block } from "../../core/Block";
import { toTemplateProps } from "../../utils/toTemplateProps";

export interface ButtonProps {
  text: string;
  type?: "button" | "submit" | "reset";
  className?: string;
  disabled?: boolean;
}

export class Button extends Block<ButtonProps> {
  protected render(): void {
    this.element = this.compile(template, toTemplateProps(this.props));
  }
}
