export type Language = 'fr' | 'en';

export interface Translation {
  [key: string]: {
    [key: string]: any;
  };
}

export type Translations = {
  [key: string]: Translation;
};

export interface MetaTranslations {
  [key: string]: {
    title: string;
    description: string;
  };
} 