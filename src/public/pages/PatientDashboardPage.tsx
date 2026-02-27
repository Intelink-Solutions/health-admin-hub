import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Calendar, MessageCircle, FileText, ShoppingCart, History, Settings, LogOut, Bell, User, ChevronRight, Clock, MapPin, UserCircle, Menu, X, Home, Video } from "lucide-react";
import { BookingFormModal } from "@/components/BookingFormModal";
import { useAuth } from "@/context/AuthContext";

interface Appointment {
  id: number;
  doctor: string;
  specialty: string;
  date: string;
  time: string;
  status: "upcoming" | "completed" | "cancelled";
  location?: string;
  type: "in-person" | "online";
}

interface Message {
  id: number;
  doctor: string;
  lastMessage: string;
  time: string;
  unread: number;
}

type PatientDashboardTab = "appointments" | "messages" | "prescriptions" | "orders";

const sampleAppointments: Appointment[] = [
  {
    id: 1,
    doctor: "Dr. Sarah Johnson",
    specialty: "General Practitioner",
    date: "Today",
    time: "2:00 PM - 2:30 PM",
    status: "upcoming",
    type: "online",
    location: "Video Call"
  },
  {
    id: 2,
    doctor: "Dr. Kofi Mensah",
    specialty: "Cardiologist",
    date: "Dec 15, 2024",
    time: "10:30 AM",
    status: "upcoming",
    type: "in-person",
    location: "Ridge Hospital"
  },
  {
    id: 3,
    doctor: "Dr. Ama Asante",
    specialty: "Pediatrician",
    date: "Dec 8, 2024",
    time: "3:15 PM",
    status: "completed",
    type: "online"
  }
];

const sampleMessages: Message[] = [
  {
    id: 1,
    doctor: "Dr. Sarah Johnson",
    lastMessage: "Take the medications as prescribed",
    time: "2 hours ago",
    unread: 0
  },
  {
    id: 2,
    doctor: "Mercy Health Clinic",
    lastMessage: "Your lab results are ready",
    time: "Yesterday",
    unread: 1
  },
  {
    id: 3,
    doctor: "Dr. Kofi Mensah",
    lastMessage: "Please come 15 minutes early",
    time: "3 days ago",
    unread: 0
  }
];

