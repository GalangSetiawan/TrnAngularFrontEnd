import { LZStringService } from 'ng-lz-string';

import { ObjectHelper } from './object-helper';

export class SessionHelper {

  public static setItem(sessionKey: string, data: any, lzStringService?: LZStringService) {
    let sessionData = JSON.stringify(data);
    if (!ObjectHelper.isEmpty(lzStringService)) {
      sessionData = lzStringService.compress(sessionData);
    }

    sessionStorage.setItem(sessionKey, sessionData);
  }

  public static getItem(sessionKey: string, lzStringService?: LZStringService): any {
    if (!ObjectHelper.isEmpty(lzStringService)) {
      return JSON.parse(lzStringService.decompress(sessionStorage.getItem(sessionKey)) || '{}');
    }

    return JSON.parse(sessionStorage.getItem(sessionKey || '{}'));
  }

  public static getItemAndDestroy(sessionKey: string, lzStringService?: LZStringService): any {
    const item = this.getItem(sessionKey, lzStringService);
    this.destroy(sessionKey);

    return item;
  }

  public static destroy(sessionKey: string) {
    sessionStorage.removeItem(sessionKey);
  }

  public static setLocalItem(sessionKey: string, data: any, lzStringService?: LZStringService) {
    let sessionData = JSON.stringify(data);
    if (!ObjectHelper.isEmpty(lzStringService)) {
      sessionData = lzStringService.compress(sessionData);
    }

    localStorage.setItem(sessionKey, sessionData);
  }

  public static getLocalItem(sessionKey: string, lzStringService?: LZStringService): any {
    if (!ObjectHelper.isEmpty(lzStringService)) {
      return JSON.parse(lzStringService.decompress(localStorage.getItem(sessionKey)) || '{}');
    }

    return JSON.parse(localStorage.getItem(sessionKey || '{}'));
  }

  public static getLocalItemAndDestroy(sessionKey: string, lzStringService?: LZStringService): any {
    const item = this.getLocalItem(sessionKey, lzStringService);
    this.destroyLocal(sessionKey);

    return item;
  }

  public static destroyLocal(sessionKey: string) {
    localStorage.removeItem(sessionKey);
  }
}
