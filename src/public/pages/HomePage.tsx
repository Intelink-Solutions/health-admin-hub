import { Search, MapPin, Star, Clock, Users, TrendingUp, CheckCircle2, Phone, Shield, Zap } from "lucide-react";
import { useState } from "react";

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
    availability: "Available today 2PM-6PM"
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
    availability: "Open 24/7"
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
    availability: "Available tomorrow"
  }
];

const serviceCategories = [
  { icon: "🏥", name: "Hospitals", count: "2,340+" },
  { icon: "👨‍⚕️", name: "Doctors", count: "8,900+" },
  { icon: "🏢", name: "Clinics", count: "5,620+" },
  { icon: "🏡", name: "Home-care", count: "1,200+" },
  { icon: "💉", name: "Lab Tests", count: "500+" },
  { icon: "💊", name: "Pharmacies", count: "3,100+" }
];

const features = [
  { icon: Shield, title: "Secure & Verified", description: "All providers are verified healthcare professionals" },
  { icon: Zap, title: "Fast Bookings", description: "Book appointments in seconds, no forms" },
  { icon: Phone, title: "24/7 Support", description: "We're here to help anytime you need us" }
];

export function HomePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchType, setSearchType] = useState<"doctor" | "hospital" | "clinic">("doctor");

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-teal-600 flex items-center justify-center">
              <span className="text-white text-sm font-bold">BP</span>
            </div>
            <span className="text-xl font-bold text-gray-900">BesaPlus</span>
          </div>
          <nav className="hidden md:flex items-center gap-8">
            <a href="#" className="text-gray-600 hover:text-gray-900 text-sm">Doctors</a>
            <a href="#" className="text-gray-600 hover:text-gray-900 text-sm">Hospitals</a>
            <a href="#" className="text-gray-600 hover:text-gray-900 text-sm">Services</a>
            <a href="/login" className="px-4 py-2 rounded-lg bg-blue-600 text-white text-sm hover:bg-blue-700">Sign In</a>
          </nav>
        </div>
      </header>

      {/* Hero Section with Search */}
      <section className="bg-gradient-to-br from-blue-50 to-teal-50 py-16 md:py-24">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Your Health, Our Priority
            </h1>
            <p className="text-xl text-gray-600">
              Find and book appointments with verified doctors, clinics, and hospitals instantly
            </p>
          </div>

          {/* Search Bar */}
          <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8">
            <div className="space-y-4">
              <div className="flex gap-3 flex-wrap">
                {["doctor", "hospital", "clinic"].map(type => (
                  <button
                    key={type}
                    onClick={() => setSearchType(type as any)}
                    className={`px-4 py-2 rounded-lg font-medium capitalize transition ${
                      searchType === type
                        ? "bg-blue-600 text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>

              <div className="flex gap-3 flex-col md:flex-row">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={`Search ${searchType}s, treatments...`}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  />
                </div>
                <div className="flex-1 relative">
                  <MapPin className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Your location"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  />
                </div>
                <button className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium">
                  Search
                </button>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-3 md:grid-cols-3 gap-4 mt-8">
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-bold text-blue-600">50K+</div>
              <p className="text-sm text-gray-600">Verified Providers</p>
            </div>
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-bold text-teal-600">1M+</div>
              <p className="text-sm text-gray-600">Appointments Booked</p>
            </div>
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-bold text-green-600">4.8★</div>
              <p className="text-sm text-gray-600">Average Rating</p>
            </div>
          </div>
        </div>
      </section>

      {/* Service Categories */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-900 mb-12">Browse Services</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {serviceCategories.map(category => (
              <button
                key={category.name}
                className="p-6 bg-white rounded-xl border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition text-left"
              >
                <div className="text-3xl mb-2">{category.icon}</div>
                <h3 className="font-bold text-gray-900">{category.name}</h3>
                <p className="text-sm text-gray-600">{category.count}</p>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Providers */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">Featured Providers</h2>
              <p className="text-gray-600 mt-2">Top-rated doctors and clinics near you</p>
            </div>
            <a href="#" className="text-blue-600 hover:text-blue-700 font-medium">View All →</a>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {featuredProviders.map(provider => (
              <div key={provider.id} className="bg-white rounded-xl border border-gray-200 hover:shadow-lg transition overflow-hidden">
                <div className="h-40 bg-gray-200 relative overflow-hidden">
                  <img src={provider.image} alt={provider.name} className="w-full h-full object-cover" />
                  {provider.verified && (
                    <div className="absolute top-3 right-3 bg-blue-600 text-white px-2 py-1 rounded-full flex items-center gap-1 text-xs font-medium">
                      <CheckCircle2 className="w-3 h-3" /> Verified
                    </div>
                  )}
                </div>

                <div className="p-4 space-y-3">
                  <div>
                    <h3 className="font-bold text-gray-900">{provider.name}</h3>
                    <p className="text-sm text-gray-600">{provider.type}</p>
                  </div>

                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-gray-600" />
                    <span className="text-sm text-gray-600">{provider.location}</span>
                  </div>

                  <div className="flex items-center gap-3 text-sm">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-medium">{provider.rating}</span>
                      <span className="text-gray-600">({provider.reviews})</span>
                    </div>
                  </div>

                  <div className="space-y-2 pt-2 border-t border-gray-200">
                    <div className="flex items-center gap-2 text-xs text-gray-600">
                      <Clock className="w-3 h-3" /> {provider.responseTime}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-green-600 font-medium">
                      <CheckCircle2 className="w-3 h-3" /> {provider.availability}
                    </div>
                  </div>

                  <button className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium text-sm">
                    Book Appointment
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">Why Choose BesaPlus</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {features.map(feature => {
              const Icon = feature.icon;
              return (
                <div key={feature.title} className="text-center">
                  <div className="w-14 h-14 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-4">
                    <Icon className="w-7 h-7 text-blue-600" />
                  </div>
                  <h3 className="font-bold text-gray-900 mb-2">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-blue-600 to-teal-600 py-16">
        <div className="max-w-4xl mx-auto px-4 text-center text-white">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to book your appointment?</h2>
          <p className="text-lg mb-8 opacity-90">Get started in seconds with no registration hassle</p>
          <a
            href="/register"
            className="inline-block px-8 py-3 bg-white text-blue-600 rounded-lg hover:bg-gray-100 transition font-bold"
          >
            Get Started Free
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-teal-600"></div>
                <span className="text-white font-bold">BesaPlus</span>
              </div>
              <p className="text-sm">Universal Healthcare Solution</p>
            </div>
            <div>
              <h4 className="text-white font-bold mb-4">Platform</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white">Browse Doctors</a></li>
                <li><a href="#" className="hover:text-white">Services</a></li>
                <li><a href="#" className="hover:text-white">Pricing</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold mb-4">Company</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white">About Us</a></li>
                <li><a href="#" className="hover:text-white">Blog</a></li>
                <li><a href="#" className="hover:text-white">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white">Privacy</a></li>
                <li><a href="#" className="hover:text-white">Terms</a></li>
                <li><a href="#" className="hover:text-white">HIPAA</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-sm">
            <p>&copy; 2024 BesaPlus. All rights reserved. Secure, encrypted healthcare for everyone.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
