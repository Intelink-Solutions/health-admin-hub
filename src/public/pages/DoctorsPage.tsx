import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, MapPin, Star, Filter, ChevronDown, CheckCircle2, Heart, MessageCircle, Phone } from "lucide-react";
import { BookingFormModal } from "../../components/BookingFormModal";
import { PublicWideHeader } from "../components/PublicWideHeader";

interface Doctor {
  id: number;
  name: string;
  specialty: string;
  rating: number;
  reviews: number;
  location: string;
  fee: number;
  phone: string;
  image: string;
  verified: boolean;
  availability: string;
  experience: string;
  education: string;
}

const doctors: Doctor[] = [
  {
    id: 1,
    name: "Dr. Sarah Johnson",
    specialty: "General Practitioner",
    rating: 4.9,
    reviews: 342,
    location: "Accra, Ghana",
    fee: 150,
    phone: "+233 24 101 0101",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop",
    verified: true,
    availability: "Available today",
    experience: "15 years",
    education: "MD - University of Ghana"
  },
  {
    id: 2,
    name: "Dr. Kofi Mensah",
    specialty: "Cardiologist",
    rating: 4.9,
    reviews: 267,
    location: "Ridge, Accra",
    fee: 250,
    phone: "+233 24 202 0202",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop",
    verified: true,
    availability: "Tomorrow",
    experience: "12 years",
    education: "MD - Korle Bu Teaching Hospital"
  },
  {
    id: 3,
    name: "Dr. Ama Asante",
    specialty: "Pediatrician",
    rating: 4.8,
    reviews: 198,
    location: "Osu, Accra",
    fee: 120,
    phone: "+233 24 303 0303",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop",
    verified: true,
    availability: "Available today",
    experience: "8 years",
    education: "MD - Ashanti Hospital"
  },
  {
    id: 4,
    name: "Dr. Emmanuel Owusu",
    specialty: "Dermatologist",
    rating: 4.7,
    reviews: 215,
    location: "Dansoman, Accra",
    fee: 180,
    phone: "+233 24 404 0404",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop",
    verified: true,
    availability: "Tomorrow",
    experience: "10 years",
    education: "MD - Komfo Anokye Hospital"
  },
  {
    id: 5,
    name: "Dr. Akosua Addo",
    specialty: "Gynecologist",
    rating: 4.9,
    reviews: 412,
    location: "Tema, Ghana",
    fee: 200,
    phone: "+233 24 505 0505",
    image: "https://images.unsplash.com/photo-1507499767569-0a2b8feefb42?w=200&h=200&fit=crop",
    verified: true,
    availability: "Available today",
    experience: "14 years",
    education: "MD - Central Hospital Kumasi"
  },
  {
    id: 6,
    name: "Dr. David Boafo",
    specialty: "Orthopedic Surgeon",
    rating: 4.8,
    reviews: 289,
    location: "Cantonments, Accra",
    fee: 220,
    phone: "+233 24 606 0606",
    image: "https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?w=200&h=200&fit=crop",
    verified: true,
    availability: "Tomorrow",
    experience: "16 years",
    education: "MD - Queen Elizabeth Hospital"
  }
];

const specialties = [
  "General Practitioner",
  "Cardiologist",
  "Pediatrician",
  "Dermatologist",
  "Gynecologist",
  "Orthopedic",
  "Dentist",
  "Ophthalmologist"
];

