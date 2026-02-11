
export class PagingHelper {

  // Primeng turbo table helper
  public static getPaging(event: any) {
    /**
     * Primeng turbo table paging event :
       > filters: {}
       > first: 0
       > globalFilter: null
       > multiSortMeta: undefined
       > rows: 10
       > sortField: undefined
       > sortOrder: 1
    */

    const result: any = {
      searchParams: {},
      sorts: null,
      paging: {
        page: (event.first / event.rows) + 1,
        perPage: event.rows
      }
    };

    if (event.sortField !== undefined) {
      result.sorts = {};
      result.sorts[event.sortField as string] = event.sortOrder === 1 ? 'asc' : 'desc';
    }

    // No handler for globalFilter, please customize by yourself (￣▽￣)/

    return result;
  }
}
