import { useState } from "react";
import { Calendar, Users, TrendingUp, Settings, LogOut, Bell, Clock, AlertCircle, Download, ChevronRight } from "lucide-react";

interface ProviderAppointment {
  id: number;
  patientName: string;
  time: string;
  type: "online" | "in-person";
  status: "completed" | "upcoming" | "no-show";
  fee: number;
}

interface ProviderStats {
  totalPatients: number;
  monthlyEarnings: number;
  completedConsultations: number;
  avgRating: number;
}

const upcomingAppointments: ProviderAppointment[] = [
  {
    id: 1,
    patientName: "John Doe",
    time: "2:00 PM - 2:30 PM",
    type: "online",
    status: "upcoming",
    fee: 150
  },
  {
    id: 2,
    patientName: "Jane Smith",
    time: "3:00 PM - 3:30 PM",
    type: "in-person",
    status: "upcoming",
    fee: 150
  },
  {
    id: 3,
    patientName: "Michael Brown",
    time: "4:00 PM - 4:45 PM",
    type: "online",
    status: "upcoming",
    fee: 150
  }
];

const pastAppointments: ProviderAppointment[] = [
  {
    id: 4,
    patientName: "Emma Wilson",
    time: "12:00 PM - 12:30 PM",
    type: "online",
    status: "completed",
    fee: 150
  },
  {
    id: 5,
    patientName: "David Lee",
    time: "10:00 AM - 10:30 AM",
    type: "in-person",
    status: "completed",
    fee: 150
  }
];

