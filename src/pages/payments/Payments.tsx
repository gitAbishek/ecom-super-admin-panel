import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import CustomHeaders from '@/components/common/CustomHeaders';
import CustomLoader from '@/components/loader/CustomLoader';
import CustomEmptyState from '@/components/common/CustomEmptyState';
import { Eye, CreditCard, Search, DollarSign } from 'lucide-react';
import { useGetAllPayments } from '@/hooks/payment.hook';
import { getValue } from '@/utils/object';

export default function Payments() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const { data, isLoading, error } = useGetAllPayments();

  if (isLoading) return <CustomLoader text="Loading payments..." />;
  if (error) return (
    <CustomEmptyState
      icon={<CreditCard className="h-12 w-12 text-gray-400" />}
      title="Error loading payments"
      description="There was an error loading the payment data."
    />
  );

  // Extract payments from the API response structure
  const paymentsData = getValue(data, 'payments') as Record<string, unknown> || {};
  const paymentsArray = getValue(paymentsData, 'results') as Record<string, unknown>[] || [];
  
  const filteredPayments = paymentsArray.filter((payment: Record<string, unknown>) => {
    const transactionId = getValue(payment, 'paymentId') || getValue(payment, 'stripePaymentIntentId') || getValue(payment, '_id') || '';
    const orderId = getValue(payment, 'orderId') || '';
    const status = getValue(payment, 'status') || '';
    
    return (
      transactionId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      status.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const formatAmount = (amount: unknown) => {
    if (!amount) return '$0.00';
    return `$${Number(amount).toFixed(2)}`;
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'completed':
      case 'success':
      case 'paid':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'pending':
      case 'processing':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'failed':
      case 'cancelled':
      case 'refunded':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  return (
    <div className="p-6 space-y-6">
      <CustomHeaders
        title="Payment Management"
        description="Manage and view payment transactions"
      />

      {/* Search Bar */}
      <Card>
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Search payments by payment ID, order ID, or status..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            />
          </div>
        </CardContent>
      </Card>

      {/* Payment List */}
      <Card>
        <CardContent className="p-0">
          {filteredPayments.length === 0 ? (
            <CustomEmptyState
              icon={<CreditCard className="h-12 w-12 text-gray-400" />}
              title="No payments found"
              description="No payments match your search criteria."
            />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Transaction
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Customer
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Payment Method
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-600">
                  {filteredPayments.map((payment: Record<string, unknown>, index: number) => {
                    const paymentId = getValue(payment, '_id') || getValue(payment, 'id') || index;
                    const transactionId = getValue(payment, 'paymentId') || getValue(payment, 'stripePaymentIntentId') || paymentId;
                    const amount = getValue(payment, 'amount') || 0;
                    const paymentMethod = 'Stripe'; // Based on API response, this appears to be Stripe payments
                    const status = getValue(payment, 'status') || 'unknown';

                    return (
                      <tr key={paymentId} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10">
                              <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                                <DollarSign className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                              </div>
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900 dark:text-white">
                                {transactionId}
                              </div>
                              <div className="text-sm text-gray-500 dark:text-gray-400">
                                ID: {paymentId}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900 dark:text-white">Stripe Customer</div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">{getValue(payment, 'stripeCustomerId') || 'N/A'}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-semibold text-gray-900 dark:text-white">
                            {formatAmount(amount)}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white capitalize">
                          {paymentMethod}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(status)}`}>
                            {status.charAt(0).toUpperCase() + status.slice(1)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex items-center justify-end space-x-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => navigate(`/payments/view/${paymentId}`)}
                              className="h-8 w-8 p-0"
                              title="View payment"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
