import { Button } from "./button";

describe("Button", () => {
  let container: HTMLElement;
  let button: Button | null = null;

  beforeEach(() => {
    document.body.innerHTML = '<div id="app"></div>';
    container = document.getElementById("app")!;
  });

  afterEach(() => {
    button?.destroy();
    button = null;
    document.body.innerHTML = "";
  });

  it("должен рендерить кнопку", () => {
    button = new Button({ text: "Нажми" });
    button.mount(container);
    const btn = container.querySelector("button");
    expect(btn).not.toBeNull();
    expect(btn?.textContent?.trim()).toBe("Нажми");
  });

  it("должен устанавливать type", () => {
    button = new Button({ text: "Btn", type: "submit" });
    button.mount(container);
    expect(container.querySelector("button")?.getAttribute("type")).toBe("submit");
  });

  it("должен применять className", () => {
    button = new Button({ text: "Btn", className: "my-btn" });
    button.mount(container);
    expect(container.querySelector("button")?.className).toBe("my-btn");
  });

  it("должен устанавливать disabled", () => {
    button = new Button({ text: "Btn", disabled: true });
    button.mount(container);
    expect(container.querySelector("button")?.hasAttribute("disabled")).toBe(true);
  });
});
