import { useState, useEffect } from "react";
import { ShoppingCart, Heart, Star, Filter, MapPin, Clock, CheckCircle2, ChevronRight, MessageCircle, Phone, Trash2, Plus, Minus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { BookingFormModal } from "@/components/BookingFormModal";
import { PublicWideHeader } from "../components/PublicWideHeader";

interface ServiceItem {
  id: number;
  name: string;
  provider: string;
  providerType: "doctor" | "hospital" | "clinic";
  location: string;
  price: number;
  rating: number;
  reviews: number;
  image: string;
  turnaround: string;
  category: string;
  description: string;
  inStock: boolean;
  phone: string;
  callType: "phone" | "telemedicine";
}

const services: ServiceItem[] = [
  {
    id: 1,
    name: "Full Blood Checkup",
    provider: "Mercy Health Lab",
    providerType: "clinic",
    location: "Accra, Ghana",
    price: 250,
    rating: 4.8,
    reviews: 342,
    image: "https://images.unsplash.com/photo-1581093160562-40460b1f3b20?w=300&h=300&fit=crop",
    turnaround: "24 hours",
    category: "Laboratory Tests",
    description: "Complete blood count, lipid profile, glucose test",
    inStock: true,
    phone: "+233 24 100 2000",
    callType: "phone"
  },
  {
    id: 2,
    name: "COVID-19 PCR Test",
    provider: "Rapid Testing Center",
    providerType: "clinic",
    location: "Accra, Ghana",
    price: 150,
    rating: 4.9,
    reviews: 1200,
    image: "https://images.unsplash.com/photo-1584308666744-24d5f15d850d?w=300&h=300&fit=crop",
    turnaround: "2 hours",
    category: "Testing",
    description: "Rapid PCR test with home delivery available",
    inStock: true,
    phone: "+233 24 100 2001",
    callType: "phone"
  },
  {
    id: 3,
    name: "Thyroid Panel Test",
    provider: "Central Diagnostics",
    providerType: "clinic",
    location: "Accra, Ghana",
    price: 180,
    rating: 4.7,
    reviews: 245,
    image: "https://images.unsplash.com/photo-1576091160631-112d4c848fc1?w=300&h=300&fit=crop",
    turnaround: "48 hours",
    category: "Laboratory Tests",
    description: "TSH, Free T3, Free T4 tests",
    inStock: true,
    phone: "+233 24 100 2002",
    callType: "phone"
  },
  {
    id: 4,
    name: "Hepatitis Screening",
    provider: "Alpha Hospital Lab",
    providerType: "hospital",
    location: "Accra, Ghana",
    price: 220,
    rating: 4.6,
    reviews: 187,
    image: "https://images.unsplash.com/photo-1576091160675-112d4c848fc1?w=300&h=300&fit=crop",
    turnaround: "48 hours",
    category: "Screening",
    description: "Hepatitis A, B, C antibody tests",
    inStock: true,
    phone: "+233 24 200 3000",
    callType: "phone"
  },
  {
    id: 5,
    name: "Home Care Service",
    provider: "Care Plus Services",
    providerType: "clinic",
    location: "Accra, Ghana",
    price: 500,
    rating: 4.9,
    reviews: 412,
    image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=300&h=300&fit=crop",
    turnaround: "Same day",
    category: "Home Services",
    description: "Nurse visit, wound dressing, injections",
    inStock: true,
    phone: "+233 24 100 2003",
    callType: "phone"
  },
  {
    id: 6,
    name: "Vaccination Package",
    provider: "City Health Center",
    providerType: "hospital",
    location: "Accra, Ghana",
    price: 380,
    rating: 4.7,
    reviews: 289,
    image: "https://images.unsplash.com/photo-1631217314942-bb88d1fec15f?w=300&h=300&fit=crop",
    turnaround: "Immediate",
    category: "Vaccination",
    description: "MMR, Tetanus, Yellow Fever vaccines",
    inStock: true,
    phone: "+233 24 200 3001",
    callType: "phone"
  },
  {
    id: 7,
    name: "General Consultation",
    provider: "Dr. Sarah Johnson",
    providerType: "doctor",
    location: "Accra, Ghana",
    price: 150,
    rating: 4.9,
    reviews: 312,
    image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=300&h=300&fit=crop",
    turnaround: "Same day",
    category: "Doctor Services",
    description: "Video or in-person consultation with a GP",
    inStock: true,
    phone: "+233 24 300 4000",
    callType: "telemedicine"
  },
  {
    id: 8,
    name: "Cardiology Review",
    provider: "Dr. Kofi Mensah",
    providerType: "doctor",
    location: "Accra, Ghana",
    price: 220,
    rating: 4.8,
    reviews: 198,
    image: "https://images.unsplash.com/photo-1526256262350-7da7584cf5eb?w=300&h=300&fit=crop",
    turnaround: "48 hours",
    category: "Doctor Services",
    description: "Specialist cardiology review and ECG",
    inStock: true,
    phone: "+233 24 300 4001",
    callType: "telemedicine"
  },
  {
    id: 9,
    name: "Emergency Consultation",
    provider: "Ridge Hospital",
    providerType: "hospital",
    location: "Accra, Ghana",
    price: 300,
    rating: 4.6,
    reviews: 421,
    image: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=300&h=300&fit=crop",
    turnaround: "Immediate",
    category: "Hospital Services",
    description: "24/7 emergency assessment and triage",
    inStock: true,
    phone: "+233 24 200 3002",
    callType: "phone"
  },
  {
    id: 10,
    name: "Family Wellness Package",
    provider: "East Legon Clinic",
    providerType: "clinic",
    location: "Accra, Ghana",
    price: 260,
    rating: 4.7,
    reviews: 233,
    image: "https://images.unsplash.com/photo-1526256262350-7da7584cf5eb?w=300&h=300&fit=crop",
    turnaround: "72 hours",
    category: "Clinic Services",
    description: "Annual checkup for up to 4 family members",
    inStock: true,
    phone: "+233 24 100 2004",
    callType: "phone"
  }
];

const categories = [
  "All Services",
  "Doctor Services",
  "Hospital Services",
  "Clinic Services",
  "Laboratory Tests",
  "Testing",
  "Screening",
  "Home Services",
  "Vaccination"
];

const SERVICE_FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=300&h=300&fit=crop";

export function EcommerceServicesPage() {
  const [cart, setCart] = useState<ServiceItem[]>([]);
  const [favorites, setFavorites] = useState<number[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("All Services");
  const [showCart, setShowCart] = useState(false);
  const [sortBy, setSortBy] = useState("popular");
  const [selectedService, setSelectedService] = useState<ServiceItem | null>(null);
  const [showServiceDetail, setShowServiceDetail] = useState(false);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [providerServices, setProviderServices] = useState<ServiceItem[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const stored = localStorage.getItem("providerServices");
    if (!stored) return;
    try {
      const parsed = JSON.parse(stored) as Array<{
        id: number;
        providerType: "doctor" | "hospital" | "clinic";
        providerName: string;
        serviceName: string;
        location?: string;
        category: string;
        price: number;
        phone: string;
        image?: string;
        description: string;
        callType: "phone" | "telemedicine";
      }>;

      const mapped: ServiceItem[] = parsed.map((item) => ({
        id: item.id,
        name: item.serviceName,
        provider: item.providerName,
        providerType: item.providerType,
        location: item.location || "Accra, Ghana",
        price: item.price,
        rating: 4.7,
        reviews: 120,
        image: item.image || SERVICE_FALLBACK_IMAGE,
        turnaround: "Same day",
        category: item.category,
        description: item.description,
        inStock: true,
        phone: item.phone,
        callType: item.callType,
      }));

      setProviderServices(mapped);
    } catch {
      setProviderServices([]);
    }
  }, []);

  const allServices = [...providerServices, ...services];
  const filteredServices = allServices.filter(service =>
    selectedCategory === "All Services" || service.category === selectedCategory
  );

  const toggleCart = (service: ServiceItem) => {
    if (cart.find(item => item.id === service.id)) {
      setCart(cart.filter(item => item.id !== service.id));
    } else {
      setCart([...cart, service]);
    }
  };

  const toggleFavorite = (serviceId: number) => {
    setFavorites(prev =>
      prev.includes(serviceId) ? prev.filter(id => id !== serviceId) : [...prev, serviceId]
    );
  };

  const handleCall = (service: ServiceItem) => {
    if (service.callType === "telemedicine") {
      navigate("/telemedicine/consultation");
      return;
    }
    window.location.href = `tel:${service.phone}`;
  };

  const handleChat = () => {
    navigate("/chat");
  };

  const handleOpenDetail = (service: ServiceItem) => {
    setSelectedService(service);
    setShowServiceDetail(true);
  };

  const handleOpenBookNow = (service: ServiceItem) => {
    setSelectedService(service);
    setShowBookingModal(true);
  };

  const removeFromCart = (serviceId: number) => {
    setCart(cart.filter(item => item.id !== serviceId));
  };

  const totalPrice = cart.reduce((sum, item) => sum + item.price, 0);
  const cartCount = cart.length;
  const deliveryFee = totalPrice > 0 ? 20 : 0;

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 transition-colors duration-300">
      <PublicWideHeader
        extraAction={
          <button
            onClick={() => setShowCart(!showCart)}
            className="relative p-2 text-gray-600 dark:text-slate-300 hover:text-gray-900 dark:hover:text-white transition-colors"
            title="Cart"
          >
            <ShoppingCart className="w-6 h-6" />
            {cartCount > 0 && (
              <span className="absolute top-1 right-1 w-5 h-5 bg-red-600 text-white text-xs rounded-full flex items-center justify-center font-bold animate-pulse">
                {cartCount}
              </span>
            )}
          </button>
        }
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8 animate-in fade-in slide-in-from-left duration-500">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-2">Healthcare Services & Tests</h1>
          <p className="text-gray-600 dark:text-slate-400">Browse verified health services, lab tests, and home care packages</p>
        </div>

        <div className="flex gap-4 md:gap-8">
          {/* Sidebar - Categories */}
          <aside className="hidden md:block w-48 lg:w-56 shrink-0">
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-md p-6 sticky top-24 border border-gray-100 dark:border-slate-700">
              <h3 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <Filter className="w-5 h-5" /> Categories
              </h3>
              <div className="space-y-2">
                {categories.map((category, idx) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`block w-full text-left px-3 py-2 rounded-lg transition transform hover:scale-105 active:scale-95 animate-in fade-in slide-in-from-left duration-500 ${
                      selectedCategory === category
                        ? "bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 font-medium"
                        : "text-gray-700 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-700"
                    }`}
                    style={{ animationDelay: `${idx * 50}ms` }}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1">
            {/* Sorting & View Options */}
            <div className="flex items-center justify-between mb-8 flex-col md:flex-row gap-4">
              <p className="text-gray-600 dark:text-slate-400">
                Showing <span className="font-bold text-gray-900 dark:text-white">{filteredServices.length}</span> services
              </p>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg text-gray-700 dark:text-slate-300 bg-white dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              >
                <option value="popular">Most Popular</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
              </select>
            </div>

            {/* Services Grid - Responsive 1-2-3 columns */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {filteredServices.map((service, idx) => (
                <div
                  key={service.id}
                  className="group bg-white dark:bg-slate-800 rounded-2xl shadow-md hover:shadow-2xl hover:shadow-blue-200/50 dark:hover:shadow-blue-900/30 transition-all duration-300 overflow-hidden border border-gray-100 dark:border-slate-700 transform hover:scale-105 hover:-translate-y-2 animate-in fade-in slide-in-from-bottom duration-500 cursor-pointer"
                  style={{ animationDelay: `${idx * 50}ms` }}
                  onClick={() => handleOpenDetail(service)}
                >
                  {/* Image */}
                  <div className="h-40 bg-gray-200 dark:bg-slate-700 relative overflow-hidden">
                    <img
                      src={service.image || SERVICE_FALLBACK_IMAGE}
                      alt={service.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      onError={(e) => {
                        e.currentTarget.src = SERVICE_FALLBACK_IMAGE;
                      }}
                    />
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFavorite(service.id);
                      }}
                      className={`absolute top-3 right-3 p-2 rounded-full transition transform hover:scale-110 active:scale-95 ${
                        favorites.includes(service.id)
                          ? "bg-red-500 text-white shadow-lg"
                          : "bg-white/90 text-gray-600 hover:text-red-600 hover:bg-white"
                      }`}
                    >
                      <Heart className={`w-5 h-5 ${favorites.includes(service.id) ? "fill-current" : ""}`} />
                    </button>
                    <div className="absolute top-3 left-3 bg-blue-600 dark:bg-blue-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
                      {service.category}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-4 space-y-3">
                    <div>
                      <h3 className="font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{service.name}</h3>
                      <p className="text-sm text-gray-600 dark:text-slate-400">{service.provider}</p>
                      <p className="text-xs text-gray-500 dark:text-slate-400 flex items-center gap-1 mt-1">
                        <MapPin className="w-3 h-3" />
                        {service.location}
                      </p>
                    </div>

                    <p className="text-sm text-gray-700 dark:text-slate-300">{service.description}</p>

                    {/* Rating & Turnaround */}
                    <div className="flex items-center justify-between text-sm py-2 border-y border-gray-200 dark:border-slate-700">
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="font-medium text-gray-900 dark:text-white">{service.rating}</span>
                        <span className="text-gray-600 dark:text-slate-400">({service.reviews})</span>
                      </div>
                      <div className="flex items-center gap-1 text-gray-600 dark:text-slate-400">
                        <Clock className="w-4 h-4" />
                        <span>{service.turnaround}</span>
                      </div>
                    </div>

                    {/* Action Buttons - Call & Message */}
                    <div className="flex gap-2">
                      <button
                        className="flex-1 py-2 px-3 bg-green-500 hover:bg-green-600 text-white rounded-lg text-sm font-medium flex items-center justify-center gap-2 transition transform hover:scale-105 active:scale-95"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCall(service);
                        }}
                      >
                        <Phone className="w-4 h-4" />
                        <span className="hidden sm:inline">Call</span>
                      </button>
                      <button
                        className="flex-1 py-2 px-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium flex items-center justify-center gap-2 transition transform hover:scale-105 active:scale-95"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleChat();
                        }}
                      >
                        <MessageCircle className="w-4 h-4" />
                        <span className="hidden sm:inline">Message</span>
                      </button>
                    </div>

                    {/* Price & Add to Cart */}
                    <div className="flex items-end justify-between gap-2 pt-2">
                      <div>
                        <p className="text-xs text-gray-600 dark:text-slate-400">Starting from</p>
                        <p className="text-2xl font-bold text-gray-900 dark:text-white">₵{service.price}</p>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleCart(service);
                        }}
                        className={`px-4 py-2 rounded-lg font-medium transition transform hover:scale-105 active:scale-95 ${
                          cart.find(item => item.id === service.id)
                            ? "bg-blue-600 text-white hover:bg-blue-700 shadow-lg"
                            : "border border-blue-600 dark:border-blue-400 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950"
                        }`}
                      >
                        {cart.find(item => item.id === service.id) ? (
                          <span className="flex items-center gap-1">
                            <CheckCircle2 className="w-4 h-4" />
                            Added
                          </span>
                        ) : (
                          "Add"
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </main>
        </div>
      </div>

      {/* Shopping Cart Sidebar - Mobile Overlay */}
      {showCart && (
        <>
          <div 
            className="fixed inset-0 bg-black/40 dark:bg-black/60 z-40 md:hidden animate-in fade-in duration-200"
            onClick={() => setShowCart(false)}
          />
          <div className="fixed right-0 top-0 h-screen w-full md:w-96 bg-white dark:bg-slate-900 border-l border-gray-200 dark:border-slate-800 shadow-2xl flex flex-col z-50 animate-in slide-in-from-right duration-300">
            {/* Header */}
            <div className="border-b border-gray-200 dark:border-slate-800 p-6 flex items-center justify-between sticky top-0 bg-white dark:bg-slate-900">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">Shopping Cart</h2>
              <button
                onClick={() => setShowCart(false)}
                className="text-gray-400 dark:text-slate-500 hover:text-gray-600 dark:hover:text-slate-300 transition"
              >
                ✕
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {cart.length === 0 ? (
                <p className="text-center text-gray-600 dark:text-slate-400 py-8">Your cart is empty</p>
              ) : (
                cart.map(item => (
                  <div key={item.id} className="bg-gray-50 dark:bg-slate-800 rounded-lg p-4 flex items-start gap-3 justify-between border border-gray-200 dark:border-slate-700 hover:shadow-md transition">
                    <img
                      src={item.image || SERVICE_FALLBACK_IMAGE}
                      alt={item.name}
                      className="w-14 h-14 rounded-md object-cover border border-gray-200 dark:border-slate-700"
                      onError={(e) => {
                        e.currentTarget.src = SERVICE_FALLBACK_IMAGE;
                      }}
                    />
                    <div className="flex-1">
                      <h4 className="font-bold text-gray-900 dark:text-white text-sm">{item.name}</h4>
                      <p className="text-xs text-gray-600 dark:text-slate-400">{item.provider}</p>
                      <p className="text-lg font-bold text-gray-900 dark:text-white mt-2">₵{item.price}</p>
                    </div>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-gray-400 dark:text-slate-500 hover:text-red-600 dark:hover:text-red-400 p-1 transition"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            {cart.length > 0 && (
              <div className="border-t border-gray-200 dark:border-slate-800 p-6 space-y-4 bg-gray-50 dark:bg-slate-800">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-gray-700 dark:text-slate-300">
                    <span>Subtotal:</span>
                    <span className="font-semibold">₵{totalPrice}</span>
                  </div>
                  <div className="flex items-center justify-between text-gray-700 dark:text-slate-300">
                    <span>Delivery:</span>
                    <span className="font-semibold">₵{deliveryFee}</span>
                  </div>
                  <div className="border-t border-gray-200 dark:border-slate-700 pt-2 flex items-center justify-between text-lg font-bold text-gray-900 dark:text-white">
                    <span>Total:</span>
                    <span>₵{totalPrice + deliveryFee}</span>
                  </div>
                </div>
                <button className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition transform hover:scale-105 active:scale-95 shadow-lg">
                  Proceed to Checkout
                </button>
                <button
                  onClick={() => setShowCart(false)}
                  className="w-full py-3 border border-gray-300 dark:border-slate-600 text-gray-700 dark:text-slate-300 rounded-lg font-medium transition hover:bg-gray-50 dark:hover:bg-slate-700"
                >
                  Continue Shopping
                </button>
              </div>
            )}
          </div>
        </>
      )}

      {/* Service Detail Modal */}
      {showServiceDetail && selectedService && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-slate-900 rounded-lg max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">{selectedService.name}</h2>
              <button
                onClick={() => setShowServiceDetail(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>
            <img
              src={selectedService.image || SERVICE_FALLBACK_IMAGE}
              alt={selectedService.name}
              className="w-full h-40 rounded-lg object-cover mb-3 border border-gray-200 dark:border-slate-700"
              onError={(e) => {
                e.currentTarget.src = SERVICE_FALLBACK_IMAGE;
              }}
            />
            <p className="text-sm text-gray-600 dark:text-slate-300 mb-3">{selectedService.description}</p>
            <div className="text-xs text-gray-500 dark:text-slate-400 space-y-1 mb-4">
              <p>Provider: {selectedService.provider}</p>
              <p>Location: {selectedService.location}</p>
              <p>Category: {selectedService.category}</p>
              <p>Turnaround: {selectedService.turnaround}</p>
            </div>
            <div className="flex gap-2">
              <button
                className="flex-1 py-2 bg-green-500 text-white rounded-lg text-sm font-medium"
                onClick={() => handleCall(selectedService)}
              >
                Call
              </button>
              <button
                className="flex-1 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium"
                onClick={handleChat}
              >
                Chat
              </button>
            </div>
            <button
              className="w-full mt-3 py-2 border border-blue-600 text-blue-600 rounded-lg text-sm font-medium"
              onClick={() => handleOpenBookNow(selectedService)}
            >
              Book Now
            </button>
          </div>
        </div>
      )}

      <BookingFormModal
        open={showBookingModal && !!selectedService}
        title={selectedService ? `Book ${selectedService.name}` : "Book Service"}
        onClose={() => setShowBookingModal(false)}
      />
    </div>
  );
}
