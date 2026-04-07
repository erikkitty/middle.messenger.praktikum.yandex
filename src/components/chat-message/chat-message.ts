import template from "./chat-message.hbs?raw";
import "./chat-message.scss";
import { Block } from "../../core/Block";
import { toTemplateProps } from "../../utils/toTemplateProps";

export interface ChatMessageProps {
  text: string;
  time: string;
  isOwn?: boolean;
}

export class ChatMessage extends Block<ChatMessageProps> {
  protected render(): void {
    this.element = this.compile(template, toTemplateProps(this.props));
  }
}
