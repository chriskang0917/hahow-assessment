import {
  type ColumnDef,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import useGlobalFilter, { type GlobalFilterProps } from "./use-table-global-filter";
import useTablePagination, { type TablePaginationOptions } from "./use-table-pagination";
import useTableSelection from "./use-table-selection";
import useTableSorting, { type TableSortingOptions } from "./use-table-sorting";

export interface UseDataTableProps<T> {
  data: T[];
  columns: ColumnDef<T>[];
  options?: {
    globalFilterOptions?: true | GlobalFilterProps<T>;
    sortingOptions?: true | TableSortingOptions<T>;
    paginationOptions?: true | TablePaginationOptions;
    selectionOptions?: true;
  };
}

/**
 * 整合式 data table hook
 *
 * 支援全域搜尋、排序等功能，基於 @tanstack/react-table
 *
 * @example
 * ```tsx
 * const { table, globalFilter, setGlobalFilter } = useDataTable({
 *   data: users,
 *   columns: userColumns,
 *   options: {
 *     globalFilterOptions: { ... },
 *     sortingOptions: { ... },
 *     paginationOptions: { ... },
 *     selectionOptions: true,
 *   }
 * });
 * ```
 */
const useDataTable = <T>({ data, columns, options = {} }: UseDataTableProps<T>) => {
  const { globalFilterOptions, sortingOptions, paginationOptions, selectionOptions } = options;

  const globalFilterHook = useGlobalFilter<T>(
    globalFilterOptions === true ? {} : (globalFilterOptions ?? {}),
  );
  const sortingHook = useTableSorting<T>(sortingOptions === true ? {} : (sortingOptions ?? {}));
  const paginationHook = useTablePagination(
    paginationOptions === true ? {} : (paginationOptions ?? {}),
  );
  const selectionHook = useTableSelection();

  const table = useReactTable({
    data,
    columns,

    getCoreRowModel: getCoreRowModel(),

    ...(globalFilterOptions && {
      getFilteredRowModel: getFilteredRowModel(),
      onGlobalFilterChange: globalFilterHook.setGlobalFilter,
      ...globalFilterHook,
    }),

    ...(sortingOptions && {
      getSortedRowModel: getSortedRowModel(),
      onSortingChange: sortingHook.setSorting,
      ...sortingHook,
    }),

    ...(paginationOptions && {
      getPaginationRowModel: getPaginationRowModel(),
      onPaginationChange: paginationHook.setPagination,
      ...paginationHook,
    }),

    ...(selectionOptions && {
      onRowSelectionChange: selectionHook.setRowSelection,
      ...selectionHook,
    }),

    state: {
      ...(globalFilterOptions && { globalFilter: globalFilterHook.globalFilter }),
      ...(sortingOptions && { sorting: sortingHook.sorting }),
      ...(paginationOptions && { pagination: paginationHook.pagination }),
      ...(selectionOptions && { rowSelection: selectionHook.rowSelection }),
    },

    initialState: {
      pagination: paginationHook.initialValue,
      sorting: sortingHook.initialValue,
      globalFilter: globalFilterHook.initialValue,
      rowSelection: selectionHook.initialValue,
    },
  });

  return {
    table,
    ...(globalFilterHook || {}),
    ...(sortingHook || {}),
    ...(paginationHook || {}),
    ...(selectionHook || {}),
  };
};

export default useDataTable;
