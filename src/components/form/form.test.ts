import { Form } from './form';

describe('Form', () => {
  let container: HTMLElement;
  let form: Form | null = null;

  beforeEach(() => {
    document.body.innerHTML = '<div id="app"></div>';
    container = document.getElementById('app')!;
  });

  afterEach(() => {
    form?.destroy();
    form = null;
    document.body.innerHTML = '';
  });

  it('должен рендерить форму', () => {
    form = new Form({ title: 'Форма' });
    form.mount(container);
    expect(container.textContent).toContain('Форма');
  });
});
