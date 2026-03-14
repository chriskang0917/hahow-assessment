import { flexRender, type Table as TableType } from "@tanstack/react-table";
import {
  IndeterminateCheckbox,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Typography,
} from "@/components/ui";

interface DataTableProps<TData> {
  table: TableType<TData>;
}

const DataTable = <TData,>({ table }: DataTableProps<TData>) => {
  const isSelectionEnabled = table.getState().rowSelection !== undefined;

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {isSelectionEnabled && (
                <TableHead className="w-12">
                  <IndeterminateCheckbox
                    disabled={table.getRowCount() === 0}
                    className={table.getRowCount() === 0 ? "cursor-not-allowed opacity-50" : ""}
                    {...{
                      checked: table.getIsAllRowsSelected(),
                      indeterminate: table.getIsSomeRowsSelected(),
                      onChange: table.getToggleAllRowsSelectedHandler(),
                    }}
                  />
                </TableHead>
              )}
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                );
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                {isSelectionEnabled && (
                  <TableCell className="w-12">
                    <IndeterminateCheckbox
                      {...{
                        checked: row.getIsSelected(),
                        disabled: !row.getCanSelect(),
                        indeterminate: row.getIsSomeSelected(),
                        onChange: row.getToggleSelectedHandler(),
                      }}
                    />
                  </TableCell>
                )}
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell
                className="text-center"
                colSpan={table.getAllColumns().length + (isSelectionEnabled ? 1 : 0)}
              >
                <Typography variant="muted" className="my-8">
                  暫時沒有搜尋結果。
                </Typography>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default DataTable;
