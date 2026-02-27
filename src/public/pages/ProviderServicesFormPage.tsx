import { useEffect, useState } from "react";
import { Plus, Save, Trash2 } from "lucide-react";

interface ProviderService {
  id: number;
  providerType: "doctor" | "hospital" | "clinic";
  providerName: string;
  serviceName: string;
  location: string;
  category: string;
  price: number;
  phone: string;
  image: string;
  description: string;
  callType: "phone" | "telemedicine";
  beds: number;
  departments: number;
  rating: number;
  waitTime: string;
  email: string;
  servicesOffered: string;
}

const defaultFormValues: Omit<ProviderService, "id"> = {
  providerType: "doctor",
  providerName: "",
  serviceName: "",
  location: "",
  category: "Doctor",
  price: 0,
  phone: "",
  image: "",
  description: "",
  callType: "phone",
  beds: 0,
  departments: 0,
  rating: 0,
  waitTime: "",
  email: "",
  servicesOffered: "",
};

const SERVICE_FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=300&h=300&fit=crop";

const seedServices: ProviderService[] = [
  {
    id: 1,
    providerType: "doctor",
    providerName: "Dr. Sarah Johnson",
    serviceName: "General Consultation",
    location: "Accra, Ghana",
    category: "Doctor",
    price: 150,
    phone: "+233 24 123 4567",
    image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=300&h=300&fit=crop",
    description: "Consultation with a licensed GP.",
    callType: "telemedicine",
    beds: 0,
    departments: 0,
    rating: 0,
    waitTime: "",
    email: "",
    servicesOffered: "",
  },
  {
    id: 2,
    providerType: "clinic",
    providerName: "Mercy Health Clinic",
    serviceName: "Family Health Check",
    location: "Osu, Accra",
    category: "Clinic",
    price: 220,
    phone: "+233 24 234 5678",
    image: "https://images.unsplash.com/photo-1581093160562-40460b1f3b20?w=300&h=300&fit=crop",
    description: "Comprehensive family health screening.",
    callType: "phone",
    beds: 0,
    departments: 0,
    rating: 0,
    waitTime: "",
    email: "",
    servicesOffered: "",
  },
];

