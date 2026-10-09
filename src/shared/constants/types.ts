import { QueryPagination } from "../utils/queryBuilder";

type listType<T> = {
  data: T[];
  pagination?: QueryPagination;
}

export default listType;