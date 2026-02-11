export interface StdPagingRequest {
  page: number;
  perPage: number;
}

export type SortMode = 'asc' | 'desc';
export type SortModeString = 'asc' | '' | 'desc';
export type SortModeNumber = 1 | 0 | -1;
