"use client"

import { useDataSource } from "@/hooks/use-data-source"

import { Badge } from "@/components/ui/badge"

import { useState } from "react"
import {
  User,
  Bell,
  Shield,
  Palette,
  Globe,
  Database,
  Mail,
  Phone,
  Camera,
  Save,
  Eye,
  EyeOff,
  Download,
  Upload,
  Trash2,
  RefreshCw,
  Monitor,
  Moon,
  Sun,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import DashboardLayout from "@/components/dashboard-layout"
import { useUser } from "@clerk/nextjs"
import { apiAdapter } from "@/lib/api-adapter"
import { useEffect } from "react"
import { toast } from "@/hooks/use-toast"

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("profile")
  const [showPassword, setShowPassword] = useState(false)
  const { dataMode, setDataMode, isConnected, checkingConnection, retryConnection } = useDataSource();
  const { user } = useUser()
  const [profile, setProfile] = useState({
    phone: "",
    dateOfBirth: "",
    gender: "Unspecified",
    address: "",
    bloodGroup: "",
    emergencyContactName: "",
    emergencyContactPhone: "",
    emergencyContactRelationship: "",
  })
  const [notifications, setNotifications] = useState({
    appointments: true,
    reminders: true,
    updates: false,
    marketing: false,
  })
  const [theme, setTheme] = useState("system")
  const [language, setLanguage] = useState("en")
  const [timezone, setTimezone] = useState("UTC-5")

  useEffect(() => {
    if (dataMode === "live") {
      apiAdapter.getProfile().then((res: any) => {
        if (res) {
          setProfile({
            phone: res.phone || "",
            dateOfBirth: res.dateOfBirth ? res.dateOfBirth.split("T")[0] : "",
            gender: res.gender || "Unspecified",
            address: res.address || "",
            bloodGroup: res.bloodGroup || "",
            emergencyContactName: res.emergencyContactName || "",
            emergencyContactPhone: res.emergencyContactPhone || "",
            emergencyContactRelationship: res.emergencyContactRelationship || "",
          })
          if (res.notificationPrefs) {
            setNotifications(res.notificationPrefs)
          }
        }
      }).catch(console.error)
    } else {
      const stored = localStorage.getItem("astra_onboarding_data")
      if (stored) {
        const data = JSON.parse(stored)
        setProfile({
          phone: data.phone || "",
          dateOfBirth: data.dateOfBirth || "",
          gender: data.gender || "Unspecified",
          address: data.address || "",
          bloodGroup: data.bloodGroup || "",
          emergencyContactName: data.emergencyContactName || "",
          emergencyContactPhone: data.emergencyContactPhone || "",
          emergencyContactRelationship: data.emergencyContactRelationship || "",
        })
      }
    }
  }, [dataMode, user])

  const handleSaveProfile = async () => {
    try {
      if (dataMode === "live") {
        await apiAdapter.updateProfile({
          ...profile,
          notificationPrefs: notifications,
        })
      } else {
        localStorage.setItem("astra_onboarding_data", JSON.stringify({
          ...profile,
          ...notifications,
          onboardingComplete: true,
        }))
      }
      toast({
        title: "Settings Saved",
        description: "Your profile preferences have been updated.",
      })
    } catch (e) {
      console.error(e)
      toast({
        title: "Save Failed",
        description: "Could not update settings.",
        variant: "destructive",
      })
    }
  }

  return (
    <DashboardLayout>
      <div className="p-6">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Settings</h1>
          <p className="text-gray-600">Manage your account settings and dashboard preferences.</p>
        </div>

        {/* Settings Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="bg-white/60 backdrop-blur-sm border-white/20">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="appearance">Appearance</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
            <TabsTrigger value="preferences">Preferences</TabsTrigger>
            <TabsTrigger value="data">Data & Privacy</TabsTrigger>
          </TabsList>

          {/* Profile Settings */}
          <TabsContent value="profile" className="space-y-6">
            <Card className="bg-white/60 backdrop-blur-sm border-white/20 shadow-sm rounded-2xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5 text-blue-600" />
                  Profile Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center gap-6">
                  <div className="relative">
                    <Avatar className="w-20 h-20 shadow">
                      <AvatarImage src={user?.imageUrl || "/patient-arindam.png"} />
                      <AvatarFallback>{user?.firstName?.[0] || "U"}</AvatarFallback>
                    </Avatar>
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-xl font-bold text-slate-800">
                      {user?.firstName} {user?.lastName}
                    </h3>
                    <p className="text-slate-500 text-sm">Patient Profile Account</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input id="firstName" value={user?.firstName || ""} disabled className="bg-slate-50 border-slate-200" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input id="lastName" value={user?.lastName || ""} disabled className="bg-slate-50 border-slate-200" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input id="email" type="email" value={user?.emailAddresses?.[0]?.emailAddress || ""} disabled className="bg-slate-50 border-slate-200" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={profile.phone}
                      onChange={(e) => setProfile((p) => ({ ...p, phone: e.target.value }))}
                      className="bg-white/50 border-slate-200"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="dateOfBirth">Date of Birth</Label>
                    <Input
                      id="dateOfBirth"
                      type="date"
                      value={profile.dateOfBirth}
                      onChange={(e) => setProfile((p) => ({ ...p, dateOfBirth: e.target.value }))}
                      className="bg-white/50 border-slate-200"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="gender">Gender</Label>
                    <Select
                      value={profile.gender}
                      onValueChange={(val) => setProfile((p) => ({ ...p, gender: val }))}
                    >
                      <SelectTrigger className="bg-white/50 border-slate-200">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Male">Male</SelectItem>
                        <SelectItem value="Female">Female</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                        <SelectItem value="Unspecified">Prefer not to say</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="bloodGroup">Blood Group</Label>
                    <Select
                      value={profile.bloodGroup}
                      onValueChange={(val) => setProfile((p) => ({ ...p, bloodGroup: val }))}
                    >
                      <SelectTrigger className="bg-white/50 border-slate-200">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="A+">A+</SelectItem>
                        <SelectItem value="A-">A-</SelectItem>
                        <SelectItem value="B+">B+</SelectItem>
                        <SelectItem value="B-">B-</SelectItem>
                        <SelectItem value="AB+">AB+</SelectItem>
                        <SelectItem value="AB-">AB-</SelectItem>
                        <SelectItem value="O+">O+</SelectItem>
                        <SelectItem value="O-">O-</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="ecName">Emergency Contact Name</Label>
                    <Input
                      id="ecName"
                      value={profile.emergencyContactName}
                      onChange={(e) => setProfile((p) => ({ ...p, emergencyContactName: e.target.value }))}
                      className="bg-white/50 border-slate-200"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="ecPhone">Emergency Contact Phone</Label>
                    <Input
                      id="ecPhone"
                      value={profile.emergencyContactPhone}
                      onChange={(e) => setProfile((p) => ({ ...p, emergencyContactPhone: e.target.value }))}
                      className="bg-white/50 border-slate-200"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="ecRel">Emergency Contact Relationship</Label>
                    <Input
                      id="ecRel"
                      value={profile.emergencyContactRelationship}
                      onChange={(e) => setProfile((p) => ({ ...p, emergencyContactRelationship: e.target.value }))}
                      className="bg-white/50 border-slate-200"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">Residential Address</Label>
                  <Textarea
                    id="address"
                    value={profile.address}
                    onChange={(e) => setProfile((p) => ({ ...p, address: e.target.value }))}
                    className="bg-white/50 border-slate-200 min-h-[80px]"
                  />
                </div>

                <div className="flex justify-end pt-2">
                  <Button onClick={handleSaveProfile} className="bg-slate-800 hover:bg-slate-700 text-white rounded-xl shadow">
                    <Save className="w-4 h-4 mr-2" />
                    Save Profile Changes
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Notifications Settings */}
          <TabsContent value="notifications" className="space-y-6">
            <Card className="bg-white/60 backdrop-blur-sm border-white/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="w-5 h-5" />
                  Notification Preferences
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label className="text-base font-medium">Appointment Notifications</Label>
                      <p className="text-sm text-gray-600">Get notified about upcoming appointments</p>
                    </div>
                    <Switch
                      checked={notifications.appointments}
                      onCheckedChange={(checked) => setNotifications({ ...notifications, appointments: checked })}
                    />
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label className="text-base font-medium">Medication Reminders</Label>
                      <p className="text-sm text-gray-600">Reminders for patient medications</p>
                    </div>
                    <Switch
                      checked={notifications.reminders}
                      onCheckedChange={(checked) => setNotifications({ ...notifications, reminders: checked })}
                    />
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label className="text-base font-medium">System Updates</Label>
                      <p className="text-sm text-gray-600">Updates about new features and improvements</p>
                    </div>
                    <Switch
                      checked={notifications.updates}
                      onCheckedChange={(checked) => setNotifications({ ...notifications, updates: checked })}
                    />
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label className="text-base font-medium">Marketing Communications</Label>
                      <p className="text-sm text-gray-600">Promotional emails and newsletters</p>
                    </div>
                    <Switch
                      checked={notifications.marketing}
                      onCheckedChange={(checked) => setNotifications({ ...notifications, marketing: checked })}
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-medium">Notification Methods</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card className="bg-white/30 border-white/20">
                      <CardContent className="p-4 text-center">
                        <Mail className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                        <p className="font-medium">Email</p>
                        <Switch className="mt-2" defaultChecked />
                      </CardContent>
                    </Card>
                    <Card className="bg-white/30 border-white/20">
                      <CardContent className="p-4 text-center">
                        <Phone className="w-8 h-8 text-green-500 mx-auto mb-2" />
                        <p className="font-medium">SMS</p>
                        <Switch className="mt-2" />
                      </CardContent>
                    </Card>
                    <Card className="bg-white/30 border-white/20">
                      <CardContent className="p-4 text-center">
                        <Bell className="w-8 h-8 text-purple-500 mx-auto mb-2" />
                        <p className="font-medium">Push</p>
                        <Switch className="mt-2" defaultChecked />
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Appearance Settings */}
          <TabsContent value="appearance" className="space-y-6">
            <Card className="bg-white/60 backdrop-blur-sm border-white/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Palette className="w-5 h-5" />
                  Appearance & Theme
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <Label className="text-base font-medium">Theme Preference</Label>
                    <p className="text-sm text-gray-600 mb-3">Choose your preferred theme</p>
                    <div className="grid grid-cols-3 gap-4">
                      <Card
                        className={`cursor-pointer transition-colors ${
                          theme === "light" ? "ring-2 ring-blue-500 bg-white/70" : "bg-white/30"
                        }`}
                        onClick={() => setTheme("light")}
                      >
                        <CardContent className="p-4 text-center">
                          <Sun className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
                          <p className="font-medium">Light</p>
                        </CardContent>
                      </Card>
                      <Card
                        className={`cursor-pointer transition-colors ${
                          theme === "dark" ? "ring-2 ring-blue-500 bg-white/70" : "bg-white/30"
                        }`}
                        onClick={() => setTheme("dark")}
                      >
                        <CardContent className="p-4 text-center">
                          <Moon className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                          <p className="font-medium">Dark</p>
                        </CardContent>
                      </Card>
                      <Card
                        className={`cursor-pointer transition-colors ${
                          theme === "system" ? "ring-2 ring-blue-500 bg-white/70" : "bg-white/30"
                        }`}
                        onClick={() => setTheme("system")}
                      >
                        <CardContent className="p-4 text-center">
                          <Monitor className="w-8 h-8 text-gray-500 mx-auto mb-2" />
                          <p className="font-medium">System</p>
                        </CardContent>
                      </Card>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <div>
                      <Label className="text-base font-medium">Dashboard Layout</Label>
                      <p className="text-sm text-gray-600">Customize your dashboard layout</p>
                    </div>
                    <div className="flex items-center justify-between">
                      <Label>Compact Mode</Label>
                      <Switch />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label>Show Sidebar Labels</Label>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label>Enable Animations</Label>
                      <Switch defaultChecked />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Security Settings */}
          <TabsContent value="security" className="space-y-6">
            <Card className="bg-white/60 backdrop-blur-sm border-white/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  Security & Privacy
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <Label className="text-base font-medium">Change Password</Label>
                    <p className="text-sm text-gray-600 mb-3">Update your account password</p>
                    <div className="space-y-3">
                      <div className="space-y-2">
                        <Label htmlFor="currentPassword">Current Password</Label>
                        <div className="relative">
                          <Input
                            id="currentPassword"
                            type={showPassword ? "text" : "password"}
                            className="bg-white/50 pr-10"
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-0 top-0 h-full px-3"
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </Button>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="newPassword">New Password</Label>
                        <Input id="newPassword" type="password" className="bg-white/50" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="confirmPassword">Confirm New Password</Label>
                        <Input id="confirmPassword" type="password" className="bg-white/50" />
                      </div>
                      <Button className="bg-slate-800 hover:bg-slate-700">Update Password</Button>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <div>
                      <Label className="text-base font-medium">Two-Factor Authentication</Label>
                      <p className="text-sm text-gray-600">Add an extra layer of security to your account</p>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">SMS Authentication</p>
                        <p className="text-sm text-gray-600">Receive codes via SMS</p>
                      </div>
                      <Switch />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Authenticator App</p>
                        <p className="text-sm text-gray-600">Use an authenticator app</p>
                      </div>
                      <Switch />
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <div>
                      <Label className="text-base font-medium">Login Sessions</Label>
                      <p className="text-sm text-gray-600">Manage your active sessions</p>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 bg-white/30 rounded-lg">
                        <div>
                          <p className="font-medium">Current Session</p>
                          <p className="text-sm text-gray-600">Chrome on Windows • New York, NY</p>
                        </div>
                        <Badge className="bg-green-100 text-green-800">Active</Badge>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-white/30 rounded-lg">
                        <div>
                          <p className="font-medium">Mobile App</p>
                          <p className="text-sm text-gray-600">iPhone • Last active 2 hours ago</p>
                        </div>
                        <Button size="sm" variant="outline" className="bg-white/50">
                          Revoke
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Preferences Settings */}
          <TabsContent value="preferences" className="space-y-6">
            <Card className="bg-white/60 backdrop-blur-sm border-white/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="w-5 h-5" />
                  Preferences
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="language">Language</Label>
                    <Select value={language} onValueChange={setLanguage}>
                      <SelectTrigger className="bg-white/50">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="en">English</SelectItem>
                        <SelectItem value="es">Spanish</SelectItem>
                        <SelectItem value="fr">French</SelectItem>
                        <SelectItem value="de">German</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="timezone">Timezone</Label>
                    <Select value={timezone} onValueChange={setTimezone}>
                      <SelectTrigger className="bg-white/50">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="UTC-8">Pacific Time (UTC-8)</SelectItem>
                        <SelectItem value="UTC-7">Mountain Time (UTC-7)</SelectItem>
                        <SelectItem value="UTC-6">Central Time (UTC-6)</SelectItem>
                        <SelectItem value="UTC-5">Eastern Time (UTC-5)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="dateFormat">Date Format</Label>
                    <Select defaultValue="mm/dd/yyyy">
                      <SelectTrigger className="bg-white/50">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="mm/dd/yyyy">MM/DD/YYYY</SelectItem>
                        <SelectItem value="dd/mm/yyyy">DD/MM/YYYY</SelectItem>
                        <SelectItem value="yyyy-mm-dd">YYYY-MM-DD</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="timeFormat">Time Format</Label>
                    <Select defaultValue="12h">
                      <SelectTrigger className="bg-white/50">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="12h">12 Hour</SelectItem>
                        <SelectItem value="24h">24 Hour</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <div>
                    <Label className="text-base font-medium">Dashboard Preferences</Label>
                    <p className="text-sm text-gray-600">Customize your dashboard experience</p>
                  </div>
                  <div className="flex items-center justify-between">
                    <Label>Auto-refresh data</Label>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label>Show patient photos</Label>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label>Enable sound notifications</Label>
                    <Switch />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Data & Privacy Settings */}
          <TabsContent value="data" className="space-y-6">
            <Card className="bg-white/60 backdrop-blur-sm border-white/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="w-5 h-5" />
                  Data & Privacy
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <Label className="text-base font-medium">Data Export</Label>
                    <p className="text-sm text-gray-600 mb-3">Download your data and patient records</p>
                    <Button variant="outline" className="bg-white/50">
                      <Download className="w-4 h-4 mr-2" />
                      Export Data
                    </Button>
                  </div>

                  <Separator />

                  <div>
                    <Label className="text-base font-medium">Data Retention</Label>
                    <p className="text-sm text-gray-600 mb-3">Manage how long your data is stored</p>
                    <Select defaultValue="5years">
                      <SelectTrigger className="bg-white/50 w-full md:w-64">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1year">1 Year</SelectItem>
                        <SelectItem value="3years">3 Years</SelectItem>
                        <SelectItem value="5years">5 Years</SelectItem>
                        <SelectItem value="indefinite">Indefinite</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Separator />

                  <div>
                    <Label className="text-base font-medium">Privacy Settings</Label>
                    <p className="text-sm text-gray-600 mb-3">Control your privacy preferences</p>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <Label>Allow analytics tracking</Label>
                        <Switch />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label>Share usage data</Label>
                        <Switch />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label>Enable crash reporting</Label>
                        <Switch defaultChecked />
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <Label className="text-base font-medium">Developer & Data Source Connection</Label>
                    <p className="text-sm text-gray-600 mb-3">Toggle between Local Demo Data and Live NestJS Server fetching.</p>
                    <div className="space-y-4 mb-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <Label className="font-semibold">Live Database Server Mode</Label>
                          <p className="text-xs text-gray-500 max-w-sm mt-0.5">
                            {dataMode === 'live'
                              ? 'Connected to local database via NestJS backend.'
                              : 'Running in offline simulation mode. Local database requests are simulated.'}
                          </p>
                        </div>
                        <div className="flex items-center gap-3">
                          {checkingConnection && <span className="text-xs text-slate-400">Verifying...</span>}
                          <Switch
                            checked={dataMode === 'live'}
                            onCheckedChange={(checked) => setDataMode(checked ? 'live' : 'dummy')}
                            disabled={checkingConnection}
                          />
                        </div>
                      </div>

                      <div className="flex items-center justify-between bg-slate-50/50 p-3.5 rounded-xl border border-slate-200/50">
                        <div>
                          <Label className="text-xs font-bold text-slate-700">CONNECTION STATUS</Label>
                          <div className="flex items-center gap-1.5 mt-1">
                            <span className={`h-2.5 w-2.5 rounded-full ${isConnected ? 'bg-emerald-500' : 'bg-red-500'}`} />
                            <span className="text-sm font-semibold text-slate-600">
                              {isConnected ? 'NestJS Server Online' : 'NestJS Server Offline'}
                            </span>
                          </div>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={retryConnection}
                          disabled={checkingConnection}
                          className="bg-white hover:bg-slate-50 transition-all duration-200"
                        >
                          <RefreshCw className={`w-3.5 h-3.5 mr-1.5 ${checkingConnection ? 'animate-spin' : ''}`} />
                          Retry Health Check
                        </Button>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <Label className="text-base font-medium text-red-600">Danger Zone</Label>
                    <p className="text-sm text-gray-600 mb-3">Irreversible actions</p>
                    <div className="space-y-3">
                      <Button variant="outline" className="border-red-200 text-red-600 hover:bg-red-50 bg-transparent">
                        <RefreshCw className="w-4 h-4 mr-2" />
                        Reset All Settings
                      </Button>
                      <Button variant="outline" className="border-red-200 text-red-600 hover:bg-red-50 bg-transparent">
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete Account
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
