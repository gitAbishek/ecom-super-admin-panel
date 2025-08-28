import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import CustomBackHeader from '@/components/common/CustomBackHeader';
import CustomLoader from '@/components/loader/CustomLoader';
import CustomEmptyState from '@/components/common/CustomEmptyState';
import { CustomInput, CustomTextArea, CustomSelect, CustomLabel } from '@/components/form';
import { Megaphone } from 'lucide-react';
import { FormProvider, useForm } from 'react-hook-form';
import type { SubmitHandler } from 'react-hook-form';
import { useGetSingleCampaignDetails, useUpdateCampaign } from '@/hooks/campaign.hook';
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
  isActive: boolean;
  maxTotalUsage: number;
  minOrderValue?: number;
  maxOrderValue?: number;
  firstTimeCustomer: boolean;
  maxUsagePerCustomer?: number;
}

export default function EditCampaign() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { data, isLoading, error } = useGetSingleCampaignDetails(id!);
  const { mutateAsync: updateCampaign } = useUpdateCampaign();

  const methods = useForm<CampaignFormData>();
  const { handleSubmit, reset } = methods;

  useEffect(() => {
    if (data) {
      const campaign = (data as { campaign?: Record<string, unknown> }).campaign || (data as Record<string, unknown>);
      const conditions = getValue(campaign, 'conditions') as Record<string, unknown>;
      
      reset({
        name: (getValue(campaign, 'name') as string) || '',
        description: (getValue(campaign, 'description') as string) || '',
        campaignType: (getValue(campaign, 'campaignType') as string) || 'discount',
        discountType: (getValue(campaign, 'discountType') as string) || 'percentage',
        discountValue: Number(getValue(campaign, 'discountValue') || 0),
        validFrom: getValue(campaign, 'validFrom') ? new Date(getValue(campaign, 'validFrom') as string).toISOString().slice(0, 16) : '',
        validTo: getValue(campaign, 'validTo') ? new Date(getValue(campaign, 'validTo') as string).toISOString().slice(0, 16) : '',
        isActive: (getValue(campaign, 'isActive') as boolean) ?? true,
        maxTotalUsage: Number(getValue(campaign, 'maxTotalUsage') || 0),
        minOrderValue: Number(getValue(conditions, 'minOrderValue') || 0) || undefined,
        maxOrderValue: Number(getValue(conditions, 'maxOrderValue') || 0) || undefined,
        firstTimeCustomer: (getValue(conditions, 'firstTimeCustomer') as boolean) ?? false,
        maxUsagePerCustomer: Number(getValue(conditions, 'maxUsagePerCustomer') || 0) || undefined,
      });
    }
  }, [data, reset]);

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
        isActive: formData.isActive,
        maxTotalUsage: formData.maxTotalUsage,
        conditions: {
          minOrderValue: formData.minOrderValue || undefined,
          maxOrderValue: formData.maxOrderValue || undefined,
          firstTimeCustomer: formData.firstTimeCustomer,
          maxUsagePerCustomer: formData.maxUsagePerCustomer || undefined,
        },
      };

      const response = await updateCampaign({ id: id!, body: campaignData });
      showSuccessMessage(getValue(response, 'message') || 'Campaign updated successfully!');
      navigate('/campaigns');
    } catch (error) {
      showErrorMessage(getValue(error, 'message') || 'Failed to update campaign. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) return <CustomLoader text="Loading campaign..." />;
  if (error || !data) return (
    <CustomEmptyState
      icon={<Megaphone className="h-12 w-12 text-gray-400" />}
      title="Campaign not found"
      description="The campaign you are looking for does not exist."
    />
  );

  return (
    <div className="p-6 space-y-6 max-w-4xl mx-auto">
      <CustomBackHeader
        title="Edit Campaign"
        description="Update campaign information"
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
                    placeHolder="Select campaign type"
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
                    placeHolder="Select discount type"
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
                  {isSubmitting ? 'Updating...' : 'Update Campaign'}
                </Button>
              </div>
            </form>
          </FormProvider>
        </CardContent>
      </Card>
    </div>
  );
}
