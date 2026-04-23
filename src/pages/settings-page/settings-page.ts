import template from "./settings-page.hbs?raw";
import "./settings-page.scss";
import { Block } from "../../core/Block";
import type { IUser } from "../../types/domains";
import { formDataToObject } from "../../utils/form";
import { collectStringValues, setFieldError, validateField } from "../../utils/validation";
import { settingsController } from "../../controllers/settings.controller";
import { initSettingsAvatar } from "./__avatar/settings-page__avatar";
import { initSettingsModal } from "./__modal/settings-page__modal";

export interface SettingsPageProps extends IUser {
  onBack?: () => void;
  onLogout?: () => void;
}

function toTemplateProps<P extends object>(props: P): Record<keyof P, unknown> {
  return props as Record<keyof P, unknown>;
}

export class SettingsPage extends Block<SettingsPageProps> {
  protected render(): void {
    this.element = this.compile(template, toTemplateProps(this.props));
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
      const form = root.querySelector<HTMLFormElement>("#settings-change-data-form");
      if (!form) return;
      
      const fieldNames = ["email", "login", "first_name", "second_name", "display_name", "phone"] as const;
      fieldNames.forEach((name) => {
        const input = form.querySelector<HTMLInputElement>(`input[name="${name}"]`);
        if (!input) return;
        const val = this.props[name];
        input.value = val ? String(val) : "";
      });
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
          ".settings-change-data__field",
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
        try {
          await settingsController.updateProfile({
            first_name: String(data.first_name ?? ""),
            second_name: String(data.second_name ?? ""),
            login: String(data.login ?? ""),
            email: String(data.email ?? ""),
            phone: String(data.phone ?? ""),
            display_name: data.display_name ? String(data.display_name) : undefined,
          });
          setMode("profile");
        } catch (error) {
          alert(error instanceof Error ? error.message : "Failed to update profile");
        }
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
        try {
          await settingsController.changePassword({
            oldPassword,
            newPassword,
          });
          setMode("profile");
        } catch (error) {
          alert(error instanceof Error ? error.message : "Failed to change password");
        }
      });
    }

    initSettingsModal(root as HTMLElement);
  }
}

