import { createFileRoute } from "@tanstack/react-router";
import type { ColumnDef } from "@tanstack/react-table";
import { Card, CardContent, CardHeader, CardTitle, DataTable, Typography } from "@/components/ui";
import { useDataTable } from "@/components/ui/data-table";

export const Route = createFileRoute("/_protected/factory/home")({
  component: RouteComponent,
});

interface Payment {
  id: string;
  amount: number;
  status: "pending" | "processing" | "success" | "failed";
  email: string;
}

async function getData(): Promise<Payment[]> {
  // Fetch data from your API here.
  return [
    {
      id: "728ed52f",
      amount: 100,
      status: "pending",
      email: "m@example.com",
    },
    {
      id: "728ed52f",
      amount: 100,
      status: "pending",
      email: "m@example.com",
    },
  ];
}

export const columns: ColumnDef<Payment>[] = [
  {
    id: "id",
    accessorKey: "id",
  },
  {
    accessorKey: "email",
  },
  {
    accessorKey: "status",
  },
  {
    accessorKey: "amount",
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("amount"));
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(amount);

      return <div className="font-medium">{formatted}</div>;
    },
  },
];

async function RouteComponent() {
  const { table } = useDataTable<Payment>({
    data: await getData(),
    columns,
    options: {
      paginationOptions: true,
    },
  });

  return (
    <>
      <title>react-template</title>
      <Card className="w-full">
        <CardHeader>
          <Typography as={CardTitle} variant="h2">
            react-template
          </Typography>
        </CardHeader>
        <CardContent>
          <DataTable table={table} />
        </CardContent>
      </Card>
    </>
  );
}
