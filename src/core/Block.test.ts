import { Block } from './Block';

class TestBlock extends Block<{ title: string }> {
  public renderCalls = 0;

  render(): void {
    this.renderCalls++;
    this.element = this.compile('<div>{{title}}</div>', this.props);
  }
}

describe('Block', () => {
  let container: HTMLElement;
  let block: TestBlock;

  beforeEach(() => {
    document.body.innerHTML = '<div id="app"></div>';
    container = document.getElementById('app')!;
    block = new TestBlock({ title: 'Test' });
  });

  afterEach(() => {
    block.destroy();
    document.body.innerHTML = '';
  });

  it('должен рендерить шаблон', () => {
    block.mount(container);
    expect(block.renderCalls).toBeGreaterThanOrEqual(0);
    expect(container.querySelector('div')).not.toBeNull();
  });

  it('должен обновлять пропсы', () => {
    block.mount(container);
    block.setProps({ title: 'Updated' });
    expect(container.textContent).toContain('Updated');
  });

  it('должен удалять элемент при destroy', () => {
    block.mount(container);
    block.destroy();
    expect(container.innerHTML).toBe('');
  });
});
