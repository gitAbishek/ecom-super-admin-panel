export interface Coupon {
  id: string;
  code: string;
  discountType: string;
  discountValue: number;
  isActive: boolean;
  maxUsage: number;
  distributionMethod: string;
  createdAt: string;
  conditions?: {
    minOrderValue?: number;
    validFrom?: string;
    validTo?: string;
  };
}
