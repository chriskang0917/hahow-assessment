export interface Customer {
  id: string;
  taxId: string;
  companyName: string;
  accountCount: number;
  companyType: CompanyType;
  status: CompanyStatus;
}

export type CompanyType = "factory" | "supplier";
export type CompanyStatus = "active" | "inactive";
