import { useState } from "react";
import { ShoppingCart, Heart, Star, Filter, MapPin, Clock, CheckCircle2, ChevronRight } from "lucide-react";

interface ServiceItem {
  id: number;
  name: string;
  provider: string;
  price: number;
  rating: number;
  reviews: number;
  image: string;
  turnaround: string;
  category: string;
  description: string;
  inStock: boolean;
}

const services: ServiceItem[] = [
  {
    id: 1,
    name: "Full Blood Checkup",
    provider: "Mercy Health Lab",
    price: 250,
    rating: 4.8,
    reviews: 342,
    image: "https://images.unsplash.com/photo-1581093160562-40460b1f3b20?w=300&h=300&fit=crop",
    turnaround: "24 hours",
    category: "Laboratory Tests",
    description: "Complete blood count, lipid profile, glucose test",
    inStock: true
  },
  {
    id: 2,
    name: "COVID-19 PCR Test",
    provider: "Rapid Testing Center",
    price: 150,
    rating: 4.9,
    reviews: 1200,
    image: "https://images.unsplash.com/photo-1584308666744-24d5f15d850d?w=300&h=300&fit=crop",
    turnaround: "2 hours",
    category: "Testing",
    description: "Rapid PCR test with home delivery available",
    inStock: true
  },
  {
    id: 3,
    name: "Thyroid Panel Test",
    provider: "Central Diagnostics",
    price: 180,
    rating: 4.7,
    reviews: 245,
    image: "https://images.unsplash.com/photo-1576091160631-112d4c848fc1?w=300&h=300&fit=crop",
    turnaround: "48 hours",
    category: "Laboratory Tests",
    description: "TSH, Free T3, Free T4 tests",
    inStock: true
  },
  {
    id: 4,
    name: "Hepatitis Screening",
    provider: "Alpha Hospital Lab",
    price: 220,
    rating: 4.6,
    reviews: 187,
    image: "https://images.unsplash.com/photo-1576091160675-112d4c848fc1?w=300&h=300&fit=crop",
    turnaround: "48 hours",
    category: "Screening",
    description: "Hepatitis A, B, C antibody tests",
    inStock: true
  },
  {
    id: 5,
    name: "Home Care Service",
    provider: "Care Plus Services",
    price: 500,
    rating: 4.9,
    reviews: 412,
    image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=300&h=300&fit=crop",
    turnaround: "Same day",
    category: "Home Services",
    description: "Nurse visit, wound dressing, injections",
    inStock: true
  },
  {
    id: 6,
    name: "Vaccination Package",
    provider: "City Health Center",
    price: 380,
    rating: 4.7,
    reviews: 289,
    image: "https://images.unsplash.com/photo-1631217314942-bb88d1fec15f?w=300&h=300&fit=crop",
    turnaround: "Immediate",
    category: "Vaccination",
    description: "MMR, Tetanus, Yellow Fever vaccines",
    inStock: true
  }
];

const categories = ["All Services", "Laboratory Tests", "Testing", "Screening", "Home Services", "Vaccination"];

