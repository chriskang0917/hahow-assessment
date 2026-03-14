import { Edit, Plus, UserCheck } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui";
import type { Customer } from "@/types/root";

interface CustomerDropdownProps {
  customer: Customer;
  children: React.ReactNode;
}

const CustomerDropdown = ({ customer, children }: CustomerDropdownProps) => {
  const handleAddAccount = (customer: Customer) => {
    console.log(customer);
  };

  const handleEditCustomer = (customer: Customer) => {
    console.log(customer);
  };

  const handleDeleteCustomer = (customer: Customer) => {
    console.log(customer);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>{children}</DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem
          onClick={() => handleAddAccount(customer)}
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          新增使用者
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => handleEditCustomer(customer)}
          className="flex items-center gap-2"
        >
          <Edit className="h-4 w-4" />
          修改客戶資料
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem variant="destructive" onClick={() => handleDeleteCustomer(customer)}>
          <UserCheck className="h-4 w-4" />
          {customer.status === "active" ? "停用帳戶" : "啟用帳戶"}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export { CustomerDropdown };
