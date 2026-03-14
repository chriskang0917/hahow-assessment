import type { SortingOptions, SortingState } from "@tanstack/react-table";
import { useState } from "react";

export interface TableSortingOptions<T> extends SortingOptions<T> {
  initialValue?: SortingState;
}

const useTableSorting = <T>(options: TableSortingOptions<T> = {}) => {
  const { initialValue = [] } = options;
  const [sorting, setSorting] = useState<SortingState>(initialValue);

  return {
    ...options,
    sorting,
    initialValue,
    setSorting,
  };
};

export default useTableSorting;
