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
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950 transition-colors duration-300">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-3">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">Provider Settings</h1>
            <p className="text-sm text-gray-600 dark:text-slate-400">Manage visibility, contact, and notifications.</p>
          </div>
          <button
            onClick={handleSave}
            className="w-full sm:w-auto px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition"
          >
            Save Settings
          </button>
        </div>

        {saved && (
          <div className="mb-4 rounded-lg border border-green-200 dark:border-green-900/50 bg-green-50 dark:bg-green-950/30 px-4 py-2 text-sm text-green-700 dark:text-green-300">
            Settings saved successfully.
          </div>
        )}

        <div className="grid gap-6">
          <section className="bg-white dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-slate-800 p-6">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Privacy</h2>
            <div className="flex items-center justify-between border border-gray-100 dark:border-slate-800 rounded-lg p-4 gap-3">
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">Show phone number to users</p>
                <p className="text-xs text-gray-500 dark:text-slate-400">Disable to hide your number on public listings.</p>
              </div>
              <Switch
                checked={form.showPhone}
                onCheckedChange={(checked) => setForm({ ...form, showPhone: checked })}
              />
            </div>
          </section>

          <section className="bg-white dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-slate-800 p-6">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Contact</h2>
            <label className="text-sm font-medium text-gray-700 dark:text-slate-300">Public phone number</label>
            <input
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              placeholder="+233 24 000 0000"
              className="w-full mt-2 px-3 py-2 border border-gray-300 dark:border-slate-700 rounded-lg text-sm bg-white dark:bg-slate-800 text-gray-900 dark:text-white"
            />
          </section>

          <section className="bg-white dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-slate-800 p-6">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Notifications</h2>
            <div className="flex items-center justify-between border border-gray-100 dark:border-slate-800 rounded-lg p-4 gap-3">
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">Email notifications</p>
                <p className="text-xs text-gray-500 dark:text-slate-400">Appointment updates and service requests.</p>
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
