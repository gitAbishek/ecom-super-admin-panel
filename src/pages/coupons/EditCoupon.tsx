import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import CustomBackHeader from '@/components/common/CustomBackHeader';
import CustomLoader from '@/components/loader/CustomLoader';
import CustomEmptyState from '@/components/common/CustomEmptyState';
import { CustomInput, CustomSelect, CustomLabel } from '@/components/form';
import { Percent } from 'lucide-react';
import { FormProvider, useForm } from 'react-hook-form';
import type { SubmitHandler } from 'react-hook-form';
import { useGetSingleCouponDetails, useUpdateCoupon } from '@/hooks/coupon.hook';
import { showSuccessMessage, showErrorMessage } from '@/utils/toast';
import { getValue } from '@/utils/object';

interface CouponFormData {
  code: string;
  discountType: string;
  discountValue: number;
  maxUsage?: number;
  minOrderValue?: number;
  validFrom: string;
  validTo: string;
  isActive: string | boolean;
  distributionMethod: string;
}

export default function EditCoupon() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { data, isLoading, error } = useGetSingleCouponDetails(id!);
  const { mutateAsync: updateCoupon } = useUpdateCoupon();

  const methods = useForm<CouponFormData>();
  const { handleSubmit, reset } = methods;

  useEffect(() => {
    if (data) {
      const coupon = (data as { coupon?: Record<string, unknown> }).coupon || (data as Record<string, unknown>);
      const conditions = getValue(coupon, 'conditions') as Record<string, unknown>;
      
      reset({
        code: (getValue(coupon, 'code') as string) || '',
        discountType: (getValue(coupon, 'discountType') as string) || 'percentage',
        discountValue: Number(getValue(coupon, 'discountValue') || 0),
        maxUsage: Number(getValue(coupon, 'maxUsage') || 0) || undefined,
        distributionMethod: (getValue(coupon, 'distributionMethod') as string) || 'email',
        validFrom: getValue(conditions, 'validFrom') ? new Date(getValue(conditions, 'validFrom') as string).toISOString().slice(0, 16) : '',
        validTo: getValue(conditions, 'validTo') ? new Date(getValue(conditions, 'validTo') as string).toISOString().slice(0, 16) : '',
        isActive: (getValue(coupon, 'isActive') as boolean) ?? true,
        minOrderValue: Number(getValue(conditions, 'minOrderValue') || 0) || undefined,
      });
    }
  }, [data, reset]);

  const onSubmit: SubmitHandler<CouponFormData> = async (formData) => {
    setIsSubmitting(true);

    try {
      // Validate required dates
      if (!formData.validFrom || !formData.validTo) {
        showErrorMessage('Please provide valid start and end dates.');
        setIsSubmitting(false);
        return;
      }

      const couponData = {
        discountType: formData.discountType,
        discountValue: Number(formData.discountValue),
        conditions: {
          minOrderValue: formData.minOrderValue ? Number(formData.minOrderValue) : undefined,
          validFrom: new Date(formData.validFrom).toISOString(),
          validTo: new Date(formData.validTo).toISOString(),
        },
        maxUsage: formData.maxUsage ? Number(formData.maxUsage) : 1,
        isActive: formData.isActive === 'true' || formData.isActive === true,
        distributionMethod: formData.distributionMethod,
      };

      const response = await updateCoupon({ id: id!, body: couponData });
      showSuccessMessage(getValue(response, 'message') || 'Coupon updated successfully!');
      navigate('/coupons');
    } catch (error) {
      showErrorMessage(getValue(error, 'message') || 'Failed to update coupon. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) return <CustomLoader text="Loading coupon..." />;
  if (error || !data) return (
    <CustomEmptyState
      icon={<Percent className="h-12 w-12 text-gray-400" />}
      title="Coupon not found"
      description="The coupon you are looking for does not exist."
    />
  );

  return (
    <div className="p-6 space-y-6 max-w-4xl mx-auto">
      <CustomBackHeader
        title="Edit Coupon"
        description="Update coupon information"
        onBack={() => navigate('/coupons')}
      />
      
      <Card>
        <CardContent className="p-6">
          <FormProvider {...methods}>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Coupon Details Card */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Coupon Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <CustomLabel htmlFor="code" required>Coupon Code</CustomLabel>
                    <CustomInput
                      name="code"
                      type="text"
                      placeHolder="Enter coupon code (e.g., SAVE20)"
                      required
                      disabled
                    />
                  </div>
                  <div>
                    <CustomLabel htmlFor="distributionMethod" required>Distribution Method</CustomLabel>
                    <CustomSelect
                      name="distributionMethod"
                      options={[
                        { value: 'email', label: 'Email' },
                        { value: 'sms', label: 'SMS' },
                        { value: 'manual', label: 'Manual' },
                        { value: 'bulk', label: 'Bulk' },
                      ]}
                      placeHolder="Select distribution method"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <CustomLabel htmlFor="discountType" required>Discount Type</CustomLabel>
                    <CustomSelect
                      name="discountType"
                      options={[
                        { value: 'percentage', label: 'Percentage' },
                        { value: 'fixed', label: 'Fixed Amount' },
                      ]}
                      placeHolder="Select discount type"
                      required
                    />
                  </div>
                  <div>
                    <CustomLabel htmlFor="discountValue" required>Discount Value</CustomLabel>
                    <CustomInput
                      name="discountValue"
                      type="number"
                      placeHolder="Enter discount value"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Usage & Conditions */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Usage & Conditions</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <CustomLabel htmlFor="maxUsage">Maximum Usage</CustomLabel>
                    <CustomInput
                      name="maxUsage"
                      type="number"
                      placeHolder="Enter max usage limit (optional)"
                    />
                  </div>
                  <div>
                    <CustomLabel htmlFor="minOrderValue">Minimum Order Value</CustomLabel>
                    <CustomInput
                      name="minOrderValue"
                      type="number"
                      placeHolder="Enter minimum order value (optional)"
                    />
                  </div>
                </div>
              </div>

              {/* Validity Period */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Validity Period</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <CustomLabel htmlFor="validFrom" required>Valid From</CustomLabel>
                    <CustomInput
                      name="validFrom"
                      type="datetime-local"
                      placeHolder=""
                      required
                    />
                  </div>
                  <div>
                    <CustomLabel htmlFor="validTo" required>Valid To</CustomLabel>
                    <CustomInput
                      name="validTo"
                      type="datetime-local"
                      placeHolder=""
                      required
                    />
                  </div>
                </div>

                <div>
                  <CustomLabel htmlFor="isActive">Status</CustomLabel>
                  <CustomSelect
                    name="isActive"
                    options={[
                      { value: 'true', label: 'Active' },
                      { value: 'false', label: 'Inactive' },
                    ]}
                    placeHolder="Select status"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate('/coupons')}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? 'Updating...' : 'Update Coupon'}
                </Button>
              </div>
            </form>
          </FormProvider>
        </CardContent>
      </Card>
    </div>
  );
}
