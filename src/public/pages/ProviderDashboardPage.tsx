import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { 
  Calendar, Users, TrendingUp, Settings, LogOut, Bell, Clock, AlertCircle, Download, ChevronRight,
  LayoutDashboard, Phone, PhoneCall, PhoneIncoming, PhoneOutgoing, Video, Menu, X,
  BarChart3, Activity, Eye, MousePointerClick, UserCheck, Wallet, Home, ClipboardList
} from "lucide-react";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

interface ProviderAppointment {
  id: number;
  patientName: string;
  patientPhone: string;
  time: string;
  type: "online" | "in-person";
  status: "completed" | "upcoming" | "no-show" | "missed-call";
  fee: number;
  needsCallback?: boolean;
}

interface ProviderStats {
  totalPatients: number;
  monthlyEarnings: number;
  completedConsultations: number;
  avgRating: number;
}

interface AnalyticsData {
  period: string;
  calls: number;
  clicks: number;
  views: number;
  bookings: number;
}

interface CallRecord {
  id: number;
  patientName: string;
  patientPhone: string;
  type: "incoming" | "outgoing" | "missed";
  duration: string;
  timestamp: string;
  status: "completed" | "missed" | "ongoing";
}

type ProviderNavSection = "dashboard" | "appointments" | "analytics" | "calls" | "patients" | "earnings";

const dailyAnalytics: AnalyticsData[] = [
  { period: "Mon", calls: 12, clicks: 45, views: 234, bookings: 8 },
  { period: "Tue", calls: 15, clicks: 52, views: 267, bookings: 10 },
  { period: "Wed", calls: 10, clicks: 38, views: 198, bookings: 6 },
  { period: "Thu", calls: 18, clicks: 61, views: 312, bookings: 12 },
  { period: "Fri", calls: 14, clicks: 48, views: 245, bookings: 9 },
  { period: "Sat", calls: 8, clicks: 28, views: 156, bookings: 5 },
  { period: "Sun", calls: 6, clicks: 22, views: 123, bookings: 3 },
];

const weeklyAnalytics: AnalyticsData[] = [
  { period: "Week 1", calls: 68, clicks: 287, views: 1234, bookings: 42 },
  { period: "Week 2", calls: 72, clicks: 298, views: 1312, bookings: 45 },
  { period: "Week 3", calls: 65, clicks: 276, views: 1198, bookings: 38 },
  { period: "Week 4", calls: 78, clicks: 315, views: 1456, bookings: 51 },
];

const monthlyAnalytics: AnalyticsData[] = [
  { period: "Jan", calls: 245, clicks: 1087, views: 4523, bookings: 156 },
  { period: "Feb", calls: 268, clicks: 1124, views: 4789, bookings: 168 },
  { period: "Mar", calls: 287, clicks: 1198, views: 5012, bookings: 182 },
  { period: "Apr", calls: 312, clicks: 1287, views: 5345, bookings: 198 },
  { period: "May", calls: 298, clicks: 1245, views: 5123, bookings: 189 },
  { period: "Jun", calls: 325, clicks: 1356, views: 5678, bookings: 212 },
];

const upcomingAppointments: ProviderAppointment[] = [
  { id: 1, patientName: "John Doe", patientPhone: "+233 24 123 4567", time: "2:00 PM - 2:30 PM", type: "online", status: "upcoming", fee: 150 },
  { id: 2, patientName: "Jane Smith", patientPhone: "+233 24 234 5678", time: "3:00 PM - 3:30 PM", type: "in-person", status: "upcoming", fee: 150 },
  { id: 3, patientName: "Michael Brown", patientPhone: "+233 24 345 6789", time: "4:00 PM - 4:45 PM", type: "online", status: "upcoming", fee: 150 }
];

