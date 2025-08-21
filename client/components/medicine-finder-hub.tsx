"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, MapPin, AlertTriangle, ShoppingCart, Bell, CheckCircle, XCircle, Pill } from "lucide-react"
import { cn } from "@/lib/utils"

interface Medicine {
  id: string
  name: string
  genericName: string
  brand: string
  dosage: string
  price: number
  originalPrice?: number
  availability: "in-stock" | "low-stock" | "out-of-stock"
  pharmacy: string
  distance: number
  expiryDate: string
  refillDate?: string
  interactions: string[]
  image: string
  category: "prescription" | "otc"
  isExpiringSoon: boolean
  needsRefill: boolean
}

const medicines: Medicine[] = [
  {
    id: "1",
    name: "Lisinopril",
    genericName: "Lisinopril",
    brand: "Prinivil",
    dosage: "10mg",
    price: 12.99,
    originalPrice: 18.99,
    availability: "in-stock",
    pharmacy: "CVS Pharmacy",
    distance: 0.8,
    expiryDate: "2025-06-15",
    refillDate: "2024-12-25",
    interactions: ["Potassium supplements", "NSAIDs"],
    image: "/lisinopril-pill.png",
    category: "prescription",
    isExpiringSoon: false,
    needsRefill: true,
  },
  {
    id: "2",
    name: "Metformin",
    genericName: "Metformin HCl",
    brand: "Glucophage",
    dosage: "500mg",
    price: 8.5,
    availability: "low-stock",
    pharmacy: "Walgreens",
    distance: 1.2,
    expiryDate: "2025-01-20",
    interactions: ["Alcohol", "Contrast dye"],
    image: "/metformin-pill.png",
    category: "prescription",
    isExpiringSoon: true,
    needsRefill: false,
  },
  {
    id: "3",
    name: "Ibuprofen",
    genericName: "Ibuprofen",
    brand: "Advil",
    dosage: "200mg",
    price: 6.99,
    availability: "in-stock",
    pharmacy: "Rite Aid",
    distance: 2.1,
    expiryDate: "2025-08-30",
    interactions: ["Blood thinners", "ACE inhibitors"],
    image: "/ibuprofen-pill.png",
    category: "otc",
    isExpiringSoon: false,
    needsRefill: false,
  },
  {
    id: "4",
    name: "Atorvastatin",
    genericName: "Atorvastatin Calcium",
    brand: "Lipitor",
    dosage: "20mg",
    price: 15.75,
    availability: "out-of-stock",
    pharmacy: "CVS Pharmacy",
    distance: 0.8,
    expiryDate: "2025-04-10",
    refillDate: "2024-12-28",
    interactions: ["Grapefruit juice", "Gemfibrozil"],
    image: "/atorvastatin-pill.png",
    category: "prescription",
    isExpiringSoon: false,
    needsRefill: true,
  },
  {
    id: "5",
    name: "Vitamin D3",
    genericName: "Cholecalciferol",
    brand: "Nature Made",
    dosage: "1000 IU",
    price: 9.99,
    availability: "in-stock",
    pharmacy: "Target Pharmacy",
    distance: 1.5,
    expiryDate: "2025-12-31",
    interactions: [],
    image: "/vitamin-d3-pill.png",
    category: "otc",
    isExpiringSoon: false,
    needsRefill: false,
  },
]

const searchSuggestions = [
  "Lisinopril 10mg",
  "Metformin 500mg",
  "Ibuprofen 200mg",
  "Atorvastatin 20mg",
  "Vitamin D3",
  "Aspirin 81mg",
  "Omeprazole 20mg",
  "Levothyroxine 50mcg",
]