export function DoctorsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSpecialty, setSelectedSpecialty] = useState<string | null>(null);
  const [priceRange, setPriceRange] = useState(500);
  const [showFilters, setShowFilters] = useState(false);
  const [favorites, setFavorites] = useState<number[]>([]);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [showPhone, setShowPhone] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const stored = localStorage.getItem("providerShowPhone");
    if (stored === null) return;
    setShowPhone(stored === "true");
  }, []);

  const filteredDoctors = doctors.filter(doctor => {
    const matchesQuery = doctor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        doctor.specialty.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSpecialty = !selectedSpecialty || doctor.specialty === selectedSpecialty;
    const matchesPrice = doctor.fee <= priceRange;
    return matchesQuery && matchesSpecialty && matchesPrice;
  });

  const toggleFavorite = (doctorId: number) => {
    setFavorites(prev =>
      prev.includes(doctorId) ? prev.filter(id => id !== doctorId) : [...prev, doctorId]
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950 transition-colors duration-300">
      <PublicWideHeader />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">Find Doctors</h1>
          <p className="text-gray-600 dark:text-slate-400">Browse verified doctors and book appointments instantly</p>
        </div>

        {/* Search Bar */}
        <div className="bg-white dark:bg-slate-900 rounded-lg shadow-sm p-4 mb-8 border border-gray-100 dark:border-slate-800">
          <div className="flex gap-3 flex-col md:flex-row">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3.5 w-5 h-5 text-gray-400 dark:text-slate-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search doctors, specialties..."
                className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-3 border border-gray-300 dark:border-slate-700 text-gray-700 dark:text-slate-300 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-800 transition"
            >
              <Filter className="w-5 h-5" />
              Filters
            </button>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
          {/* Sidebar Filters */}
          <aside className={`${showFilters ? "block" : "hidden"} md:block w-full lg:w-64 shrink-0`}>
            <div className="bg-white dark:bg-slate-900 rounded-lg shadow-sm p-6 space-y-6 border border-gray-100 dark:border-slate-800">
              <div>
                <h3 className="font-bold text-gray-900 dark:text-white mb-3">Specialty</h3>
                <div className="space-y-2">
                  <button
                    onClick={() => setSelectedSpecialty(null)}
                    className={`block text-left px-3 py-2 rounded-lg w-full transition ${
                      selectedSpecialty === null
                        ? "bg-blue-100 text-blue-700 font-medium"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    All Specialties
                  </button>
                  {specialties.map(specialty => (
                    <button
                      key={specialty}
                      onClick={() => setSelectedSpecialty(specialty)}
                      className={`block text-left px-3 py-2 rounded-lg w-full transition ${
                        selectedSpecialty === specialty
                          ? "bg-blue-100 text-blue-700 font-medium"
                          : "text-gray-700 hover:bg-gray-100"
                      }`}
                    >
                      {specialty}
                    </button>
                  ))}
                </div>
              </div>

              <div className="border-t border-gray-200 dark:border-slate-700 pt-6">
                <h3 className="font-bold text-gray-900 dark:text-white mb-3">Consultation Fee</h3>
                <div className="space-y-4">
                  <div>
                    <input
                      type="range"
                      min="50"
                      max="500"
                      value={priceRange}
                      onChange={(e) => setPriceRange(Number(e.target.value))}
                      className="w-full"
                    />
                    <div className="flex justify-between mt-2 text-sm text-gray-600 dark:text-slate-400">
                      <span>₵50</span>
                      <span className="font-bold text-gray-900 dark:text-white">₵{priceRange}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-200 dark:border-slate-700 pt-6">
                <h3 className="font-bold text-gray-900 dark:text-white mb-3">Availability</h3>
                <label className="flex items-center gap-2 text-gray-700 dark:text-slate-300">
                  <input type="checkbox" defaultChecked className="w-4 h-4 rounded" />
                  Available Today
                </label>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1">
            <div className="flex items-center justify-between gap-3 mb-6 flex-col sm:flex-row">
              <p className="text-gray-600 dark:text-slate-400">
                Showing <span className="font-bold">{filteredDoctors.length}</span> doctors
              </p>
              <select className="w-full sm:w-auto px-3 py-2 border border-gray-300 dark:border-slate-700 rounded-lg text-gray-700 dark:text-slate-300 bg-white dark:bg-slate-900">
                <option>Most Popular</option>
                <option>Highest Rated</option>
                <option>Lowest Fee</option>
              </select>
            </div>

            {/* Doctor Cards */}
            <div className="space-y-4">
              {filteredDoctors.map(doctor => (
                <div key={doctor.id} className="bg-white dark:bg-slate-900 rounded-lg shadow-sm hover:shadow-md transition overflow-hidden border border-gray-100 dark:border-slate-800">
                  <div className="p-4 sm:p-6 flex flex-col sm:flex-row gap-4 sm:gap-6">
                    {/* Image */}
                    <div className="w-24 h-24 rounded-lg bg-gray-200 shrink-0 overflow-hidden mx-auto sm:mx-0">
                      <img src={doctor.image} alt={doctor.name} className="w-full h-full object-cover" />
                    </div>

                    {/* Info */}
                    <div className="flex-1">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white">{doctor.name}</h3>
                            {doctor.verified && <CheckCircle2 className="w-5 h-5 text-blue-600" />}
                          </div>
                          <p className="text-sm text-gray-600 dark:text-slate-400">{doctor.specialty}</p>
                        </div>
                        <button
                          onClick={() => toggleFavorite(doctor.id)}
                          className={`p-2 rounded-lg transition ${
                            favorites.includes(doctor.id)
                              ? "bg-red-100 text-red-600"
                              : "bg-gray-100 text-gray-400 hover:text-red-600"
                          }`}
                        >
                          <Heart className={`w-5 h-5 ${favorites.includes(doctor.id) ? "fill-current" : ""}`} />
                        </button>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 my-4 pb-4 border-b border-gray-200 dark:border-slate-700">
                        <div>
                          <p className="text-xs text-gray-600">Rating</p>
                          <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                            <span className="font-bold">{doctor.rating}</span>
                            <span className="text-sm text-gray-600 dark:text-slate-400">({doctor.reviews})</span>
                          </div>
                        </div>
                        <div>
                          <p className="text-xs text-gray-600">Experience</p>
                          <p className="font-bold text-gray-900 dark:text-white">{doctor.experience}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-600">Fee</p>
                          <p className="font-bold text-gray-900 dark:text-white">₵{doctor.fee}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-600">Availability</p>
                          <p className="font-bold text-green-600">{doctor.availability}</p>
                        </div>
                      </div>

                      <div className="flex gap-2 sm:gap-3 flex-wrap">
                        <button
                          className="px-4 sm:px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium text-sm sm:text-base"
                          onClick={() => setShowBookingModal(true)}
                        >
                          Book Now
                        </button>
                        {showPhone ? (
                          <a
                            href={`tel:${doctor.phone}`}
                            className="p-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition"
                            title={`Call ${doctor.phone}`}
                          >
                            <Phone className="w-5 h-5" />
                          </a>
                        ) : (
                          <div
                            className="p-2 bg-gray-100 text-gray-400 rounded-lg cursor-not-allowed"
                            title="Phone number hidden by provider"
                          >
                            <Phone className="w-5 h-5" />
                          </div>
                        )}
                        <button
                          className="p-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
                          onClick={() => navigate("/chat")}
                        >
                          <MessageCircle className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {filteredDoctors.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-600 text-lg mb-4">No doctors found matching your criteria</p>
                <button
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedSpecialty(null);
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
      <BookingFormModal
        open={showBookingModal}
        title="Book Appointment"
        onClose={() => setShowBookingModal(false)}
      />
    </div>
  );
}
