type IBlockProps = object;

import Handlebars from "handlebars";

export class Block<P extends IBlockProps = object> {
  protected props: P;
  protected element: HTMLElement | null = null;
  private _children: Record<string, Block> = {};
  private _isMounted = false;

  constructor(props: P) {
    this.props = props;

    Object.entries(this.props).forEach(([key, value]) => {
      if (value instanceof Block) {
        this._children[key] = value;
      }
    });
    
    this.init();
  }

  protected init(): void {
    this.beforeInit();
    this.render();
    this.afterInit();
  }

  protected beforeInit(): void {
  }

  protected afterInit(): void {
  }

  protected componentDidMount(): void {
  }

  protected compile(template: string, props: Record<string, unknown>): HTMLElement {
    const propsAndStubs: Record<string, unknown> = { ...props };
    const blocksByStub: Record<string, Block> = {};

    const registerBlock = (value: Block, keyForStub: string): string => {
      const stubId = `__stub_${keyForStub}_${Math.random().toString(36).substring(2, 9)}__`;
      blocksByStub[stubId] = value;
      return `<div data-stub="${stubId}"></div>`;
    };

    Object.entries(propsAndStubs).forEach(([key, value]) => {
      if (value instanceof Block) {
        propsAndStubs[key] = registerBlock(value, key);
        return;
      }
      if (Array.isArray(value) && value.every((v) => v instanceof Block)) {
        propsAndStubs[key] = (value as Block[])
          .map((v, i) => registerBlock(v, `${key}_${i}`))
          .join("");
      }
    });

    const hbTemplate = Handlebars.compile(template);
    const fragment = hbTemplate(propsAndStubs);

    const element = document.createElement('div');
    element.innerHTML = fragment;

    const stubs = element.querySelectorAll("[data-stub]");
    stubs.forEach((stub) => {
      const stubId = stub.getAttribute("data-stub");
      if (!stubId) return;
      const block = blocksByStub[stubId];
      if (!block) return;
      if (!block.getElement()) {
        (block as Block & { render?: () => void }).render?.();
      }
      const childEl = block.getElement();
      if (childEl) stub.replaceWith(childEl);
    });

    return element.firstElementChild as HTMLElement;
  }

  protected render(): void {
  }

  public setProps(nextProps: Partial<P>): void {
    if (!nextProps || Object.keys(nextProps).length === 0) {
      return;
    }

    const oldProps = { ...this.props };
    const newProps = { ...this.props, ...nextProps };

    if (this.hasPropsChanged(oldProps, newProps)) {
      this.props = newProps;

      Object.entries(newProps).forEach(([key, value]) => {
        if (value instanceof Block && this._children[key] !== value) {
          this._children[key] = value;
        }
      });

      this.componentDidUpdate(oldProps, newProps);
    }
  }

  protected hasPropsChanged(oldProps: P, newProps: P): boolean {
    const oldKeys = Object.keys(oldProps);
    const newKeys = Object.keys(newProps);
    
    if (oldKeys.length !== newKeys.length) {
      return true;
    }

    for (const key of oldKeys) {
      const oldValue = (oldProps as Record<string, unknown>)[key];
      const newValue = (newProps as Record<string, unknown>)[key];

      if (oldValue instanceof Block || newValue instanceof Block) {
        if (oldValue !== newValue) {
          return true;
        }
        continue;
      }

      if (oldValue !== newValue) {
        return true;
      }
    }

    return false;
  }

  protected componentDidUpdate(_oldProps: P, _newProps: P): void {
    void _oldProps;
    void _newProps;
    this.render();

    if (this._isMounted) {
      this.componentDidMount();
    }
  }

  public getElement(): HTMLElement | null {
    return this.element;
  }

  public mount(root: HTMLElement): void {
    if (!this.element) this.render();
    if (!this.element) return;
    root.textContent = "";
    root.appendChild(this.element);
    this._isMounted = true;
    this.componentDidMount();
    Object.values(this._children).forEach((c) => c._markMounted());
  }

  private _markMounted(): void {
    this._isMounted = true;
  }

  public destroy(): void {
    this.beforeDestroy();

    Object.values(this._children).forEach(child => child.destroy());
    
    this.element?.remove();
    this.element = null;
  }

  protected beforeDestroy(): void {
  }
}
