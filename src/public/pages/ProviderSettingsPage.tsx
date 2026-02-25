import { useEffect, useState } from "react";
import { Switch } from "../../components/ui/switch";

interface ProviderSettingsForm {
  showPhone: boolean;
  phone: string;
  emailNotifications: boolean;
}

export function ProviderSettingsPage() {
  const [form, setForm] = useState<ProviderSettingsForm>({
    showPhone: true,
    phone: "",
    emailNotifications: true,
  });
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const storedShowPhone = localStorage.getItem("providerShowPhone");
    const storedPhone = localStorage.getItem("providerPhone");
    const storedEmailNotifications = localStorage.getItem("providerEmailNotifications");

    setForm((prev) => ({
      ...prev,
      showPhone: storedShowPhone === null ? prev.showPhone : storedShowPhone === "true",
      phone: storedPhone ?? prev.phone,
      emailNotifications:
        storedEmailNotifications === null
          ? prev.emailNotifications
          : storedEmailNotifications === "true",
    }));
  }, []);

  const handleSave = () => {
    localStorage.setItem("providerShowPhone", String(form.showPhone));
    localStorage.setItem("providerPhone", form.phone);
    localStorage.setItem("providerEmailNotifications", String(form.emailNotifications));
    setSaved(true);
    window.setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Provider Settings</h1>
            <p className="text-sm text-gray-600">Manage visibility, contact, and notifications.</p>
          </div>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium"
          >
            Save Settings
          </button>
        </div>

        {saved && (
          <div className="mb-4 rounded-lg border border-green-200 bg-green-50 px-4 py-2 text-sm text-green-700">
            Settings saved successfully.
          </div>
        )}

        <div className="grid gap-6">
          <section className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Privacy</h2>
            <div className="flex items-center justify-between border border-gray-100 rounded-lg p-4">
              <div>
                <p className="text-sm font-medium text-gray-900">Show phone number to users</p>
                <p className="text-xs text-gray-500">Disable to hide your number on public listings.</p>
              </div>
              <Switch
                checked={form.showPhone}
                onCheckedChange={(checked) => setForm({ ...form, showPhone: checked })}
              />
            </div>
          </section>

          <section className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Contact</h2>
            <label className="text-sm font-medium text-gray-700">Public phone number</label>
            <input
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              placeholder="+233 24 000 0000"
              className="w-full mt-2 px-3 py-2 border border-gray-300 rounded-lg text-sm"
            />
          </section>

          <section className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Notifications</h2>
            <div className="flex items-center justify-between border border-gray-100 rounded-lg p-4">
              <div>
                <p className="text-sm font-medium text-gray-900">Email notifications</p>
                <p className="text-xs text-gray-500">Appointment updates and service requests.</p>
              </div>
              <Switch
                checked={form.emailNotifications}
                onCheckedChange={(checked) => setForm({ ...form, emailNotifications: checked })}
              />
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
