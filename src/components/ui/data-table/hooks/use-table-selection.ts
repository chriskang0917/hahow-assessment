import type { RowSelectionOptions, RowSelectionState } from "@tanstack/react-table";
import { useState } from "react";

export interface TableSelectionOptions<T> extends RowSelectionOptions<T> {
  initialValue?: RowSelectionState;
}

const useTableSelection = <T>(options: TableSelectionOptions<T> = {}) => {
  const { initialValue = {} } = options;
  const [rowSelection, setRowSelection] = useState<RowSelectionState>(initialValue);

  return { ...options, rowSelection, setRowSelection };
};

export default useTableSelection;
