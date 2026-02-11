export class ComboConstant {

  public id: string = null;
  public kode: string = null;
  public deskripsi: string = null;

  constructor(initial?: Partial<ComboConstant>) {
    Object.assign(this, initial);
  }
}
