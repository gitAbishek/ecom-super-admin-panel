import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import CustomBackHeader from '@/components/common/CustomBackHeader';
import CustomLoader from '@/components/loader/CustomLoader';
import CustomEmptyState from '@/components/common/CustomEmptyState';
import { Users, Mail, Phone, MapPin, Calendar, User, CreditCard } from 'lucide-react';
import { useGetSingleCustomerDetails } from '@/hooks/payment.hook';
import { getValue } from '@/utils/object';

export default function ViewCustomer() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data, isLoading, error } = useGetSingleCustomerDetails(id!);

  if (isLoading) return <CustomLoader text="Loading customer details..." />;
  if (error || !data) return (
    <CustomEmptyState
      icon={<Users className="h-12 w-12 text-gray-400" />}
      title="Customer not found"
      description="The customer you are looking for does not exist."
    />
  );

  const customer = (data as { customer?: Record<string, unknown> }).customer || (data as Record<string, unknown>);
  
  const formatDate = (dateString: unknown) => {
    if (!dateString) return 'N/A';
    return new Date(dateString as string).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const name = getValue(customer, 'name') || 
              `${getValue(customer, 'firstName') || ''} ${getValue(customer, 'lastName') || ''}`.trim() || 'N/A';

  return (
    <div className="p-6 space-y-6 max-w-4xl mx-auto">
      <CustomBackHeader
        title={`Customer: ${name}`}
        description="View customer details and information"
        onBack={() => navigate('/customers')}
      />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Basic Information */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2 mb-4">
              <User className="h-5 w-5 text-blue-600" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Basic Information</h3>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-center mb-6">
                <div className="h-20 w-20 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center">
                  <Users className="h-10 w-10 text-gray-500 dark:text-gray-400" />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Full Name</label>
                <p className="text-lg font-medium text-gray-900 dark:text-white">
                  {name}
                </p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Customer ID</label>
                <p className="text-gray-900 dark:text-white font-mono">
                  {getValue(customer, '_id') || getValue(customer, 'id') || 'N/A'}
                </p>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Status</label>
                <div className="flex items-center space-x-2">
                  <div className={`w-2 h-2 rounded-full ${
                    getValue(customer, 'isActive') !== false ? 'bg-green-500' : 'bg-red-500'
                  }`} />
                  <span className={`text-sm font-medium ${
                    getValue(customer, 'isActive') !== false ? 'text-green-700 dark:text-green-400' : 'text-red-700 dark:text-red-400'
                  }`}>
                    {getValue(customer, 'isActive') !== false ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contact Information */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2 mb-4">
              <Mail className="h-5 w-5 text-green-600" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Contact Information</h3>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Email Address</label>
                <div className="flex items-center space-x-2">
                  <Mail className="h-4 w-4 text-gray-400" />
                  <p className="text-gray-900 dark:text-white">
                    {getValue(customer, 'email') || 'N/A'}
                  </p>
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Phone Number</label>
                <div className="flex items-center space-x-2">
                  <Phone className="h-4 w-4 text-gray-400" />
                  <p className="text-gray-900 dark:text-white">
                    {getValue(customer, 'phone') || getValue(customer, 'phoneNumber') || 'N/A'}
                  </p>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Address</label>
                <div className="flex items-start space-x-2">
                  <MapPin className="h-4 w-4 text-gray-400 mt-1" />
                  <div className="text-gray-900 dark:text-white">
                    {getValue(customer, 'address') ? (
                      <div>
                        <p>{getValue(customer, 'address.line1') || getValue(customer, 'address.street') || getValue(customer, 'address')}</p>
                        <p>
                          {getValue(customer, 'address.city')} {getValue(customer, 'address.state')} {getValue(customer, 'address.postal_code') || getValue(customer, 'address.zipCode')}
                        </p>
                        <p>{getValue(customer, 'address.country')}</p>
                      </div>
                    ) : (
                      'No address provided'
                    )}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Account Information */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2 mb-4">
              <Calendar className="h-5 w-5 text-blue-600" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Account Information</h3>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Registration Date</label>
                <p className="text-gray-900 dark:text-white">
                  {formatDate(getValue(customer, 'createdAt') || getValue(customer, 'registrationDate'))}
                </p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Last Updated</label>
                <p className="text-gray-900 dark:text-white">
                  {formatDate(getValue(customer, 'updatedAt'))}
                </p>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Last Login</label>
                <p className="text-gray-900 dark:text-white">
                  {formatDate(getValue(customer, 'lastLogin')) || 'Never'}
                </p>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Email Verified</label>
                <div className="flex items-center space-x-2">
                  <div className={`w-2 h-2 rounded-full ${
                    getValue(customer, 'emailVerified') ? 'bg-green-500' : 'bg-red-500'
                  }`} />
                  <span className="text-gray-900 dark:text-white">
                    {getValue(customer, 'emailVerified') ? 'Verified' : 'Not Verified'}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Payment Information */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2 mb-4">
              <CreditCard className="h-5 w-5 text-purple-600" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Payment Information</h3>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Orders</label>
                <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {getValue(customer, 'totalOrders') || '0'}
                </p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Spent</label>
                <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                  ${getValue(customer, 'totalSpent') || '0.00'}
                </p>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Average Order Value</label>
                <p className="text-gray-900 dark:text-white">
                  ${getValue(customer, 'averageOrderValue') || '0.00'}
                </p>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Payment Method</label>
                <p className="text-gray-900 dark:text-white">
                  {getValue(customer, 'preferredPaymentMethod') || 'Not specified'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-end space-x-4">
        <Button variant="outline" onClick={() => navigate('/customers')}>
          Back to Customers
        </Button>
      </div>
    </div>
  );
}