const pastAppointments: ProviderAppointment[] = [
  { id: 4, patientName: "Emma Wilson", patientPhone: "+233 24 456 7890", time: "12:00 PM - 12:30 PM", type: "online", status: "completed", fee: 150 },
  { id: 5, patientName: "David Lee", patientPhone: "+233 24 567 8901", time: "10:00 AM - 10:30 AM", type: "in-person", status: "completed", fee: 150 },
  { id: 6, patientName: "Sarah Johnson", patientPhone: "+233 24 678 9012", time: "9:00 AM - 9:30 AM", type: "online", status: "missed-call", fee: 150, needsCallback: true }
];

const callRecords: CallRecord[] = [
  { id: 1, patientName: "John Doe", patientPhone: "+233 24 123 4567", type: "incoming", duration: "12:34", timestamp: "2 hours ago", status: "completed" },
  { id: 2, patientName: "Jane Smith", patientPhone: "+233 24 234 5678", type: "outgoing", duration: "8:21", timestamp: "3 hours ago", status: "completed" },
  { id: 3, patientName: "Michael Brown", patientPhone: "+233 24 345 6789", type: "missed", duration: "0:00", timestamp: "4 hours ago", status: "missed" },
  { id: 4, patientName: "Sarah Wilson", patientPhone: "+233 24 456 7890", type: "incoming", duration: "15:42", timestamp: "5 hours ago", status: "completed" },
  { id: 5, patientName: "David Lee", patientPhone: "+233 24 567 8901", type: "outgoing", duration: "6:18", timestamp: "6 hours ago", status: "completed" },
];

