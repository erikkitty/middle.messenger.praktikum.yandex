import template from "./settings-page.hbs?raw";
import "./settings-page.scss";
import { Block } from "../../core/Block";
import type { IUser } from "../../types/domains";
import { formDataToObject } from "../../utils/form";
import { collectStringValues, setFieldError, validateField } from "../../utils/validation";
import { settingsController } from "../../controllers/settings.controller";
import { initSettingsAvatar } from "./__avatar/settings-page__avatar";
import { initSettingsModal } from "./__modal/settings-page__modal";
import { updateView } from "./__user-info/settings-page__user-info";

export interface SettingsPageProps extends IUser {
  onBack?: () => void;
  onLogout?: () => void;
}

export class SettingsPage extends Block<SettingsPageProps> {
  protected render(): void {
    this.element = this.compile(template, this.props as unknown as Record<string, unknown>);
  }

  protected componentDidMount(): void {
    const root = this.element;
    if (!root) return;

    const profileBlock = root.querySelector(
      ".settings-content__profile",
    ) as HTMLElement | null;
    const dataBlock = root.querySelector(
      ".settings-content__change-data",
    ) as HTMLElement | null;
    const passwordBlock = root.querySelector(
      ".settings-content__change-password",
    ) as HTMLElement | null;

    const setMode = (mode: "profile" | "data" | "password") => {
      if (profileBlock) {
        profileBlock.style.display = mode === "profile" ? "flex" : "none";
      }
      if (dataBlock) {
        dataBlock.style.display = mode === "data" ? "block" : "none";
      }
      if (passwordBlock) {
        passwordBlock.style.display = mode === "password" ? "block" : "none";
      }
    };

    setMode("profile");

    initSettingsAvatar(root as HTMLElement);

    const backBtn = root.querySelector('[data-action="back"]');
    backBtn?.addEventListener("click", () => this.props.onBack?.());

    const logoutBtn = root.querySelector('[data-action="logout"]');
    logoutBtn?.addEventListener("click", () => this.props.onLogout?.());

    const editDataBtn = root.querySelector('[data-action="edit-data"]');
    editDataBtn?.addEventListener("click", () => {
      setMode("data");
      const form = root.querySelector(
        "#settings-change-data-form",
      ) as HTMLFormElement | null;
      if (!form) return;
      (["email", "login", "first_name", "second_name", "display_name", "phone"] as const).forEach(
        (name) => {
          const input = form.querySelector(`input[name="${name}"]`) as HTMLInputElement | null;
          if (!input) return;
          const val = (this.props as unknown as Record<string, string>)[name];
          input.value = val ? String(val) : "";
        },
      );
    });

    const editPasswordBtn = root.querySelector('[data-action="edit-password"]');
    editPasswordBtn?.addEventListener("click", () => setMode("password"));

    root.querySelectorAll('[data-action="back-to-profile"]').forEach((btn) => {
      btn.addEventListener("click", () => setMode("profile"));
    });
    const cancelEditDataBtn = root.querySelector('[data-action="cancel-edit-data"]');
    cancelEditDataBtn?.addEventListener("click", () => setMode("profile"));

    const changeDataForm = root.querySelector(
      "#settings-change-data-form",
    ) as HTMLFormElement | null;
    if (changeDataForm) {
      const inputs = Array.from(
        changeDataForm.querySelectorAll("input[name]"),
      ) as HTMLInputElement[];

      const validateOne = (input: HTMLInputElement): boolean => {
        const all = collectStringValues(changeDataForm);
        const r = validateField(input.name, input.value, all);
        const msg = r.ok ? "" : r.message;
        setFieldError(
          input,
          msg,
          ".settings-change-data__row",
          ".settings-change-data__error",
        );
        return r.ok;
      };

      inputs.forEach((i) => i.addEventListener("blur", () => validateOne(i)));

      changeDataForm.addEventListener("submit", async (e: SubmitEvent) => {
        e.preventDefault();
        const ok = inputs.every((i) => validateOne(i));
        const data = formDataToObject(changeDataForm);
        if (!ok) return;
        const avatarImage = root.querySelector(".settings-avatar__image") as HTMLImageElement | null;
        const avatar = avatarImage?.src || "";
        await settingsController.updateProfile({
          first_name: data.first_name,
          second_name: data.second_name,
          login: data.login,
          email: data.email,
          phone: data.phone,
          display_name: data.display_name,
          avatar: avatar || undefined,
        });
        updateView();
        if (avatar) {
          const avatarImageEl = root.querySelector(".settings-avatar__image") as HTMLImageElement | null;
          if (avatarImageEl) avatarImageEl.src = avatar;
        }
        setMode("profile");
      });
    }

    const changePasswordForm = root.querySelector(
      ".settings-change-password__form",
    ) as HTMLFormElement | null;
    if (changePasswordForm) {
      const inputs = Array.from(
        changePasswordForm.querySelectorAll("input[name]"),
      ) as HTMLInputElement[];

      const validateOne = (input: HTMLInputElement): boolean => {
        const all = collectStringValues(changePasswordForm);
        const r = validateField(input.name, input.value, all);
        const msg = r.ok ? "" : r.message;
        setFieldError(
          input,
          msg,
          ".settings-change-password__field",
          ".settings-change-password__error",
        );
        return r.ok;
      };

      inputs.forEach((i) => i.addEventListener("blur", () => validateOne(i)));

      changePasswordForm.addEventListener("submit", async (e: SubmitEvent) => {
        e.preventDefault();
        const ok = inputs.every((i) => validateOne(i));
        const data = formDataToObject(changePasswordForm);
        if (!ok) return;
        const oldPassword = String(data.old_password ?? "");
        const newPassword = String(data.new_password ?? "");
        await settingsController.changePassword({
          oldPassword,
          newPassword,
        });
        setMode("profile");
      });
    }

    initSettingsModal(root as HTMLElement);
  }
}

