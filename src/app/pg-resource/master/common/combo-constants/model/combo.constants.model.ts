export class ComboConstants {

  public rectyp: string = null;
  public reccode: string = null;
  public rectxt: string = null;
  public flkakt: boolean = false;

  // harus ada di setiap model
  public id: string = null;
  public version: number = null;

  constructor(initial?: Partial<ComboConstants>) {
    Object.assign(this, initial);
  }
}

