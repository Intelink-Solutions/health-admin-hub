import { useState } from "react";
import { Search, MapPin, Star, Filter, Bed, Users, Award, Clock, Phone, Mail } from "lucide-react";

interface Hospital {
  id: number;
  name: string;
  type: string;
  rating: number;
  reviews: number;
  location: string;
  beds: number;
  departments: number;
  image: string;
  verified: boolean;
  emergencyServices: boolean;
  avgWaitTime: string;
  phone: string;
}

const hospitals: Hospital[] = [
  {
    id: 1,
    name: "Korle Bu Teaching Hospital",
    type: "Tertiary Hospital",
    rating: 4.7,
    reviews: 1240,
    location: "Korle Bu, Accra",
    beds: 650,
    departments: 32,
    image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=300&h=200&fit=crop",
    verified: true,
    emergencyServices: true,
    avgWaitTime: "30-45 mins",
    phone: "+233 300 123 456"
  },
  {
    id: 2,
    name: "Mercy Health Clinic",
    type: "Multi-specialty Clinic",
    rating: 4.8,
    reviews: 528,
    location: "Osu, Accra",
    beds: 120,
    departments: 8,
    image: "https://images.unsplash.com/photo-1538108149393-fbbd81895907?w=300&h=200&fit=crop",
    verified: true,
    emergencyServices: true,
    avgWaitTime: "15-20 mins",
    phone: "+233 302 456 789"
  },
  {
    id: 3,
    name: "Komfo Anokye Hospital",
    type: "Tertiary Hospital",
    rating: 4.6,
    reviews: 892,
    location: "Kumasi, Ghana",
    beds: 750,
    departments: 28,
    image: "https://images.unsplash.com/photo-1519494026067-461c5d8498cb?w=300&h=200&fit=crop",
    verified: true,
    emergencyServices: true,
    avgWaitTime: "40-50 mins",
    phone: "+233 322 123 456"
  },
  {
    id: 4,
    name: "Tema General Hospital",
    type: "Regional Hospital",
    rating: 4.5,
    reviews: 456,
    location: "Tema, Ghana",
    beds: 400,
    departments: 18,
    image: "https://images.unsplash.com/photo-1632833716993-a6ff64d71cbc?w=300&h=200&fit=crop",
    verified: true,
    emergencyServices: true,
    avgWaitTime: "25-35 mins",
    phone: "+233 303 456 123"
  },
  {
    id: 5,
    name: "Ridge Hospital",
    type: "Tertiary Hospital",
    rating: 4.8,
    reviews: 734,
    location: "Ridge, Accra",
    beds: 300,
    departments: 20,
    image: "https://images.unsplash.com/photo-1587280591290-76ec3ae4d234?w=300&h=200&fit=crop",
    verified: true,
    emergencyServices: true,
    avgWaitTime: "20-30 mins",
    phone: "+233 300 234 567"
  },
  {
    id: 6,
    name: "Cape Coast Hospital",
    type: "Regional Hospital",
    rating: 4.4,
    reviews: 312,
    location: "Cape Coast, Ghana",
    beds: 250,
    departments: 14,
    image: "https://images.unsplash.com/photo-1626271248464-ec4247d7c2c8?w=300&h=200&fit=crop",
    verified: true,
    emergencyServices: false,
    avgWaitTime: "35-45 mins",
    phone: "+233 332 456 789"
  }
];

const types = ["All Hospitals", "Tertiary Hospital", "Regional Hospital", "Multi-specialty Clinic"];

