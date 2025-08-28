import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useForm, FormProvider } from "react-hook-form";
import { CustomInput, CustomTextArea } from "@/components/form";
import { useTheme } from "@/hooks/useTheme";
import {
  User,
  Bell,
  Shield,
  CreditCard,
  HelpCircle,
  Moon,
  Sun,
  Camera,
  Save,
  LogOut,
} from "lucide-react";
import { signOut } from "@/utils/auth";

const tabs = [
  { id: "profile", name: "Profile", icon: User },
  { id: "notifications", name: "Notifications", icon: Bell },
  { id: "security", name: "Security", icon: Shield },
  { id: "billing", name: "Billing", icon: CreditCard },
  { id: "help", name: "Help", icon: HelpCircle },
];

export function Settings() {
  // const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState("profile");
  const { theme, toggleTheme } = useTheme();

  const methods = useForm({
    defaultValues: {
      firstName: "John",
      lastName: "Doe",
      email: "john.doe@example.com",
      phone: "+1 (555) 123-4567",
      company: "Property Rentals Inc.",
      bio: "Experienced property owner managing residential and commercial properties.",
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });
  const { handleSubmit } = methods;

  const handleSave = (data: Record<string, unknown>) => {
    console.log("Saving settings:", data);
    alert("Settings saved successfully!");
  };

  const handleLogout = () => {
    signOut();
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "profile":
        return (
          <FormProvider {...methods}>
            <form className="space-y-6" onSubmit={handleSubmit(handleSave)}>
              {/* Profile Picture */}
              <Card className="border border-gray-200 dark:border-gray-700 shadow-sm bg-white dark:bg-gray-800">
                <CardHeader>
                  <CardTitle className="text-lg">Profile Picture</CardTitle>
                  <CardDescription>
                    Update your profile picture and personal information
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center">
                      <span className="text-white text-2xl font-medium">
                        JD
                      </span>
                    </div>
                    <div>
                      {/* Example: CustomImageUpload for profile photo (not wired up) */}
                      {/* <CustomImageUpload name="profilePhoto" /> */}
                      <Button variant="outline" className="mb-2">
                        <Camera className="h-4 w-4 mr-2" />
                        Change Photo
                      </Button>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        JPG, PNG or GIF. Max size 2MB.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Personal Information */}
              <Card className="border border-gray-200 dark:border-gray-700 shadow-sm bg-white dark:bg-gray-800">
                <CardHeader>
                  <CardTitle className="text-lg">
                    Personal Information
                  </CardTitle>
                  <CardDescription>
                    Update your personal details
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-gray-100">
                        First Name
                      </label>
                      <CustomInput
                        name="firstName"
                        placeHolder="Enter first name"
                        type="text"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-gray-100">
                        Last Name
                      </label>
                      <CustomInput
                        name="lastName"
                        placeHolder="Enter last name"
                        type="text"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-gray-100">
                      Email
                    </label>
                    <CustomInput
                      name="email"
                      type="email"
                      placeHolder="Enter email address"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-gray-100">
                      Phone Number
                    </label>
                    <CustomInput
                      name="phone"
                      placeHolder="Enter phone number"
                      type="text"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-gray-100">
                      Company
                    </label>
                    <CustomInput
                      name="company"
                      placeHolder="Enter company name"
                      type="text"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-gray-100">
                      Bio
                    </label>
                    <CustomTextArea
                      name="bio"
                      placeHolder="Tell us about yourself..."
                      rows={4}
                    />
                  </div>
                </CardContent>
              </Card>
              <div className="mt-6 flex justify-end">
                <Button type="submit" className="px-6">
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </Button>
              </div>
            </form>
          </FormProvider>
        );

      case "notifications":
        return (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Email Notifications</CardTitle>
                <CardDescription>
                  Configure when and how you receive email notifications
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  {
                    label: "New booking requests",
                    description: "Get notified when tenants request bookings",
                  },
                  {
                    label: "Payment confirmations",
                    description: "Receive confirmations for received payments",
                  },
                  {
                    label: "Property maintenance alerts",
                    description: "Get alerts for maintenance issues",
                  },
                  {
                    label: "Monthly reports",
                    description: "Receive monthly property performance reports",
                  },
                ].map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between py-3 border-b border-gray-200 dark:border-gray-700 last:border-0"
                  >
                    <div>
                      <p className="font-medium text-gray-900 dark:text-gray-100">
                        {item.label}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {item.description}
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        className="sr-only peer"
                        defaultChecked={index < 2}
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Push Notifications</CardTitle>
                <CardDescription>
                  Manage browser and mobile notifications
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  {
                    label: "Desktop notifications",
                    description: "Show notifications on your desktop",
                  },
                  {
                    label: "Mobile push notifications",
                    description: "Send notifications to your mobile device",
                  },
                ].map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between py-3 border-b border-gray-200 dark:border-gray-700 last:border-0"
                  >
                    <div>
                      <p className="font-medium text-gray-900 dark:text-gray-100">
                        {item.label}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {item.description}
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        className="sr-only peer"
                        defaultChecked
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        );

      case "security":
        return (
          <div className="space-y-6">
            <FormProvider {...methods}>
              <form className="space-y-4">
                <Card className="border border-gray-200 dark:border-gray-700 shadow-sm bg-white dark:bg-gray-800">
                  <CardHeader>
                    <CardTitle className="text-lg">Change Password</CardTitle>
                    <CardDescription>
                      Update your password to keep your account secure
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-gray-100">
                        Current Password
                      </label>
                      <CustomInput
                        name="currentPassword"
                        type="password"
                        placeHolder="Enter current password"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-gray-100">
                        New Password
                      </label>
                      <CustomInput
                        name="newPassword"
                        type="password"
                        placeHolder="Enter new password"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-gray-100">
                        Confirm New Password
                      </label>
                      <CustomInput
                        name="confirmPassword"
                        type="password"
                        placeHolder="Confirm new password"
                      />
                    </div>
                    <Button className="w-full sm:w-auto" type="submit">
                      Update Password
                    </Button>
                  </CardContent>
                </Card>
              </form>
            </FormProvider>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">
                  Two-Factor Authentication
                </CardTitle>
                <CardDescription>
                  Add an extra layer of security to your account
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900 dark:text-gray-100">
                      Two-factor authentication
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Secure your account with 2FA
                    </p>
                  </div>
                  <Button variant="outline">Enable 2FA</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case "billing":
        return (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Current Plan</CardTitle>
                <CardDescription>
                  Manage your subscription and billing information
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-blue-900 dark:text-blue-100">
                        Professional Plan
                      </h3>
                      <p className="text-sm text-blue-700 dark:text-blue-300">
                        $29/month • Billed monthly
                      </p>
                    </div>
                    <Button variant="outline" size="sm">
                      Change Plan
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Payment Method</CardTitle>
                <CardDescription>
                  Update your payment information
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-6 bg-blue-600 rounded flex items-center justify-center">
                          <span className="text-white text-xs font-bold">
                            VISA
                          </span>
                        </div>
                        <span className="text-gray-900 dark:text-gray-100">
                          •••• •••• •••• 4242
                        </span>
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          Expires 12/25
                        </span>
                      </div>
                      <Button variant="ghost" size="sm">
                        Edit
                      </Button>
                    </div>
                  </div>
                  <Button variant="outline" className="w-full sm:w-auto">
                    <CreditCard className="h-4 w-4 mr-2" />
                    Add Payment Method
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case "help":
        return (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Help & Support</CardTitle>
                <CardDescription>
                  Get help with your account and the platform
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Button
                    variant="outline"
                    className="h-auto p-4 flex flex-col items-start"
                  >
                    <div className="flex items-center mb-2">
                      <HelpCircle className="h-5 w-5 mr-2 text-blue-600" />
                      <span className="font-medium">Help Center</span>
                    </div>
                    <span className="text-sm text-gray-500 dark:text-gray-400 text-left">
                      Browse our help articles and guides
                    </span>
                  </Button>
                  <Button
                    variant="outline"
                    className="h-auto p-4 flex flex-col items-start"
                  >
                    <div className="flex items-center mb-2">
                      <User className="h-5 w-5 mr-2 text-green-600" />
                      <span className="font-medium">Contact Support</span>
                    </div>
                    <span className="text-sm text-gray-500 dark:text-gray-400 text-left">
                      Get in touch with our support team
                    </span>
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">App Information</CardTitle>
                <CardDescription>
                  Version and system information
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500 dark:text-gray-400">
                      App Version
                    </span>
                    <span className="text-gray-900 dark:text-gray-100">
                      1.0.0
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500 dark:text-gray-400">
                      Last Updated
                    </span>
                    <span className="text-gray-900 dark:text-gray-100">
                      July 29, 2025
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500 dark:text-gray-400">
                      Theme
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={toggleTheme}
                      className="h-6 p-0 text-gray-900 dark:text-gray-100"
                    >
                      {theme === "dark" ? (
                        <span className="flex items-center">
                          <Moon className="h-4 w-4 mr-1" />
                          Dark
                        </span>
                      ) : (
                        <span className="flex items-center">
                          <Sun className="h-4 w-4 mr-1" />
                          Light
                        </span>
                      )}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="p-3 sm:p-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100">
          Settings
        </h1>
        <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 mt-2">
          Manage your account settings and preferences
        </p>
      </div>

      <div className="flex flex-col gap-6">
        {/* Mobile Horizontal Tabs */}
        <div className="lg:hidden">
          <div className="flex overflow-x-auto scrollbar-hide gap-2 p-1 bg-gray-100 dark:bg-gray-700 rounded-lg">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex flex-col items-center justify-center px-3 py-2 rounded-lg transition-colors whitespace-nowrap min-w-0 flex-shrink-0 ${
                  activeTab === tab.id
                    ? "bg-white dark:bg-gray-800 text-blue-700 dark:text-blue-300 shadow-sm"
                    : "text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                }`}
              >
                <tab.icon className="h-5 w-5 mb-1 flex-shrink-0" />
                <span className="text-xs font-medium">{tab.name}</span>
              </button>
            ))}

            {/* Mobile Logout Button */}
            <button
              onClick={handleLogout}
              className="flex flex-col items-center justify-center px-3 py-2 rounded-lg transition-colors whitespace-nowrap min-w-0 flex-shrink-0 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/20"
            >
              <LogOut className="h-5 w-5 mb-1 flex-shrink-0" />
              <span className="text-xs font-medium">Sign Out</span>
            </button>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Desktop Sidebar Navigation */}
          <div className="hidden lg:block lg:w-64 flex-shrink-0">
            <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
              <CardContent className="p-3">
                <nav className="space-y-1">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                        activeTab === tab.id
                          ? "bg-blue-50 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 border-r-2 border-blue-600"
                          : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-gray-100"
                      }`}
                    >
                      <tab.icon className="h-4 w-4 mr-3 flex-shrink-0" />
                      <span className="text-left">{tab.name}</span>
                    </button>
                  ))}

                  {/* Logout Button */}
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 mt-4 border-t border-gray-200 dark:border-gray-700 pt-4"
                  >
                    <LogOut className="h-4 w-4 mr-3 flex-shrink-0" />
                    <span className="text-left">Sign Out</span>
                  </button>
                </nav>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="flex-1 min-w-0">
            {renderTabContent()}

            {/* Save Button handled inside the form for profile tab */}
          </div>
        </div>
      </div>
    </div>
  );
}
