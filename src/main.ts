import "./assets/scss/main.scss";
import Handlebars from "handlebars";

import authFormHbs from "./components/auth-form/auth-form.hbs?raw";
import regFormHbs from "./components/register-form/register-form.hbs?raw";
import chatPageHbs from "./components/chat-page/chat-page.hbs?raw";

import authInputHbs from "./components/auth-form/__input/auth-form__input.hbs?raw";
import authButtonHbs from "./components/auth-form/__button/auth-form__button.hbs?raw";
import authLinkHbs from "./components/auth-form/__link/auth-form__link.hbs?raw";

import regInputHbs from "./components/register-form/__input/register-form__input.hbs?raw";
import regButtonHbs from "./components/register-form/__button/register-form__button.hbs?raw";
import regLinkHbs from "./components/register-form/__link/register-form__link.hbs?raw";

import chatHeaderHbs from "./components/chat-page/__header/chat-page__header.hbs?raw";
import chatSidebarSearchHbs from "./components/chat-page/__sidebar/__search/chat-page__sidebar-search.hbs?raw";
import chatSidebarItemHbs from "./components/chat-page/__sidebar/__chat-item/chat-page__sidebar-chat-item.hbs?raw";
import chatContentEmptyHbs from "./components/chat-page/__content/__empty-state/chat-page__content-empty.hbs?raw";

import settingsPageHbs from "./components/settings-page/settings-page.hbs?raw";
import settingsAvatarHbs from "./components/settings-page/__avatar/settings-page__avatar.hbs?raw";
import settingsUserInfoHbs from "./components/settings-page/__user-info/settings-page__user-info.hbs?raw";
import settingsLinksHbs from "./components/settings-page/__links/settings-page__links.hbs?raw";
import settingsModalHbs from "./components/settings-page/__modal/settings-page__modal.hbs?raw";
import settingsChangePasswordHbs from "./components/settings-page/__change-password/settings-page__change-password.hbs?raw";
import settingsChangeDataHbs from "./components/settings-page/__change-data/settings-page__change-data.hbs?raw";

import { mockUser } from "./components/settings-page/mock-user";

function setLayout(mode: "auth" | "chat" | "settings") {
  document.body.classList.toggle("layout-chat", mode === "chat");
  document.body.classList.toggle("layout-settings", mode === "settings");
}

function renderAuthForm() {
  const app = document.getElementById("app");
  if (!app) return;

  try {
    setLayout("auth");

    Handlebars.registerPartial(
      "auth-form/__input/auth-form__input",
      authInputHbs,
    );
    Handlebars.registerPartial(
      "auth-form/__button/auth-form__button",
      authButtonHbs,
    );
    Handlebars.registerPartial("auth-form/__link/auth-form__link", authLinkHbs);

    const template = Handlebars.compile(authFormHbs);
    app.innerHTML = template({});

    import("./components/auth-form/auth-form.ts")
      .then(() => {
        const regLink = app.querySelector(".auth-form__link--register");
        regLink?.addEventListener("click", (e) => {
          e.preventDefault();
          renderRegisterForm();
        });
      })
      .catch(console.error);
  } catch (e) {
    const errDiv = document.createElement("div");
    errDiv.className = "app-error";
    errDiv.textContent = `Ошибка: ${(e as Error).message}`;
    app.innerHTML = "";
    app.appendChild(errDiv);
  }
}

function renderRegisterForm() {
  const app = document.getElementById("app");
  if (!app) return;

  try {
    setLayout("auth");

    Handlebars.registerPartial(
      "register-form/__input/register-form__input",
      regInputHbs,
    );
    Handlebars.registerPartial(
      "register-form/__button/register-form__button",
      regButtonHbs,
    );
    Handlebars.registerPartial(
      "register-form/__link/register-form__link",
      regLinkHbs,
    );

    const template = Handlebars.compile(regFormHbs);
    app.innerHTML = template({});

    import("./components/register-form/register-form.ts")
      .then(() => {
        const loginLink = app.querySelector(".register-form__link--login");
        loginLink?.addEventListener("click", (e) => {
          e.preventDefault();
          renderAuthForm();
        });
      })
      .catch(console.error);
  } catch (e) {
    const errDiv = document.createElement("div");
    errDiv.className = "app-error";
    errDiv.textContent = `Ошибка: ${(e as Error).message}`;
    app.innerHTML = "";
    app.appendChild(errDiv);
  }
}