export function HospitalsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState("All Hospitals");
  const [emergencyOnly, setEmergencyOnly] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  const filteredHospitals = hospitals.filter(hospital => {
    const matchesQuery = hospital.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        hospital.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = selectedType === "All Hospitals" || hospital.type === selectedType;
    const matchesEmergency = !emergencyOnly || hospital.emergencyServices;
    return matchesQuery && matchesType && matchesEmergency;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-teal-600 flex items-center justify-center">
              <span className="text-white text-sm font-bold">BP</span>
            </div>
            <span className="text-lg font-bold text-gray-900">BesaPlus</span>
          </div>
          <button className="text-blue-600 font-medium">Sign In</button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Find Hospitals</h1>
          <p className="text-gray-600">Browse verified hospitals and healthcare facilities</p>
        </div>

        {/* Search Bar */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-8">
          <div className="flex gap-3 flex-col md:flex-row">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search hospitals, locations..."
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
            >
              <Filter className="w-5 h-5" />
              Filters
            </button>
          </div>
        </div>

        <div className="flex gap-8">
          {/* Sidebar Filters */}
          <aside className={`${showFilters ? "block" : "hidden"} md:block w-full md:w-64 shrink-0`}>
            <div className="bg-white rounded-lg shadow-sm p-6 space-y-6">
              <div>
                <h3 className="font-bold text-gray-900 mb-3">Hospital Type</h3>
                <div className="space-y-2">
                  {types.map(type => (
                    <button
                      key={type}
                      onClick={() => setSelectedType(type)}
                      className={`block text-left px-3 py-2 rounded-lg w-full transition ${
                        selectedType === type
                          ? "bg-blue-100 text-blue-700 font-medium"
                          : "text-gray-700 hover:bg-gray-100"
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              <div className="border-t border-gray-200 pt-6">
                <h3 className="font-bold text-gray-900 mb-3">Services</h3>
                <label className="flex items-center gap-2 text-gray-700">
                  <input
                    type="checkbox"
                    checked={emergencyOnly}
                    onChange={(e) => setEmergencyOnly(e.target.checked)}
                    className="w-4 h-4 rounded"
                  />
                  Emergency Services
                </label>
              </div>

              <div className="border-t border-gray-200 pt-6">
                <h3 className="font-bold text-gray-900 mb-3">Rating</h3>
                <div className="space-y-2">
                  {[4.5, 4.0, 3.5, 3.0].map(rating => (
                    <label key={rating} className="flex items-center gap-2 text-gray-700">
                      <input type="checkbox" className="w-4 h-4 rounded" />
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      {rating}+ stars
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1">
            <div className="flex items-center justify-between mb-6">
              <p className="text-gray-600">
                Showing <span className="font-bold">{filteredHospitals.length}</span> hospitals
              </p>
              <select className="px-3 py-2 border border-gray-300 rounded-lg text-gray-700">
                <option>Highest Rated</option>
                <option>Most Reviews</option>
                <option>Nearest</option>
              </select>
            </div>

            {/* Hospital Cards */}
            <div className="grid md:grid-cols-2 gap-6">
              {filteredHospitals.map(hospital => (
                <div key={hospital.id} className="bg-white rounded-lg shadow-sm hover:shadow-lg transition overflow-hidden border border-gray-100">
                  <div className="h-40 bg-gray-200 relative overflow-hidden">
                    <img src={hospital.image} alt={hospital.name} className="w-full h-full object-cover" />
                  </div>

                  <div className="p-6 space-y-4">
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">{hospital.name}</h3>
                      <p className="text-sm text-gray-600">{hospital.type}</p>
                    </div>

                    <div className="flex items-center gap-2 text-gray-600">
                      <MapPin className="w-4 h-4" />
                      <span className="text-sm">{hospital.location}</span>
                    </div>

                    <div className="grid grid-cols-2 gap-4 py-4 border-y border-gray-200">
                      <div className="flex gap-3">
                        <Bed className="w-5 h-5 text-teal-600 shrink-0" />
                        <div>
                          <p className="text-xs text-gray-600">Total Beds</p>
                          <p className="font-bold text-gray-900">{hospital.beds}</p>
                        </div>
                      </div>
                      <div className="flex gap-3">
                        <Users className="w-5 h-5 text-blue-600 shrink-0" />
                        <div>
                          <p className="text-xs text-gray-600">Departments</p>
                          <p className="font-bold text-gray-900">{hospital.departments}</p>
                        </div>
                      </div>
                      <div className="flex gap-3">
                        <Star className="w-5 h-5 fill-yellow-400 text-yellow-400 shrink-0" />
                        <div>
                          <p className="text-xs text-gray-600">Rating</p>
                          <p className="font-bold text-gray-900">{hospital.rating} ({hospital.reviews})</p>
                        </div>
                      </div>
                      <div className="flex gap-3">
                        <Clock className="w-5 h-5 text-orange-600 shrink-0" />
                        <div>
                          <p className="text-xs text-gray-600">Wait Time</p>
                          <p className="font-bold text-gray-900">{hospital.avgWaitTime}</p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      {hospital.emergencyServices && (
                        <div className="flex items-center gap-2 px-3 py-2 bg-red-50 border border-red-200 rounded-lg">
                          <Award className="w-4 h-4 text-red-600" />
                          <span className="text-sm font-medium text-red-700">24/7 Emergency Services</span>
                        </div>
                      )}
                    </div>

                    <div className="flex gap-3">
                      <button className="flex-1 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium text-sm">
                        View Services
                      </button>
                      <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition">
                        <Phone className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {filteredHospitals.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-600 text-lg mb-4">No hospitals found matching your criteria</p>
                <button
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedType("All Hospitals");
                    setEmergencyOnly(false);
                  }}
                  className="text-blue-600 font-medium hover:text-blue-700"
                >
                  Clear filters
                </button>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
