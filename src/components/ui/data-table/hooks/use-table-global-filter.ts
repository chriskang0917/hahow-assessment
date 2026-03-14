import type { GlobalFilterOptions } from "@tanstack/react-table";
import { useState } from "react";

export interface GlobalFilterProps<TData> extends GlobalFilterOptions<TData> {
  initialValue?: string;
}

const useGlobalFilter = <TData>(options: GlobalFilterProps<TData> = {}) => {
  const { globalFilterFn = "includesString", initialValue = "" } = options;
  const [globalFilter, setGlobalFilter] = useState<string>(initialValue);

  return {
    ...options,
    globalFilter,
    globalFilterFn,
    initialValue,
    setGlobalFilter,
  };
};

export default useGlobalFilter;
