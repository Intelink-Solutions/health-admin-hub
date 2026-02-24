import { useState } from "react";
import { Calendar, MessageCircle, FileText, ShoppingCart, History, Settings, LogOut, Bell, User, ChevronRight, Clock, MapPin, UserCircle } from "lucide-react";

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
  const [activeTab, setActiveTab] = useState<"appointments" | "messages" | "prescriptions" | "orders">("appointments");
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-teal-600 flex items-center justify-center">
              <span className="text-white text-sm font-bold">BP</span>
            </div>
            <span className="text-lg font-bold text-gray-900">BesaPlus Dashboard</span>
          </div>
          <div className="flex items-center gap-4">
            <button className="relative p-2 text-gray-600 hover:text-gray-900">
              <Bell className="w-6 h-6" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-600 rounded-full"></span>
            </button>
            <button className="p-2 text-gray-600 hover:text-gray-900">
              <Settings className="w-6 h-6" />
            </button>
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
              <User className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Card */}
        <div className="mb-8 bg-gradient-to-r from-blue-600 to-teal-600 rounded-xl p-8 text-white">
          <h1 className="text-3xl font-bold mb-2">Welcome back, John!</h1>
          <p className="text-blue-100">You have 1 appointment today at 2:00 PM</p>
        </div>

        {/* Quick Stats */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-lg p-6 border border-gray-200">
            <Calendar className="w-8 h-8 text-blue-600 mb-2" />
            <p className="text-sm text-gray-600">Next Appointment</p>
            <p className="text-lg font-bold text-gray-900">Today, 2:00 PM</p>
          </div>
          <div className="bg-white rounded-lg p-6 border border-gray-200">
            <MessageCircle className="w-8 h-8 text-teal-600 mb-2" />
            <p className="text-sm text-gray-600">Unread Messages</p>
            <p className="text-lg font-bold text-gray-900">1 new</p>
          </div>
          <div className="bg-white rounded-lg p-6 border border-gray-200">
            <FileText className="w-8 h-8 text-orange-600 mb-2" />
            <p className="text-sm text-gray-600">Pending Prescriptions</p>
            <p className="text-lg font-bold text-gray-900">2 items</p>
          </div>
          <div className="bg-white rounded-lg p-6 border border-gray-200">
            <ShoppingCart className="w-8 h-8 text-green-600 mb-2" />
            <p className="text-sm text-gray-600">Active Orders</p>
            <p className="text-lg font-bold text-gray-900">1 order</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Tabs */}
            <div className="flex gap-2 border-b border-gray-200 bg-white rounded-lg p-4">
              {[
                { id: "appointments", label: "Appointments", icon: Calendar },
                { id: "messages", label: "Messages", icon: MessageCircle },
                { id: "prescriptions", label: "Prescriptions", icon: FileText },
                { id: "orders", label: "Orders", icon: ShoppingCart }
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
              <div className="space-y-4">
                {sampleAppointments.map(appointment => (
                  <div
                    key={appointment.id}
                    className="bg-white rounded-lg p-6 border border-gray-200 hover:shadow-md transition cursor-pointer"
                    onClick={() => setSelectedAppointment(appointment)}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="font-bold text-gray-900">{appointment.doctor}</h3>
                        <p className="text-sm text-gray-600">{appointment.specialty}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        appointment.status === "upcoming"
                          ? "bg-blue-100 text-blue-700"
                          : appointment.status === "completed"
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-100 text-gray-700"
                      }`}>
                        {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                      </span>
                    </div>

                    <div className="space-y-2 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        <span>{appointment.date} at {appointment.time}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        {appointment.type === "online" ? (
                          <>
                            <MessageCircle className="w-4 h-4" />
                            <span>Video Call</span>
                          </>
                        ) : (
                          <>
                            <MapPin className="w-4 h-4" />
                            <span>{appointment.location}</span>
                          </>
                        )}
                      </div>
                    </div>

                    {appointment.status === "upcoming" && (
                      <div className="mt-4 flex gap-2">
                        <button className="flex-1 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm font-medium">
                          {appointment.type === "online" ? "Join Call" : "Check In"}
                        </button>
                        <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition">
                          <MessageCircle className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>
                ))}

                <button className="w-full py-3 border border-dashed border-gray-300 rounded-lg text-blue-600 font-medium hover:bg-blue-50 transition">
                  + Book New Appointment
                </button>
              </div>
            )}

            {/* Messages Tab */}
            {activeTab === "messages" && (
              <div className="space-y-2">
                {sampleMessages.map(message => (
                  <div
                    key={message.id}
                    className="bg-white rounded-lg p-4 border border-gray-200 hover:shadow-md transition cursor-pointer"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-bold text-gray-900 flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-blue-100"></div>
                        {message.doctor}
                        {message.unread > 0 && (
                          <span className="px-2 py-0.5 bg-red-600 text-white text-xs rounded-full">{message.unread}</span>
                        )}
                      </h3>
                      <span className="text-xs text-gray-600">{message.time}</span>
                    </div>
                    <p className="text-sm text-gray-600">{message.lastMessage}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Prescriptions Tab */}
            {activeTab === "prescriptions" && (
              <div className="space-y-4">
                {[1, 2].map(i => (
                  <div key={i} className="bg-white rounded-lg p-6 border border-gray-200">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="font-bold text-gray-900">Prescription from Dr. Sarah Johnson</h3>
                        <p className="text-sm text-gray-600">Issued 2 days ago</p>
                      </div>
                      <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">Active</span>
                    </div>
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-700">Ibuprofen 200mg</span>
                        <span className="text-gray-600">3 times daily</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-700">Amoxicillin 500mg</span>
                        <span className="text-gray-600">Twice daily</span>
                      </div>
                    </div>
                    <button className="w-full py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition text-sm font-medium">
                      View & Download
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Orders Tab */}
            {activeTab === "orders" && (
              <div className="space-y-4">
                <div className="bg-white rounded-lg p-6 border border-gray-200">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="font-bold text-gray-900">Lab Test Package</h3>
                      <p className="text-sm text-gray-600">Order #LP-001234</p>
                    </div>
                    <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">Completed</span>
                  </div>
                  <div className="flex items-center justify-between text-sm mb-4">
                    <span className="text-gray-700">Full Blood Checkup</span>
                    <span className="font-bold text-gray-900">₵250.00</span>
                  </div>
                  <button className="w-full py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition text-sm font-medium">
                    View Results
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <aside className="space-y-6">
            {/* Profile Card */}
            <div className="bg-white rounded-lg p-6 border border-gray-200">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                  <UserCircle className="w-8 h-8 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">John Doe</h3>
                  <p className="text-xs text-gray-600">Member since 2024</p>
                </div>
              </div>
              <button className="w-full py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition text-sm font-medium">
                Edit Profile
              </button>
            </div>

            {/* Upcoming Appointment */}
            <div className="bg-gradient-to-br from-blue-50 to-teal-50 rounded-lg p-6 border border-blue-200">
              <h3 className="font-bold text-gray-900 mb-3">Today's Appointment</h3>
              <div className="space-y-2 text-sm mb-4">
                <div className="flex items-center gap-2 text-gray-700">
                  <Clock className="w-4 h-4 text-blue-600" />
                  <span>2:00 PM - 2:30 PM</span>
                </div>
                <div className="text-gray-700 font-medium">Dr. Sarah Johnson</div>
                <div className="text-gray-600">General Consultation</div>
              </div>
              <button className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm font-bold">
                Join Video Call
              </button>
            </div>

            {/* Health Tips */}
            <div className="bg-white rounded-lg p-6 border border-gray-200">
              <h3 className="font-bold text-gray-900 mb-4">Health Tips</h3>
              <div className="space-y-3">
                <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                  <p className="text-xs font-medium text-green-700">Stay Hydrated</p>
                  <p className="text-xs text-green-600 mt-1">Drink 8-10 glasses of water daily</p>
                </div>
                <div className="p-3 bg-orange-50 rounded-lg border border-orange-200">
                  <p className="text-xs font-medium text-orange-700">Exercise Daily</p>
                  <p className="text-xs text-orange-600 mt-1">30 minutes of moderate activity</p>
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
            <div className="space-y-3 mb-6">
              <div>
                <p className="text-xs text-gray-600">Doctor</p>
                <p className="font-bold text-gray-900">{selectedAppointment.doctor}</p>
              </div>
              <div>
                <p className="text-xs text-gray-600">Date & Time</p>
                <p className="font-bold text-gray-900">{selectedAppointment.date}, {selectedAppointment.time}</p>
              </div>
              <div>
                <p className="text-xs text-gray-600">Type</p>
                <p className="font-bold text-gray-900 capitalize">{selectedAppointment.type}</p>
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
    </div>
  );
}
