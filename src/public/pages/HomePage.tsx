import { Search, MapPin, Star, Clock, Users, TrendingUp, CheckCircle2, Phone, Shield, Zap, MessageCircle, MessageSquare, Stethoscope, Building2, Home } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BookingFormModal } from "@/components/BookingFormModal";
import { PublicWideHeader } from "../components/PublicWideHeader";

interface FeaturedProvider {
  id: number;
  name: string;
  type: string;
  rating: number;
  reviews: number;
  location: string;
  image: string;
  verified: boolean;
  responseTime: string;
  availability: string;
  path: string;
}

const featuredProviders: FeaturedProvider[] = [
  {
    id: 1,
    name: "Dr. Sarah Johnson",
    type: "General Practitioner",
    rating: 4.9,
    reviews: 342,
    location: "Accra, Ghana",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop",
    verified: true,
    responseTime: "Usually replies within 2 hours",
    availability: "Available today 2PM-6PM",
    path: "/discover/doctors"
  },
  {
    id: 2,
    name: "Mercy Health Clinic",
    type: "Multi-specialty Clinic",
    rating: 4.8,
    reviews: 528,
    location: "Osu, Accra",
    image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=400&h=400&fit=crop",
    verified: true,
    responseTime: "Usually replies within 1 hour",
    availability: "Open 24/7",
    path: "/discover/hospitals"
  },
  {
    id: 3,
    name: "Dr. Kofi Mensah",
    type: "Cardiologist",
    rating: 4.9,
    reviews: 267,
    location: "Ridge, Accra",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop",
    verified: true,
    responseTime: "Usually replies within 3 hours",
    availability: "Available tomorrow",
    path: "/discover/doctors"
  },
  {
    id: 4,
    name: "East Legon Family Care",
    type: "Family Practice",
    rating: 4.7,
    reviews: 198,
    location: "East Legon, Accra",
    image: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=400&h=400&fit=crop",
    verified: true,
    responseTime: "Usually replies within 1 hour",
    availability: "Available today 1PM-5PM",
    path: "/discover/hospitals"
  },
  {
    id: 5,
    name: "Dr. Ama Asante",
    type: "Pediatrician",
    rating: 4.8,
    reviews: 311,
    location: "Labone, Accra",
    image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&h=400&fit=crop",
    verified: true,
    responseTime: "Usually replies within 2 hours",
    availability: "Available today 3PM-6PM",
    path: "/discover/doctors"
  },
  {
    id: 6,
    name: "Harborview Diagnostics",
    type: "Diagnostic Center",
    rating: 4.6,
    reviews: 254,
    location: "Airport Residential, Accra",
    image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=400&h=400&fit=crop",
    verified: true,
    responseTime: "Usually replies within 2 hours",
    availability: "Open today 8AM-8PM",
    path: "/discover/hospitals"
  }
];

const serviceCategories = [
  { icon: Building2, name: "Hospitals", count: "2,340+", path: "/discover/hospitals", color: "from-blue-600 to-blue-400" },
  { icon: Stethoscope, name: "Doctors", count: "8,900+", path: "/discover/doctors", color: "from-teal-600 to-teal-400" },
  { icon: MessageCircle, name: "Clinics", count: "5,620+", path: "/discover/hospitals", color: "from-purple-600 to-purple-400" },
  { icon: Home, name: "Home-care", count: "1,200+", path: "/marketplace/services", color: "from-green-600 to-green-400" },
  { icon: CheckCircle2, name: "Lab Tests", count: "500+", path: "/marketplace/services", color: "from-orange-600 to-orange-400" },
  { icon: Shield, name: "Pharmacies", count: "3,100+", path: "/marketplace/services", color: "from-pink-600 to-pink-400" }
];

const features = [
  { icon: Shield, title: "Secure & Verified", description: "All providers are verified healthcare professionals" },
  { icon: Zap, title: "Fast Bookings", description: "Book appointments in seconds, no forms" },
  { icon: Phone, title: "24/7 Support", description: "We're here to help anytime you need us" }
];

