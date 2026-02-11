import { StdPagingRequest } from './standar-api-request.model';

export interface StdResponse<T> {
  data?: T;
  meta?: StdMetadata;
  notices?: StdMessage[];
  warnings?: StdMessage[];
  errors?: StdMessage[];
  multiErrors?: StdMultiMessage[];
  status?: string;

  feNotices?: string[];
  feWarnings?: string[];
  feErrors?: string[];
  feMultiErrors?: string[][];
}

export interface StdErrorResponse {
  errors: StdMessage[];
  multiErrors?: StdMultiMessage[];
  status: string;
  data?: any;

  feErrors?: string[];
  feMultiErrors?: string[][];
}

export interface StdMetadata {
  pagination?: StdPagingResponse;
}

export interface StdMessage {
  code: string;
  desc: string;
  hint?: any;
  args?: any[];
}

export interface StdPagingResponse extends StdPagingRequest {
  pages: number;
  dataCount: number;
}

export interface StdMultiMessage {
    name: string;
    messages: StdMessage[][];
}