function renderChatPage() {
  const app = document.getElementById("app");
  if (!app) return;

  try {
    setLayout("chat");

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

    const template = Handlebars.compile(chatPageHbs);
    app.innerHTML = template({});

    import("./components/chat-page/chat-page.ts")
      .then((m) => m.initChatPage?.())
      .catch(console.error);
  } catch (e) {
    const errDiv = document.createElement("div");
    errDiv.className = "app-error";
    errDiv.textContent = `Ошибка: ${(e as Error).message}`;
    app.innerHTML = "";
    app.appendChild(errDiv);
  }
}

function renderSettingsPage() {
  const app = document.getElementById("app");
  if (!app) return;

  try {
    setLayout("settings");

    Handlebars.registerPartial(
      "settings-page/__avatar/settings-page__avatar",
      settingsAvatarHbs,
    );
    Handlebars.registerPartial(
      "settings-page/__user-info/settings-page__user-info",
      settingsUserInfoHbs,
    );
    Handlebars.registerPartial(
      "settings-page/__links/settings-page__links",
      settingsLinksHbs,
    );
    Handlebars.registerPartial(
      "settings-page/__modal/settings-page__modal",
      settingsModalHbs,
    );
    Handlebars.registerPartial(
      "settings-page/__change-password/settings-page__change-password",
      settingsChangePasswordHbs,
    );
    Handlebars.registerPartial(
      "settings-page/__change-data/settings-page__change-data",
      settingsChangeDataHbs,
    );

    const template = Handlebars.compile(settingsPageHbs);
    app.innerHTML = template({
      avatar: mockUser.avatar,
      display_name: mockUser.display_name,
      email: mockUser.email,
      login: mockUser.login,
      first_name: mockUser.first_name,
      second_name: mockUser.second_name,
      phone: mockUser.phone,
    });

    import("./components/settings-page/settings-page.ts").catch(console.error);
  } catch (e) {
    const errDiv = document.createElement("div");
    errDiv.className = "app-error";
    errDiv.textContent = `Ошибка: ${(e as Error).message}`;
    app.innerHTML = "";
    app.appendChild(errDiv);
  }
}

function showChangeDataView() {
  const slot = document.getElementById("settings-change-data-slot");
  const content = document.getElementById("settings-content");
  if (!slot || !content) return;
  const template = Handlebars.compile(settingsChangeDataHbs);
  slot.innerHTML = template({});
  content.classList.add("settings-content--data-view");
  import("./components/settings-page/__change-data/settings-page__change-data.ts")
    .then((m) => {
      m.initChangeData();
    })
    .catch(console.error);
}

function showChangePasswordView() {
  const slot = document.getElementById("settings-change-password-slot");
  const content = document.getElementById("settings-content");
  if (!slot || !content) return;
  const template = Handlebars.compile(settingsChangePasswordHbs);
  slot.innerHTML = template({});
  content.classList.add("settings-content--password-view");
  import("./components/settings-page/__change-password/settings-page__change-password.ts")
    .then((m) => {
      m.initChangePassword();
    })
    .catch(console.error);
}

const win = window as Window & {
  renderChatPage?: () => void;
  renderSettingsPage?: () => void;
  renderAuthForm?: () => void;
  showChangeDataView?: () => void;
  showChangePasswordView?: () => void;
};
win.renderChatPage = renderChatPage;
win.renderSettingsPage = renderSettingsPage;
win.renderAuthForm = renderAuthForm;
win.showChangeDataView = showChangeDataView;
win.showChangePasswordView = showChangePasswordView;

document.addEventListener("DOMContentLoaded", () => {
  renderAuthForm();
});
