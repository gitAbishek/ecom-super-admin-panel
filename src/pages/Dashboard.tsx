import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Building2,
  Users,
  DollarSign,
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
  Plus,
  Eye,
  Edit,
  MoreVertical
} from 'lucide-react'
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell
} from 'recharts'

const stats = [
  {
    title: 'Total Properties',
    value: '24',
    change: '+12%',
    trend: 'up',
    icon: Building2,
    description: 'from last month'
  },
  {
    title: 'Active Tenants',
    value: '189',
    change: '+5%',
    trend: 'up',
    icon: Users,
    description: 'from last month'
  },
  {
    title: 'Monthly Revenue',
    value: '$45,720',
    change: '+8%',
    trend: 'up',
    icon: DollarSign,
    description: 'from last month'
  },
  {
    title: 'Pending Bookings',
    value: '12',
    change: '-3%',
    trend: 'down',
    icon: Calendar,
    description: 'from last month'
  }
]

const revenueData = [
  { month: 'Jan', revenue: 35000 },
  { month: 'Feb', revenue: 42000 },
  { month: 'Mar', revenue: 38000 },
  { month: 'Apr', revenue: 48000 },
  { month: 'May', revenue: 52000 },
  { month: 'Jun', revenue: 45720 }
]

const propertyTypeData = [
  { name: 'Apartments', value: 45, color: '#3b82f6' },
  { name: 'Houses', value: 30, color: '#10b981' },
  { name: 'Studios', value: 15, color: '#f59e0b' },
  { name: 'Condos', value: 10, color: '#ef4444' }
]

const recentProperties = [
  {
    id: 1,
    name: 'Modern Downtown Apartment',
    location: 'Downtown, NYC',
    price: '$2,800/month',
    status: 'Available',
    image: '/api/placeholder/80/60'
  },
  {
    id: 2,
    name: 'Cozy Studio Near University',
    location: 'University District',
    price: '$1,200/month',
    status: 'Occupied',
    image: '/api/placeholder/80/60'
  },
  {
    id: 3,
    name: 'Luxury Family House',
    location: 'Suburbs, NYC',
    price: '$4,500/month',
    status: 'Available',
    image: '/api/placeholder/80/60'
  }
]

export function Dashboard() {
  return (
    <div className="p-3 sm:p-6 space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100">Dashboard</h1>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300">Welcome back! Here's what's happening with your properties.</p>
        </div>
        <Button className="w-full sm:w-auto py-2.5 sm:py-2">
          <Plus className="h-4 w-4 mr-2" />
          <span className="text-sm sm:text-base">Add Property</span>
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <Card key={stat.title} className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-300">
                {stat.title}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-gray-400 dark:text-gray-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">{stat.value}</div>
              <div className="flex items-center text-xs text-gray-600 dark:text-gray-300">
                {stat.trend === 'up' ? (
                  <ArrowUpRight className="h-3 w-3 text-green-500 mr-1" />
                ) : (
                  <ArrowDownRight className="h-3 w-3 text-red-500 mr-1" />
                )}
                <span className={stat.trend === 'up' ? 'text-green-500' : 'text-red-500'}>
                  {stat.change}
                </span>
                <span className="ml-1">{stat.description}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="text-gray-900 dark:text-gray-100">Revenue Overview</CardTitle>
            <CardDescription className="text-gray-600 dark:text-gray-300">Monthly revenue for the last 6 months</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="month" stroke="#6b7280" />
                  <YAxis stroke="#6b7280" />
                  <Tooltip 
                    formatter={(value) => [`$${value.toLocaleString()}`, 'Revenue']}
                    contentStyle={{ backgroundColor: 'white', border: '1px solid #e5e7eb' }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="revenue" 
                    stroke="#3b82f6" 
                    strokeWidth={2}
                    dot={{ fill: '#3b82f6' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Property Types */}
        <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="text-gray-900 dark:text-gray-100">Property Types</CardTitle>
            <CardDescription className="text-gray-600 dark:text-gray-300">Distribution of property types in your portfolio</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={propertyTypeData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {propertyTypeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value) => [`${value}%`, 'Percentage']}
                    contentStyle={{ backgroundColor: 'white', border: '1px solid #e5e7eb' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-2 gap-4 mt-4">
              {propertyTypeData.map((item) => (
                <div key={item.name} className="flex items-center space-x-2">
                  <div 
                    className="w-3 h-3 rounded" 
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">{item.name}</span>
                  <span className="text-sm text-gray-500 dark:text-gray-400">({item.value}%)</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Properties */}
      <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg sm:text-xl text-gray-900 dark:text-gray-100">Recent Properties</CardTitle>
          <CardDescription className="text-sm text-gray-600 dark:text-gray-300">Your latest property listings and their status</CardDescription>
        </CardHeader>
        <CardContent className="px-4 sm:px-6">
          <div className="space-y-3 sm:space-y-4">
            {recentProperties.map((property) => (
              <div key={property.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-3 sm:p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors gap-3 sm:gap-4">
                <div className="flex items-center space-x-3 sm:space-x-4 flex-1 min-w-0">
                  <div className="w-12 h-10 sm:w-16 sm:h-12 bg-gray-100 dark:bg-gray-700 rounded-md flex items-center justify-center flex-shrink-0">
                    <Building2 className="h-4 w-4 sm:h-6 sm:w-6 text-gray-400 dark:text-gray-500" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-medium text-sm sm:text-base text-gray-900 dark:text-gray-100 truncate">{property.name}</h3>
                    <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 truncate">{property.location}</p>
                  </div>
                </div>
                
                {/* Mobile: stacked layout, Desktop: horizontal layout */}
                <div className="flex items-center justify-between sm:justify-end gap-3 sm:gap-4">
                  <div className="text-left sm:text-right">
                    <p className="font-medium text-sm sm:text-base text-gray-900 dark:text-gray-100">{property.price}</p>
                    <span className={`inline-block text-xs px-2 py-1 rounded-full mt-1 sm:mt-0 ${
                      property.status === 'Available' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      {property.status}
                    </span>
                  </div>
                  
                  {/* Actions - More compact on mobile */}
                  <div className="flex items-center gap-1 sm:gap-2">
                    <Button variant="ghost" size="icon" className="h-8 w-8 sm:h-9 sm:w-9 hover:bg-gray-100 dark:hover:bg-gray-600">
                      <Eye className="h-3 w-3 sm:h-4 sm:w-4 text-gray-600 dark:text-gray-300" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 sm:h-9 sm:w-9 hover:bg-gray-100 dark:hover:bg-gray-600">
                      <Edit className="h-3 w-3 sm:h-4 sm:w-4 text-gray-600 dark:text-gray-300" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 sm:h-9 sm:w-9 hover:bg-gray-100 dark:hover:bg-gray-600">
                      <MoreVertical className="h-3 w-3 sm:h-4 sm:w-4 text-gray-600 dark:text-gray-300" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
