export function formDataToObject(form: HTMLFormElement): Record<string, string> {
  const fd = new FormData(form);
  const out: Record<string, string> = {};

  fd.forEach((value, key) => {
    if (typeof value === "string") {
      out[key] = value;
    }
  });

  return out;
}
