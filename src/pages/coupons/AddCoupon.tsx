import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FormProvider, useForm } from 'react-hook-form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import CustomInput from '@/components/form/CustomInput';
import CustomSelect from '@/components/form/CustomSelect';
import CustomLabel from '@/components/form/CustomLabel';
import CustomBackHeader from '@/components/common/CustomBackHeader';
import { useCreateCoupon } from '@/hooks/coupon.hook';
import { showErrorMessage, showSuccessMessage } from '@/utils/toast';
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

export default function AddCoupon() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const methods = useForm<CouponFormData>({
    defaultValues: {
      code: '',
      discountType: '',
      discountValue: 0,
      maxUsage: undefined,
      minOrderValue: undefined,
      validFrom: '',
      validTo: '',
      isActive: true,
      distributionMethod: '',
    },
  });

  const { mutateAsync: createCoupon } = useCreateCoupon();

  const onSubmit = async (data: CouponFormData) => {
    setIsSubmitting(true);
    try {
      // Validate required dates
      if (!data.validFrom || !data.validTo) {
        showErrorMessage('Please provide valid start and end dates.');
        setIsSubmitting(false);
        return;
      }

      const payload = {
        code: data.code,
        discountType: data.discountType,
        discountValue: Number(data.discountValue),
        conditions: {
          minOrderValue: data.minOrderValue ? Number(data.minOrderValue) : undefined,
          validFrom: new Date(data.validFrom).toISOString(),
          validTo: new Date(data.validTo).toISOString(),
        },
        maxUsage: data.maxUsage ? Number(data.maxUsage) : 1, // Default to 1 if not specified
        isActive: data.isActive === 'true' || data.isActive === true,
        distributionMethod: data.distributionMethod,
      };

      const response = await createCoupon(payload);
      showSuccessMessage(getValue(response, "message") || 'Coupon created successfully!');
      navigate('/coupons');
    } catch (error) {
      showErrorMessage(getValue(error, "message") || 'Failed to create coupon. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-6 space-y-6 max-w-4xl mx-auto">
      <CustomBackHeader
        title="Add New Coupon"
        description="Create a new discount coupon or promotional code"
        onBack={() => navigate('/coupons')}
      />

      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Coupon Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <CustomLabel htmlFor="code" required>Coupon Code</CustomLabel>
                  <CustomInput
                    name="code"
                    type="text"
                    placeHolder="Enter coupon code (e.g., SAVE20)"
                    required
                  />
                </div>
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
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Usage & Distribution</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
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
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Conditions & Validity</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <CustomLabel htmlFor="minOrderValue">Minimum Order Value</CustomLabel>
                <CustomInput
                  name="minOrderValue"
                  type="number"
                  placeHolder="Enter minimum order value (optional)"
                />
              </div>

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
            </CardContent>
          </Card>

          <div className="flex justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/coupons')}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Creating...' : 'Create Coupon'}
            </Button>
          </div>
        </form>
      </FormProvider>
    </div>
  );
}
