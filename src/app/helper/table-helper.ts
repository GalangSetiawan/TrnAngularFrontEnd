
export class TableHelper {

  public static convertMultiSortMetaToBeSorting(multiSortMeta: any[]): any {
    const sorting = {};
    multiSortMeta.forEach((sort) => {
      sorting[sort.field] = this.getBeSortOrderByFeSortOrder(sort.order);
    });
    return sorting;
  }

  public static getBeSortOrderByFeSortOrder(feSortOrder: number): string {
    return feSortOrder === -1 ? 'desc' : 'asc';
  }

}
