import { Input } from './input';

describe('Input', () => {
  let container: HTMLElement;
  let inputComp: Input | null = null;

  beforeEach(() => {
    document.body.innerHTML = '<div id="app"></div>';
    container = document.getElementById('app')!;
  });

  afterEach(() => {
    inputComp?.destroy();
    inputComp = null;
    document.body.innerHTML = '';
  });

  it('должен рендерить инпут', () => {
    inputComp = new Input({ name: 'login' });
    inputComp.mount(container);
    expect(container.querySelector('input')).not.toBeNull();
  });

  it('должен устанавливать name', () => {
    inputComp = new Input({ name: 'email' });
    inputComp.mount(container);
    const input = container.querySelector('input');
    expect(input?.getAttribute('name')).toBe('email');
  });

  it('должен отображать label', () => {
    inputComp = new Input({ name: 'pass', label: 'Пароль' });
    inputComp.mount(container);
    expect(container.textContent).toContain('Пароль');
  });
});
