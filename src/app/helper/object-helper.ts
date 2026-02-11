
export class ObjectHelper {

  public static deepCopy(obj: any) {
    let copy;

    // Handle the 3 simple types, and null or undefined
    if (null === obj || 'object' !== typeof obj) {
      return obj;
    }

    // Handle Date
    if (obj instanceof Date) {
        copy = new Date();
        copy.setTime(obj.getTime());
        return copy;
    }

    // Handle Array
    if (obj instanceof Array) {
        copy = [];
        for (let i = 0, len = obj.length; i < len; i++) {
            copy[i] = this.deepCopy(obj[i]);
        }
        return copy;
    }

    // Handle Object
    if (obj instanceof Object) {
        copy = {};
        for (const attr in obj) {
            if (obj.hasOwnProperty(attr)) {
              copy[attr] = this.deepCopy(obj[attr]);
            }
        }
        return copy;
    }

    throw new Error('Unable to copy obj! Its type not supported.');
  }

  public static isEmpty(object: any): boolean {
    if (object === null || object === undefined || object === 'null') { return true; }

    if (typeof object === 'string') {
      if (object.trim() === '') { return true; }
    }

    if (object instanceof Array) {
      if (object.length === 0) { return true; }
    }

    if (object.constructor === Object) {
      if (Object.keys(object).length === 0) { return true; }
    }

    return false;
  }

  // untuk konversi file pdf yang didapat dari back end dan membentuknya menjadi blob
  // tapi belum atribut tipe file nya lho ya (yang: 'application/pdf'), hanya blob content nya saja
  public static getBlob(base64String: string) {
    const byteCharacters = atob(base64String);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    return new Uint8Array(byteNumbers);
  }

}
