export interface Campaign {
  id: string;
  name: string;
  description: string;
  campaignType: string;
  discountType: string;
  discountValue: number;
  isActive: boolean;
  validFrom: string;
  validTo: string;
  maxTotalUsage: number;
  createdAt: string;
  conditions?: {
    minOrderValue?: number;
    maxOrderValue?: number;
    applicableCategories?: string[];
    excludeProducts?: string[];
    firstTimeCustomer?: boolean;
    maxUsagePerCustomer?: number;
  };
}
