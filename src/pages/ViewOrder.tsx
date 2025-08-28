//
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import CustomBackHeader from '@/components/common/CustomBackHeader';
import CustomLoader from '@/components/loader/CustomLoader';
import CustomEmptyState from '@/components/common/CustomEmptyState';
import { Package } from 'lucide-react';
import { useGetSingleOrderDetails } from '@/hooks/order.hook';
import type { Order } from '@/types/order';

export default function ViewOrder() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data, isLoading, error } = useGetSingleOrderDetails(id!);

  if (isLoading) return <CustomLoader text="Loading order details..." />;
  if (error || !data) return (
    <CustomEmptyState
      icon={<Package className="h-12 w-12 text-gray-400" />}
      title="Order not found"
      description="The order you are looking for does not exist."
    />
  );

  // Support both { order: Order } and Order response
  const order: Order = (data as { order?: Order }).order || (data as Order);

  return (
    <div className="p-6 space-y-6 max-w-4xl mx-auto">
      <CustomBackHeader
        title={`Order #${order.orderId || order.id}`}
        description={`Status: ${order.status}`}
        onBack={() => navigate(-1)}
      />
      <Card>
        <CardContent className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="font-semibold mb-2">Customer</h3>
              <div>{order.shippingAddress?.fullName || 'N/A'}</div>
              <div>{order.shippingAddress?.email || 'N/A'}</div>
              <div>{order.shippingAddress?.phone || 'N/A'}</div>
              <div>{order.shippingAddress?.addressLine1 || 'N/A'}</div>
              <div>{order.shippingAddress?.city || ''} {order.shippingAddress?.postalCode || ''}</div>
              <div>{order.shippingAddress?.country || ''}</div>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Order Info</h3>
              <div><b>Order ID:</b> {order.orderId || order.id}</div>
              <div><b>Status:</b> {order.status}</div>
              <div><b>Payment:</b> {order.paymentStatus} ({order.paymentMethod})</div>
              <div><b>Shipping:</b> {order.shippingStatus} ({order.shippingMethod})</div>
              <div><b>Tracking #:</b> {order.trackingNumber || 'N/A'}</div>
              <div><b>Created:</b> {new Date(order.createdAt).toLocaleString()}</div>
            </div>
          </div>
          <div>
            <h3 className="font-semibold mt-6 mb-2">Items</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm border">
                <thead>
                  <tr className="bg-gray-100 dark:bg-gray-800">
                    <th className="px-4 py-2 text-left">Product</th>
                    <th className="px-4 py-2 text-left">SKU</th>
                    <th className="px-4 py-2 text-left">Attributes</th>
                    <th className="px-4 py-2 text-right">Price</th>
                    <th className="px-4 py-2 text-right">Qty</th>
                    <th className="px-4 py-2 text-right">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {order.items?.map((item) => (
                    <tr key={item._id}>
                      <td className="px-4 py-2">{item.name}</td>
                      <td className="px-4 py-2">{item.sku}</td>
                      <td className="px-4 py-2">
                        {item.attributes && Object.entries(item.attributes).map(([k, v]) => (
                          <span key={k} className="inline-block mr-2 bg-gray-200 dark:bg-gray-700 rounded px-2 py-0.5 text-xs">{k}: {v}</span>
                        ))}
                      </td>
                      <td className="px-4 py-2 text-right">${item.price.toFixed(2)}</td>
                      <td className="px-4 py-2 text-right">{item.quantity}</td>
                      <td className="px-4 py-2 text-right">${(item.price * item.quantity).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div className="flex flex-col md:flex-row md:justify-end gap-4 mt-6">
            <div className="space-y-1">
              <div><b>Subtotal:</b> ${order.subtotal?.toFixed(2) ?? '0.00'}</div>
              <div><b>Tax:</b> ${order.tax?.toFixed(2) ?? '0.00'}</div>
              <div><b>Shipping:</b> ${order.shippingCost?.toFixed(2) ?? '0.00'}</div>
              <div><b>Discount:</b> ${order.discount?.toFixed(2) ?? '0.00'}</div>
              <div className="font-bold text-lg"><b>Total:</b> ${order.total?.toFixed(2) ?? '0.00'}</div>
            </div>
          </div>
          {order.notes && (
            <div className="mt-4">
              <h3 className="font-semibold mb-1">Notes</h3>
              <div className="bg-gray-100 dark:bg-gray-800 rounded p-3 text-sm">{order.notes}</div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
