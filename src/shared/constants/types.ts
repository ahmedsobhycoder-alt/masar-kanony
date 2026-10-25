export interface QueryPagination {
    page: number;
    limit: number;
    numberOfPages: number;
    totalDocuments: number;
    next?: PaginationDetails;
    prev?: PaginationDetails;
}
export interface QueryResult<T> {
    data: T[];
    pagination?: QueryPagination;
}
export interface PaginationDetails {
    page: number;
    limit: number;
}



type listType<T> = {
  data: T[];
  pagination?: QueryPagination;
}

export default listType;