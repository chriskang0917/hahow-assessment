import { createFileRoute } from "@tanstack/react-router";
import { type ColumnDef } from "@tanstack/react-table";
import { ArrowDown, ArrowUp, ArrowUpDown, MoreHorizontal, Plus, Shield } from "lucide-react";
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  DataTable,
  SearchBar,
  Typography,
} from "@/components/ui";
import { AutoPagination, useDataTable } from "@/components/ui/data-table";
import { CustomerDropdown } from "@/features/root/components/customer-dropdown";
import NewCustomerDialog from "@/features/root/components/new-customer-dialog";
import type { CompanyType, Customer } from "@/types/root";

export const Route = createFileRoute("/_protected/root/home")({
  component: RouteComponent,
});

const customers: Customer[] = [
  {
    id: "1",
    taxId: "12345678",
    companyName: "台積電股份有限公司",
    accountCount: 15,
    companyType: "factory",
    status: "active",
  },
  {
    id: "2",
    taxId: "87654321",
    companyName: "鴻海精密工業股份有限公司",
    accountCount: 8,
    companyType: "supplier",
    status: "active",
  },
  {
    id: "3",
    taxId: "11223344",
    companyName: "聯發科技股份有限公司",
    accountCount: 12,
    companyType: "factory",
    status: "inactive",
  },
  {
    id: "4",
    taxId: "44332211",
    companyName: "華碩電腦股份有限公司",
    accountCount: 6,
    companyType: "factory",
    status: "active",
  },
  {
    id: "5",
    taxId: "55667788",
    companyName: "宏達國際電子股份有限公司",
    accountCount: 3,
    companyType: "supplier",
    status: "active",
  },
];

function RouteComponent() {
  const handleSuperUserLogin = (customer: Customer) => {
    console.log(customer);
  };

  const handleNewCustomer = (data: {
    taxId: number;
    companyName: string;
    customerType: CompanyType;
  }) => {
    console.log("新增客戶:", data);
  };

  const columns: ColumnDef<Customer>[] = [
    {
      accessorKey: "status",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            className="-mx-2 flex w-full justify-start"
            onClick={() => column.toggleSorting()}
          >
            <span>狀態</span>
            {column.getIsSorted() === "asc" ? (
              <ArrowDown className="h-4 w-4" />
            ) : column.getIsSorted() === "desc" ? (
              <ArrowUp className="h-4 w-4" />
            ) : (
              <ArrowUpDown className="h-4 w-4 opacity-30" />
            )}
          </Button>
        );
      },
      cell: ({ row }) => (
        <Badge variant={row.getValue("status") === "active" ? "default" : "secondary"}>
          {row.getValue("status") === "active" ? "啟用" : "停用"}
        </Badge>
      ),
    },
    {
      accessorKey: "taxId",
      header: "統編",
      cell: ({ row }) => <span className="font-mono">{row.getValue("taxId")}</span>,
    },
    {
      accessorKey: "companyName",
      header: "公司名稱",
      cell: ({ row }) => <span className="font-medium">{row.getValue("companyName")}</span>,
    },
    {
      accessorKey: "companyType",
      header: "公司類別",
      cell: ({ row }) => (
        <Badge variant={row.getValue("companyType") === "factory" ? "default" : "secondary"}>
          {row.getValue("companyType") === "factory" ? "中心廠" : "供應商"}
        </Badge>
      ),
    },
    {
      accessorKey: "accountCount",
      header: "帳戶數",
      cell: ({ row }) => <Badge variant="secondary">{row.getValue("accountCount")} 個帳戶</Badge>,
    },
    {
      id: "superUserLogin",
      header: "超級使用者登入",
      cell: ({ row }) => (
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleSuperUserLogin(row.original)}
          className="flex items-center gap-2"
        >
          <Shield className="h-3 w-3" />
          登入
        </Button>
      ),
    },
    {
      id: "actions",
      header: () => <div className="text-center">操作</div>,
      cell: ({ row }) => (
        <div className="flex justify-center">
          <CustomerDropdown customer={row.original}>
            <Button variant="ghost" size="icon">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </CustomerDropdown>
        </div>
      ),
    },
  ];

  const { table, globalFilter, setGlobalFilter } = useDataTable<Customer>({
    data: customers,
    columns,
    options: {
      sortingOptions: true,
      paginationOptions: true,
      selectionOptions: true,
      globalFilterOptions: {
        globalFilterFn: (row, _columnId, value) => {
          const customer = row.original;
          const searchValue = value.toLowerCase();

          const statusText = customer.status === "active" ? "啟用" : "停用";
          const companyTypeText = customer.companyType === "factory" ? "中心廠" : "供應商";

          return (
            customer.taxId.toLowerCase().includes(searchValue) ||
            customer.companyName.toLowerCase().includes(searchValue) ||
            statusText.includes(searchValue) ||
            companyTypeText.includes(searchValue)
          );
        },
      },
    },
  });

  return (
    <section className="flex h-full flex-col items-center overflow-hidden">
      <Card className="w-full flex-1">
        <CardHeader>
          <Typography variant="h2">客戶列表</Typography>
          <CardDescription>管理您的客戶資料，包含統編、公司名稱和帳戶資訊</CardDescription>
        </CardHeader>

        <CardContent>
          <div className="mb-10 flex flex-wrap items-center justify-between gap-4">
            <span className="sm:min-w-sm">
              <SearchBar
                className="grow"
                placeholder="請輸入客戶統編或公司名稱進行搜尋..."
                value={globalFilter}
                onChange={setGlobalFilter}
              />
            </span>
            <NewCustomerDialog onSubmit={handleNewCustomer}>
              <Button>
                <Plus className="h-4 w-4" />
                新增客戶
              </Button>
            </NewCustomerDialog>
          </div>
          <DataTable table={table} />
          <AutoPagination
            className="mt-4 flex justify-end"
            currentPage={table.getState().pagination.pageIndex + 1}
            totalPages={table.getPageCount()}
            onPageChange={(page: number) => table.setPageIndex(page - 1)}
            canPreviousPage={table.getCanPreviousPage()}
            canNextPage={table.getCanNextPage()}
          />
        </CardContent>
      </Card>
    </section>
  );
}
