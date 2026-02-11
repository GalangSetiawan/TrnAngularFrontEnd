import { HttpParams } from '@angular/common/http';
import { StdPagingRequest } from '../common-model/standar-api-request.model';

import * as moment from 'moment';

export interface StdFieldMappingHint {
  model: string;
  api?: string;
  dataType?: string | Function;
}

export class StdModelMapper<T> {
  private _fieldMappingHints: StdFieldMappingHint[] = null;

  constructor(public modelSignature: any = null) {
    if (this.modelSignature == null) { return; }

    this._fieldMappingHints = this.modelSignature['fieldMappingHints'];
  }

  public toModel(json: any): T {
    if (json === undefined || json === null) { return null; }

    const model = this.newModelInstance(this.modelSignature);

    for (const prop in model) {
      if (typeof model[prop] !== 'function') { // handle only field member, not function member
        const mappedVal = this.attemptMapping(prop, json);
        if (mappedVal !== null && mappedVal !== undefined) { model[prop] = mappedVal; }
      }
    }

    return model;
  }

  // public toModelArray(jsonArr: any[]): T[] {

  //   const ms: T[] = [];
  //   for (const json of jsonArr) { ms.push(this.toModel(json)); }
  //   return ms;
  // }

  public toModelArray(jsonArr: any[]): any[] {

    const ms: any[] = [];
    for (const json of jsonArr) {
      if (json instanceof Array) {
        ms.push(this.toModelArray(json));
      } else {
        ms.push(this.toModel(json));
      }
    }
    return ms;
  }

  public toJson(model: T, depth: number = 0): Object {
    const json = {};

    for (const prop in model) {
      if (model[prop] !== undefined && typeof model[prop] !== 'function') {
        const hint = this.findMappingHint(prop);
        const jsonPropName = (hint !== null && hint.api) ? hint.api : prop;
        const currVal: any = model[prop];
        const maxDepth = depth - 1 < 0 ? 0 : depth - 1;

        if (model[prop] instanceof Array) {
          json[jsonPropName] = this.toJsonArray(currVal, maxDepth);
        } else {
          if (depth === 0) {
            if (currVal !== null && currVal['id'] !== undefined && currVal['id'] !== null) {
              json[jsonPropName] = { id: currVal['id'] };
            } else {
              if (hint !== null && hint.dataType === 'date') { json[jsonPropName] = moment(currVal).toISOString(); }
              else { json[jsonPropName] = currVal; }
            }
          } else if (depth > 0) {
            if (model[prop] instanceof Array) {
              json[jsonPropName] = this.toJsonArray(currVal, maxDepth);
            } else {
              if (currVal === null || currVal instanceof Object === false) {
                json[jsonPropName] = currVal;
              } else {
                // json[jsonPropName] = this.toJson(currVal, maxDepth);
                if (hint !== null && hint.dataType === 'date') { json[jsonPropName] = moment(currVal).toISOString(); }
                else { json[jsonPropName] = this.toJson(currVal, maxDepth); }
              }
            }
          }
        }
      }
    }
    return json;
  }

  public toJsonArray(model: any, depth): any {
    const list = [];
    for (const prop in model) {
      if (model[prop]) {
        const currVal: any = model[prop];
        list.push(this.toJson(currVal, depth));
      }
    }
    return list;
  }

  public toSearchParams(searchParams?: {}, sorts?: {}, paging?: StdPagingRequest): HttpParams {
    let httpParams = new HttpParams();

    if (searchParams !== undefined && searchParams !== null) {
      for (const k in searchParams) {
        if (searchParams[k] != null) {
          const hint = this.findMappingHint(k);

          if (hint === null) {
            if (moment.isDate(searchParams[k])) { httpParams = httpParams.set(k, moment(searchParams[k]).toISOString()); }
            else { httpParams = httpParams.set(k, searchParams[k]); }
          }
          else {
            const apiPropName = hint.api ? hint.api : k;
            // ini aslinya
            // const apiVal = (hint.dataType && hint.dataType === 'date') ? moment(searchParams[k]).toISOString() : searchParams[k];

            let apiVal;
            if (hint.dataType && hint.dataType === 'date') {
              apiVal = moment(searchParams[k]).utcOffset(moment().utcOffset()).format();
            } else {
              apiVal = searchParams[k];
            }

            httpParams = httpParams.set(apiPropName, apiVal);
          }
        }
      }
    }

    if (sorts !== undefined && sorts !== null) {
      let sortStr = '';

      for (const k in sorts) {
        if (sorts[k] !== undefined) {
          const hint = this.findMappingHint(k);

          if (hint === null) { sortStr += k + '-' + sorts[k] + ';'; }
          else {
            const apiPropName = hint.api ? hint.api : k;
            sortStr += apiPropName + '-' + sorts[k] + ';';
          }
        }
      }

      httpParams = httpParams.set('sort', sortStr);
    }

    if (paging !== undefined && paging !== null) {
      httpParams = httpParams.set('page', String(paging.page));
      httpParams = httpParams.set('perPage', String(paging.perPage));
    }

    return httpParams;
  }

  private attemptMapping(modelPropName: string, json: any): any {
    const hint = this.findMappingHint(modelPropName);
    if (hint === null) { return json[modelPropName]; } // no hint? no work... return whatever it is

    const apiPropName = hint.api ? hint.api : modelPropName;
    const jsonVal = json[apiPropName];

    if (jsonVal === undefined || jsonVal === null) { return; } // huh? prop value undefined / not found ? terminate!
    if (hint.dataType === undefined || hint.dataType === null) { return jsonVal; } // no datatype? return whatever it is
    const hdt = hint.dataType;

    // native type handling
    if (hdt === 'string' || hdt === 'number' || hdt === 'boolean') { return jsonVal; } // standard type needs no conversion
    if (hdt === 'date') { return new Date(jsonVal); }

    if (typeof hdt === 'function') { return this.customModelMapping(jsonVal, hint); }

    console.warn('[DaModelMapper] - unhandled data type!', hdt);
  }

  private findMappingHint(modelPropName: string): StdFieldMappingHint {
    if (this._fieldMappingHints === undefined || this._fieldMappingHints === null) { return null; }

    for (let idx = 0, len = this._fieldMappingHints.length; idx < len; idx++) {
      const hint = this._fieldMappingHints[idx];

      if (hint.model === modelPropName) { return hint; }
    }

    return null;
  }

  private customModelMapping(jsonVal: any, hint: StdFieldMappingHint): any {
    if (jsonVal instanceof Array) {
      return new StdModelMapper(hint.dataType).toModelArray(jsonVal);
    } else {
      return new StdModelMapper(hint.dataType).toModel(jsonVal);
    }
  }

  private newModelInstance(type: { new (): T; }): T { return new type(); }
}
