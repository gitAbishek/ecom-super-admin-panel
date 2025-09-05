import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Building2, Edit, Users, Mail, Globe, Calendar } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import CustomLoader from "@/components/loader/CustomLoader";
import CustomBackHeader from "@/components/common/CustomBackHeader";
import { useGetSingleTenantDetails } from "@/hooks/tenant.hook";
import type { Tenant } from "@/types/tenant";

const ViewTenant = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [tenant, setTenant] = useState<Tenant | null>(null);

  const { data: tenantData, isLoading } = useGetSingleTenantDetails(id || "");

  useEffect(() => {
    if (tenantData?.tenant && id) {
      setTenant(tenantData.tenant);
    }
  }, [tenantData, id]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'inactive':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
      case 'suspended':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (isLoading) {
    return <CustomLoader text="Loading tenant details..." />;
  }

  if (!tenant) {
    return (
      <div className="p-6 space-y-6 max-w-4xl mx-auto">
        <CustomBackHeader
          title="Tenant Details"
          description="View detailed information about this tenant"
          onBack={() => navigate('/tenants')}
        />
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <Building2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
              Tenant Not Found
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-4">
              The tenant you're looking for doesn't exist.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 max-w-4xl mx-auto">
      <CustomBackHeader
        title="Tenant Details"
        description="View detailed information about this tenant"
        onBack={() => navigate('/tenants')}
        editButton={{
          onEdit: () => navigate(`/tenants/edit/${id}`),
          text: "Edit Tenant",
          icon: <Edit className="h-4 w-4" />
        }}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Basic Information */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Building2 className="h-5 w-5" />
                  <span>Basic Information</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      Tenant Name
                    </label>
                    <p className="text-gray-900 dark:text-gray-100 font-medium">
                      {tenant.name}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      Email
                    </label>
                    <div className="flex items-center space-x-2">
                      <Mail className="h-4 w-4 text-gray-400" />
                      <p className="text-gray-900 dark:text-gray-100">
                        {tenant.email}
                      </p>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      Domain
                    </label>
                    <div className="flex items-center space-x-2">
                      <Globe className="h-4 w-4 text-gray-400" />
                      <p className="text-gray-900 dark:text-gray-100">
                        {tenant.domain}
                      </p>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      Status
                    </label>
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(tenant.status)}`}>
                        {tenant.status.charAt(0).toUpperCase() + tenant.status.slice(1)}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Business Information */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Users className="h-5 w-5" />
                  <span>Business Information</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      Industry
                    </label>
                    <p className="text-gray-900 dark:text-gray-100 font-medium">
                      {tenant.metafield.industry}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      Number of Employees
                    </label>
                    <p className="text-gray-900 dark:text-gray-100 font-medium">
                      {tenant.metafield.employees}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Status Management */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Status Management</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2 block">
                    Current Status
                  </label>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(tenant.status)}`}>
                    {tenant.status.charAt(0).toUpperCase() + tenant.status.slice(1)}
                  </span>
                </div>
                
                                <div className="pt-4 border-t">
                  <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
                    <Calendar className="h-4 w-4" />
                    <span>Created: {formatDate(tenant.createdAt)}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400 mt-1">
                    <Calendar className="h-4 w-4" />
                    <span>Updated: {formatDate(tenant.updatedAt)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
};

export default ViewTenant;
