import { ChatMessage } from './chat-message';

describe('ChatMessage', () => {
  let container: HTMLElement;
  let message: ChatMessage | null = null;

  beforeEach(() => {
    document.body.innerHTML = '<div id="app"></div>';
    container = document.getElementById('app')!;
  });

  afterEach(() => {
    message?.destroy();
    message = null;
    document.body.innerHTML = '';
  });

  it('должен рендерить сообщение', () => {
    message = new ChatMessage({ text: 'Привет', time: '10:00' });
    message.mount(container);
    expect(container.textContent).toContain('Привет');
  });

  it('должен добавлять класс own при isOwn: true', () => {
    message = new ChatMessage({ text: 'Моё', time: '10:05', isOwn: true });
    message.mount(container);
    expect(container.innerHTML).toContain('own');
  });
});
