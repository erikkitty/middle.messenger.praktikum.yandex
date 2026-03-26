import template from "./error-404.hbs?raw";
import "./error-404.scss";
import { Block } from "../../core/Block";

export interface Error404Props {
  onBack?: () => void;
}

export class Error404 extends Block<Error404Props> {
  protected render(): void {
    this.element = this.compile(template, this.props as unknown as Record<string, unknown>);
  }

  protected componentDidMount(): void {
    const backBtn = this.element?.querySelector('[data-action="go-back"]');
    backBtn?.addEventListener("click", () => this.props.onBack?.());
  }
}
