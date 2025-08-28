import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import CustomBackHeader from '@/components/common/CustomBackHeader';
import CustomLoader from '@/components/loader/CustomLoader';
import CustomEmptyState from '@/components/common/CustomEmptyState';
import { CreditCard, DollarSign, User, Calendar, Receipt, CheckCircle, XCircle, Clock } from 'lucide-react';
import { useGetSinglePaymentDetails } from '@/hooks/payment.hook';
import { getValue } from '@/utils/object';

export default function ViewPayment() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data, isLoading, error } = useGetSinglePaymentDetails(id!);

  if (isLoading) return <CustomLoader text="Loading payment details..." />;
  if (error || !data) return (
    <CustomEmptyState
      icon={<CreditCard className="h-12 w-12 text-gray-400" />}
      title="Payment not found"
      description="The payment you are looking for does not exist."
    />
  );

  const payment = (data as { payment?: Record<string, unknown> }).payment || (data as Record<string, unknown>);
  
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

  const formatAmount = (amount: unknown) => {
    if (!amount) return '$0.00';
    return `$${Number(amount).toFixed(2)}`;
  };

  const getStatusIcon = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'completed':
      case 'success':
      case 'paid':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'pending':
      case 'processing':
        return <Clock className="h-5 w-5 text-yellow-600" />;
      case 'failed':
      case 'cancelled':
      case 'refunded':
        return <XCircle className="h-5 w-5 text-red-600" />;
      default:
        return <Receipt className="h-5 w-5 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'completed':
      case 'success':
      case 'paid':
        return 'text-green-700 dark:text-green-400';
      case 'pending':
      case 'processing':
        return 'text-yellow-700 dark:text-yellow-400';
      case 'failed':
      case 'cancelled':
      case 'refunded':
        return 'text-red-700 dark:text-red-400';
      default:
        return 'text-gray-700 dark:text-gray-400';
    }
  };

  const transactionId = getValue(payment, 'paymentId') || getValue(payment, 'stripePaymentIntentId') || getValue(payment, '_id') || 'N/A';
  const status = getValue(payment, 'status') || 'unknown';

  return (
    <div className="p-6 space-y-6 max-w-4xl mx-auto">
      <CustomBackHeader
        title={`Payment: ${transactionId}`}
        description="View payment transaction details"
        onBack={() => navigate('/payments')}
      />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Transaction Information */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2 mb-4">
              <Receipt className="h-5 w-5 text-blue-600" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Transaction Information</h3>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Transaction ID</label>
                <p className="text-lg font-mono bg-gray-100 dark:bg-gray-800 px-3 py-2 rounded border text-gray-900 dark:text-white">
                  {transactionId}
                </p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Payment ID</label>
                <p className="text-gray-900 dark:text-white font-mono">
                  {getValue(payment, '_id') || getValue(payment, 'id') || 'N/A'}
                </p>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Status</label>
                <div className="flex items-center space-x-2">
                  {getStatusIcon(status)}
                  <span className={`text-sm font-medium ${getStatusColor(status)}`}>
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </span>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Order ID</label>
                <p className="text-gray-900 dark:text-white">
                  {getValue(payment, 'orderId') || 'N/A'}
                </p>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Stripe Payment Intent ID</label>
                <p className="text-gray-900 dark:text-white font-mono text-sm">
                  {getValue(payment, 'stripePaymentIntentId') || 'N/A'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Amount Information */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2 mb-4">
              <DollarSign className="h-5 w-5 text-green-600" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Amount Information</h3>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Amount</label>
                <p className="text-3xl font-bold text-green-600 dark:text-green-400">
                  {formatAmount(getValue(payment, 'amount') || getValue(payment, 'totalAmount'))}
                </p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Subtotal</label>
                <p className="text-gray-900 dark:text-white">
                  {formatAmount(getValue(payment, 'subtotal') || getValue(payment, 'amount'))}
                </p>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Tax Amount</label>
                <p className="text-gray-900 dark:text-white">
                  {formatAmount(getValue(payment, 'taxAmount') || 0)}
                </p>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Discount</label>
                <p className="text-gray-900 dark:text-white">
                  {formatAmount(getValue(payment, 'discountAmount') || 0)}
                </p>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Currency</label>
                <p className="text-gray-900 dark:text-white uppercase">
                  {getValue(payment, 'currency') || 'USD'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Customer Information */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2 mb-4">
              <User className="h-5 w-5 text-purple-600" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Customer Information</h3>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Stripe Customer ID</label>
                <p className="text-gray-900 dark:text-white font-mono">
                  {getValue(payment, 'stripeCustomerId') || 'N/A'}
                </p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-500 dark:text-gray-400">User ID</label>
                <p className="text-gray-900 dark:text-white font-mono">
                  {getValue(payment, 'userId') || 'N/A'}
                </p>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Tenant ID</label>
                <p className="text-gray-900 dark:text-white font-mono">
                  {getValue(payment, 'tenantId') || 'N/A'}
                </p>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Created By</label>
                <p className="text-gray-900 dark:text-white font-mono">
                  {getValue(payment, 'createdBy') || 'N/A'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Payment Method & Timeline */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2 mb-4">
              <CreditCard className="h-5 w-5 text-blue-600" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Payment Method & Timeline</h3>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Payment Method</label>
                <p className="text-gray-900 dark:text-white">
                  Stripe
                </p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Client Secret</label>
                <p className="text-gray-900 dark:text-white font-mono text-sm break-all">
                  {getValue(payment, 'clientSecret') || 'N/A'}
                </p>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Transaction Date</label>
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4 text-gray-400" />
                  <p className="text-gray-900 dark:text-white">
                    {formatDate(getValue(payment, 'createdAt') || getValue(payment, 'paymentDate'))}
                  </p>
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Last Updated</label>
                <p className="text-gray-900 dark:text-white">
                  {formatDate(getValue(payment, 'updatedAt'))}
                </p>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Gateway Transaction ID</label>
                <p className="text-gray-900 dark:text-white font-mono text-sm">
                  {getValue(payment, 'gatewayTransactionId') || getValue(payment, 'externalTransactionId') || 'N/A'}
                </p>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Payment Notes</label>
                <p className="text-gray-900 dark:text-white">
                  {getValue(payment, 'notes') || getValue(payment, 'description') || 'No notes available'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-end space-x-4">
        <Button variant="outline" onClick={() => navigate('/payments')}>
          Back to Payments
        </Button>
      </div>
    </div>
  );
}
