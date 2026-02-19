/**
 * Replace {{placeholders}} in a template string with values.
 */
export function fillTemplate(
  template: string,
  variables: Record<string, string>
): string {
  return template.replace(/\{\{(\w+)\}\}/g, (_, key) => {
    return variables[key] ?? `{{${key}}}`;
  });
}