export function ProviderDashboardPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();
  const [activeNav, setActiveNav] = useState<ProviderNavSection>("dashboard");
  const [analyticsView, setAnalyticsView] = useState<"daily" | "weekly" | "monthly">("daily");
  const [selectedAppointment, setSelectedAppointment] = useState<ProviderAppointment | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showCallbackModal, setShowCallbackModal] = useState(false);
  const [selectedCallback, setSelectedCallback] = useState<ProviderAppointment | null>(null);

  const stats: ProviderStats = {
    totalPatients: 342,
    monthlyEarnings: 12500,
    completedConsultations: 98,
    avgRating: 4.9
  };

  const getAnalyticsData = () => {
    switch (analyticsView) {
      case "daily": return dailyAnalytics;
      case "weekly": return weeklyAnalytics;
      case "monthly": return monthlyAnalytics;
      default: return dailyAnalytics;
    }
  };

  const navigationItems: Array<{ id: ProviderNavSection | "services"; label: string; icon: typeof LayoutDashboard; path?: string }> = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "appointments", label: "Appointments", icon: Calendar },
    { id: "analytics", label: "Analytics", icon: BarChart3 },
    { id: "calls", label: "Call Logs", icon: Phone },
    { id: "patients", label: "Patients", icon: Users },
    { id: "earnings", label: "Earnings", icon: Wallet },
    { id: "services", label: "Post Service", icon: ClipboardList, path: "/provider/services" },
  ];

  const handleCallback = (appointment: ProviderAppointment) => {
    setSelectedCallback(appointment);
    setShowCallbackModal(true);
  };

  const bottomNavItems = [
    {
      id: "home",
      label: "Home",
      icon: Home,
      onClick: () => navigate("/home"),
      isActive: location.pathname === "/home" || location.pathname === "/",
    },
    {
      id: "dashboard",
      label: "Dashboard",
      icon: BarChart3,
      onClick: () => {
        navigate("/provider/dashboard");
        setActiveNav("dashboard");
      },
      isActive: location.pathname.startsWith("/provider/") && activeNav === "dashboard",
    },
    {
      id: "telemedicine",
      label: "Telemedicine",
      icon: Video,
      onClick: () => navigate("/telemedicine/consultation"),
      isActive: location.pathname.startsWith("/telemedicine/"),
    },
    {
      id: "menu",
      label: "Menu",
      icon: Menu,
      onClick: () => setSidebarOpen(true),
      isActive: sidebarOpen,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950 flex transition-colors duration-300 overflow-x-hidden">
      {/* Side Navigation - Desktop */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-slate-900 border-r border-gray-200 dark:border-slate-800 transform transition-transform duration-300 lg:translate-x-0 lg:static flex flex-col h-screen ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="h-16 flex items-center justify-between px-4 border-b border-gray-200 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-teal-600 flex items-center justify-center">
              <span className="text-white text-sm font-bold">BP</span>
            </div>
            <span className="text-lg font-bold text-gray-900 dark:text-white">Provider</span>
          </div>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden p-1 text-gray-500 dark:text-slate-400 hover:text-gray-700 dark:hover:text-slate-200">
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="p-4 space-y-1 flex-1 overflow-y-auto scrollbar-hide">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeNav === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  if (item.path) {
                    navigate(item.path);
                    setSidebarOpen(false);
                    return;
                  }
                  setActiveNav(item.id as ProviderNavSection);
                  setSidebarOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                  isActive ? 'bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 font-medium' : 'text-gray-600 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-800 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="p-4 border-t border-gray-200 dark:border-slate-800">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-teal-500 flex items-center justify-center">
              <span className="text-white font-bold">SJ</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-gray-900 dark:text-white text-sm truncate">Dr. Sarah Johnson</p>
              <p className="text-xs text-gray-600 dark:text-slate-400">Cardiologist</p>
            </div>
          </div>
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

      {sidebarOpen && <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />}

      <div className="flex-1 flex flex-col min-w-0 overflow-x-hidden">
        <header className="bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-slate-800 sticky top-0 z-30">
          <div className="h-16 px-3 sm:px-6 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 text-gray-600 dark:text-slate-300 hover:text-gray-900 dark:hover:text-white">
                <Menu className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">
                  {navigationItems.find(item => item.id === activeNav)?.label || "Dashboard"}
                </h1>
                <p className="text-xs text-gray-500 dark:text-slate-400 hidden sm:block">Manage your practice efficiently</p>
              </div>
            </div>
            <div className="flex items-center gap-2 sm:gap-4">
              <button className="relative p-2 text-gray-600 dark:text-slate-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg transition">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-600 rounded-full"></span>
              </button>
              <button
                className="p-2 text-gray-600 dark:text-slate-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg transition"
                onClick={() => navigate("/provider/settings")}
              >
                <Settings className="w-5 h-5" />
              </button>
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-blue-500 to-teal-500 flex items-center justify-center lg:hidden">
                <span className="text-white font-bold text-xs sm:text-sm">SJ</span>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-auto p-3 sm:p-6">
          {activeNav === "dashboard" && (
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-blue-600 to-teal-600 rounded-lg sm:rounded-xl p-4 sm:p-6 text-white">
                <h2 className="text-xl sm:text-2xl font-bold mb-1">Welcome back, Dr. Sarah Johnson!</h2>
                <p className="text-sm text-blue-100">You have 3 appointments scheduled for today</p>
              </div>

              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                <div className="bg-white dark:bg-slate-900 rounded-lg p-4 border border-gray-200 dark:border-slate-800 hover:shadow-lg transition">
                  <Users className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600 mb-2" />
                  <p className="text-xs sm:text-sm text-gray-600 dark:text-slate-400">Total Patients</p>
                  <p className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">{stats.totalPatients}</p>
                </div>
                <div className="bg-white dark:bg-slate-900 rounded-lg p-4 border border-gray-200 dark:border-slate-800 hover:shadow-lg transition">
                  <TrendingUp className="w-6 h-6 sm:w-8 sm:h-8 text-green-600 mb-2" />
                  <p className="text-xs sm:text-sm text-gray-600 dark:text-slate-400">This Month</p>
                  <p className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">₵{stats.monthlyEarnings.toLocaleString()}</p>
                </div>
                <div className="bg-white dark:bg-slate-900 rounded-lg p-4 border border-gray-200 dark:border-slate-800 hover:shadow-lg transition">
                  <Calendar className="w-6 h-6 sm:w-8 sm:h-8 text-orange-600 mb-2" />
                  <p className="text-xs sm:text-sm text-gray-600 dark:text-slate-400">Completed</p>
                  <p className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">{stats.completedConsultations}</p>
                </div>
                <div className="bg-white dark:bg-slate-900 rounded-lg p-4 border border-gray-200 dark:border-slate-800 hover:shadow-lg transition">
                  <Activity className="w-6 h-6 sm:w-8 sm:h-8 text-purple-600 mb-2" />
                  <p className="text-xs sm:text-sm text-gray-600 dark:text-slate-400">Rating</p>
                  <p className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">{stats.avgRating}★</p>
                </div>
              </div>

              <div className="grid lg:grid-cols-2 gap-6">
                <div className="bg-white dark:bg-slate-900 rounded-lg p-4 sm:p-6 border border-gray-200 dark:border-slate-800">
                  <h3 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                    <Clock className="w-5 h-5 text-blue-600" /> Today's Schedule
                  </h3>
                  <div className="space-y-3">
                    {upcomingAppointments.slice(0,3).map(apt => (
                      <div key={apt.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-slate-800 rounded-lg">
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-gray-900 dark:text-white text-sm truncate">{apt.patientName}</p>
                          <p className="text-xs text-gray-600 dark:text-slate-400">{apt.time}</p>
                        </div>
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          apt.type === "online" ? "bg-blue-100 text-blue-700" : "bg-green-100 text-green-700"
                        }`}>
                          {apt.type === "online" ? "Video" : "In-Person"}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white dark:bg-slate-900 rounded-lg p-4 sm:p-6 border border-gray-200 dark:border-slate-800">
                  <h3 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                    <Activity className="w-5 h-5 text-purple-600" /> Today's Activity
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Eye className="w-4 h-4 text-blue-600" />
                        <span className="text-sm text-gray-600 dark:text-slate-400">Profile Views</span>
                      </div>
                      <span className="font-bold text-gray-900 dark:text-white">234</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <MousePointerClick className="w-4 h-4 text-green-600" />
                        <span className="text-sm text-gray-600 dark:text-slate-400">Clicks</span>
                      </div>
                      <span className="font-bold text-gray-900 dark:text-white">45</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <PhoneCall className="w-4 h-4 text-orange-600" />
                        <span className="text-sm text-gray-600 dark:text-slate-400">Calls Today</span>
                      </div>
                      <span className="font-bold text-gray-900 dark:text-white">12</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <UserCheck className="w-4 h-4 text-purple-600" />
                        <span className="text-sm text-gray-600 dark:text-slate-400">New Bookings</span>
                      </div>
                      <span className="font-bold text-gray-900 dark:text-white">8</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeNav === "analytics" && (
            <div className="space-y-6">
              <div className="bg-white dark:bg-slate-900 rounded-lg p-4 border border-gray-200 dark:border-slate-800">
                <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
                  <h3 className="font-bold text-gray-900 dark:text-white">Analytics Overview</h3>
                  <div className="flex gap-2">
                    {(["daily", "weekly", "monthly"] as const).map((period) => (
                      <button
                        key={period}
                        onClick={() => setAnalyticsView(period)}
                        className={`px-3 sm:px-4 py-2 rounded-lg font-medium capitalize transition text-xs sm:text-sm ${
                          analyticsView === period ? "bg-blue-600 text-white shadow-lg" : "bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-slate-300 hover:bg-gray-200 dark:hover:bg-slate-700"
                        }`}
                      >
                        {period}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
                  <div className="p-3 sm:p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <PhoneCall className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600 mb-2" />
                    <p className="text-xs sm:text-sm text-blue-700">Total Calls</p>
                    <p className="text-lg sm:text-2xl font-bold text-blue-900">
                      {getAnalyticsData().reduce((sum, d) => sum + d.calls, 0)}
                    </p>
                  </div>
                  <div className="p-3 sm:p-4 bg-green-50 rounded-lg border border-green-200">
                    <MousePointerClick className="w-5 h-5 sm:w-6 sm:h-6 text-green-600 mb-2" />
                    <p className="text-xs sm:text-sm text-green-700">Total Clicks</p>
                    <p className="text-lg sm:text-2xl font-bold text-green-900">
                      {getAnalyticsData().reduce((sum, d) => sum + d.clicks, 0)}
                    </p>
                  </div>
                  <div className="p-3 sm:p-4 bg-purple-50 rounded-lg border border-purple-200">
                    <Eye className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600 mb-2" />
                    <p className="text-xs sm:text-sm text-purple-700">Total Views</p>
                    <p className="text-lg sm:text-2xl font-bold text-purple-900">
                      {getAnalyticsData().reduce((sum, d) => sum + d.views, 0)}
                    </p>
                  </div>
                  <div className="p-3 sm:p-4 bg-orange-50 rounded-lg border border-orange-200">
                    <UserCheck className="w-5 h-5 sm:w-6 sm:h-6 text-orange-600 mb-2" />
                    <p className="text-xs sm:text-sm text-orange-700">Bookings</p>
                    <p className="text-lg sm:text-2xl font-bold text-orange-900">
                      {getAnalyticsData().reduce((sum, d) => sum + d.bookings, 0)}
                    </p>
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white mb-4">Calls & Bookings Trend</h4>
                    <ResponsiveContainer width="100%" height={250}>
                      <LineChart data={getAnalyticsData()}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="period" />
                        <YAxis />
                        <Tooltip />
                        <Line type="monotone" dataKey="calls" stroke="#3b82f6" strokeWidth={2} />
                        <Line type="monotone" dataKey="bookings" stroke="#10b981" strokeWidth={2} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>

                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white mb-4">Clicks & Views</h4>
                    <ResponsiveContainer width="100%" height={250}>
                      <BarChart data={getAnalyticsData()}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="period" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="clicks" fill="#22c55e" />
                        <Bar dataKey="views" fill="#a855f7" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-slate-900 rounded-lg p-4 sm:p-6 border border-gray-200 dark:border-slate-800">
                <div className="flex items-center gap-2 mb-4">
                  <Activity className="w-5 h-5 text-green-600" />
                  <h3 className="font-bold text-gray-900 dark:text-white">Real-Time Activity</h3>
                  <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">Live</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-slate-800 rounded-lg">
                    <span className="text-sm text-gray-600 dark:text-slate-400">Active Visitors</span>
                    <span className="text-xl font-bold text-gray-900 dark:text-white">23</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-slate-800 rounded-lg">
                    <span className="text-sm text-gray-600 dark:text-slate-400">Clicks (last hour)</span>
                    <span className="text-xl font-bold text-gray-900 dark:text-white">142</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-slate-800 rounded-lg">
                    <span className="text-sm text-gray-600 dark:text-slate-400">Conversion Rate</span>
                    <span className="text-xl font-bold text-green-600">18%</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeNav === "calls" && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                <div className="bg-white dark:bg-slate-900 rounded-lg p-4 border border-gray-200 dark:border-slate-800">
                  <PhoneIncoming className="w-6 h-6 text-green-600 mb-2" />
                  <p className="text-xs text-gray-600 dark:text-slate-400">Incoming</p>
                  <p className="text-xl font-bold text-gray-900 dark:text-white">{callRecords.filter(c => c.type === "incoming").length}</p>
                </div>
                <div className="bg-white dark:bg-slate-900 rounded-lg p-4 border border-gray-200 dark:border-slate-800">
                  <PhoneOutgoing className="w-6 h-6 text-blue-600 mb-2" />
                  <p className="text-xs text-gray-600 dark:text-slate-400">Outgoing</p>
                  <p className="text-xl font-bold text-gray-900 dark:text-white">{callRecords.filter(c => c.type === "outgoing").length}</p>
                </div>
                <div className="bg-white dark:bg-slate-900 rounded-lg p-4 border border-gray-200 dark:border-slate-800">
                  <Phone className="w-6 h-6 text-red-600 mb-2" />
                  <p className="text-xs text-gray-600 dark:text-slate-400">Missed</p>
                  <p className="text-xl font-bold text-gray-900 dark:text-white">{callRecords.filter(c => c.type === "missed").length}</p>
                </div>
                <div className="bg-white dark:bg-slate-900 rounded-lg p-4 border border-gray-200 dark:border-slate-800">
                  <Video className="w-6 h-6 text-purple-600 mb-2" />
                  <p className="text-xs text-gray-600 dark:text-slate-400">Video Calls</p>
                  <p className="text-xl font-bold text-gray-900 dark:text-white">{upcomingAppointments.filter(a => a.type === "online").length}</p>
                </div>
              </div>

              <div className="bg-white dark:bg-slate-900 rounded-lg p-4 sm:p-6 border border-gray-200 dark:border-slate-800">
                <h3 className="font-bold text-gray-900 dark:text-white mb-4">Recent Calls</h3>
                <div className="space-y-2">
                  {callRecords.map((call) => (
                    <div key={call.id} className="flex items-center justify-between p-3 sm:p-4 bg-gray-50 dark:bg-slate-800 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700 transition">
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <div className={`p-2 rounded-full ${
                          call.type === "incoming" ? "bg-green-100" : call.type === "outgoing" ? "bg-blue-100" : "bg-red-100"
                        }`}>
                          {call.type === "incoming" && <PhoneIncoming className="w-4 h-4 text-green-600" />}
                          {call.type === "outgoing" && <PhoneOutgoing className="w-4 h-4 text-blue-600" />}
                          {call.type === "missed" && <Phone className="w-4 h-4 text-red-600" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-gray-900 dark:text-white text-sm truncate">{call.patientName}</p>
                          <p className="text-xs text-gray-600 dark:text-slate-400">{call.patientPhone}</p>
                        </div>
                        <div className="hidden sm:block text-right">
                          <p className="text-sm font-medium text-gray-900 dark:text-white">{call.duration}</p>
                          <p className="text-xs text-gray-600 dark:text-slate-400">{call.timestamp}</p>
                        </div>
                      </div>
                      {call.type === "missed" && (
                        <button 
                          onClick={() => {
                            const apt = pastAppointments.find(a => a.patientName === call.patientName);
                            if (apt) handleCallback(apt);
                          }}
                          className="ml-2 px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-xs font-medium whitespace-nowrap"
                        >
                          Call Back
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {pastAppointments.filter(a => a.needsCallback).length > 0 && (
                <div className="bg-orange-50 rounded-lg p-4 sm:p-6 border border-orange-200">
                  <h3 className="font-bold text-orange-900 mb-4 flex items-center gap-2">
                    <AlertCircle className="w-5 h-5" />
                    Callback Required
                  </h3>
                  <div className="space-y-3">
                    {pastAppointments.filter(a => a.needsCallback).map((apt) => (
                      <div key={apt.id} className="flex items-center justify-between p-3 bg-white rounded-lg">
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-gray-900 text-sm">{apt.patientName}</p>
                          <p className="text-xs text-gray-600">{apt.patientPhone}</p>
                        </div>
                        <button 
                          onClick={() => handleCallback(apt)}
                          className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition text-xs sm:text-sm font-medium whitespace-nowrap"
                        >
                          Call Now
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {activeNav === "appointments" && (
            <div className="space-y-6">
              <div className="bg-white dark:bg-slate-900 rounded-lg p-4 sm:p-6 border border-gray-200 dark:border-slate-800">
                <h3 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <Clock className="w-5 h-5 text-blue-600" /> Today's Appointments
                </h3>
                <div className="space-y-3">
                  {upcomingAppointments.map(apt => (
                    <div key={apt.id} className="p-3 sm:p-4 border border-gray-200 dark:border-slate-700 rounded-lg hover:shadow-md transition cursor-pointer">
                      <div className="flex items-start justify-between mb-3 gap-2">
                        <div className="min-w-0 flex-1">
                          <h4 className="font-bold text-gray-900 dark:text-white text-sm sm:text-base truncate">{apt.patientName}</h4>
                          <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600 dark:text-slate-400 mt-1 flex-wrap">
                            <Clock className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                            <span>{apt.time}</span>
                            <span className={`px-2 py-0.5 rounded text-xs font-medium whitespace-nowrap ${
                              apt.type === "online" ? "bg-blue-100 text-blue-700" : "bg-green-100 text-green-700"
                            }`}>
                              {apt.type === "online" ? "Video Call" : "In-Person"}
                            </span>
                          </div>
                        </div>
                        <span className="px-2 sm:px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs sm:text-sm font-medium flex-shrink-0">
                          ₵{apt.fee}
                        </span>
                      </div>
                      <div className="flex gap-2 pt-3 border-t border-gray-200 dark:border-slate-700">
                        <button className="flex-1 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-xs sm:text-sm font-medium">
                          {apt.type === "online" ? "Start Call" : "Check In"}
                        </button>
                        <button className="px-2 sm:px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-800 transition text-xs sm:text-sm whitespace-nowrap text-gray-700 dark:text-slate-300">
                          Reschedule
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white dark:bg-slate-900 rounded-lg p-4 sm:p-6 border border-gray-200 dark:border-slate-800">
                <h3 className="font-bold text-gray-900 dark:text-white mb-4">Completed Today</h3>
                <div className="space-y-2">
                  {pastAppointments.map(apt => (
                    <div key={apt.id} className="flex items-center justify-between p-3 sm:p-4 bg-gray-50 dark:bg-slate-800 rounded-lg">
                      <div>
                        <h4 className="font-bold text-gray-900 dark:text-white text-sm sm:text-base">{apt.patientName}</h4>
                        <p className="text-xs sm:text-sm text-gray-600 dark:text-slate-400">{apt.time}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-gray-900 dark:text-white text-sm sm:text-base">₵{apt.fee}</p>
                        <span className={`text-xs font-medium ${
                          apt.status === "completed" ? "text-green-600" : "text-red-600"
                        }`}>
                          {apt.status === "completed" ? "Completed" : apt.needsCallback ? "Needs Callback" : "Missed"}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeNav === "patients" && (
            <div className="bg-white dark:bg-slate-900 rounded-lg p-4 sm:p-6 border border-gray-200 dark:border-slate-800">
              <h3 className="font-bold text-gray-900 dark:text-white mb-4">All Patients</h3>
              <div className="space-y-2">
                {[1, 2, 3, 4, 5, 6].map(i => (
                  <div key={i} className="flex items-center justify-between p-3 sm:p-4 bg-gray-50 dark:bg-slate-800 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700 transition cursor-pointer">
                    <div className="flex items-center gap-3 sm:gap-4">
                      <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                        <span className="text-blue-600 font-bold text-sm">P{i}</span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white text-sm sm:text-base">Patient Name {i}</p>
                        <p className="text-xs sm:text-sm text-gray-600 dark:text-slate-400">Last visit: {5 - i} days ago</p>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-400 dark:text-slate-500" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeNav === "earnings" && (
            <div className="space-y-6">
              <div className="bg-white dark:bg-slate-900 rounded-lg p-4 sm:p-6 border border-gray-200 dark:border-slate-800">
                <h3 className="font-bold text-gray-900 dark:text-white mb-4">Monthly Earnings Summary</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                    <p className="text-sm text-green-700">This Month</p>
                    <p className="text-2xl font-bold text-green-900 mt-2">₵{stats.monthlyEarnings.toLocaleString()}</p>
                  </div>
                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <p className="text-sm text-blue-700">Paid Out</p>
                    <p className="text-2xl font-bold text-blue-900 mt-2">₵10,000</p>
                  </div>
                  <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
                    <p className="text-sm text-orange-700">Pending</p>
                    <p className="text-2xl font-bold text-orange-900 mt-2">₵2,500</p>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-slate-900 rounded-lg p-4 sm:p-6 border border-gray-200 dark:border-slate-800">
                <h3 className="font-bold text-gray-900 dark:text-white mb-4">Recent Transactions</h3>
                <div className="space-y-2">
                  {[1, 2, 3, 4, 5].map(i => (
                    <div key={i} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-slate-800 rounded-lg">
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">Patient Consultation #{i}</p>
                        <p className="text-xs text-gray-600 dark:text-slate-400">Feb {20 + i}, 2026</p>
                      </div>
                      <p className="font-bold text-gray-900 dark:text-white">+₵150</p>
                    </div>
                  ))}
                </div>
                <button className="w-full mt-4 py-3 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 dark:hover:bg-slate-800 transition font-medium flex items-center justify-center gap-2 text-sm">
                  <Download className="w-4 h-4" /> Download Statement
                </button>
              </div>
            </div>
          )}
        </main>

        <div className="lg:hidden px-4 pb-20 pt-3 text-center text-xs text-gray-500 dark:text-slate-400">
          <p>BesaPlus v1.0.0</p>
          <p className="text-[10px] mt-1">Your Healthcare Companion</p>
        </div>

        {/* Mobile Bottom Navigation */}
        <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-slate-900 border-t border-gray-200 dark:border-slate-800 z-40">
          <div className="grid grid-cols-4 gap-1 p-2">
            {bottomNavItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={item.onClick}
                  className={`flex flex-col items-center gap-1 p-2 rounded-lg transition ${
                    item.isActive ? 'bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300' : 'text-gray-600 dark:text-slate-300'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="text-xs font-medium">{item.label}</span>
                </button>
              );
            })}
          </div>
        </nav>
      </div>

      {/* Callback Modal */}
      {showCallbackModal && selectedCallback && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-slate-900 rounded-lg max-w-md w-full p-6 border border-gray-200 dark:border-slate-800">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Initiate Callback</h2>
            <div className="space-y-4 mb-6">
              <div>
                <p className="text-xs text-gray-600 dark:text-slate-400">Patient</p>
                <p className="font-bold text-gray-900 dark:text-white">{selectedCallback.patientName}</p>
              </div>
              <div>
                <p className="text-xs text-gray-600 dark:text-slate-400">Phone Number</p>
                <p className="font-bold text-gray-900 dark:text-white">{selectedCallback.patientPhone}</p>
              </div>
              <div>
                <p className="text-xs text-gray-600 dark:text-slate-400">Original Time</p>
                <p className="font-bold text-gray-900 dark:text-white">{selectedCallback.time}</p>
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => { setShowCallbackModal(false); setSelectedCallback(null); }}
                className="flex-1 py-2 border border-gray-300 dark:border-slate-600 text-gray-700 dark:text-slate-300 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-800 transition font-medium"
              >
                Cancel
              </button>
              <button
                onClick={() => { alert(`Calling ${selectedCallback.patientPhone}...`); setShowCallbackModal(false); setSelectedCallback(null); }}
                className="flex-1 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium flex items-center justify-center gap-2"
              >
                <Phone className="w-4 h-4" />
                Call Now
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Appointment Details Modal */}
      {selectedAppointment && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-slate-900 rounded-lg max-w-md w-full p-6 relative border border-gray-200 dark:border-slate-800">
            <button
              onClick={() => setSelectedAppointment(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-slate-300"
            >
              ✕
            </button>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Appointment Details</h2>
            <div className="space-y-4">
              <div>
                <p className="text-xs text-gray-600 dark:text-slate-400">Patient</p>
                <p className="font-bold text-gray-900 dark:text-white">{selectedAppointment.patientName}</p>
              </div>
              <div>
                <p className="text-xs text-gray-600 dark:text-slate-400">Phone</p>
                <p className="font-bold text-gray-900 dark:text-white">{selectedAppointment.patientPhone}</p>
              </div>
              <div>
                <p className="text-xs text-gray-600 dark:text-slate-400">Time</p>
                <p className="font-bold text-gray-900 dark:text-white">{selectedAppointment.time}</p>
              </div>
              <div>
                <p className="text-xs text-gray-600 dark:text-slate-400">Type</p>
                <p className="font-bold text-gray-900 dark:text-white capitalize">{selectedAppointment.type === "online" ? "Video Call" : "In-Person"}</p>
              </div>
              <div>
                <p className="text-xs text-gray-600">Fee</p>
                <p className="font-bold text-green-600">₵{selectedAppointment.fee}</p>
              </div>
            </div>
            <button
              onClick={() => setSelectedAppointment(null)}
              className="w-full mt-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
