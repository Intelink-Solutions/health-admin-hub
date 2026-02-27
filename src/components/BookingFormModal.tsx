import { useState } from "react";

interface BookingFormData {
  fullName: string;
  phone: string;
  date: string;
  time: string;
  notes: string;
}

interface BookingFormModalProps {
  open: boolean;
  title: string;
  onClose: () => void;
  onSubmit?: (data: BookingFormData) => void;
}

export function BookingFormModal({ open, title, onClose, onSubmit }: BookingFormModalProps) {
  const [form, setForm] = useState<BookingFormData>({
    fullName: "",
    phone: "",
    date: "",
    time: "",
    notes: "",
  });

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-end sm:items-center justify-center p-2 sm:p-4 z-50">
      <div className="bg-white dark:bg-slate-900 rounded-lg max-w-md w-full p-4 sm:p-6 border border-gray-200 dark:border-slate-800 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">{title}</h2>
          <button onClick={onClose} className="text-gray-400 dark:text-slate-500 hover:text-gray-600 dark:hover:text-slate-300">
            ✕
          </button>
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            onSubmit?.(form);
            setForm({ fullName: "", phone: "", date: "", time: "", notes: "" });
            onClose();
          }}
          className="space-y-4"
        >
          <div>
            <label className="text-xs text-gray-600 dark:text-slate-400">Full Name</label>
            <input
              value={form.fullName}
              onChange={(e) => setForm({ ...form, fullName: e.target.value })}
              className="w-full mt-1 px-3 py-2 border border-gray-300 dark:border-slate-700 rounded-lg text-sm bg-white dark:bg-slate-800 text-gray-900 dark:text-white"
              placeholder="Your name"
            />
          </div>
          <div>
            <label className="text-xs text-gray-600 dark:text-slate-400">Phone</label>
            <input
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              className="w-full mt-1 px-3 py-2 border border-gray-300 dark:border-slate-700 rounded-lg text-sm bg-white dark:bg-slate-800 text-gray-900 dark:text-white"
              placeholder="+233 24 000 0000"
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-gray-600 dark:text-slate-400">Date</label>
              <input
                type="date"
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
                className="w-full mt-1 px-3 py-2 border border-gray-300 dark:border-slate-700 rounded-lg text-sm bg-white dark:bg-slate-800 text-gray-900 dark:text-white"
              />
            </div>
            <div>
              <label className="text-xs text-gray-600 dark:text-slate-400">Time</label>
              <input
                type="time"
                value={form.time}
                onChange={(e) => setForm({ ...form, time: e.target.value })}
                className="w-full mt-1 px-3 py-2 border border-gray-300 dark:border-slate-700 rounded-lg text-sm bg-white dark:bg-slate-800 text-gray-900 dark:text-white"
              />
            </div>
          </div>
          <div>
            <label className="text-xs text-gray-600 dark:text-slate-400">Notes</label>
            <textarea
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              className="w-full mt-1 px-3 py-2 border border-gray-300 dark:border-slate-700 rounded-lg text-sm bg-white dark:bg-slate-800 text-gray-900 dark:text-white"
              rows={3}
              placeholder="Reason for visit"
            />
          </div>
          <button className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition">
            Submit Request
          </button>
        </form>
      </div>
    </div>
  );
}
