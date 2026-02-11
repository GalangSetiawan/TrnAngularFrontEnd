import { Language } from '../../../base/default-language/language';

import { IndonesiaLabelDictionary } from './indonesia-label.translation';
import { IndonesiaMessageDictionary } from './indonesia-message.translation';
import { EnglishLabelDictionary } from './english-label.translation';
import { EnglishMessageDictionary } from './english-message.translation';

export class Translation {
  private static allTranslation: Dictionary[] = [IndonesiaLabelDictionary.getValues(), IndonesiaMessageDictionary.getValues(), EnglishLabelDictionary.getValues(), EnglishMessageDictionary.getValues()];
  public static getTranslation(lang: string) {
    const contents: object = {};
    this.allTranslation.map(item => {
      if (item.language.value === lang) {
        Object.assign(contents, item.contents);
      }
    });
    return contents;
  }
}

export interface Dictionary {
  language: Language;
  contents: any;
}
