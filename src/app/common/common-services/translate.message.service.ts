import { DecimalPipe } from '@angular/common';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { DefaultLanguageState } from 'src/app/base/default-language/default-language.state';
import { LanguageTypes } from 'src/app/base/default-language/language';
import { EnglishMessageDictionary } from 'src/app/base/internationalization/i18n/english-message.translation';
import { IndonesiaMessageDictionary } from 'src/app/base/internationalization/i18n/indonesia-message.translation';
import { DateFormatPipe } from 'src/app/base/pipe/date-format.pipe';
import { BaseService } from 'src/app/common/common-class/base-service';
import { StdModelMapper } from 'src/app/common/common-class/standar-api-mapper';
import { StdConstants } from 'src/app/common/common-class/standar-api.constants';
import { AppAlertService } from 'src/app/common/common-components/alert/app-alert.service';
import { StdMessage, StdResponse } from 'src/app/common/common-model/standar-api-response.model';
import { StdMessageTranslator } from 'src/app/common/common-services/standar-api-message-translator';
import { TimeHelper } from 'src/app/helper/time-helper';


@Injectable()
export class TranslateMessageService extends BaseService {

  constructor(private http: HttpClient, 
              private dateFormatPipe: DateFormatPipe,
              private messageTranslator: StdMessageTranslator,
              private defaultLanguageState: DefaultLanguageState,
              private router: Router,
              private appAlertService: AppAlertService,
              private decimalPipe: DecimalPipe) {

    super();

  }

  public translateGeneralMessage(errorMsg: StdMessage): string {

    if (this.defaultLanguageState.getDefaultLanguage().value === LanguageTypes.indonesia.value) {
      return this.messageTranslator.translateLooseMessage(errorMsg, IndonesiaMessageDictionary.getValues());
    } else if (this.defaultLanguageState.getDefaultLanguage().value === LanguageTypes.english.value) {
      return this.messageTranslator.translateLooseMessage(errorMsg, EnglishMessageDictionary.getValues());
    }
    
  }

  public generateArrayArguments(strArguments: string): string[] {

    // pemisah antara kelompok argument dengan kelompok argument yang lain adalah : ';'
    // pemisah antara nilai argument dengan jenisnya adalah : '|'
    // Contoh : 'ABC|String;201711|YearMonth'

    const hasil: string[] = [];

    let posisiAwal = 0;
    let terus = true;
    while (terus) {

      // ambil teks yang ada diantara posisiIndex sampai dengan ';' pertama yang ditemukan
      let posisiAkhir = strArguments.indexOf(';', posisiAwal);

      if (posisiAkhir > 0) {
        // ditemukan tanda ';' (dalam arti masih ada kelompok <x>|<y> berikutnya)
        let kelompok = strArguments.substring(posisiAwal, posisiAkhir);

        // generate argument untuk kelompok ini
        const argument = this.generateArgumentFromString(kelompok);
        hasil.push(argument);
  
        // set posisi awal pencarian ke huruf berikutnya dari ';' yang ditemukan ini
        posisiAwal = posisiAkhir + 1;
      } else {
        if (posisiAwal < strArguments.length) {
          let kelompok = strArguments.substring(posisiAwal, strArguments.length);

          // generate argument untuk kelompok ini
          const argument = this.generateArgumentFromString(kelompok);
          hasil.push(argument);

        }
        terus = false;
      }
    }

    return hasil;
  }

  private generateArgumentFromString(kelompokParam: string): string {

    let hasil = '';

    // ambil value dan tipenya dari kelompok param ini
    let value = kelompokParam.substring(0, kelompokParam.indexOf('|'));
    let tipe  = kelompokParam.substring(kelompokParam.indexOf('|') + 1, kelompokParam.length);

    if (tipe === 'String') {
      hasil = value;
    }

    if (tipe === 'YearMonth') {
      hasil = this.dateFormatPipe.transform(TimeHelper.getDateFromStringYYYYMMDD(value + '01'),'yearMonth', this.defaultLanguageState.getDefaultLanguage().locale);
    }

    if (tipe === 'Date') {
      hasil = this.dateFormatPipe.transform(TimeHelper.getDateFromStringYYYYMMDD(value),'shortDate', this.defaultLanguageState.getDefaultLanguage().locale);
    }

    if (tipe === 'Number') {

      let angka = 0;
      if(!isNaN(Number(value))){
        hasil = this.decimalPipe.transform(Number(value), '.1', this.defaultLanguageState.getDefaultLanguage().locale);
      }
    }

    return hasil;
  }
}