export default function MedicineFinderHub() {
  const [searchQuery, setSearchQuery] = useState("")
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [filteredMedicines, setFilteredMedicines] = useState(medicines)
  const [selectedMedicine, setSelectedMedicine] = useState<Medicine | null>(null)
  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState("")

  const filteredSuggestions = searchSuggestions.filter((suggestion) =>
    suggestion.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  useEffect(() => {
    if (searchQuery) {
      const filtered = medicines.filter(
        (medicine) =>
          medicine.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          medicine.genericName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          medicine.brand.toLowerCase().includes(searchQuery.toLowerCase()),
      )
      setFilteredMedicines(filtered)
    } else {
      setFilteredMedicines(medicines)
    }
  }, [searchQuery])

  const getAvailabilityConfig = (availability: string) => {
    switch (availability) {
      case "in-stock":
        return { color: "bg-green-500", textColor: "text-green-800", bgColor: "bg-green-100", ring: "ring-green-400" }
      case "low-stock":
        return {
          color: "bg-yellow-500",
          textColor: "text-yellow-800",
          bgColor: "bg-yellow-100",
          ring: "ring-yellow-400",
        }
      case "out-of-stock":
        return { color: "bg-red-500", textColor: "text-red-800", bgColor: "bg-red-100", ring: "ring-red-400" }
      default:
        return { color: "bg-gray-500", textColor: "text-gray-800", bgColor: "bg-gray-100", ring: "ring-gray-400" }
    }
  }

  const handleReorder = (medicine: Medicine) => {
    setToastMessage(`${medicine.name} added to cart for reorder`)
    setShowToast(true)
    setTimeout(() => setShowToast(false), 3000)
  }

  const MedicineCard = ({ medicine }: { medicine: Medicine }) => {
    const availabilityConfig = getAvailabilityConfig(medicine.availability)

    return (
      <div
        className={cn(
          "group relative bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20 hover:bg-white/20 transition-all duration-300 cursor-pointer",
          medicine.isExpiringSoon && "animate-pulse",
        )}
        onClick={() => setSelectedMedicine(medicine)}
      >
        {/* Availability Ring */}
        <div className={cn("absolute -top-2 -right-2 w-6 h-6 rounded-full ring-2", availabilityConfig.ring)}>
          <div className={cn("w-full h-full rounded-full", availabilityConfig.color)} />
        </div>

        {/* Expiry Warning */}
        {medicine.isExpiringSoon && (
          <div className="absolute -top-1 -left-1 animate-spin-slow">
            <AlertTriangle className="w-5 h-5 text-orange-500" />
          </div>
        )}

        {/* Refill Alert */}
        {medicine.needsRefill && (
          <div className="absolute top-2 left-2">
            <Badge className="bg-blue-100 text-blue-800 text-xs">
              <Bell className="w-3 h-3 mr-1" />
              Refill
            </Badge>
          </div>
        )}

        <div className="flex items-start gap-4">
          {/* 3D Pill Illustration */}
          <div className="relative">
            <div
              className={cn(
                "w-16 h-16 rounded-xl bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center",
                medicine.isExpiringSoon && "animate-bounce",
              )}
            >
              <Pill className="w-8 h-8 text-blue-600" />
            </div>
            {medicine.originalPrice && (
              <div className="absolute -bottom-1 -right-1 bg-red-500 text-white text-xs rounded-full px-1">Sale</div>
            )}
          </div>

          {/* Medicine Details */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between mb-2">
              <div>
                <h4 className="font-semibold text-gray-800">{medicine.name}</h4>
                <p className="text-sm text-gray-600">{medicine.brand}</p>
                <p className="text-xs text-gray-500">{medicine.dosage}</p>
              </div>
              <Badge className={cn("capitalize", availabilityConfig.bgColor, availabilityConfig.textColor)}>
                {medicine.availability.replace("-", " ")}
              </Badge>
            </div>

            {/* Price */}
            <div className="flex items-center gap-2 mb-2">
              <span className="text-lg font-bold text-green-600">${medicine.price}</span>
              {medicine.originalPrice && (
                <span className="text-sm text-gray-500 line-through">${medicine.originalPrice}</span>
              )}
            </div>

            {/* Pharmacy & Distance */}
            <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
              <div className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                <span>{medicine.pharmacy}</span>
              </div>
              <div className="flex items-center gap-1">
                <span>{medicine.distance} mi</span>
              </div>
            </div>

            {/* Interactions Warning */}
            {medicine.interactions.length > 0 && (
              <div className="mb-3">
                <Badge variant="outline" className="text-xs text-orange-600 border-orange-200">
                  <AlertTriangle className="w-3 h-3 mr-1" />
                  {medicine.interactions.length} interactions
                </Badge>
              </div>
            )}

            {/* Action Button */}
            <Button
              size="sm"
              className="w-full"
              disabled={medicine.availability === "out-of-stock"}
              onClick={(e) => {
                e.stopPropagation()
                handleReorder(medicine)
              }}
            >
              {medicine.availability === "out-of-stock" ? (
                <>
                  <XCircle className="w-4 h-4 mr-2" />
                  Out of Stock
                </>
              ) : (
                <>
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  {medicine.needsRefill ? "Reorder" : "Add to Cart"}
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <Card className="bg-white/60 backdrop-blur-sm border-white/20">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <Pill className="w-5 h-5 text-blue-600" />
            Medicine Finder Hub
          </CardTitle>
          <p className="text-sm text-gray-600 mt-1">Find medicines, compare prices, and track refills</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge className="bg-orange-100 text-orange-800">
            <AlertTriangle className="w-3 h-3 mr-1" />2 Expiring Soon
          </Badge>
          <Badge className="bg-blue-100 text-blue-800">
            <Bell className="w-3 h-3 mr-1" />3 Need Refill
          </Badge>
        </div>
      </CardHeader>

      <CardContent>
        {/* Curved Floating Search Bar */}
        <div className="relative mb-6">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              placeholder="Search medicines, brands, or generic names..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value)
                setShowSuggestions(true)
              }}
              onFocus={() => setShowSuggestions(true)}
              onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
              className="pl-12 pr-4 py-3 bg-white/20 backdrop-blur-sm border-white/30 rounded-full text-gray-800 placeholder-gray-500 focus:bg-white/30 transition-all duration-300"
            />
          </div>

          {/* Auto-suggestions Dropdown */}
          {showSuggestions && searchQuery && filteredSuggestions.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white/90 backdrop-blur-md rounded-2xl border border-white/20 shadow-lg z-10">
              {filteredSuggestions.slice(0, 5).map((suggestion, index) => (
                <button
                  key={index}
                  className="w-full text-left px-4 py-3 hover:bg-white/50 transition-colors first:rounded-t-2xl last:rounded-b-2xl"
                  onClick={() => {
                    setSearchQuery(suggestion)
                    setShowSuggestions(false)
                  }}
                >
                  <div className="flex items-center gap-2">
                    <Search className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-700">{suggestion}</span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 mb-6">
          <Button variant="outline" size="sm" className="bg-blue-100 text-blue-800 border-blue-200">
            All Medicines
          </Button>
          <Button variant="outline" size="sm" className="bg-transparent">
            Prescription
          </Button>
          <Button variant="outline" size="sm" className="bg-transparent">
            Over-the-Counter
          </Button>
          <Button variant="outline" size="sm" className="bg-transparent">
            Need Refill
          </Button>
          <Button variant="outline" size="sm" className="bg-transparent">
            Expiring Soon
          </Button>
        </div>

        {/* Medicine Cards Grid */}
        <div className="grid grid-cols-2 gap-4">
          {filteredMedicines.map((medicine) => (
            <MedicineCard key={medicine.id} medicine={medicine} />
          ))}
        </div>

        {filteredMedicines.length === 0 && (
          <div className="text-center py-8">
            <Pill className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">No medicines found matching your search.</p>
          </div>
        )}
      </CardContent>

      {/* Toast Notification */}
      {showToast && (
        <div className="fixed bottom-4 right-4 z-50 animate-slide-in-right">
          <div className="bg-green-500 text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-2">
            <CheckCircle className="w-5 h-5" />
            <span>{toastMessage}</span>
          </div>
        </div>
      )}

      {/* Medicine Detail Modal */}
      {selectedMedicine && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full max-h-[80vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold">{selectedMedicine.name}</h3>
                <Button variant="ghost" size="icon" onClick={() => setSelectedMedicine(null)}>
                  <XCircle className="w-5 h-5" />
                </Button>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
                    <Pill className="w-8 h-8 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-semibold">{selectedMedicine.brand}</p>
                    <p className="text-sm text-gray-600">{selectedMedicine.genericName}</p>
                    <p className="text-sm text-gray-500">{selectedMedicine.dosage}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-sm text-gray-600">Price</p>
                    <p className="text-lg font-bold text-green-600">${selectedMedicine.price}</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-sm text-gray-600">Pharmacy</p>
                    <p className="font-medium">{selectedMedicine.pharmacy}</p>
                    <p className="text-sm text-gray-500">{selectedMedicine.distance} mi away</p>
                  </div>
                </div>

                {selectedMedicine.interactions.length > 0 && (
                  <div className="bg-orange-50 rounded-lg p-4">
                    <h4 className="font-semibold text-orange-800 mb-2 flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4" />
                      Drug Interactions
                    </h4>
                    <ul className="space-y-1">
                      {selectedMedicine.interactions.map((interaction, index) => (
                        <li key={index} className="text-sm text-orange-700">
                          • {interaction}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="flex gap-2">
                  <Button
                    className="flex-1"
                    disabled={selectedMedicine.availability === "out-of-stock"}
                    onClick={() => handleReorder(selectedMedicine)}
                  >
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    Add to Cart
                  </Button>
                  <Button variant="outline">
                    <MapPin className="w-4 h-4 mr-2" />
                    Directions
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </Card>
  )
}
