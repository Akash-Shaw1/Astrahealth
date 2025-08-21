"use client"

import { useState, useEffect } from "react"
import { Calendar, MapPin, Users, Phone, Mail, Filter, Search, Plus, Edit, Trash2, MoreHorizontal } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { toast } from "@/hooks/use-toast"
import DashboardLayout from "@/components/dashboard-layout"
import { type HealthCampaign, initialHealthCampaigns, STORAGE_KEYS, loadFromStorage, saveToStorage } from "@/lib/data"

// Type labels for campaign types
const typeLabels = {
  IMD: "Immunisation Drive",
  FHC: "Full Health Checkup",
  MHC: "Mental Health Camp",
  BDC: "Blood Donation Camp",
  WPC: "Wellness Program",
}

// Type colors for visual distinction
const typeColors = {
  IMD: "bg-green-100 text-green-800 border-green-200",
  FHC: "bg-blue-100 text-blue-800 border-blue-200",
  MHC: "bg-purple-100 text-purple-800 border-purple-200",
  BDC: "bg-red-100 text-red-800 border-red-200",
  WPC: "bg-orange-100 text-orange-800 border-orange-200",
}

export default function HealthCampaignsPage() {
  const [campaigns, setCampaigns] = useState<HealthCampaign[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [filterType, setFilterType] = useState<string>("all")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editingCampaign, setEditingCampaign] = useState<HealthCampaign | null>(null)
  const [formData, setFormData] = useState({
    type: "IMD" as keyof typeof typeLabels,
    title: "",
    description: "",
    organiser: "",
    location: "",
    startDate: "",
    endDate: "",
    capacity: "",
    registrationRequired: true,
    vaccines: "",
    phone: "",
    email: "",
  })

  useEffect(() => {
    const storedCampaigns = loadFromStorage(STORAGE_KEYS.HEALTH_CAMPAIGNS, initialHealthCampaigns)
    setCampaigns(storedCampaigns)
  }, [])

  useEffect(() => {
    if (campaigns.length > 0) {
      saveToStorage(STORAGE_KEYS.HEALTH_CAMPAIGNS, campaigns)
    }
  }, [campaigns])

  // Filter campaigns based on search term and type
  const filteredCampaigns = campaigns.filter((campaign) => {
    const matchesSearch =
      campaign.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      campaign.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      campaign.organiser.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = filterType === "all" || campaign.type === filterType
    return matchesSearch && matchesType
  })

  const handleAddCampaign = () => {
    if (!formData.title || !formData.organiser || !formData.location || !formData.startDate || !formData.endDate) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    const newCampaign: HealthCampaign = {
      id: `HC${String(campaigns.length + 1).padStart(3, "0")}`,
      type: formData.type,
      title: formData.title,
      description: formData.description,
      organiser: formData.organiser,
      location: formData.location,
      startDate: formData.startDate,
      endDate: formData.endDate,
      capacity: formData.capacity ? Number.parseInt(formData.capacity) : undefined,
      registeredUsers: 0,
      registrationRequired: formData.registrationRequired,
      vaccines: formData.vaccines ? formData.vaccines.split(",").map((v) => v.trim()) : undefined,
      contactInfo: {
        phone: formData.phone,
        email: formData.email,
      },
    }

    setCampaigns([...campaigns, newCampaign])
    setIsAddDialogOpen(false)
    resetForm()
    toast({
      title: "Success",
      description: "Campaign added successfully",
    })
  }

  const handleUpdateCampaign = () => {
    if (!editingCampaign || !formData.title || !formData.organiser || !formData.location) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    const updatedCampaign: HealthCampaign = {
      ...editingCampaign,
      type: formData.type,
      title: formData.title,
      description: formData.description,
      organiser: formData.organiser,
      location: formData.location,
      startDate: formData.startDate,
      endDate: formData.endDate,
      capacity: formData.capacity ? Number.parseInt(formData.capacity) : undefined,
      registrationRequired: formData.registrationRequired,
      vaccines: formData.vaccines ? formData.vaccines.split(",").map((v) => v.trim()) : undefined,
      contactInfo: {
        phone: formData.phone,
        email: formData.email,
      },
    }

    setCampaigns(campaigns.map((c) => (c.id === editingCampaign.id ? updatedCampaign : c)))
    setIsEditDialogOpen(false)
    setEditingCampaign(null)
    resetForm()
    toast({
      title: "Success",
      description: "Campaign updated successfully",
    })
  }

  const handleDeleteCampaign = (campaignId: string) => {
    setCampaigns(campaigns.filter((c) => c.id !== campaignId))
    toast({
      title: "Success",
      description: "Campaign deleted successfully",
    })
  }

  const handleEditCampaign = (campaign: HealthCampaign) => {
    setEditingCampaign(campaign)
    setFormData({
      type: campaign.type,
      title: campaign.title,
      description: campaign.description,
      organiser: campaign.organiser,
      location: campaign.location,
      startDate: campaign.startDate,
      endDate: campaign.endDate,
      capacity: campaign.capacity?.toString() || "",
      registrationRequired: campaign.registrationRequired,
      vaccines: campaign.vaccines?.join(", ") || "",
      phone: campaign.contactInfo.phone,
      email: campaign.contactInfo.email,
    })
    setIsEditDialogOpen(true)
  }

  const resetForm = () => {
    setFormData({
      type: "IMD",
      title: "",
      description: "",
      organiser: "",
      location: "",
      startDate: "",
      endDate: "",
      capacity: "",
      registrationRequired: true,
      vaccines: "",
      phone: "",
      email: "",
    })
  }

  // Format date for display
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    })
  }

  // Calculate capacity percentage
  const getCapacityPercentage = (registered: number, capacity?: number) => {
    if (!capacity) return null
    return Math.round((registered / capacity) * 100)
  }

  return (
    <DashboardLayout>
      <div className="p-4 sm:p-6 space-y-6">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Health Campaign Tracker</h1>
            <p className="text-sm sm:text-base text-gray-600 mt-1">
              Monitor and manage health programs, immunization drives, and wellness events
            </p>
          </div>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800">
                <Plus className="w-4 h-4 mr-2" />
                Add Campaign
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Add New Campaign</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="type">Campaign Type *</Label>
                  <Select
                    value={formData.type}
                    onValueChange={(value: keyof typeof typeLabels) => setFormData({ ...formData, type: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(typeLabels).map(([key, label]) => (
                        <SelectItem key={key} value={key}>
                          {label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Campaign title"
                  />
                </div>
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Campaign description"
                  />
                </div>
                <div>
                  <Label htmlFor="organiser">Organiser *</Label>
                  <Input
                    id="organiser"
                    value={formData.organiser}
                    onChange={(e) => setFormData({ ...formData, organiser: e.target.value })}
                    placeholder="Organization name"
                  />
                </div>
                <div>
                  <Label htmlFor="location">Location *</Label>
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    placeholder="Campaign location"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label htmlFor="startDate">Start Date *</Label>
                    <Input
                      id="startDate"
                      type="date"
                      value={formData.startDate}
                      onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="endDate">End Date *</Label>
                    <Input
                      id="endDate"
                      type="date"
                      value={formData.endDate}
                      onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="capacity">Capacity</Label>
                  <Input
                    id="capacity"
                    type="number"
                    value={formData.capacity}
                    onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                    placeholder="Maximum participants"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="Contact phone"
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="Contact email"
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button onClick={handleAddCampaign} className="flex-1">
                    Add Campaign
                  </Button>
                  <Button variant="outline" onClick={() => setIsAddDialogOpen(false)} className="flex-1">
                    Cancel
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="max-w-md max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Edit Campaign</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="edit-type">Campaign Type *</Label>
                <Select
                  value={formData.type}
                  onValueChange={(value: keyof typeof typeLabels) => setFormData({ ...formData, type: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(typeLabels).map(([key, label]) => (
                      <SelectItem key={key} value={key}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="edit-title">Title *</Label>
                <Input
                  id="edit-title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Campaign title"
                />
              </div>
              <div>
                <Label htmlFor="edit-description">Description</Label>
                <Textarea
                  id="edit-description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Campaign description"
                />
              </div>
              <div>
                <Label htmlFor="edit-organiser">Organiser *</Label>
                <Input
                  id="edit-organiser"
                  value={formData.organiser}
                  onChange={(e) => setFormData({ ...formData, organiser: e.target.value })}
                  placeholder="Organization name"
                />
              </div>
              <div>
                <Label htmlFor="edit-location">Location *</Label>
                <Input
                  id="edit-location"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  placeholder="Campaign location"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label htmlFor="edit-startDate">Start Date *</Label>
                  <Input
                    id="edit-startDate"
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="edit-endDate">End Date *</Label>
                  <Input
                    id="edit-endDate"
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <Button onClick={handleUpdateCampaign} className="flex-1">
                  Update Campaign
                </Button>
                <Button variant="outline" onClick={() => setIsEditDialogOpen(false)} className="flex-1">
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Filters and Search */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search campaigns, organizers, or locations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={filterType} onValueChange={setFilterType}>
            <SelectTrigger className="w-full sm:w-48">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="IMD">Immunisation Drive</SelectItem>
              <SelectItem value="FHC">Full Health Checkup</SelectItem>
              <SelectItem value="MHC">Mental Health Camp</SelectItem>
              <SelectItem value="BDC">Blood Donation Camp</SelectItem>
              <SelectItem value="WPC">Wellness Program</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Campaign Statistics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {Object.entries(typeLabels).map(([type, label]) => {
            const count = campaigns.filter((c) => c.type === type).length
            return (
              <Card key={type} className="bg-white/60 backdrop-blur-sm border-white/20">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">{label}</p>
                      <p className="text-2xl font-bold text-gray-900">{count}</p>
                    </div>
                    <Badge className={typeColors[type as keyof typeof typeColors]}>{type}</Badge>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Campaign Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredCampaigns.map((campaign) => {
            const capacityPercentage = getCapacityPercentage(campaign.registeredUsers, campaign.capacity)

            return (
              <Card
                key={campaign.id}
                className="bg-white/80 backdrop-blur-sm border-white/20 hover:shadow-lg transition-shadow"
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge className={typeColors[campaign.type]}>{campaign.type}</Badge>
                        <span className="text-xs text-gray-500">{typeLabels[campaign.type]}</span>
                      </div>
                      <CardTitle className="text-lg font-semibold text-gray-900">{campaign.title}</CardTitle>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem onClick={() => handleEditCampaign(campaign)}>
                          <Edit className="w-4 h-4 mr-2" />
                          Edit Campaign
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDeleteCampaign(campaign.id)} className="text-red-600">
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete Campaign
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  <p className="text-sm text-gray-600 leading-relaxed">{campaign.description}</p>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Calendar className="w-4 h-4" />
                      <span>
                        {formatDate(campaign.startDate)} - {formatDate(campaign.endDate)}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <MapPin className="w-4 h-4" />
                      <span>{campaign.location}</span>
                    </div>

                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Users className="w-4 h-4" />
                      <span>
                        {campaign.registeredUsers} registered
                        {campaign.capacity && ` / ${campaign.capacity} capacity`}
                        {capacityPercentage && (
                          <span
                            className={`ml-2 font-medium ${
                              capacityPercentage >= 90
                                ? "text-red-600"
                                : capacityPercentage >= 70
                                  ? "text-orange-600"
                                  : "text-green-600"
                            }`}
                          >
                            ({capacityPercentage}%)
                          </span>
                        )}
                      </span>
                    </div>
                  </div>

                  {campaign.vaccines && (
                    <div className="flex flex-wrap gap-1">
                      {campaign.vaccines.map((vaccine, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {vaccine}
                        </Badge>
                      ))}
                    </div>
                  )}

                  <div className="pt-3 border-t border-gray-100">
                    <p className="text-sm font-medium text-gray-700 mb-2">Organized by: {campaign.organiser}</p>
                    <div className="flex flex-col sm:flex-row gap-2">
                      <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                        <Phone className="w-3 h-3 mr-1" />
                        {campaign.contactInfo.phone}
                      </Button>
                      <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                        <Mail className="w-3 h-3 mr-1" />
                        Contact
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {filteredCampaigns.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Calendar className="w-12 h-12 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No campaigns found</h3>
            <p className="text-gray-600">
              {searchTerm || filterType !== "all"
                ? "Try adjusting your search or filter criteria"
                : "No health campaigns are currently scheduled"}
            </p>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
