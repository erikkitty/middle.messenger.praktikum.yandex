import "./assets/scss/main.scss";
import Handlebars from "handlebars";
import { router } from "./core/Router";
import { authController } from "./controllers/auth.controller";
import { registerController } from "./controllers/register.controller";
import { chatController } from "./controllers/chat.controller";
import { settingsController } from "./controllers/settings.controller";
import { error404Controller } from "./controllers/error-404.controller";
import { error500Controller } from "./controllers/error-500.controller";

import chatHeaderHbs from "./pages/chat-page/__header/chat-page__header.hbs?raw";
import chatSidebarSearchHbs from "./pages/chat-page/__sidebar/__search/chat-page__sidebar-search.hbs?raw";
import chatSidebarItemHbs from "./pages/chat-page/__sidebar/__chat-item/chat-page__sidebar-chat-item.hbs?raw";
import chatContentEmptyHbs from "./pages/chat-page/__content/__empty-state/chat-page__content-empty.hbs?raw";

import settingsPageAvatarHbs from "./pages/settings-page/__avatar/settings-page__avatar.hbs?raw";
import settingsPageUserInfoHbs from "./pages/settings-page/__user-info/settings-page__user-info.hbs?raw";
import settingsPageLinksHbs from "./pages/settings-page/__links/settings-page__links.hbs?raw";
import settingsPageModalHbs from "./pages/settings-page/__modal/settings-page__modal.hbs?raw";
import settingsChangePasswordHbs from "./pages/settings-page/__change-password/settings-page__change-password.hbs?raw";
import settingsChangeDataHbs from "./pages/settings-page/__change-data/settings-page__change-data.hbs?raw";

function setLayout(mode: "auth" | "chat" | "settings" | "error") {
  document.body.classList.toggle("layout-chat", mode === "chat");
  document.body.classList.toggle("layout-settings", mode === "settings");
  document.body.classList.toggle("layout-error", mode === "error");
}

function showFatalError(error: unknown): void {
  const app = document.getElementById("app");
  if (!app) return;
  const message = error instanceof Error ? error.message : String(error);
  const errorEl = document.createElement("div");
  errorEl.className = "app-error";
  errorEl.textContent = `Ошибка: ${message}`;
  app.innerHTML = "";
  app.appendChild(errorEl);
}

function registerPartials(): void {
  Handlebars.registerPartial(
    "chat-page/__header/chat-page__header",
    chatHeaderHbs,
  );
  Handlebars.registerPartial(
    "chat-page/__sidebar/__search/chat-page__sidebar-search",
    chatSidebarSearchHbs,
  );
  Handlebars.registerPartial(
    "chat-page/__sidebar/__chat-item/chat-page__sidebar-chat-item",
    chatSidebarItemHbs,
  );
  Handlebars.registerPartial(
    "chat-page/__content/__empty-state/chat-page__content-empty",
    chatContentEmptyHbs,
  );

  Handlebars.registerPartial(
    "settings-page/__avatar/settings-page__avatar",
    settingsPageAvatarHbs,
  );
  Handlebars.registerPartial(
    "settings-page/__user-info/settings-page__user-info",
    settingsPageUserInfoHbs,
  );
  Handlebars.registerPartial(
    "settings-page/__links/settings-page__links",
    settingsPageLinksHbs,
  );
  Handlebars.registerPartial(
    "settings-page/__modal/settings-page__modal",
    settingsPageModalHbs,
  );
  Handlebars.registerPartial(
    "settings-page/__change-password/settings-page__change-password",
    settingsChangePasswordHbs,
  );
  Handlebars.registerPartial(
    "settings-page/__change-data/settings-page__change-data",
    settingsChangeDataHbs,
  );
}

function mount(block: { mount: (root: HTMLElement) => void }): void {
  const app = document.getElementById("app");
  if (!app) return;
  block.mount(app);
}

window.addEventListener("error", (e) => showFatalError(e.error ?? e.message));
window.addEventListener("unhandledrejection", (e) =>
  showFatalError((e as PromiseRejectionEvent).reason),
);

registerPartials();

router.addRoute("/", () => {
  setLayout("auth");
  mount(authController.getView());
});

router.addRoute("/register", () => {
  setLayout("auth");
  mount(registerController.getView());
});

router.addRoute("/chat", () => {
  setLayout("chat");
  chatController
    .init()
    .then(() => mount(chatController.getView()))
    .catch(console.error);
});

router.addRoute("/settings", () => {
  setLayout("settings");
  settingsController
    .init()
    .then(() => mount(settingsController.getView()))
    .catch(console.error);
});

router.addRoute("/404", () => {
  setLayout("error");
  mount(error404Controller.getView());
});

router.addRoute("/500", () => {
  setLayout("error");
  mount(error500Controller.getView());
});

router.addRoute("*", () => {
  setLayout("error");
  mount(error404Controller.getView());
});

document.addEventListener("DOMContentLoaded", () => {
  if (!window.location.hash) window.location.hash = "/";
  router.start();
});
