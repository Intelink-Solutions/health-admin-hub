import { useState } from "react";
import { Video, Mic, MicOff, VideoOff, MessageCircle, Phone, Share2, Copy, Clock, Monitor, PlusCircle, Settings } from "lucide-react";

interface Message {
  id: number;
  sender: "patient" | "doctor";
  text: string;
  time: string;
}

export function TelemedicineConsultationPage() {
  const [isMuted, setIsMuted] = useState(false);
  const [isCameraOff, setIsCameraOff] = useState(false);
  const [showChat, setShowChat] = useState(true);
  const [showPrescription, setShowPrescription] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, sender: "doctor", text: "Hello! How are you feeling today?", time: "2:15 PM" },
    { id: 2, sender: "patient", text: "Hi doctor, I've been having headaches for 3 days", time: "2:16 PM" },
    { id: 3, sender: "doctor", text: "I see. Let me ask you a few questions...", time: "2:17 PM" }
  ]);
  const [messageInput, setMessageInput] = useState("");
  const [consultationTime, setConsultationTime] = useState(12);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageInput.trim()) return;
    setMessages([
      ...messages,
      {
        id: messages.length + 1,
        sender: "patient",
        text: messageInput,
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      }
    ]);
    setMessageInput("");
  };

  return (
    <div className="h-screen bg-black flex">
      {/* Main Video Area */}
      <div className="flex-1 flex flex-col">
        {/* Doctor Video */}
        <div className="flex-1 bg-gradient-to-br from-gray-800 to-black relative overflow-hidden flex items-center justify-center">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 to-teal-600/10 opacity-50"></div>

          {/* Placeholder for Doctor Video */}
          <div className="relative z-10 text-center">
            <div className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-500 to-teal-500 flex items-center justify-center mx-auto mb-6">
              <span className="text-white text-5xl">👨‍⚕️</span>
            </div>
            <h2 className="text-white text-2xl font-bold">Dr. Sarah Johnson</h2>
            <p className="text-gray-300">Connected</p>
          </div>

          {/* Top Right - Your Video */}
          <div className="absolute top-4 right-4 w-32 h-32 bg-gray-700 rounded-lg overflow-hidden border-2 border-blue-500">
            <div className="w-full h-full flex items-center justify-center bg-gray-600">
              <span className="text-white text-2xl">🧑‍🔬</span>
            </div>
          </div>

          {/* Top Left - Consultation Info */}
          <div className="absolute top-4 left-4 bg-black/50 backdrop-blur-sm px-4 py-2 rounded-lg flex items-center gap-2 text-white">
            <Clock className="w-4 h-4" />
            <span className="text-sm font-medium">{consultationTime} mins remaining</span>
          </div>
        </div>

        {/* Control Bar */}
        <div className="bg-gradient-to-t from-black to-gray-900 border-t border-gray-700 px-6 py-4">
          <div className="flex items-center justify-center gap-4">
            {/* Microphone */}
            <button
              onClick={() => setIsMuted(!isMuted)}
              className={`p-4 rounded-full transition ${
                isMuted
                  ? "bg-red-600 hover:bg-red-700 text-white"
                  : "bg-gray-700 hover:bg-gray-600 text-white"
              }`}
            >
              {isMuted ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
            </button>

            {/* Camera */}
            <button
              onClick={() => setIsCameraOff(!isCameraOff)}
              className={`p-4 rounded-full transition ${
                isCameraOff
                  ? "bg-red-600 hover:bg-red-700 text-white"
                  : "bg-gray-700 hover:bg-gray-600 text-white"
              }`}
            >
              {isCameraOff ? <VideoOff className="w-6 h-6" /> : <Video className="w-6 h-6" />}
            </button>

            {/* Screen Share */}
            <button className="p-4 rounded-full bg-gray-700 hover:bg-gray-600 text-white transition">
              <Monitor className="w-6 h-6" />
            </button>

            {/* Chat Toggle */}
            <button
              onClick={() => setShowChat(!showChat)}
              className={`p-4 rounded-full transition ${
                showChat
                  ? "bg-blue-600 text-white"
                  : "bg-gray-700 hover:bg-gray-600 text-white"
              }`}
            >
              <MessageCircle className="w-6 h-6" />
            </button>

            {/* End Call */}
            <button className="p-4 rounded-full bg-red-600 hover:bg-red-700 text-white transition">
              <Phone className="w-6 h-6" />
            </button>
          </div>

          {/* Subtitle */}
          <div className="text-center mt-4 text-gray-400 text-sm">
            {isMuted && "📍 Microphone is muted"}
            {isCameraOff && " • Camera is off"}
          </div>
        </div>
      </div>

      {/* Right Sidebar - Chat & Prescription */}
      {showChat && (
        <div className="w-80 bg-gray-900 border-l border-gray-700 flex flex-col">
          {/* Tabs */}
          <div className="flex border-b border-gray-700">
            <button
              onClick={() => setShowPrescription(false)}
              className={`flex-1 py-3 px-4 font-medium text-center transition ${
                !showPrescription
                  ? "bg-blue-600 text-white border-b-2 border-blue-600"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              Chat
            </button>
            <button
              onClick={() => setShowPrescription(true)}
              className={`flex-1 py-3 px-4 font-medium text-center transition ${
                showPrescription
                  ? "bg-blue-600 text-white border-b-2 border-blue-600"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              Prescription
            </button>
          </div>

          {/* Chat Messages */}
          {!showPrescription && (
            <>
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map(message => (
                  <div
                    key={message.id}
                    className={`flex ${message.sender === "patient" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-xs px-4 py-2 rounded-lg ${
                        message.sender === "patient"
                          ? "bg-blue-600 text-white"
                          : "bg-gray-700 text-gray-100"
                      }`}
                    >
                      <p className="text-sm">{message.text}</p>
                      <p className="text-xs opacity-70 mt-1">{message.time}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Message Input */}
              <div className="border-t border-gray-700 p-4">
                <form onSubmit={handleSendMessage} className="flex gap-2">
                  <input
                    type="text"
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    placeholder="Type a message..."
                    className="flex-1 bg-gray-800 text-white rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                  >
                    Send
                  </button>
                </form>
              </div>
            </>
          )}

          {/* Prescription Panel */}
          {showPrescription && (
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              <div className="bg-gray-800 rounded-lg p-4 space-y-3">
                <h3 className="font-bold text-white">Current Prescription</h3>

                {/* Medication 1 */}
                <div className="bg-gray-700/50 rounded p-3 space-y-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-bold text-white">Ibuprofen</p>
                      <p className="text-xs text-gray-400">Pain Reliever</p>
                    </div>
                    <span className="text-xs bg-blue-600/30 text-blue-300 px-2 py-1 rounded">Rx</span>
                  </div>
                  <p className="text-sm text-gray-300">200mg, 3 times daily for 7 days</p>
                </div>

                {/* Medication 2 */}
                <div className="bg-gray-700/50 rounded p-3 space-y-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-bold text-white">Amoxicillin</p>
                      <p className="text-xs text-gray-400">Antibiotic</p>
                    </div>
                    <span className="text-xs bg-teal-600/30 text-teal-300 px-2 py-1 rounded">Rx</span>
                  </div>
                  <p className="text-sm text-gray-300">500mg, twice daily for 10 days</p>
                </div>

                <div className="border-t border-gray-600 pt-3">
                  <p className="text-xs text-gray-400 mb-2">Notes from doctor:</p>
                  <p className="text-sm text-gray-300">"Take antibiotics with food. Rest for 2-3 days. Follow up if symptoms persist."</p>
                </div>

                <button className="w-full mt-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm font-medium flex items-center justify-center gap-2">
                  <Download /> Download Prescription
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function Download() {
  return <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>;
}
