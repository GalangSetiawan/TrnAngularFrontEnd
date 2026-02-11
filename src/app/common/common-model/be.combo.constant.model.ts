export class BEComboConstant {

  public id: string = null;
  public kode: string = null;
  public deskripsi: string = null;

  constructor(initial?: Partial<BEComboConstant>) {
    Object.assign(this, initial);
  }
}
