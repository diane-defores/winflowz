export type Language = 'fr' | 'en';

export interface Translation {
  [key: string]: any;
}

export interface MetaTranslations {
  [key: string]: {
    title: string;
    description: string;
  };
} 