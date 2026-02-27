import { useEffect, useState } from "react";
import { Switch } from "../../components/ui/switch";

interface UserSettingsForm {
  emailNotifications: boolean;
  smsNotifications: boolean;
  appointmentReminders: boolean;
}

export function UserSettingsPage() {
  const [form, setForm] = useState<UserSettingsForm>({
    emailNotifications: true,
    smsNotifications: true,
    appointmentReminders: true,
  });
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const storedEmail = localStorage.getItem("userEmailNotifications");
    const storedSms = localStorage.getItem("userSmsNotifications");
    const storedReminders = localStorage.getItem("userAppointmentReminders");

    setForm((prev) => ({
      ...prev,
      emailNotifications: storedEmail === null ? prev.emailNotifications : storedEmail === "true",
      smsNotifications: storedSms === null ? prev.smsNotifications : storedSms === "true",
      appointmentReminders:
        storedReminders === null ? prev.appointmentReminders : storedReminders === "true",
    }));
  }, []);

  const handleSave = () => {
    localStorage.setItem("userEmailNotifications", String(form.emailNotifications));
    localStorage.setItem("userSmsNotifications", String(form.smsNotifications));
    localStorage.setItem("userAppointmentReminders", String(form.appointmentReminders));
    setSaved(true);
    window.setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950 transition-colors duration-300">
      <header className="bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-slate-800 sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-teal-600 flex items-center justify-center">
            <span className="text-white text-sm font-bold">BP</span>
          </div>
          <span className="text-base sm:text-lg font-bold text-gray-900 dark:text-white">BesaPlus</span>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <div className="flex items-center justify-between mb-6 gap-3">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">User Settings</h1>
            <p className="text-sm text-gray-600 dark:text-slate-400">Control notifications and reminders.</p>
          </div>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition"
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
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Notifications</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between border border-gray-100 dark:border-slate-800 rounded-lg p-4">
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">Email notifications</p>
                  <p className="text-xs text-gray-500 dark:text-slate-400">Updates about appointments and care plans.</p>
                </div>
                <Switch
                  checked={form.emailNotifications}
                  onCheckedChange={(checked) => setForm({ ...form, emailNotifications: checked })}
                />
              </div>
              <div className="flex items-center justify-between border border-gray-100 dark:border-slate-800 rounded-lg p-4">
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">SMS notifications</p>
                  <p className="text-xs text-gray-500 dark:text-slate-400">Short messages for time-sensitive updates.</p>
                </div>
                <Switch
                  checked={form.smsNotifications}
                  onCheckedChange={(checked) => setForm({ ...form, smsNotifications: checked })}
                />
              </div>
              <div className="flex items-center justify-between border border-gray-100 dark:border-slate-800 rounded-lg p-4">
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">Appointment reminders</p>
                  <p className="text-xs text-gray-500 dark:text-slate-400">Reminders 24 hours before your visit.</p>
                </div>
                <Switch
                  checked={form.appointmentReminders}
                  onCheckedChange={(checked) => setForm({ ...form, appointmentReminders: checked })}
                />
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
