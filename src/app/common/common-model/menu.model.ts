export class Menu {

  public id: string = null;
  public menuCode: string = null;
  public label: string = null;
  public icon: string = null;
  public path: string = null;
  public component: string = null;
  public breadcrumb: string = null;
  public subMenus: Menu[] = [];

  constructor(initial?: Partial<Menu>) {
    Object.assign(this, initial);
  }
}
