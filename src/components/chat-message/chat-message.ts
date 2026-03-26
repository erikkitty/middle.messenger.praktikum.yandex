import template from "./chat-message.hbs?raw";
import "./chat-message.scss";
import { Block } from "../../core/Block";

export interface ChatMessageProps {
  text: string;
  time: string;
  isOwn?: boolean;
}

export class ChatMessage extends Block<ChatMessageProps> {
  protected render(): void {
    this.element = this.compile(template, this.props as unknown as Record<string, unknown>);
  }
}
