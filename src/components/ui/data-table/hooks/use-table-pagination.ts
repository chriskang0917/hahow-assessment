import type { PaginationOptions, PaginationState } from "@tanstack/react-table";
import { useState } from "react";

export interface TablePaginationOptions extends PaginationOptions {
  initialValue?: PaginationState;
}

const useTablePagination = (options: TablePaginationOptions = {}) => {
  const { initialValue = { pageIndex: 0, pageSize: 10 } } = options;

  const [pagination, setPagination] = useState(initialValue);

  return {
    ...options,
    pagination,
    initialValue,
    setPagination,
  };
};

export default useTablePagination;
