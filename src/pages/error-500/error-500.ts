import template from "./error-500.hbs?raw";
import "./error-500.scss";
import { Block } from "../../core/Block";
import { toTemplateProps } from "../../utils/toTemplateProps";

export interface Error500Props {
  onRefresh?: () => void;
}

export class Error500 extends Block<Error500Props> {
  protected render(): void {
    this.element = this.compile(template, toTemplateProps(this.props));
  }

  protected componentDidMount(): void {
    const refreshBtn = this.element?.querySelector('[data-action="refresh"]');
    refreshBtn?.addEventListener("click", () => this.props.onRefresh?.());
  }
}
