export interface Pagination<T> {
  total: number;
  page_size: number;
  page_count: number;
  current_page: number;
  next: number | null;
  previous: number | null;
  results: T[];
}