export function PatientDashboardPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();
  const getTabFromSearch = (search: string): PatientDashboardTab => {
    const tabParam = new URLSearchParams(search).get("tab");
    if (tabParam === "messages" || tabParam === "prescriptions" || tabParam === "orders") {
      return tabParam;
    }
    return "appointments";
  };

  const [activeTab, setActiveTab] = useState<PatientDashboardTab>(
    getTabFromSearch(location.search)
  );
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showBookModal, setShowBookModal] = useState(false);

  useEffect(() => {
    if (location.pathname === "/user/dashboard") {
      setActiveTab(getTabFromSearch(location.search));
    }
  }, [location.pathname, location.search]);

  const sideNavItems = [
    { id: "home", label: "Home", icon: Home, path: "/home" },
    { id: "appointments", label: "Appointments", icon: Calendar, tab: "appointments" as const },
    { id: "messages", label: "Messages", icon: MessageCircle, tab: "messages" as const },
    { id: "prescriptions", label: "Prescriptions", icon: FileText, tab: "prescriptions" as const },
    { id: "orders", label: "Orders", icon: ShoppingCart, tab: "orders" as const },
    { id: "telemedicine", label: "Telemedicine", icon: Video, path: "/telemedicine/consultation" },
    { id: "services", label: "Services", icon: ShoppingCart, path: "/marketplace/services" },
  ];

  const bottomNavItems = [
    { id: "home", label: "Home", icon: Home, onClick: () => navigate("/home") },
    { id: "dashboard", label: "Dashboard", icon: Calendar, onClick: () => setActiveTab("appointments") },
    { id: "telemedicine", label: "Telemed", icon: Video, onClick: () => navigate("/telemedicine/consultation") },
    { id: "menu", label: "Menu", icon: Menu, onClick: () => setSidebarOpen(true) },
  ];

  const dashboardTabs: Array<{ id: PatientDashboardTab; label: string; icon: typeof Calendar }> = [
    { id: "appointments", label: "Appointments", icon: Calendar },
    { id: "messages", label: "Messages", icon: MessageCircle },
    { id: "prescriptions", label: "Prescriptions", icon: FileText },
    { id: "orders", label: "Orders", icon: ShoppingCart },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950 flex overflow-x-hidden transition-colors duration-300">
      {/* Side Navigation */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-slate-900 border-r border-gray-200 dark:border-slate-800 transform transition-transform duration-300 lg:translate-x-0 lg:static flex flex-col h-screen ${
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      }`}>
        <div className="h-16 flex items-center justify-between px-4 border-b border-gray-200 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-teal-600 flex items-center justify-center">
              <span className="text-white text-sm font-bold">BP</span>
            </div>
            <span className="text-lg font-bold text-gray-900 dark:text-white">User</span>
          </div>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden p-1 text-gray-500 dark:text-slate-400 hover:text-gray-700 dark:hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="p-4 space-y-1 flex-1 overflow-y-auto scrollbar-hide">
          {sideNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = item.tab
              ? location.pathname === "/user/dashboard" && activeTab === item.tab
              : item.path
              ? location.pathname === item.path
              : false;
            return (
              <button
                key={item.id}
                onClick={() => {
                  if (item.tab) {
                    navigate(`/user/dashboard?tab=${item.tab}`);
                    setActiveTab(item.tab);
                  }
                  if (item.path) {
                    navigate(item.path);
                  }
                  setSidebarOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                  isActive
                    ? "bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 font-medium"
                    : "text-gray-600 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-800 hover:text-gray-900 dark:hover:text-white"
                }`}
              >
                <Icon className="w-5 h-5" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="p-4 border-t border-gray-200 dark:border-slate-800">
          <button
            className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-lg transition"
            onClick={() => {
              logout();
              navigate("/login");
            }}
          >
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      <div className="flex-1 flex flex-col min-w-0 overflow-x-hidden">
        {/* Header */}
        <header className="bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-slate-800 sticky top-0 z-30">
          <div className="max-w-7xl mx-auto px-2.5 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-2 sm:gap-3">
            <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
              <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-1.5 sm:p-2 text-gray-600 dark:text-slate-300 hover:text-gray-900 dark:hover:text-white shrink-0">
                <Menu className="w-5 h-5" />
              </button>
              <div className="flex items-center gap-2 min-w-0">
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-gradient-to-br from-blue-600 to-teal-600 flex items-center justify-center shrink-0">
                  <span className="text-white text-sm font-bold">BP</span>
                </div>
                <span className="text-sm sm:text-lg font-bold text-gray-900 dark:text-white truncate">BesaPlus</span>
              </div>
            </div>
            <div className="flex items-center gap-1 sm:gap-3 shrink-0">
              <button className="relative p-1.5 sm:p-2 text-gray-600 dark:text-slate-300 hover:text-gray-900 dark:hover:text-white">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-600 rounded-full"></span>
              </button>
              <button
                className="p-1.5 sm:p-2 text-gray-600 dark:text-slate-300 hover:text-gray-900 dark:hover:text-white"
                onClick={() => navigate("/user/settings")}
              >
                <Settings className="w-5 h-5" />
              </button>
              <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-slate-700 items-center justify-center hidden sm:flex">
                <User className="w-5 h-5 text-blue-600" />
              </div>
            </div>
          </div>
        </header>

        <div className="w-full max-w-7xl mx-auto px-2 sm:px-6 lg:px-8 py-3 sm:py-8 pb-24 lg:pb-8">
        {/* Welcome Card */}
          <div className="mb-4 sm:mb-8 bg-gradient-to-r from-blue-600 to-teal-600 rounded-lg sm:rounded-xl p-3 sm:p-8 text-white">
            <h1 className="text-xl sm:text-3xl font-bold mb-1 sm:mb-2">Welcome back, John!</h1>
            <p className="text-xs sm:text-base text-blue-100">You have 1 appointment today at 2:00 PM</p>
        </div>

        {/* Quick Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4 mb-5 sm:mb-8">
            <div className="bg-white dark:bg-slate-900 rounded-lg p-3 sm:p-4 border border-gray-200 dark:border-slate-800">
              <Calendar className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600 mb-2" />
              <p className="text-xs sm:text-sm text-gray-600 dark:text-slate-400">Next Appointment</p>
              <p className="text-sm sm:text-lg font-bold text-gray-900 dark:text-white">Today, 2:00 PM</p>
            </div>
            <div className="bg-white dark:bg-slate-900 rounded-lg p-3 sm:p-4 border border-gray-200 dark:border-slate-800">
              <MessageCircle className="w-6 h-6 sm:w-8 sm:h-8 text-teal-600 mb-2" />
              <p className="text-xs sm:text-sm text-gray-600 dark:text-slate-400">Unread Messages</p>
              <p className="text-sm sm:text-lg font-bold text-gray-900 dark:text-white">1 new</p>
            </div>
            <div className="bg-white dark:bg-slate-900 rounded-lg p-3 sm:p-4 border border-gray-200 dark:border-slate-800">
              <FileText className="w-6 h-6 sm:w-8 sm:h-8 text-orange-600 mb-2" />
              <p className="text-xs sm:text-sm text-gray-600 dark:text-slate-400">Pending Prescriptions</p>
              <p className="text-sm sm:text-lg font-bold text-gray-900 dark:text-white">2 items</p>
            </div>
            <div className="bg-white dark:bg-slate-900 rounded-lg p-3 sm:p-4 border border-gray-200 dark:border-slate-800">
              <ShoppingCart className="w-6 h-6 sm:w-8 sm:h-8 text-green-600 mb-2" />
              <p className="text-xs sm:text-sm text-gray-600 dark:text-slate-400">Active Orders</p>
              <p className="text-sm sm:text-lg font-bold text-gray-900 dark:text-white">1 order</p>
            </div>
        </div>

          <div className="grid lg:grid-cols-3 gap-3 sm:gap-8">
          {/* Main Content */}
            <div className="lg:col-span-2 space-y-4 sm:space-y-6">
            {/* Tabs */}
              <div className="grid grid-cols-2 sm:flex gap-2 border-b border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-lg p-2 sm:p-4">
              {dashboardTabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center justify-center gap-1.5 sm:gap-2 px-2.5 sm:px-4 py-2 rounded-lg transition whitespace-nowrap text-xs sm:text-base ${
                    activeTab === tab.id
                      ? "bg-blue-100 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 font-medium"
                      : "text-gray-600 dark:text-slate-300 hover:text-gray-900 dark:hover:text-white"
                  }`}
                >
                  <tab.icon className="w-4 h-4" />
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Appointments Tab */}
            {activeTab === "appointments" && (
              <div className="space-y-4">
                {sampleAppointments.map(appointment => (
                  <div
                    key={appointment.id}
                    className="bg-white dark:bg-slate-900 rounded-lg p-4 sm:p-6 border border-gray-200 dark:border-slate-800 hover:shadow-md transition cursor-pointer"
                    onClick={() => setSelectedAppointment(appointment)}
                  >
                    <div className="flex items-start justify-between gap-3 mb-4 flex-col sm:flex-row">
                      <div className="min-w-0 w-full">
                        <h3 className="font-bold text-gray-900 dark:text-white text-sm sm:text-base break-words">{appointment.doctor}</h3>
                        <p className="text-xs sm:text-sm text-gray-600 dark:text-slate-400 break-words">{appointment.specialty}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium shrink-0 ${
                        appointment.status === "upcoming"
                          ? "bg-blue-100 text-blue-700"
                          : appointment.status === "completed"
                          ? "bg-green-100 text-green-700"
                            : "bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-slate-200"
                      }`}>
                        {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                      </span>
                    </div>

                    <div className="space-y-2 text-xs sm:text-sm text-gray-600 dark:text-slate-400">
                      <div className="flex items-start gap-2">
                        <Calendar className="w-4 h-4 mt-0.5 shrink-0" />
                        <span className="break-words">{appointment.date} at {appointment.time}</span>
                      </div>
                      <div className="flex items-start gap-2">
                        {appointment.type === "online" ? (
                          <>
                            <MessageCircle className="w-4 h-4 mt-0.5 shrink-0" />
                            <span className="break-words">Video Call</span>
                          </>
                        ) : (
                          <>
                            <MapPin className="w-4 h-4 mt-0.5 shrink-0" />
                            <span className="break-words">{appointment.location}</span>
                          </>
                        )}
                      </div>
                    </div>

                    {appointment.status === "upcoming" && (
                      <div className="mt-4 flex flex-col sm:flex-row gap-2">
                        <button
                          className="flex-1 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-xs sm:text-sm font-medium"
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate("/telemedicine/consultation");
                          }}
                        >
                          {appointment.type === "online" ? "Join Call" : "Check In"}
                        </button>
                        <button
                          className="w-full sm:w-auto px-3 sm:px-4 py-2.5 border border-gray-300 dark:border-slate-700 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-800 transition shrink-0 flex items-center justify-center gap-2 text-gray-700 dark:text-slate-200"
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate("/chat");
                          }}
                        >
                          <MessageCircle className="w-4 h-4" />
                          <span className="text-xs sm:hidden font-medium">Message</span>
                        </button>
                      </div>
                    )}
                  </div>
                ))}

                <button
                  className="w-full py-3.5 border border-dashed border-gray-300 dark:border-slate-700 rounded-lg text-blue-600 dark:text-blue-400 font-medium hover:bg-blue-50 dark:hover:bg-blue-950/20 transition text-sm"
                  onClick={() => setShowBookModal(true)}
                >
                  + Book New Appointment
                </button>
              </div>
            )}

            {/* Messages Tab */}
            {activeTab === "messages" && (
              <div className="space-y-3">
                {sampleMessages.map(message => (
                  <div
                    key={message.id}
                    className="bg-white dark:bg-slate-900 rounded-lg p-3 sm:p-4 border border-gray-200 dark:border-slate-800 hover:shadow-md transition cursor-pointer"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-2">
                      <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2 min-w-0 w-full sm:w-auto">
                        <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-slate-700"></div>
                        <span className="truncate">{message.doctor}</span>
                        {message.unread > 0 && (
                          <span className="px-2 py-0.5 bg-red-600 text-white text-xs rounded-full shrink-0">{message.unread}</span>
                        )}
                      </h3>
                      <span className="text-[11px] sm:text-xs text-gray-600 dark:text-slate-400 self-end sm:self-auto shrink-0">{message.time}</span>
                    </div>
                    <p className="text-xs sm:text-sm text-gray-600 dark:text-slate-400 break-words leading-relaxed">{message.lastMessage}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Prescriptions Tab */}
            {activeTab === "prescriptions" && (
              <div className="space-y-4">
                {[1, 2].map(i => (
                  <div key={i} className="bg-white dark:bg-slate-900 rounded-lg p-4 sm:p-6 border border-gray-200 dark:border-slate-800">
                    <div className="flex items-start sm:items-center justify-between gap-2 mb-4">
                      <div>
                        <h3 className="font-bold text-gray-900 dark:text-white">Prescription from Dr. Sarah Johnson</h3>
                        <p className="text-sm text-gray-600 dark:text-slate-400">Issued 2 days ago</p>
                      </div>
                      <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">Active</span>
                    </div>
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-700 dark:text-slate-200">Ibuprofen 200mg</span>
                        <span className="text-gray-600 dark:text-slate-400">3 times daily</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-700 dark:text-slate-200">Amoxicillin 500mg</span>
                        <span className="text-gray-600 dark:text-slate-400">Twice daily</span>
                      </div>
                    </div>
                    <button
                      className="w-full py-2 border border-blue-600 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-950/20 transition text-sm font-medium"
                      onClick={() => navigate("/marketplace/services")}
                    >
                      View & Download
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Orders Tab */}
            {activeTab === "orders" && (
              <div className="space-y-4">
                  <div className="bg-white dark:bg-slate-900 rounded-lg p-4 sm:p-6 border border-gray-200 dark:border-slate-800">
                  <div className="flex items-start justify-between gap-2 mb-4">
                    <div>
                      <h3 className="font-bold text-gray-900 dark:text-white">Lab Test Package</h3>
                      <p className="text-sm text-gray-600 dark:text-slate-400">Order #LP-001234</p>
                    </div>
                    <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">Completed</span>
                  </div>
                  <div className="flex items-center justify-between text-sm mb-4">
                    <span className="text-gray-700 dark:text-slate-200">Full Blood Checkup</span>
                    <span className="font-bold text-gray-900 dark:text-white">₵250.00</span>
                  </div>
                  <button
                    className="w-full py-2 border border-blue-600 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-950/20 transition text-sm font-medium"
                    onClick={() => navigate("/marketplace/services")}
                  >
                    View Results
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <aside className="space-y-4 sm:space-y-6">
            {/* Profile Card */}
            <div className="bg-white dark:bg-slate-900 rounded-lg p-4 sm:p-6 border border-gray-200 dark:border-slate-800">
              <div className="flex items-center gap-3 sm:gap-4 mb-4">
                <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-slate-700 flex items-center justify-center">
                  <UserCircle className="w-8 h-8 text-blue-600" />
                </div>
                <div className="min-w-0">
                  <h3 className="font-bold text-gray-900 dark:text-white truncate">John Doe</h3>
                  <p className="text-xs text-gray-600 dark:text-slate-400">Member since 2024</p>
                </div>
              </div>
              <button
                className="w-full py-2 border border-gray-300 dark:border-slate-700 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-800 transition text-sm font-medium text-gray-800 dark:text-slate-200"
                onClick={() => navigate("/user/dashboard")}
              >
                Edit Profile
              </button>
            </div>

            {/* Upcoming Appointment */}
            <div className="bg-gradient-to-br from-blue-50 to-teal-50 dark:from-slate-900 dark:to-slate-800 rounded-lg p-4 sm:p-6 border border-blue-200 dark:border-slate-700">
              <h3 className="font-bold text-gray-900 dark:text-white mb-3 text-sm sm:text-base">Today's Appointment</h3>
              <div className="space-y-2 text-xs sm:text-sm mb-4">
                <div className="flex items-center gap-2 text-gray-700 dark:text-slate-300">
                  <Clock className="w-4 h-4 text-blue-600" />
                  <span>2:00 PM - 2:30 PM</span>
                </div>
                <div className="text-gray-700 dark:text-slate-200 font-medium">Dr. Sarah Johnson</div>
                <div className="text-gray-600 dark:text-slate-400">General Consultation</div>
              </div>
              <button
                className="w-full py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-xs sm:text-sm font-bold"
                onClick={() => navigate("/telemedicine/consultation")}
              >
                Join Video Call
              </button>
            </div>

            {/* Health Tips */}
            <div className="bg-white dark:bg-slate-900 rounded-lg p-4 sm:p-6 border border-gray-200 dark:border-slate-800">
              <h3 className="font-bold text-gray-900 dark:text-white mb-4 text-sm sm:text-base">Health Tips</h3>
              <div className="space-y-3">
                <div className="p-3 bg-green-50 dark:bg-green-950/30 rounded-lg border border-green-200 dark:border-green-900/50">
                  <p className="text-xs font-medium text-green-700 dark:text-green-300">Stay Hydrated</p>
                  <p className="text-xs text-green-600 dark:text-green-400 mt-1 break-words">Drink 8-10 glasses of water daily</p>
                </div>
                <div className="p-3 bg-orange-50 dark:bg-orange-950/30 rounded-lg border border-orange-200 dark:border-orange-900/50">
                  <p className="text-xs font-medium text-orange-700 dark:text-orange-300">Exercise Daily</p>
                  <p className="text-xs text-orange-600 dark:text-orange-400 mt-1 break-words">30 minutes of moderate activity</p>
                </div>
              </div>
            </div>
          </aside>
        </div>
        </div>
        {/* Appointment Modal */}
        {selectedAppointment && (
          <div className="fixed inset-0 bg-black/50 flex items-end sm:items-center justify-center p-2 sm:p-4 z-50">
            <div className="bg-white dark:bg-slate-900 rounded-lg max-w-md w-full p-4 sm:p-6 max-h-[90vh] overflow-y-auto border border-gray-200 dark:border-slate-800">
              <div className="flex items-center justify-end mb-1">
                <button
                  onClick={() => setSelectedAppointment(null)}
                  className="text-gray-400 hover:text-gray-600 dark:text-slate-500 dark:hover:text-slate-300"
                >
                  ✕
                </button>
              </div>
              <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Appointment Details</h2>
              <div className="space-y-3 mb-6">
                <div>
                  <p className="text-xs text-gray-600 dark:text-slate-400">Doctor</p>
                  <p className="font-bold text-gray-900 dark:text-white">{selectedAppointment.doctor}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-600 dark:text-slate-400">Date & Time</p>
                  <p className="font-bold text-gray-900 dark:text-white">{selectedAppointment.date}, {selectedAppointment.time}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-600 dark:text-slate-400">Type</p>
                  <p className="font-bold text-gray-900 dark:text-white capitalize">{selectedAppointment.type}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedAppointment(null)}
                className="w-full py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition"
              >
                Close
              </button>
            </div>
          </div>
        )}

        <BookingFormModal
          open={showBookModal}
          title="Book Appointment"
          onClose={() => setShowBookModal(false)}
        />

        {/* Mobile Bottom Navigation */}
        <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-slate-900 border-t border-gray-200 dark:border-slate-800 z-40 pb-[env(safe-area-inset-bottom)]">
          <div className="grid grid-cols-4 gap-1 p-2">
            {bottomNavItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={item.onClick}
                  className="flex flex-col items-center justify-center gap-1 p-2 rounded-lg transition text-gray-600 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-800 min-h-14"
                >
                  <Icon className="w-5 h-5" />
                  <span className="text-[11px] font-medium leading-none">{item.label}</span>
                </button>
              );
            })}
          </div>
        </nav>
      </div>
    </div>
  );
}