const searchTypeOptions: Array<"doctor" | "hospital" | "clinic"> = ["doctor", "hospital", "clinic"];

export function HomePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchType, setSearchType] = useState<"doctor" | "hospital" | "clinic">("doctor");
  const [showBookModal, setShowBookModal] = useState(false);
  const [bookTarget, setBookTarget] = useState<{ name: string; path: string } | null>(null);
  const navigate = useNavigate();

  const handleBookAppointment = (name: string, path: string) => {
    setBookTarget({ name, path });
    setShowBookModal(true);
  };

  const handleSearch = () => {
    if (searchType === "doctor") {
      navigate("/discover/doctors");
      return;
    }
    if (searchType === "hospital" || searchType === "clinic") {
      navigate("/discover/hospitals");
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 transition-colors duration-300">
      <PublicWideHeader />

      {/* Hero Section with Background Image Overlay */}
      <section className="relative overflow-hidden py-12 md:py-32 bg-gradient-to-br from-blue-600 to-teal-600">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=1200&auto=format&fit=crop')] bg-cover bg-center" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/90 via-blue-600/80 to-teal-600/90" />
        
        <div className="relative max-w-4xl mx-auto px-4">
          <div className="text-center mb-8 md:mb-12 space-y-2 md:space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <h1 className="text-3xl md:text-6xl font-bold text-white mb-2 md:mb-4 leading-tight">
              Your Health, Our Priority
            </h1>
            <p className="text-base md:text-xl text-blue-100 max-w-2xl mx-auto">
              Access verified healthcare providers, book appointments instantly, and get care when you need it
            </p>
          </div>

          {/* Search Bar */}
          <div className="bg-white dark:bg-slate-800 rounded-lg md:rounded-2xl shadow-2xl p-4 md:p-8 animate-in fade-in slide-in-from-bottom-2 duration-700 delay-100">
            <div className="space-y-3 md:space-y-4">
              <div className="flex gap-2 md:gap-3 flex-wrap justify-center md:justify-start">
                {searchTypeOptions.map(type => (
                  <button
                    key={type}
                    onClick={() => setSearchType(type)}
                    className={`px-3 md:px-4 py-2 rounded-lg font-medium capitalize transition transform hover:scale-105 active:scale-95 text-xs md:text-sm ${
                      searchType === type
                        ? "bg-blue-600 text-white shadow-lg"
                        : "bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-slate-200 hover:bg-gray-200 dark:hover:bg-slate-600"
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>

              <div className="flex gap-2 md:gap-3 flex-col md:flex-row">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-3 md:top-3.5 w-4 h-4 md:w-5 md:h-5 text-gray-400 dark:text-slate-500" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={`Search ${searchType}s...`}
                    className="w-full pl-9 md:pl-10 pr-3 md:pr-4 py-2 md:py-3 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition text-sm md:text-base"
                  />
                </div>
                <div className="flex-1 relative">
                  <MapPin className="absolute left-3 top-3 md:top-3.5 w-4 h-4 md:w-5 md:h-5 text-gray-400 dark:text-slate-500" />
                  <input
                    type="text"
                    placeholder="Your location"
                    className="w-full pl-9 md:pl-10 pr-3 md:pr-4 py-2 md:py-3 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition text-sm md:text-base"
                  />
                </div>
                <button
                  className="px-6 md:px-8 py-2 md:py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition font-medium transform hover:scale-105 active:scale-95 shadow-lg text-sm md:text-base"
                  onClick={handleSearch}
                >
                  Search
                </button>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-3 md:grid-cols-3 gap-2 md:gap-4 mt-8 animate-in fade-in slide-in-from-bottom duration-700 delay-200">
            <div className="text-center bg-white/10 backdrop-blur-sm rounded-lg md:rounded-xl p-3 md:p-4 hover:bg-white/20 transition transform hover:scale-105">
              <div className="text-xl md:text-3xl font-bold text-white">50K+</div>
              <p className="text-xs md:text-sm text-blue-100 mt-1">Verified Providers</p>
            </div>
            <div className="text-center bg-white/10 backdrop-blur-sm rounded-lg md:rounded-xl p-3 md:p-4 hover:bg-white/20 transition transform hover:scale-105">
              <div className="text-xl md:text-3xl font-bold text-white">1M+</div>
              <p className="text-xs md:text-sm text-blue-100 mt-1">Appointments</p>
            </div>
            <div className="text-center bg-white/10 backdrop-blur-sm rounded-lg md:rounded-xl p-3 md:p-4 hover:bg-white/20 transition transform hover:scale-105">
              <div className="text-xl md:text-3xl font-bold text-white">4.8★</div>
              <p className="text-xs md:text-sm text-blue-100 mt-1">Average Rating</p>
            </div>
          </div>
        </div>
      </section>

      {/* Service Categories - Clickable */}
      <section className="py-16 md:py-20 bg-gray-50 dark:bg-slate-900 transition-colors duration-300">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4 animate-in fade-in slide-in-from-left duration-500">Browse Services</h2>
            <p className="text-base md:text-lg text-gray-600 dark:text-slate-400 max-w-2xl mx-auto animate-in fade-in slide-in-from-left duration-500 delay-100">Explore our comprehensive healthcare services and find exactly what you need</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-6">
            {serviceCategories.map((category, idx) => {
              const Icon = category.icon;
              const colors = [
                { bg: "bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900", icon: "text-blue-600 dark:text-blue-400", hover: "hover:shadow-blue-200/50 dark:hover:shadow-blue-900/30", border: "border-blue-200 dark:border-blue-800" },
                { bg: "bg-gradient-to-br from-teal-50 to-teal-100 dark:from-teal-950 dark:to-teal-900", icon: "text-teal-600 dark:text-teal-400", hover: "hover:shadow-teal-200/50 dark:hover:shadow-teal-900/30", border: "border-teal-200 dark:border-teal-800" },
                { bg: "bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900", icon: "text-purple-600 dark:text-purple-400", hover: "hover:shadow-purple-200/50 dark:hover:shadow-purple-900/30", border: "border-purple-200 dark:border-purple-800" },
                { bg: "bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900", icon: "text-green-600 dark:text-green-400", hover: "hover:shadow-green-200/50 dark:hover:shadow-green-900/30", border: "border-green-200 dark:border-green-800" },
                { bg: "bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950 dark:to-orange-900", icon: "text-orange-600 dark:text-orange-400", hover: "hover:shadow-orange-200/50 dark:hover:shadow-orange-900/30", border: "border-orange-200 dark:border-orange-800" },
                { bg: "bg-gradient-to-br from-pink-50 to-pink-100 dark:from-pink-950 dark:to-pink-900", icon: "text-pink-600 dark:text-pink-400", hover: "hover:shadow-pink-200/50 dark:hover:shadow-pink-900/30", border: "border-pink-200 dark:border-pink-800" }
              ];
              const colorSet = colors[idx % colors.length];
              
              return (
                <button
                  key={category.name}
                  onClick={() => navigate(category.path)}
                  className={`group relative overflow-hidden p-4 md:p-6 ${colorSet.bg} rounded-xl md:rounded-2xl border ${colorSet.border} hover:border-current transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-md hover:shadow-xl ${colorSet.hover} dark:hover:shadow-lg animate-in fade-in slide-in-from-bottom duration-500`}
                  style={{ animationDelay: `${idx * 50}ms` }}
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${category.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />
                  <div className="relative">
                    <div className={`w-12 h-12 md:w-14 md:h-14 rounded-xl md:rounded-2xl ${colorSet.bg} flex items-center justify-center mb-2 md:mb-3 group-hover:scale-110 group-hover:-rotate-12 transition-transform duration-300`}>
                      <Icon className={`w-6 h-6 md:w-8 md:h-8 ${colorSet.icon}`} />
                    </div>
                    <h3 className="font-bold text-gray-900 dark:text-white text-sm md:text-lg group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors text-left">{category.name}</h3>
                    <p className="text-xs md:text-sm text-gray-600 dark:text-slate-400 mt-1 group-hover:text-gray-700 dark:group-hover:text-slate-300 transition-colors text-left font-medium">{category.count}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Featured Providers - 2 Column Mobile */}
      <section className="py-16 md:py-20 bg-white dark:bg-slate-950 transition-colors duration-300">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center justify-between mb-8 md:mb-12 flex-col sm:flex-row gap-4 animate-in fade-in slide-in-from-left duration-500">
            <div>
              <h2 className="text-2xl md:text-4xl font-bold text-gray-900 dark:text-white">Featured Providers</h2>
              <p className="text-sm md:text-base text-gray-600 dark:text-slate-400 mt-2">Top-rated doctors and clinics near you</p>
            </div>
            <Link to="/discover/doctors" className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium text-sm md:text-base whitespace-nowrap">View All →</Link>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {featuredProviders.map((provider, idx) => (
              <div key={provider.id} className="group bg-white dark:bg-slate-800 rounded-lg md:rounded-2xl border border-gray-200 dark:border-slate-700 hover:shadow-2xl hover:shadow-blue-200/50 dark:hover:shadow-blue-900/30 transition-all duration-300 overflow-hidden transform hover:scale-105 animate-in fade-in slide-in-from-bottom duration-500" style={{ animationDelay: `${idx * 100}ms` }}>
                <div className="h-32 md:h-40 bg-gray-200 dark:bg-slate-700 relative overflow-hidden">
                  <img src={provider.image} alt={provider.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  {provider.verified && (
                    <div className="absolute top-2 md:top-3 right-2 md:right-3 bg-blue-600 text-white px-2 py-1 rounded-full flex items-center gap-1 text-xs font-medium shadow-lg">
                      <CheckCircle2 className="w-3 h-3" /> Verified
                    </div>
                  )}
                </div>

                <div className="p-3 md:p-4 space-y-2 md:space-y-3">
                  <div>
                    <h3 className="font-bold text-sm md:text-base text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{provider.name}</h3>
                    <p className="text-xs md:text-sm text-gray-600 dark:text-slate-400">{provider.type}</p>
                  </div>

                  <div className="flex items-center gap-2 text-xs md:text-sm">
                    <MapPin className="w-3 h-3 md:w-4 md:h-4 text-gray-600 dark:text-slate-400 flex-shrink-0" />
                    <span className="text-gray-600 dark:text-slate-400">{provider.location}</span>
                  </div>

                  <div className="flex items-center gap-3 text-xs md:text-sm">
                    <div className="flex items-center gap-1">
                      <Star className="w-3 h-3 md:w-4 md:h-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-medium text-gray-900 dark:text-white">{provider.rating}</span>
                      <span className="text-gray-600 dark:text-slate-400">({provider.reviews})</span>
                    </div>
                  </div>

                  <div className="space-y-1 md:space-y-2 pt-2 md:pt-3 border-t border-gray-200 dark:border-slate-700">
                    <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-slate-400">
                      <Clock className="w-3 h-3 flex-shrink-0" /> {provider.responseTime}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-green-600 dark:text-green-400 font-medium">
                      <CheckCircle2 className="w-3 h-3 flex-shrink-0" /> {provider.availability}
                    </div>
                  </div>

                  <button
                    className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition font-medium text-xs md:text-sm transform hover:scale-105 active:scale-95 shadow-lg"
                    onClick={() => handleBookAppointment(provider.name, provider.path)}
                  >
                    Book Appointment
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 md:py-24 bg-white dark:bg-slate-950 transition-colors duration-300">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4 animate-in fade-in slide-in-from-top duration-500">Why Choose BesaPlus</h2>
            <p className="text-base md:text-lg text-gray-600 dark:text-slate-400 max-w-2xl mx-auto">Everything you need for comprehensive healthcare in one place</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {features.map((feature, idx) => {
              const Icon = feature.icon;
              const colorSchemes = [
                { bg: "bg-blue-100 dark:bg-blue-950", text: "text-blue-600 dark:text-blue-400" },
                { bg: "bg-teal-100 dark:bg-teal-950", text: "text-teal-600 dark:text-teal-400" },
                { bg: "bg-purple-100 dark:bg-purple-950", text: "text-purple-600 dark:text-purple-400" }
              ];
              const scheme = colorSchemes[idx];
              
              return (
                <div key={feature.title} className="p-6 md:p-8 bg-gray-50 dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-800 hover:shadow-xl hover:shadow-blue-200/50 dark:hover:shadow-blue-900/30 transition-all duration-300 transform hover:scale-105 hover:-translate-y-2 animate-in fade-in slide-in-from-bottom duration-500" style={{ animationDelay: `${idx * 100}ms` }}>
                  <div className={`w-16 h-16 rounded-2xl ${scheme.bg} flex items-center justify-center mx-auto mb-4 group-hover:scale-125 transition-transform group-hover:rotate-12`}>
                    <Icon className={`w-8 h-8 ${scheme.text}`} />
                  </div>
                  <h3 className="font-bold text-gray-900 dark:text-white mb-2 text-center text-lg">{feature.title}</h3>
                  <p className="text-gray-600 dark:text-slate-400 text-center">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-blue-600 to-teal-600 py-12 md:py-16">
        <div className="max-w-4xl mx-auto px-4 text-center text-white">
          <h2 className="text-2xl md:text-4xl font-bold mb-2 md:mb-4">Ready to book your appointment?</h2>
          <p className="text-sm md:text-lg mb-6 md:mb-8 opacity-90">Get started in seconds with no registration hassle</p>
          <button
            onClick={() => navigate("/register")}
            className="inline-block px-6 md:px-8 py-2 md:py-3 bg-white text-blue-600 rounded-lg hover:bg-gray-100 transition font-bold text-sm md:text-base transform hover:scale-105 active:scale-95"
          >
            Get Started Free
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-8 md:py-12">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-teal-600"></div>
                <span className="text-white font-bold text-sm md:text-base">BesaPlus</span>
              </div>
              <p className="text-xs md:text-sm">Universal Healthcare Solution</p>
            </div>
            <div>
              <h4 className="text-white font-bold mb-3 md:mb-4 text-sm md:text-base">Platform</h4>
              <ul className="space-y-2 text-xs md:text-sm">
                <li><Link to="/discover/doctors" className="hover:text-white">Browse Doctors</Link></li>
                <li><Link to="/marketplace/services" className="hover:text-white">Services</Link></li>
                <li><Link to="/marketplace/services" className="hover:text-white">Pricing</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold mb-3 md:mb-4 text-sm md:text-base">Company</h4>
              <ul className="space-y-2 text-xs md:text-sm">
                <li><Link to="/home" className="hover:text-white">About Us</Link></li>
                <li><Link to="/home" className="hover:text-white">Blog</Link></li>
                <li><Link to="/home" className="hover:text-white">Contact</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold mb-3 md:mb-4 text-sm md:text-base">Legal</h4>
              <ul className="space-y-2 text-xs md:text-sm">
                <li><Link to="/home" className="hover:text-white">Privacy</Link></li>
                <li><Link to="/home" className="hover:text-white">Terms</Link></li>
                <li><Link to="/home" className="hover:text-white">HIPAA</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-6 md:pt-8 text-center text-xs md:text-sm">
            <p>&copy; 2024 BesaPlus. All rights reserved. Secure, encrypted healthcare for everyone.</p>
          </div>
        </div>
      </footer>

      <BookingFormModal
        open={showBookModal}
        title={bookTarget ? `Book with ${bookTarget.name}` : "Book Appointment"}
        onClose={() => setShowBookModal(false)}
        onSubmit={() => {
          if (bookTarget?.path) {
            navigate(bookTarget.path);
          }
        }}
      />
    </div>
  );
}
