import { useForm } from "@tanstack/react-form";
import React, { useState } from "react";
import { FieldInfo } from "@/components/form/field-info";
import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Input,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui";
import type { CompanyType } from "@/types/root";
import {
  companyNameSchema,
  customerTypeSchema,
  newCustomerSchema,
  taxIdSchema,
} from "../schema/new-customer.schema";

interface NewCustomerProps {
  children: React.ReactNode;
  onSubmit?: (data: { taxId: number; companyName: string; customerType: CompanyType }) => void;
}

const NewCustomerDialog = ({ children, onSubmit }: NewCustomerProps) => {
  const [open, setOpen] = useState(false);

  const form = useForm({
    defaultValues: {
      taxId: "",
      companyName: "",
      customerType: "factory" as CompanyType,
    },
    onSubmit: ({ value }) => {
      const validation = newCustomerSchema.safeParse(value);
      if (!validation.success) {
        console.error("表單驗證失敗:", validation.error);
        return;
      }

      onSubmit?.(validation.data);
      setOpen(false);
      form.reset();
    },
  });

  const handleCancel = () => {
    setOpen(false);
    form.reset();
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    e.stopPropagation();
    form.handleSubmit();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      form.handleSubmit();
    }
  };

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    form.reset();
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>新增客戶</DialogTitle>
          <DialogDescription>請填寫新客戶的基本資訊</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-6">
            <form.Field
              name="taxId"
              validators={{
                onBlur: ({ value }) => {
                  const result = taxIdSchema.safeParse(value);
                  return result.success ? undefined : result.error.message;
                },
              }}
              children={(field) => (
                <div className="space-y-2">
                  <Label htmlFor={field.name}>
                    統編 <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    placeholder="請輸入 8 位數統編"
                    maxLength={8}
                    onKeyDown={handleKeyDown}
                  />
                  <FieldInfo field={field} />
                </div>
              )}
            />

            <form.Field
              name="companyName"
              validators={{
                onBlur: ({ value }) => {
                  const result = companyNameSchema.safeParse(value);
                  return result.success ? undefined : result.error.message;
                },
              }}
              children={(field) => (
                <div className="space-y-2">
                  <Label htmlFor={field.name}>
                    公司名稱 <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    placeholder="請輸入公司名稱"
                    onKeyDown={handleKeyDown}
                  />
                  <FieldInfo field={field} />
                </div>
              )}
            />

            <form.Field
              name="customerType"
              validators={{
                onBlur: ({ value }) => {
                  const result = customerTypeSchema.safeParse(value);
                  return result.success ? undefined : result.error.issues[0]?.message;
                },
              }}
              children={(field) => (
                <div className="space-y-2">
                  <Label htmlFor={field.name}>
                    客戶類型 <span className="text-destructive">*</span>
                  </Label>
                  <Select
                    value={field.state.value}
                    onValueChange={(value) => field.handleChange(value as CompanyType)}
                  >
                    <SelectTrigger className="w-full" onKeyDown={handleKeyDown}>
                      <SelectValue placeholder="選擇客戶類型" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="factory">中心廠</SelectItem>
                      <SelectItem value="supplier">供應商</SelectItem>
                    </SelectContent>
                  </Select>
                  <FieldInfo field={field} />
                </div>
              )}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleCancel}>
              取消
            </Button>
            <form.Subscribe
              selector={(state) => [state.canSubmit, state.isSubmitting]}
              children={([canSubmit, isSubmitting]) => (
                <Button type="submit" disabled={!canSubmit} className="min-w-20">
                  {isSubmitting ? "新增中..." : "新增"}
                </Button>
              )}
            />
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default NewCustomerDialog;