export function ProviderServicesFormPage() {
  const [services, setServices] = useState<ProviderService[]>(seedServices);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [imageInputKey, setImageInputKey] = useState(0);
  const [form, setForm] = useState<Omit<ProviderService, "id">>(defaultFormValues);

  useEffect(() => {
    const stored = localStorage.getItem("providerServices");
    if (!stored) return;
    try {
      const parsed = JSON.parse(stored) as Array<Partial<ProviderService>>;
      if (Array.isArray(parsed) && parsed.length > 0) {
        const normalized = parsed.map((item) => ({
          id: item.id || Date.now(),
          ...defaultFormValues,
          ...item,
        })) as ProviderService[];
        setServices(normalized);
      }
    } catch {
      setServices(seedServices);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("providerServices", JSON.stringify(services));
  }, [services]);

  const handleChange = (key: keyof Omit<ProviderService, "id">, value: string | number) => {
    setForm({ ...form, [key]: value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.providerName || !form.serviceName) return;
    const normalizedForm = {
      ...form,
      image: form.image || SERVICE_FALLBACK_IMAGE,
    };

    if (editingId) {
      setServices(services.map(s => (s.id === editingId ? { id: editingId, ...normalizedForm } : s)));
      setEditingId(null);
    } else {
      setServices([{ id: Date.now(), ...normalizedForm }, ...services]);
    }
    setForm(defaultFormValues);
    setImageInputKey((prev) => prev + 1);
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !file.type.startsWith("image/")) {
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const result = typeof reader.result === "string" ? reader.result : "";
      setForm({ ...form, image: result });
    };
    reader.readAsDataURL(file);
  };

  const handleEdit = (service: ProviderService) => {
    setEditingId(service.id);
    const { id, ...rest } = service;
    setForm({ ...defaultFormValues, ...rest });
  };

  const handleDelete = (id: number) => {
    setServices(services.filter(s => s.id !== id));
    if (editingId === id) {
      setEditingId(null);
    }
  };

  const isHospital = form.providerType === "hospital";
  const inputClass = "w-full mt-1 px-3 py-2 border border-gray-300 dark:border-slate-700 rounded-lg text-sm bg-white dark:bg-slate-900 text-gray-900 dark:text-white";
  const labelClass = "text-sm font-medium text-gray-700 dark:text-slate-300";

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950 transition-colors duration-300">
      <div className="max-w-6xl mx-auto px-3 sm:px-6 py-6 sm:py-8">
        <div className="mb-6 rounded-xl border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 sm:p-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-1">Post Service</h1>
          <p className="text-sm text-gray-600 dark:text-slate-400">Doctors, hospitals, and clinics can publish services for users.</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-900 rounded-xl p-4 sm:p-6 border border-gray-200 dark:border-slate-800 space-y-5 mb-8">
          <div className="rounded-lg border border-gray-200 dark:border-slate-800 p-4">
            <h2 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">Basic Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Provider Type</label>
                <select
                  value={form.providerType}
                  onChange={(e) => {
                    const nextType = e.target.value as "doctor" | "hospital" | "clinic";
                    setForm({
                      ...form,
                      providerType: nextType,
                      category: nextType === "hospital" ? "Hospital" : nextType === "clinic" ? "Clinic" : "Doctor",
                    });
                  }}
                  className={inputClass}
                >
                  <option value="doctor">Doctor</option>
                  <option value="hospital">Hospital</option>
                  <option value="clinic">Clinic</option>
                </select>
              </div>
              <div>
                <label className={labelClass}>Provider Name</label>
                <input
                  value={form.providerName}
                  onChange={(e) => handleChange("providerName", e.target.value)}
                  className={inputClass}
                  placeholder="Provider name"
                  minLength={2}
                  maxLength={40}
                />
              </div>
              <div>
                <label className={labelClass}>Service Name</label>
                <input
                  value={form.serviceName}
                  onChange={(e) => handleChange("serviceName", e.target.value)}
                  className={inputClass}
                  placeholder="Service name"
                  minLength={2}
                  maxLength={60}
                />
              </div>
              <div>
                <label className={labelClass}>Category</label>
                <input
                  value={form.category}
                  onChange={(e) => handleChange("category", e.target.value)}
                  className={inputClass}
                  placeholder="Category"
                  minLength={2}
                  maxLength={30}
                />
              </div>
              <div>
                <label className={labelClass}>Location</label>
                <input
                  value={form.location}
                  onChange={(e) => handleChange("location", e.target.value)}
                  className={inputClass}
                  placeholder="City, area"
                  minLength={2}
                  maxLength={40}
                />
              </div>
              <div>
                <label className={labelClass}>Price</label>
                <input
                  type="number"
                  value={form.price}
                  onChange={(e) => handleChange("price", Number(e.target.value))}
                  className={inputClass}
                  placeholder="0"
                />
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-gray-200 dark:border-slate-800 p-4">
            <h2 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">Contact & Media</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Phone</label>
                <input
                  value={form.phone}
                  onChange={(e) => handleChange("phone", e.target.value)}
                  className={inputClass}
                  placeholder="+233 24 000 0000"
                />
              </div>
              <div>
                <label className={labelClass}>Call Type</label>
                <select
                  value={form.callType}
                  onChange={(e) => handleChange("callType", e.target.value)}
                  className={inputClass}
                >
                  <option value="phone">Phone</option>
                  <option value="telemedicine">Telemedicine</option>
                </select>
              </div>
              <div>
                <label className={labelClass}>Service Photo</label>
                <input
                  key={imageInputKey}
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className={inputClass}
                />
              </div>
              <div className="md:row-span-2">
                <label className={labelClass}>Description</label>
                <textarea
                  value={form.description}
                  onChange={(e) => handleChange("description", e.target.value)}
                  className={`${inputClass} min-h-[96px]`}
                  placeholder="Short description"
                  minLength={10}
                  maxLength={140}
                />
              </div>
              {form.image && (
                <div className="md:col-span-1">
                  <img
                    src={form.image}
                    alt="Service preview"
                    className="mt-1 h-28 w-full rounded-lg object-cover border border-gray-200 dark:border-slate-700"
                  />
                </div>
              )}
            </div>
          </div>

          {isHospital && (
            <div className="rounded-lg border border-blue-200 dark:border-blue-900 bg-blue-50/40 dark:bg-blue-950/20 p-4">
              <h2 className="text-sm font-semibold text-blue-800 dark:text-blue-300 mb-3">Hospital Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Beds</label>
                  <input
                    type="number"
                    min={1}
                    value={form.beds}
                    onChange={(e) => handleChange("beds", Number(e.target.value))}
                    className={inputClass}
                    placeholder="Total beds"
                    required
                  />
                </div>
                <div>
                  <label className={labelClass}>Departments</label>
                  <input
                    type="number"
                    min={1}
                    value={form.departments}
                    onChange={(e) => handleChange("departments", Number(e.target.value))}
                    className={inputClass}
                    placeholder="Total departments"
                    required
                  />
                </div>
                <div>
                  <label className={labelClass}>Rating</label>
                  <input
                    type="number"
                    min={1}
                    max={5}
                    step="0.1"
                    value={form.rating}
                    onChange={(e) => handleChange("rating", Number(e.target.value))}
                    className={inputClass}
                    placeholder="1.0 - 5.0"
                    required
                  />
                </div>
                <div>
                  <label className={labelClass}>Wait Time</label>
                  <input
                    value={form.waitTime}
                    onChange={(e) => handleChange("waitTime", e.target.value)}
                    className={inputClass}
                    placeholder="e.g. 20-30 mins"
                    minLength={3}
                    maxLength={20}
                    required
                  />
                </div>
                <div>
                  <label className={labelClass}>Hospital Email</label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => handleChange("email", e.target.value)}
                    className={inputClass}
                    placeholder="hospital@email.com"
                    required
                  />
                </div>
                <div className="md:col-span-2">
                  <label className={labelClass}>Services Offered</label>
                  <textarea
                    value={form.servicesOffered}
                    onChange={(e) => handleChange("servicesOffered", e.target.value)}
                    className={`${inputClass} min-h-[96px]`}
                    placeholder="List major services offered"
                    rows={3}
                    minLength={10}
                    maxLength={220}
                    required
                  />
                </div>
              </div>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between pt-2">
            <p className="text-xs text-gray-500 dark:text-slate-400">Use short, clear content so all service cards stay balanced.</p>
            <button
              type="submit"
              className="w-full sm:w-auto px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium flex items-center justify-center gap-2"
            >
              {editingId ? <Save className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
              {editingId ? "Update Service" : "Post Service"}
            </button>
          </div>
        </form>

        <div className="bg-white dark:bg-slate-900 rounded-xl p-4 sm:p-6 border border-gray-200 dark:border-slate-800">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Published Services</h2>
          <div className="space-y-3">
            {services.map((service) => (
              <div key={service.id} className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 p-3 border border-gray-200 dark:border-slate-700 rounded-lg">
                <div className="flex items-start gap-3">
                  <img
                    src={service.image || SERVICE_FALLBACK_IMAGE}
                    alt={service.serviceName}
                    className="w-14 h-14 rounded-md object-cover border border-gray-200 dark:border-slate-700"
                    onError={(e) => {
                      e.currentTarget.src = SERVICE_FALLBACK_IMAGE;
                    }}
                  />
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">{service.serviceName}</p>
                  <p className="text-xs text-gray-600 dark:text-slate-400">{service.providerName} • {service.category}</p>
                  <p className="text-xs text-gray-500 dark:text-slate-500">{service.location}</p>
                  <p className="text-xs text-gray-500 dark:text-slate-500">{service.callType === "telemedicine" ? "Telemedicine" : "Phone"}</p>
                  {service.providerType === "hospital" && (
                    <p className="text-xs text-gray-500 dark:text-slate-500">
                      Beds: {service.beds} • Departments: {service.departments} • Rating: {service.rating} • Wait: {service.waitTime}
                    </p>
                  )}
                </div>
                </div>
                <div className="flex items-center gap-2 self-end sm:self-auto">
                  <button
                    className="px-3 py-1.5 text-xs border border-gray-300 dark:border-slate-600 rounded-lg text-gray-700 dark:text-slate-300"
                    onClick={() => handleEdit(service)}
                  >
                    Edit
                  </button>
                  <button
                    className="px-3 py-1.5 text-xs border border-red-200 text-red-600 rounded-lg"
                    onClick={() => handleDelete(service.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
