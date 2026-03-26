import template from "./button.hbs?raw";
import "./button.scss";
import { Block } from "../../core/Block";

export interface ButtonProps {
  text: string;
  type?: "button" | "submit" | "reset";
  className?: string;
  disabled?: boolean;
}

export class Button extends Block<ButtonProps> {
  protected render(): void {
    this.element = this.compile(template, this.props as unknown as Record<string, unknown>);
  }
}
