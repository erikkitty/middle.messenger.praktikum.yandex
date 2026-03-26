export function toTemplateProps<P extends object>(props: P): Record<keyof P, unknown> {
  return props as Record<keyof P, unknown>;
}
