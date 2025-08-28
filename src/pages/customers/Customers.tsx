import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import CustomHeaders from '@/components/common/CustomHeaders';
import CustomLoader from '@/components/loader/CustomLoader';
import CustomEmptyState from '@/components/common/CustomEmptyState';
import { Eye, Users, Search } from 'lucide-react';
import { useGetAllCustomers } from '@/hooks/payment.hook';
import { getValue } from '@/utils/object';

export default function Customers() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const { data, isLoading, error } = useGetAllCustomers();

  if (isLoading) return <CustomLoader text="Loading customers..." />;
  if (error) return (
    <CustomEmptyState
      icon={<Users className="h-12 w-12 text-gray-400" />}
      title="Error loading customers"
      description="There was an error loading the customer data."
    />
  );

  // Debug logging to understand data structure
  console.log('Customer API Response:', data);

  // Extract customers from the correct API response structure
  const customersData = getValue(data, 'customers') as Record<string, unknown> || {};
  const customersArray = getValue(customersData, 'results') as Record<string, unknown>[] || [];
  
  const filteredCustomers = customersArray.filter((customer: Record<string, unknown>) => {
    const name = getValue(customer, 'name') || `${getValue(customer, 'firstName') || ''} ${getValue(customer, 'lastName') || ''}`.trim() || '';
    const email = getValue(customer, 'email') || '';
    const phone = getValue(customer, 'phone') || getValue(customer, 'phoneNumber') || '';
    
    return (
      name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      phone.includes(searchTerm)
    );
  });

  const formatDate = (dateString: unknown) => {
    if (!dateString) return 'N/A';
    return new Date(dateString as string).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="p-6 space-y-6">
      <CustomHeaders
        title="Customer Management"
        description="Manage and view customer information"
      />

      {/* Search Bar */}
      <Card>
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Search customers by name, email, or phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            />
          </div>
        </CardContent>
      </Card>

      {/* Customer List */}
      <Card>
        <CardContent className="p-0">
          {filteredCustomers.length === 0 ? (
            <CustomEmptyState
              icon={<Users className="h-12 w-12 text-gray-400" />}
              title="No customers found"
              description="No customers match your search criteria."
            />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Customer
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Contact
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Registration Date
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
                  {filteredCustomers.map((customer: any, index: number) => {
                    const customerId = getValue(customer, '_id') || getValue(customer, 'id') || index;
                    const name = getValue(customer, 'name') || 
                                `${getValue(customer, 'firstName') || ''} ${getValue(customer, 'lastName') || ''}`.trim() || 'N/A';
                    const email = getValue(customer, 'email') || 'N/A';
                    const phone = getValue(customer, 'phone') || getValue(customer, 'phoneNumber') || 'N/A';
                    const createdAt = getValue(customer, 'createdAt') || getValue(customer, 'registrationDate');
                    const isActive = getValue(customer, 'isActive') !== false;

                    return (
                      <tr key={customerId} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10">
                              <div className="h-10 w-10 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center">
                                <Users className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                              </div>
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900 dark:text-white">
                                {name}
                              </div>
                              <div className="text-sm text-gray-500 dark:text-gray-400">
                                ID: {customerId}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900 dark:text-white">{email}</div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">{phone}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                          {formatDate(createdAt)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            isActive
                              ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                              : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                          }`}>
                            {isActive ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button
                            onClick={() => navigate(`/customers/view/${customerId}`)}
                            className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 transition-colors duration-200"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
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