export function ProviderDashboardPage() {
  const [activeTab, setActiveTab] = useState<"appointments" | "schedule" | "earnings" | "patients">("appointments");
  const [selectedAppointment, setSelectedAppointment] = useState<ProviderAppointment | null>(null);

  const stats: ProviderStats = {
    totalPatients: 342,
    monthlyEarnings: 12500,
    completedConsultations: 98,
    avgRating: 4.9
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-teal-600 flex items-center justify-center">
              <span className="text-white text-sm font-bold">BP</span>
            </div>
            <span className="text-lg font-bold text-gray-900">BesaPlus Provider</span>
          </div>
          <div className="flex items-center gap-4">
            <button className="relative p-2 text-gray-600 hover:text-gray-900">
              <Bell className="w-6 h-6" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-600 rounded-full"></span>
            </button>
            <button className="p-2 text-gray-600 hover:text-gray-900">
              <Settings className="w-6 h-6" />
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Card */}
        <div className="mb-8 bg-gradient-to-r from-blue-600 to-teal-600 rounded-xl p-8 text-white">
          <h1 className="text-3xl font-bold mb-2">Welcome back, Dr. Sarah Johnson!</h1>
          <p className="text-blue-100">You have 3 appointments scheduled for today</p>
        </div>

        {/* Quick Stats */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-lg p-6 border border-gray-200">
            <Users className="w-8 h-8 text-blue-600 mb-2" />
            <p className="text-sm text-gray-600">Total Patients</p>
            <p className="text-2xl font-bold text-gray-900">{stats.totalPatients}</p>
          </div>
          <div className="bg-white rounded-lg p-6 border border-gray-200">
            <TrendingUp className="w-8 h-8 text-green-600 mb-2" />
            <p className="text-sm text-gray-600">This Month</p>
            <p className="text-2xl font-bold text-gray-900">₵{stats.monthlyEarnings.toLocaleString()}</p>
          </div>
          <div className="bg-white rounded-lg p-6 border border-gray-200">
            <Calendar className="w-8 h-8 text-orange-600 mb-2" />
            <p className="text-sm text-gray-600">Completed Today</p>
            <p className="text-2xl font-bold text-gray-900">{stats.completedConsultations}</p>
          </div>
          <div className="bg-white rounded-lg p-6 border border-gray-200">
            <div className="flex items-center gap-1 mb-2">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className={`w-2 h-2 rounded-full ${i < 4 ? "bg-yellow-400" : "bg-gray-300"}`}
                />
              ))}
            </div>
            <p className="text-sm text-gray-600">Rating</p>
            <p className="text-2xl font-bold text-gray-900">{stats.avgRating}★</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Tabs */}
            <div className="flex gap-2 border-b border-gray-200 bg-white rounded-lg p-4">
              {[
                { id: "appointments", label: "Appointments", icon: Calendar },
                { id: "schedule", label: "Schedule", icon: Clock },
                { id: "earnings", label: "Earnings", icon: TrendingUp },
                { id: "patients", label: "Patients", icon: Users }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition ${
                    activeTab === tab.id
                      ? "bg-blue-100 text-blue-700 font-medium"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  <tab.icon className="w-4 h-4" />
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Appointments Tab */}
            {activeTab === "appointments" && (
              <div className="space-y-6">
                <div>
                  <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <Clock className="w-5 h-5 text-blue-600" /> Today's Appointments
                  </h3>
                  <div className="space-y-4">
                    {upcomingAppointments.map(apt => (
                      <div
                        key={apt.id}
                        className="bg-white rounded-lg p-4 border border-gray-200 cursor-pointer hover:shadow-md transition"
                        onClick={() => setSelectedAppointment(apt)}
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h4 className="font-bold text-gray-900">{apt.patientName}</h4>
                            <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                              <Clock className="w-4 h-4" />
                              <span>{apt.time}</span>
                              <span className={`px-2 py-1 rounded text-xs font-medium ${
                                apt.type === "online"
                                  ? "bg-blue-100 text-blue-700"
                                  : "bg-green-100 text-green-700"
                              }`}>
                                {apt.type === "online" ? "Video Call" : "In-Person"}
                              </span>
                            </div>
                          </div>
                          <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                            ₵{apt.fee}
                          </span>
                        </div>
                        <div className="flex gap-2 pt-3 border-t border-gray-200">
                          {apt.type === "online" ? (
                            <button className="flex-1 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm font-medium">
                              Start Call
                            </button>
                          ) : (
                            <button className="flex-1 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm font-medium">
                              Check In
                            </button>
                          )}
                          <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition text-sm">
                            Reschedule
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="font-bold text-gray-900 mb-4">Completed Today</h3>
                  <div className="space-y-2">
                    {pastAppointments.map(apt => (
                      <div
                        key={apt.id}
                        className="bg-gray-50 rounded-lg p-4 border border-gray-200"
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-bold text-gray-900">{apt.patientName}</h4>
                            <p className="text-sm text-gray-600">{apt.time}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-gray-900">₵{apt.fee}</p>
                            <span className="text-xs text-green-600 font-medium">Completed</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Schedule Tab */}
            {activeTab === "schedule" && (
              <div className="bg-white rounded-lg p-6 border border-gray-200">
                <h3 className="font-bold text-gray-900 mb-4">Manage Your Availability</h3>
                <div className="space-y-4">
                  {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"].map(day => (
                    <div key={day} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900">{day}</p>
                        <p className="text-sm text-gray-600">9:00 AM - 6:00 PM</p>
                      </div>
                      <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-white transition text-sm">
                        Edit
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Earnings Tab */}
            {activeTab === "earnings" && (
              <div className="bg-white rounded-lg p-6 border border-gray-200 space-y-6">
                <div>
                  <h3 className="font-bold text-gray-900 mb-4">Monthly Earnings Summary</h3>
                  <div className="grid md:grid-cols-3 gap-4">
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

                <div>
                  <h3 className="font-bold text-gray-900 mb-4">Recent Transactions</h3>
                  <div className="space-y-2">
                    {[1, 2, 3].map(i => (
                      <div
                        key={i}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                      >
                        <div>
                          <p className="text-sm font-medium text-gray-900">Patient Consultation #{i}</p>
                          <p className="text-xs text-gray-600">Dec {10 + i}, 2024</p>
                        </div>
                        <p className="font-bold text-gray-900">+₵150</p>
                      </div>
                    ))}
                  </div>
                </div>

                <button className="w-full py-3 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition font-medium flex items-center justify-center gap-2">
                  <Download className="w-4 h-4" /> Download Statement
                </button>
              </div>
            )}

            {/* Patients Tab */}
            {activeTab === "patients" && (
              <div className="bg-white rounded-lg p-6 border border-gray-200">
                <h3 className="font-bold text-gray-900 mb-4">Recent Patients</h3>
                <div className="space-y-3">
                  {[1, 2, 3, 4, 5].map(i => (
                    <div
                      key={i}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition cursor-pointer"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                          <span className="text-blue-600 font-bold">P{i}</span>
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">Patient Name {i}</p>
                          <p className="text-sm text-gray-600">Last visit: {5 - i} days ago</p>
                        </div>
                      </div>
                      <ChevronRight className="w-5 h-5 text-gray-400" />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <aside className="space-y-6">
            {/* Alert */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex gap-3">
                <AlertCircle className="w-5 h-5 text-yellow-600 shrink-0" />
                <div>
                  <p className="font-bold text-yellow-900 text-sm">Weekend Availability</p>
                  <p className="text-xs text-yellow-800 mt-1">You're not available on weekends. Enable to increase bookings.</p>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-lg p-6 border border-gray-200 space-y-2">
              <h3 className="font-bold text-gray-900 mb-4">Quick Actions</h3>
              <button className="w-full py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition text-sm font-medium">
                + Add Availability
              </button>
              <button className="w-full py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition text-sm font-medium">
                View Profile
              </button>
              <button className="w-full py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition text-sm font-medium">
                Update Services
              </button>
            </div>

            {/* Performance */}
            <div className="bg-white rounded-lg p-6 border border-gray-200">
              <h3 className="font-bold text-gray-900 mb-4">Performance</h3>
              <div className="space-y-3">
                <div>
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="text-gray-600">Response Rate</span>
                    <span className="font-bold text-gray-900">98%</span>
                  </div>
                  <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full bg-green-600" style={{ width: "98%" }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="text-gray-600">Completion Rate</span>
                    <span className="font-bold text-gray-900">99%</span>
                  </div>
                  <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full bg-green-600" style={{ width: "99%" }}></div>
                  </div>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>

      {/* Appointment Modal */}
      {selectedAppointment && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <button
              onClick={() => setSelectedAppointment(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
            <h2 className="text-lg font-bold text-gray-900 mb-4">Appointment Details</h2>
            <div className="space-y-4">
              <div>
                <p className="text-xs text-gray-600">Patient</p>
                <p className="font-bold text-gray-900">{selectedAppointment.patientName}</p>
              </div>
              <div>
                <p className="text-xs text-gray-600">Time</p>
                <p className="font-bold text-gray-900">{selectedAppointment.time}</p>
              </div>
              <div>
                <p className="text-xs text-gray-600">Type</p>
                <p className="font-bold text-gray-900 capitalize">{selectedAppointment.type === "online" ? "Video Call" : "In-Person"}</p>
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
