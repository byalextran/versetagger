/**
 * CSS Injector
 * Dynamically injects and manages stylesheets in the document
 */

const STYLE_ID_PREFIX = 'versetagger-styles';
const THEME_VARS_ID = `${STYLE_ID_PREFIX}-theme-vars`;
const BASE_STYLES_ID = `${STYLE_ID_PREFIX}-base`;

/**
 * Inject CSS custom properties (theme variables) into the document
 * Creates or updates a <style> tag with CSS variables
 */
export function injectThemeVariables(variables: Record<string, string>): void {
  let styleTag = document.getElementById(THEME_VARS_ID) as HTMLStyleElement;

  if (!styleTag) {
    styleTag = document.createElement('style');
    styleTag.id = THEME_VARS_ID;
    document.head.appendChild(styleTag);
  }

  // Build CSS custom properties
  const cssVars = Object.entries(variables)
    .map(([key, value]) => `  --vt-${key}: ${value};`)
    .join('\n');

  styleTag.textContent = `:root {\n${cssVars}\n}`;
}

/**
 * Inject base CSS styles for the modal
 * Creates a <style> tag with the base stylesheet
 */
export function injectBaseStyles(css: string): void {
  let styleTag = document.getElementById(BASE_STYLES_ID) as HTMLStyleElement;

  if (!styleTag) {
    styleTag = document.createElement('style');
    styleTag.id = BASE_STYLES_ID;
    document.head.appendChild(styleTag);
  }

  styleTag.textContent = css;
}

/**
 * Remove all VerseTagger styles from the document
 * Used during cleanup/destroy
 */
export function removeAllStyles(): void {
  const themeVarsTag = document.getElementById(THEME_VARS_ID);
  const baseStylesTag = document.getElementById(BASE_STYLES_ID);

  if (themeVarsTag) {
    themeVarsTag.remove();
  }

  if (baseStylesTag) {
    baseStylesTag.remove();
  }
}

/**
 * Check if base styles are already injected
 */
export function hasBaseStyles(): boolean {
  return document.getElementById(BASE_STYLES_ID) !== null;
}

/**
 * Check if theme variables are already injected
 */
export function hasThemeVariables(): boolean {
  return document.getElementById(THEME_VARS_ID) !== null;
}
