import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import CustomBackHeader from '@/components/common/CustomBackHeader';
import CustomLoader from '@/components/loader/CustomLoader';
import CustomEmptyState from '@/components/common/CustomEmptyState';
import { CustomInput, CustomTextArea, CustomSelect } from '@/components/form';
import { Percent } from 'lucide-react';
import { FormProvider, useForm } from 'react-hook-form';
import type { SubmitHandler } from 'react-hook-form';
import { useGetSingleCouponDetails, useUpdateCoupon } from '@/hooks/coupon.hook';
import { showSuccessMessage, showErrorMessage } from '@/utils/toast';
import { getValue } from '@/utils/object';

interface CouponFormData {
  code: string;
  description: string;
  couponType: string;
  discountType: string;
  discountValue: number;
  validFrom: string;
  validTo: string;
  isActive: boolean;
  maxTotalUsage: number;
  minOrderValue?: number;
  maxOrderValue?: number;
  firstTimeCustomer: boolean;
  maxUsagePerCustomer?: number;
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
        description: (getValue(coupon, 'description') as string) || '',
        couponType: (getValue(coupon, 'couponType') as string) || 'discount',
        discountType: (getValue(coupon, 'discountType') as string) || 'percentage',
        discountValue: Number(getValue(coupon, 'discountValue') || 0),
        validFrom: getValue(coupon, 'validFrom') ? new Date(getValue(coupon, 'validFrom') as string).toISOString().slice(0, 16) : '',
        validTo: getValue(coupon, 'validTo') ? new Date(getValue(coupon, 'validTo') as string).toISOString().slice(0, 16) : '',
        isActive: (getValue(coupon, 'isActive') as boolean) ?? true,
        maxTotalUsage: Number(getValue(coupon, 'maxTotalUsage') || 0),
        minOrderValue: Number(getValue(conditions, 'minOrderValue') || 0) || undefined,
        maxOrderValue: Number(getValue(conditions, 'maxOrderValue') || 0) || undefined,
        firstTimeCustomer: (getValue(conditions, 'firstTimeCustomer') as boolean) ?? false,
        maxUsagePerCustomer: Number(getValue(conditions, 'maxUsagePerCustomer') || 0) || undefined,
      });
    }
  }, [data, reset]);

  const onSubmit: SubmitHandler<CouponFormData> = async (formData) => {
    setIsSubmitting(true);

    try {
      const couponData = {
        code: formData.code,
        description: formData.description,
        couponType: formData.couponType,
        discountType: formData.discountType,
        discountValue: formData.discountValue,
        validFrom: new Date(formData.validFrom).toISOString(),
        validTo: new Date(formData.validTo).toISOString(),
        isActive: formData.isActive,
        maxTotalUsage: formData.maxTotalUsage,
        conditions: {
          minOrderValue: formData.minOrderValue || undefined,
          maxOrderValue: formData.maxOrderValue || undefined,
          firstTimeCustomer: formData.firstTimeCustomer,
          maxUsagePerCustomer: formData.maxUsagePerCustomer || undefined,
        },
      };

      await updateCoupon({ id: id!, body: couponData });
      showSuccessMessage('Coupon updated successfully!');
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Coupon Code</label>
                  <CustomInput
                    name="code"
                    placeHolder="Enter coupon code"
                    type="text"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Coupon Type</label>
                  <CustomSelect
                    name="couponType"
                    options={[
                      { value: 'discount', label: 'Discount' },
                      { value: 'promotion', label: 'Promotion' },
                      { value: 'seasonal', label: 'Seasonal' },
                    ]}
                    placeHolder="Select coupon type"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <CustomTextArea
                  name="description"
                  placeHolder="Enter coupon description"
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Discount Type</label>
                  <CustomSelect
                    name="discountType"
                    options={[
                      { value: 'percentage', label: 'Percentage (%)' },
                      { value: 'fixed', label: 'Fixed Amount ($)' },
                    ]}
                    placeHolder="Select discount type"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Discount Value</label>
                  <CustomInput
                    name="discountValue"
                    placeHolder="Enter discount value"
                    type="number"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Max Total Usage</label>
                  <CustomInput
                    name="maxTotalUsage"
                    placeHolder="Enter max total usage"
                    type="number"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Valid From</label>
                  <CustomInput
                    name="validFrom"
                    placeHolder="Valid from date"
                    type="datetime-local"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Valid To</label>
                  <CustomInput
                    name="validTo"
                    placeHolder="Valid to date"
                    type="datetime-local"
                    required
                  />
                </div>
              </div>

              <div className="border-t pt-6">
                <h3 className="text-lg font-medium mb-4">Conditions</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Min Order Value</label>
                    <CustomInput
                      name="minOrderValue"
                      placeHolder="Enter minimum order value"
                      type="number"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Max Order Value</label>
                    <CustomInput
                      name="maxOrderValue"
                      placeHolder="Enter maximum order value"
                      type="number"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Max Usage Per Customer</label>
                    <CustomInput
                      name="maxUsagePerCustomer"
                      placeHolder="Enter max usage per customer"
                      type="number"
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end space-x-4">
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
