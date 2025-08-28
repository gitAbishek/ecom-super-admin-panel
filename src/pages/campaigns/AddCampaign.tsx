import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import CustomBackHeader from '@/components/common/CustomBackHeader';
import { CustomInput, CustomTextArea, CustomSelect, CustomLabel } from '@/components/form';
import { FormProvider, useForm } from 'react-hook-form';
import type { SubmitHandler } from 'react-hook-form';
import { useCreateCampaign } from '@/hooks/campaign.hook';
import { showSuccessMessage, showErrorMessage } from '@/utils/toast';
import { getValue } from '@/utils/object';

interface CampaignFormData {
  name: string;
  description: string;
  campaignType: string;
  discountType: string;
  discountValue: number;
  validFrom: string;
  validTo: string;
  maxTotalUsage: number;
  minOrderValue?: number;
  maxOrderValue?: number;
  firstTimeCustomer: boolean;
  maxUsagePerCustomer?: number;
}

export default function AddCampaign() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { mutateAsync: createCampaign } = useCreateCampaign();

  const methods = useForm<CampaignFormData>({
    defaultValues: {
      name: '',
      description: '',
      campaignType: 'discount',
      discountType: 'percentage',
      discountValue: 0,
      validFrom: '',
      validTo: '',
      maxTotalUsage: 0,
      minOrderValue: undefined,
      maxOrderValue: undefined,
      firstTimeCustomer: false,
      maxUsagePerCustomer: undefined,
    }
  });

  const { handleSubmit } = methods;

  const onSubmit: SubmitHandler<CampaignFormData> = async (formData) => {
    setIsSubmitting(true);

    try {
      const campaignData = {
        name: formData.name,
        description: formData.description,
        campaignType: formData.campaignType,
        discountType: formData.discountType,
        discountValue: formData.discountValue,
        validFrom: new Date(formData.validFrom).toISOString(),
        validTo: new Date(formData.validTo).toISOString(),
        isActive: true,
        maxTotalUsage: formData.maxTotalUsage,
        conditions: {
          minOrderValue: formData.minOrderValue || undefined,
          maxOrderValue: formData.maxOrderValue || undefined,
          firstTimeCustomer: formData.firstTimeCustomer,
          maxUsagePerCustomer: formData.maxUsagePerCustomer || undefined,
        },
      };

      const response = await createCampaign(campaignData);
      showSuccessMessage(getValue(response, 'message') || 'Campaign created successfully!');
      navigate('/campaigns');
    } catch (error) {
      showErrorMessage(getValue(error, 'message') || 'Failed to create campaign. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-6 space-y-6 max-w-4xl mx-auto">
      <CustomBackHeader
        title="Add New Campaign"
        description="Create a new marketing campaign"
        onBack={() => navigate('/campaigns')}
      />
      
      <Card>
        <CardContent className="p-6">
          <FormProvider {...methods}>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <CustomLabel required>Campaign Name</CustomLabel>
                  <CustomInput
                    name="name"
                    placeHolder="Enter campaign name"
                    type="text"
                    required
                  />
                </div>
                
                <div>
                  <CustomLabel required>Campaign Type</CustomLabel>
                  <CustomSelect
                    name="campaignType"
                    options={[
                      { value: 'discount', label: 'Discount' },
                      { value: 'bogo', label: 'Buy One Get One' },
                      { value: 'free_shipping', label: 'Free Shipping' },
                      { value: 'cashback', label: 'Cashback' },
                    ]}
                    defaultValue="discount"
                    required
                  />
                </div>
              </div>

              <div>
                <CustomLabel>Description</CustomLabel>
                <CustomTextArea
                  name="description"
                  placeHolder="Enter campaign description"
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <CustomLabel required>Discount Type</CustomLabel>
                  <CustomSelect
                    name="discountType"
                    options={[
                      { value: 'percentage', label: 'Percentage (%)' },
                      { value: 'fixed', label: 'Fixed Amount ($)' },
                    ]}
                    defaultValue="percentage"
                    required
                  />
                </div>
                
                <div>
                  <CustomLabel required>Discount Value</CustomLabel>
                  <CustomInput
                    name="discountValue"
                    placeHolder="Enter discount value"
                    type="number"
                    required
                  />
                </div>

                <div>
                  <CustomLabel required>Max Total Usage</CustomLabel>
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
                  <CustomLabel required>Valid From</CustomLabel>
                  <CustomInput
                    name="validFrom"
                    placeHolder="Valid from date"
                    type="datetime-local"
                    required
                  />
                </div>
                
                <div>
                  <CustomLabel required>Valid To</CustomLabel>
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
                    <CustomLabel>Min Order Value</CustomLabel>
                    <CustomInput
                      name="minOrderValue"
                      placeHolder="Enter minimum order value"
                      type="number"
                    />
                  </div>
                  
                  <div>
                    <CustomLabel>Max Order Value</CustomLabel>
                    <CustomInput
                      name="maxOrderValue"
                      placeHolder="Enter maximum order value"
                      type="number"
                    />
                  </div>

                  <div>
                    <CustomLabel>Max Usage Per Customer</CustomLabel>
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
                  onClick={() => navigate('/campaigns')}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? 'Creating...' : 'Create Campaign'}
                </Button>
              </div>
            </form>
          </FormProvider>
        </CardContent>
      </Card>
    </div>
  );
}
