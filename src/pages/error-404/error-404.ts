import template from "./error-404.hbs?raw";
import "./error-404.scss";
import { Block } from "../../core/Block";
import { toTemplateProps } from "../../utils/toTemplateProps";

export interface Error404Props {
  onBack?: () => void;
}

export class Error404 extends Block<Error404Props> {
  protected render(): void {
    this.element = this.compile(template, toTemplateProps(this.props));
  }

  protected componentDidMount(): void {
    const backBtn = this.element?.querySelector('[data-action="go-back"]');
    backBtn?.addEventListener("click", () => this.props.onBack?.());
  }
}
