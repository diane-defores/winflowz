export type Language = 'en' | 'fr';

export interface TranslationConfig {
  defaultLocale: Language;
  locales: Record<Language, string>;
}

// Type générique pour les traductions
export type Translation = Record<string, any>; 