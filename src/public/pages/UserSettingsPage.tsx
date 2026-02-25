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
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">User Settings</h1>
            <p className="text-sm text-gray-600">Control notifications and reminders.</p>
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
            <h2 className="text-lg font-bold text-gray-900 mb-4">Notifications</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between border border-gray-100 rounded-lg p-4">
                <div>
                  <p className="text-sm font-medium text-gray-900">Email notifications</p>
                  <p className="text-xs text-gray-500">Updates about appointments and care plans.</p>
                </div>
                <Switch
                  checked={form.emailNotifications}
                  onCheckedChange={(checked) => setForm({ ...form, emailNotifications: checked })}
                />
              </div>
              <div className="flex items-center justify-between border border-gray-100 rounded-lg p-4">
                <div>
                  <p className="text-sm font-medium text-gray-900">SMS notifications</p>
                  <p className="text-xs text-gray-500">Short messages for time-sensitive updates.</p>
                </div>
                <Switch
                  checked={form.smsNotifications}
                  onCheckedChange={(checked) => setForm({ ...form, smsNotifications: checked })}
                />
              </div>
              <div className="flex items-center justify-between border border-gray-100 rounded-lg p-4">
                <div>
                  <p className="text-sm font-medium text-gray-900">Appointment reminders</p>
                  <p className="text-xs text-gray-500">Reminders 24 hours before your visit.</p>
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
