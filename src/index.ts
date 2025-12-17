/**
 * VerseTagger - Scripture Reference Library
 * Main entry point for all module systems
 */

// Main class
export { VerseTagger, default as VersetaggerDefault } from './core/VerseTagger';

// Configuration types
export type {
  VersetaggerConfig,
  BehaviorMode,
  TriggerMode,
  ColorScheme
} from './core/config';

// Theme types
export type { Theme, ThemeColors, ThemeSpacing, ThemeFonts } from './theming/preset-themes';

// API types
export type { VerseContent, VerseData, ApiError } from './api/youversion-client';

// Scanner types
export type { ScannedReference } from './core/scanner';

// Reference parser types
export type { ScriptureReference } from './parser/reference-parser';

// For convenience, also export as default
import { VerseTagger } from './core/VerseTagger';
export default VerseTagger;
