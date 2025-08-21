"use client"

import { useState } from "react"
import {
  Search,
  MapPin,
  Clock,
  DollarSign,
  Star,
  ShoppingCart,
  AlertTriangle,
  Info,
  Filter,
  ScanLine,
  Camera,
  Truck,
  Shield,
  CheckCircle2,
  FileText,
  History,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import DashboardLayout from "@/components/dashboard-layout"
import PrescriptionScanModal from "@/components/prescription-scan-modal"
import PillIdentifierModal from "@/components/pill-identifier-modal"
import MyMedicinesModal from "@/components/my-medicines-modal"
import MedicineRecordsModal from "@/components/medicine-records-modal"

const medicines = [
  {
    id: 1,
    name: "Lisinopril 10mg",
    genericName: "Lisinopril",
    brand: "Prinivil",
    category: "ACE Inhibitor",
    price: 12.99,
    originalPrice: 18.99,
    discount: 32,
    inStock: true,
    quantity: 30,
    unit: "tablets",
    rating: 4.6,
    reviews: 234,
    description: "Used to treat high blood pressure and heart failure",
    sideEffects: ["Dizziness", "Dry cough", "Headache"],
    dosage: "Take once daily with or without food",
    prescription: true,
    image: "/placeholder-c2ugo.png",
  },
  {
    id: 2,
    name: "Metformin 500mg",
    genericName: "Metformin HCl",
    brand: "Glucophage",
    category: "Antidiabetic",
    price: 8.49,
    originalPrice: 12.99,
    discount: 35,
    inStock: true,
    quantity: 60,
    unit: "tablets",
    rating: 4.4,
    reviews: 189,
    description: "Helps control blood sugar levels in type 2 diabetes",
    sideEffects: ["Nausea", "Diarrhea", "Stomach upset"],
    dosage: "Take twice daily with meals",
    prescription: true,
    image: "/placeholder-fg46a.png",
  },
  {
    id: 3,
    name: "Ibuprofen 200mg",
    genericName: "Ibuprofen",
    brand: "Advil",
    category: "NSAID",
    price: 6.99,
    originalPrice: 9.99,
    discount: 30,
    inStock: true,
    quantity: 24,
    unit: "capsules",
    rating: 4.7,
    reviews: 456,
    description: "Pain reliever and fever reducer",
    sideEffects: ["Stomach irritation", "Dizziness", "Headache"],
    dosage: "Take every 4-6 hours as needed",
    prescription: false,
    image: "/placeholder-msfkf.png",
  },
  {
    id: 4,
    name: "Omeprazole 20mg",
    genericName: "Omeprazole",
    brand: "Prilosec",
    category: "Proton Pump Inhibitor",
    price: 15.49,
    originalPrice: 22.99,
    discount: 33,
    inStock: false,
    quantity: 0,
    unit: "capsules",
    rating: 4.5,
    reviews: 167,
    description: "Treats gastroesophageal reflux disease (GERD)",
    sideEffects: ["Headache", "Nausea", "Diarrhea"],
    dosage: "Take once daily before breakfast",
    prescription: false,
    image: "/omeprazole-medication.png",
  },
]

const categories = [
  { id: "all", name: "All Medicines", count: 1247 },
  { id: "prescription", name: "Prescription", count: 856 },
  { id: "otc", name: "Over-the-Counter", count: 391 },
  { id: "vitamins", name: "Vitamins & Supplements", count: 234 },
  { id: "pain-relief", name: "Pain Relief", count: 156 },
  { id: "diabetes", name: "Diabetes Care", count: 89 },
  { id: "heart", name: "Heart Health", count: 67 },
]

const nearbyPharmacies = [
  {
    id: 1,
    name: "CVS Pharmacy",
    address: "123 Main St, Downtown",
    distance: "0.3 miles",
    rating: 4.2,
    openUntil: "10:00 PM",
    phone: "(555) 123-4567",
    hasDelivery: true,
  },
  {
    id: 2,
    name: "Walgreens",
    address: "456 Oak Ave, Midtown",
    distance: "0.7 miles",
    rating: 4.0,
    openUntil: "9:00 PM",
    phone: "(555) 987-6543",
    hasDelivery: true,
  },
  {
    id: 3,
    name: "Local Health Pharmacy",
    address: "789 Pine St, Uptown",
    distance: "1.2 miles",
    rating: 4.8,
    openUntil: "8:00 PM",
    phone: "(555) 456-7890",
    hasDelivery: false,
  },
]

const quickActions = [
  { icon: ScanLine, label: "Scan Prescription", description: "Upload prescription image", action: "scan_prescription" },
  { icon: Camera, label: "Pill Identifier", description: "Identify unknown pills", action: "pill_identifier" },
  { icon: FileText, label: "My Medicines", description: "View and manage medicines", action: "my_medicines" },
  { icon: History, label: "Medicine Records", description: "View past records", action: "medicine_records" },
]

export default function MedicineFinderHub() {
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedMedicine, setSelectedMedicine] = useState<(typeof medicines)[0] | null>(null)
  const [showPrescriptionScan, setShowPrescriptionScan] = useState(false)
  const [showPillIdentifier, setShowPillIdentifier] = useState(false)
  const [showMyMedicines, setShowMyMedicines] = useState(false)
  const [showMedicineRecords, setShowMedicineRecords] = useState(false)

  const filteredMedicines = medicines.filter((medicine) => {
    const matchesSearch =
      medicine.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      medicine.genericName.toLowerCase().includes(searchQuery.toLowerCase())

    if (selectedCategory === "all") return matchesSearch
    if (selectedCategory === "prescription") return matchesSearch && medicine.prescription
    if (selectedCategory === "otc") return matchesSearch && !medicine.prescription

    return matchesSearch
  })

  const handleQuickAction = (action: string) => {
    switch (action) {
      case "scan_prescription":
        setShowPrescriptionScan(true)
        break
      case "pill_identifier":
        setShowPillIdentifier(true)
        break
      case "my_medicines":
        setShowMyMedicines(true)
        break
      case "medicine_records":
        setShowMedicineRecords(true)
        break
    }
  }

  const handlePrescriptionScanSuccess = () => {
    console.log("[v0] Prescription scan completed successfully")
  }

  const handlePillIdentifierSuccess = () => {
    console.log("[v0] Pill identification completed successfully")
  }

  const handleMyMedicinesUpdate = () => {
    console.log("[v0] My medicines updated successfully")
  }

  const handleMedicineRecordsClose = () => {
    setShowMedicineRecords(false)
  }

  return (
    <DashboardLayout>
      <div className="p-6">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Medicine Finder Hub</h1>
              <p className="text-gray-600">Find, compare, and order medications from nearby pharmacies</p>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" className="bg-white/60 backdrop-blur-sm">
                <Filter className="w-4 h-4 mr-2" />
                Advanced Filter
              </Button>
              <Button
                className="bg-gradient-to-r from-green-500 to-emerald-500 text-white"
                onClick={() => handleQuickAction("scan_prescription")}
              >
                <ScanLine className="w-4 h-4 mr-2" />
                Scan Prescription
              </Button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-4 mb-8">
          {quickActions.map((action, index) => {
            const Icon = action.icon
            return (
              <Card
                key={index}
                className="bg-white/60 backdrop-blur-sm border-white/20 hover:shadow-lg transition-all cursor-pointer"
                onClick={() => handleQuickAction(action.action)}
              >
                <CardContent className="p-4 text-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                    <Icon className="w-6 h-6 text-blue-600" />
                  </div>
                  <h3 className="font-semibold text-sm mb-1">{action.label}</h3>
                  <p className="text-xs text-gray-500">{action.description}</p>
                </CardContent>
              </Card>
            )
          })}
        </div>

        <div className="mb-8">
          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              placeholder="Search medicines by name, condition, or active ingredient..."
              className="pl-12 h-12 bg-white/60 backdrop-blur-sm border-white/20"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="flex gap-3 overflow-x-auto pb-2">
            {categories.map((category) => (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? "default" : "outline"}
                className={`flex items-center gap-2 whitespace-nowrap ${
                  selectedCategory === category.id
                    ? "bg-blue-500 text-white"
                    : "bg-white/60 backdrop-blur-sm border-white/20"
                }`}
                onClick={() => setSelectedCategory(category.id)}
              >
                {category.name}
                <Badge variant="secondary" className="ml-1">
                  {category.count}
                </Badge>
              </Button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-4 gap-6">
          <div className="col-span-3">
            <div className="grid grid-cols-1 gap-4">
              {filteredMedicines.map((medicine) => (
                <Card key={medicine.id} className="bg-white/60 backdrop-blur-sm border-white/20 overflow-hidden">
                  <CardContent className="p-6">
                    <div className="flex gap-6">
                      <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-lg flex items-center justify-center">
                        <img
                          src={medicine.image || "/placeholder.svg"}
                          alt={medicine.name}
                          className="w-16 h-16 object-contain"
                        />
                      </div>

                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h3 className="text-lg font-bold text-gray-900 mb-1">{medicine.name}</h3>
                            <p className="text-sm text-gray-600 mb-2">
                              Generic: {medicine.genericName} | Brand: {medicine.brand}
                            </p>
                            <div className="flex items-center gap-3 mb-2">
                              <Badge className="bg-blue-100 text-blue-800">{medicine.category}</Badge>
                              {medicine.prescription ? (
                                <Badge className="bg-red-100 text-red-800">
                                  <Shield className="w-3 h-3 mr-1" />
                                  Prescription Required
                                </Badge>
                              ) : (
                                <Badge className="bg-green-100 text-green-800">
                                  <CheckCircle2 className="w-3 h-3 mr-1" />
                                  Over-the-Counter
                                </Badge>
                              )}
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-2xl font-bold text-green-600">${medicine.price}</span>
                              <span className="text-sm text-gray-500 line-through">${medicine.originalPrice}</span>
                              <Badge className="bg-green-100 text-green-800">{medicine.discount}% OFF</Badge>
                            </div>
                            <p className="text-xs text-gray-500">
                              {medicine.quantity} {medicine.unit}
                            </p>
                          </div>
                        </div>

                        <p className="text-sm text-gray-600 mb-3">{medicine.description}</p>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className="flex items-center gap-1">
                              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                              <span className="text-sm font-medium">{medicine.rating}</span>
                              <span className="text-sm text-gray-500">({medicine.reviews} reviews)</span>
                            </div>
                            {medicine.inStock ? (
                              <Badge className="bg-green-100 text-green-800">In Stock</Badge>
                            ) : (
                              <Badge className="bg-red-100 text-red-800">Out of Stock</Badge>
                            )}
                          </div>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm" onClick={() => setSelectedMedicine(medicine)}>
                              <Info className="w-4 h-4 mr-2" />
                              Details
                            </Button>
                            <Button
                              size="sm"
                              disabled={!medicine.inStock}
                              className="bg-blue-500 hover:bg-blue-600 text-white"
                            >
                              <ShoppingCart className="w-4 h-4 mr-2" />
                              Add to Cart
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <Card className="bg-white/60 backdrop-blur-sm border-white/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  Nearby Pharmacies
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {nearbyPharmacies.map((pharmacy) => (
                    <div key={pharmacy.id} className="p-3 bg-gray-50/50 rounded-lg">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h4 className="font-semibold text-sm">{pharmacy.name}</h4>
                          <p className="text-xs text-gray-500">{pharmacy.address}</p>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center gap-1 mb-1">
                            <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                            <span className="text-xs">{pharmacy.rating}</span>
                          </div>
                          <p className="text-xs text-gray-500">{pharmacy.distance}</p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-1 text-green-600">
                          <Clock className="w-3 h-3" />
                          Open until {pharmacy.openUntil}
                        </div>
                        {pharmacy.hasDelivery && (
                          <Badge className="bg-blue-100 text-blue-800 text-xs">
                            <Truck className="w-3 h-3 mr-1" />
                            Delivery
                          </Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-purple-500 to-pink-500 text-white border-0">
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <DollarSign className="w-5 h-5" />
                  <span className="font-semibold">Price Comparison</span>
                </div>
                <h3 className="font-bold mb-2">Save up to 70%</h3>
                <p className="text-purple-100 text-sm mb-4">
                  Compare prices across multiple pharmacies and find the best deals
                </p>
                <Button className="w-full bg-white/20 hover:bg-white/30 text-white border-white/20">
                  Compare Prices
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-white/60 backdrop-blur-sm border-white/20">
              <CardHeader>
                <CardTitle className="text-sm">Prescription Reminders</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-2 bg-orange-50 rounded-lg">
                    <div>
                      <p className="text-sm font-medium">Lisinopril</p>
                      <p className="text-xs text-gray-500">Refill in 3 days</p>
                    </div>
                    <AlertTriangle className="w-4 h-4 text-orange-500" />
                  </div>
                  <div className="flex items-center justify-between p-2 bg-red-50 rounded-lg">
                    <div>
                      <p className="text-sm font-medium">Metformin</p>
                      <p className="text-xs text-gray-500">Refill overdue</p>
                    </div>
                    <AlertTriangle className="w-4 h-4 text-red-500" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {selectedMedicine && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <Card className="w-full max-w-2xl bg-white">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>{selectedMedicine.name}</CardTitle>
                  <Button variant="ghost" size="icon" onClick={() => setSelectedMedicine(null)}>
                    ×
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">Dosage Instructions</h4>
                    <p className="text-sm text-gray-600">{selectedMedicine.dosage}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Common Side Effects</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedMedicine.sideEffects.map((effect, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {effect}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div className="flex gap-3 pt-4">
                    <Button className="flex-1 bg-blue-500 hover:bg-blue-600 text-white">
                      <ShoppingCart className="w-4 h-4 mr-2" />
                      Add to Cart - ${selectedMedicine.price}
                    </Button>
                    <Button variant="outline">
                      <Info className="w-4 h-4 mr-2" />
                      More Info
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        <PrescriptionScanModal
          isOpen={showPrescriptionScan}
          onClose={() => setShowPrescriptionScan(false)}
          onSuccess={handlePrescriptionScanSuccess}
        />

        <PillIdentifierModal
          isOpen={showPillIdentifier}
          onClose={() => setShowPillIdentifier(false)}
          onSuccess={handlePillIdentifierSuccess}
        />

        <MyMedicinesModal
          isOpen={showMyMedicines}
          onClose={() => setShowMyMedicines(false)}
          onUpdate={handleMyMedicinesUpdate}
        />

        <MedicineRecordsModal isOpen={showMedicineRecords} onClose={handleMedicineRecordsClose} />
      </div>
    </DashboardLayout>
  )
}