export function EcommerceServicesPage() {
  const [cart, setCart] = useState<ServiceItem[]>([]);
  const [favorites, setFavorites] = useState<number[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("All Services");
  const [showCart, setShowCart] = useState(false);
  const [sortBy, setSortBy] = useState("popular");

  const filteredServices = services.filter(service =>
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

  const totalPrice = cart.reduce((sum, item) => sum + item.price, 0);
  const cartCount = cart.length;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-teal-600 flex items-center justify-center">
              <span className="text-white text-sm font-bold">BP</span>
            </div>
            <span className="text-lg font-bold text-gray-900">BesaPlus Marketplace</span>
          </div>
          <button
            onClick={() => setShowCart(!showCart)}
            className="relative p-2 text-gray-600 hover:text-gray-900"
          >
            <ShoppingCart className="w-6 h-6" />
            {cartCount > 0 && (
              <span className="absolute top-1 right-1 w-5 h-5 bg-red-600 text-white text-xs rounded-full flex items-center justify-center font-bold">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Healthcare Services & Tests</h1>
          <p className="text-gray-600">Browse verified health services, lab tests, and home care packages</p>
        </div>

        <div className="flex gap-8">
          {/* Sidebar - Categories */}
          <aside className="w-56 shrink-0">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-24">
              <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Filter className="w-5 h-5" /> Categories
              </h3>
              <div className="space-y-2">
                {categories.map(category => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`block w-full text-left px-3 py-2 rounded-lg transition ${
                      selectedCategory === category
                        ? "bg-blue-100 text-blue-700 font-medium"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
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
            <div className="flex items-center justify-between mb-8">
              <p className="text-gray-600">
                Showing <span className="font-bold">{filteredServices.length}</span> services
              </p>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="popular">Most Popular</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
              </select>
            </div>

            {/* Services Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredServices.map(service => (
                <div
                  key={service.id}
                  className="bg-white rounded-lg shadow-sm hover:shadow-lg transition overflow-hidden border border-gray-100"
                >
                  {/* Image */}
                  <div className="h-40 bg-gray-200 relative overflow-hidden">
                    <img src={service.image} alt={service.name} className="w-full h-full object-cover" />
                    <button
                      onClick={() => toggleFavorite(service.id)}
                      className={`absolute top-3 right-3 p-2 rounded-full transition ${
                        favorites.includes(service.id)
                          ? "bg-red-500 text-white"
                          : "bg-white text-gray-600 hover:text-red-600"
                      }`}
                    >
                      <Heart className={`w-5 h-5 ${favorites.includes(service.id) ? "fill-current" : ""}`} />
                    </button>
                  </div>

                  {/* Content */}
                  <div className="p-4 space-y-3">
                    <div>
                      <p className="text-xs text-gray-600 uppercase font-semibold">{service.category}</p>
                      <h3 className="font-bold text-gray-900 mt-1">{service.name}</h3>
                      <p className="text-sm text-gray-600">{service.provider}</p>
                    </div>

                    <p className="text-sm text-gray-700">{service.description}</p>

                    {/* Rating & Turnaround */}
                    <div className="flex items-center justify-between text-sm py-2 border-y border-gray-200">
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="font-medium text-gray-900">{service.rating}</span>
                        <span className="text-gray-600">({service.reviews})</span>
                      </div>
                      <div className="flex items-center gap-1 text-gray-600">
                        <Clock className="w-4 h-4" />
                        <span>{service.turnaround}</span>
                      </div>
                    </div>

                    {/* Price & Add to Cart */}
                    <div className="flex items-end justify-between gap-2">
                      <div>
                        <p className="text-xs text-gray-600">Starting from</p>
                        <p className="text-2xl font-bold text-gray-900">₵{service.price}</p>
                      </div>
                      <button
                        onClick={() => toggleCart(service)}
                        className={`px-4 py-2 rounded-lg font-medium transition ${
                          cart.find(item => item.id === service.id)
                            ? "bg-blue-600 text-white hover:bg-blue-700"
                            : "border border-blue-600 text-blue-600 hover:bg-blue-50"
                        }`}
                      >
                        {cart.find(item => item.id === service.id) ? "Added" : "Add"}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </main>
        </div>
      </div>

      {/* Shopping Cart Sidebar */}
      {showCart && (
        <div className="fixed right-0 top-0 h-screen w-96 bg-white border-l border-gray-200 shadow-lg flex flex-col z-50">
          {/* Header */}
          <div className="border-b border-gray-200 p-6 flex items-center justify-between">
            <h2 className="text-lg font-bold text-gray-900">Shopping Cart</h2>
            <button
              onClick={() => setShowCart(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          </div>

          {/* Items */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {cart.length === 0 ? (
              <p className="text-center text-gray-600 py-8">Your cart is empty</p>
            ) : (
              cart.map(item => (
                <div key={item.id} className="bg-gray-50 rounded-lg p-4 flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="font-bold text-gray-900 text-sm">{item.name}</h4>
                    <p className="text-xs text-gray-600">{item.provider}</p>
                    <p className="text-lg font-bold text-gray-900 mt-2">₵{item.price}</p>
                  </div>
                  <button
                    onClick={() => toggleCart(item)}
                    className="text-gray-400 hover:text-red-600 p-1"
                  >
                    ✕
                  </button>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          {cart.length > 0 && (
            <div className="border-t border-gray-200 p-6 space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-gray-700">
                  <span>Subtotal</span>
                  <span>₵{totalPrice}</span>
                </div>
                <div className="flex items-center justify-between text-gray-700">
                  <span>Delivery</span>
                  <span>₵20</span>
                </div>
                <div className="flex items-center justify-between text-lg font-bold text-gray-900 pt-2 border-t border-gray-200">
                  <span>Total</span>
                  <span>₵{totalPrice + 20}</span>
                </div>
              </div>
              <button className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-bold">
                Proceed to Checkout
              </button>
              <button
                onClick={() => setShowCart(false)}
                className="w-full py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition font-medium"
              >
                Continue Shopping
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
