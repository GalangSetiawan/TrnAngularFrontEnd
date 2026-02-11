import { Injectable } from '@angular/core';
import { Language, LanguageTypes } from './language';

@Injectable()
export class DefaultLanguageState {

  private DEFAULT_LANGUAGE = 'DEFAULT_LANGUAGE';
  private defaultLanguage: Language;

  constructor() { }

  public getDefaultLanguage(): Language {
    if (!this.defaultLanguage) {
      const defaultLanguageFromLs = localStorage.getItem(this.DEFAULT_LANGUAGE);
      if (defaultLanguageFromLs) {
        this.defaultLanguage = JSON.parse(defaultLanguageFromLs) as Language;
      } else {
        this.defaultLanguage = LanguageTypes.getValues()[0];
        this.setDefaultLanguage(this.defaultLanguage);
      }
    }
    return this.defaultLanguage;
  }

  public setDefaultLanguage(defaultLanguage: Language): void {
    this.defaultLanguage = defaultLanguage;
    localStorage.setItem(this.DEFAULT_LANGUAGE, JSON.stringify(defaultLanguage));
  }

  public destroyDefaultLanguage(): void {
    this.defaultLanguage = null;
    localStorage.removeItem(this.DEFAULT_LANGUAGE);
  }
}
