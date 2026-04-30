const mockHandlebars = {
  compile: jest.fn((template: string) => {
    return jest.fn((props: Record<string, unknown>) => {
      if (!template) return "";

      let result = template;

      const replaceVars = (obj: Record<string, unknown>, prefix = "") => {
        Object.entries(obj).forEach(([key, value]) => {
          const fullKey = prefix ? `${prefix}.${key}` : key;
          if (
            value !== undefined &&
            value !== null &&
            typeof value !== "object"
          ) {
            const regex = new RegExp(`{{${fullKey}}}`, "g");
            result = result.replace(regex, String(value));
          } else if (
            value &&
            typeof value === "object" &&
            !Array.isArray(value)
          ) {
            replaceVars(value as Record<string, unknown>, fullKey);
          }
        });
      };

      replaceVars(props);

      const ifBlockRegex = /{{#if\s+([\w.]+)}}([\s\S]*?){{\/if}}/g;
      result = result.replace(ifBlockRegex, (_, varName, content) => {
        const getNestedValue = (
          obj: Record<string, unknown>,
          path: string,
        ): unknown => {
          return path.split(".").reduce((acc: unknown, part: string) => {
            if (acc && typeof acc === "object") {
              return (acc as Record<string, unknown>)[part];
            }
            return undefined;
          }, obj);
        };
        const value = getNestedValue(props, varName);
        return value ? content : "";
      });

      result = result.replace(/{{[\w.]+}}/g, "");

      return result.trim();
    });
  }),
};

export default mockHandlebars;
