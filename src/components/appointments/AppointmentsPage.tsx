import { useState, useMemo } from "react";
import { format, isSameDay, parseISO, startOfMonth, endOfMonth, eachDayOfInterval, startOfWeek, endOfWeek, isToday, isSameMonth } from "date-fns";
import {
  Calendar as CalendarIcon, Plus, Search, Filter, Clock, Users,
  CheckCircle2, XCircle, AlertCircle, ChevronLeft, ChevronRight,
  MoreHorizontal, User, Phone, Stethoscope, MapPin,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter,
} from "@/components/ui/dialog";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

/* ── Types ── */
type AppointmentStatus = "Scheduled" | "Completed" | "Cancelled" | "In Progress" | "No Show";
type AppointmentType = "OPD" | "IPD";

interface Appointment {
  id: string;
  patientName: string;
  patientId: string;
  doctorName: string;
  department: string;
  type: AppointmentType;
  date: string;
  time: string;
  status: AppointmentStatus;
  phone: string;
  reason: string;
  room: string;
}

/* ── Mock data ── */
const APPOINTMENTS: Appointment[] = [
  { id: "APT-001", patientName: "Aisha Mohammed", patientId: "P-10001", doctorName: "Dr. Adebayo", department: "Cardiology", type: "OPD", date: "2026-02-21", time: "09:00", status: "Scheduled", phone: "+234 801 234 5678", reason: "Follow-up ECG", room: "OPD-12" },
  { id: "APT-002", patientName: "John Okafor", patientId: "P-10002", doctorName: "Dr. Nnamdi", department: "Orthopedics", type: "IPD", date: "2026-02-21", time: "10:30", status: "In Progress", phone: "+234 802 345 6789", reason: "Post-surgery review", room: "Ward B-4" },
  { id: "APT-003", patientName: "Fatima Bello", patientId: "P-10003", doctorName: "Dr. Okonkwo", department: "Dermatology", type: "OPD", date: "2026-02-21", time: "11:00", status: "Completed", phone: "+234 803 456 7890", reason: "Skin allergy consultation", room: "OPD-05" },
  { id: "APT-004", patientName: "Emeka Nwosu", patientId: "P-10004", doctorName: "Dr. Ibrahim", department: "ICU", type: "IPD", date: "2026-02-21", time: "14:00", status: "Scheduled", phone: "+234 804 567 8901", reason: "Critical care monitoring", room: "ICU-02" },
  { id: "APT-005", patientName: "Grace Adeyemi", patientId: "P-10005", doctorName: "Dr. Olatunji", department: "General Medicine", type: "OPD", date: "2026-02-22", time: "09:30", status: "Scheduled", phone: "+234 805 678 9012", reason: "Annual check-up", room: "OPD-08" },
  { id: "APT-006", patientName: "Ibrahim Musa", patientId: "P-10006", doctorName: "Dr. Chukwu", department: "ENT", type: "OPD", date: "2026-02-22", time: "10:00", status: "Cancelled", phone: "+234 806 789 0123", reason: "Ear infection", room: "OPD-03" },
  { id: "APT-007", patientName: "Ngozi Eze", patientId: "P-10007", doctorName: "Dr. Adeleke", department: "Obstetrics", type: "IPD", date: "2026-02-22", time: "08:00", status: "Scheduled", phone: "+234 807 890 1234", reason: "Prenatal checkup", room: "Ward C-1" },
  { id: "APT-008", patientName: "Tunde Bakare", patientId: "P-10008", doctorName: "Dr. Yusuf", department: "Neurology", type: "OPD", date: "2026-02-20", time: "15:00", status: "No Show", phone: "+234 808 901 2345", reason: "Migraine follow-up", room: "OPD-10" },
  { id: "APT-009", patientName: "Amina Yusuf", patientId: "P-10009", doctorName: "Dr. Balogun", department: "Pediatrics", type: "OPD", date: "2026-02-23", time: "09:00", status: "Scheduled", phone: "+234 809 012 3456", reason: "Vaccination", room: "OPD-01" },
  { id: "APT-010", patientName: "Chidi Anyanwu", patientId: "P-10010", doctorName: "Dr. Abubakar", department: "Urology", type: "OPD", date: "2026-02-23", time: "11:30", status: "Scheduled", phone: "+234 810 123 4567", reason: "Renal assessment", room: "OPD-07" },
  { id: "APT-011", patientName: "Halima Abdullahi", patientId: "P-10011", doctorName: "Dr. Eze", department: "Oncology", type: "IPD", date: "2026-02-19", time: "10:00", status: "Completed", phone: "+234 811 234 5678", reason: "Chemotherapy session", room: "Ward D-3" },
  { id: "APT-012", patientName: "Olumide Ajayi", patientId: "P-10012", doctorName: "Dr. Adebayo", department: "Cardiology", type: "OPD", date: "2026-02-24", time: "13:00", status: "Scheduled", phone: "+234 812 345 6789", reason: "Blood pressure review", room: "OPD-12" },
];

/* ── Status badge ── */
function StatusBadge({ status }: { status: AppointmentStatus }) {
  const map: Record<AppointmentStatus, string> = {
    Scheduled: "badge-info",
    "In Progress": "badge-warning",
    Completed: "badge-success",
    Cancelled: "badge-danger",
    "No Show": "badge-neutral",
  };
  return <span className={map[status]}>{status}</span>;
}

/* ── Stat card ── */
function StatCard({ label, value, icon: Icon, iconClass }: {
  label: string; value: number; icon: React.ElementType; iconClass: string;
}) {
  return (
    <div className="stat-card">
      <div className="flex items-center justify-between">
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">{label}</p>
        <div className={cn("h-8 w-8 rounded-lg flex items-center justify-center", iconClass)}>
          <Icon className="h-4 w-4 text-primary-foreground" />
        </div>
      </div>
      <p className="text-2xl font-bold text-foreground">{value}</p>
    </div>
  );
}

/* ── Mini calendar grid ── */
function MiniCalendarGrid({ selectedDate, onSelect, appointments }: {
  selectedDate: Date;
  onSelect: (d: Date) => void;
  appointments: Appointment[];
}) {
  const [viewMonth, setViewMonth] = useState(startOfMonth(selectedDate));
  const monthStart = startOfMonth(viewMonth);
  const monthEnd = endOfMonth(viewMonth);
  const calStart = startOfWeek(monthStart);
  const calEnd = endOfWeek(monthEnd);
  const days = eachDayOfInterval({ start: calStart, end: calEnd });

  const dayHasAppointment = (d: Date) =>
    appointments.some((a) => isSameDay(parseISO(a.date), d));

  return (
    <div className="rounded-xl border border-border bg-card p-4" style={{ boxShadow: "var(--shadow-sm)" }}>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-foreground">{format(viewMonth, "MMMM yyyy")}</h3>
        <div className="flex gap-1">
          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setViewMonth((m) => new Date(m.getFullYear(), m.getMonth() - 1))}>
            <ChevronLeft className="h-3.5 w-3.5" />
          </Button>
          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setViewMonth((m) => new Date(m.getFullYear(), m.getMonth() + 1))}>
            <ChevronRight className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>
      <div className="grid grid-cols-7 gap-0.5 text-center">
        {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((d) => (
          <div key={d} className="text-[10px] font-semibold text-muted-foreground py-1">{d}</div>
        ))}
        {days.map((day) => {
          const inMonth = isSameMonth(day, viewMonth);
          const selected = isSameDay(day, selectedDate);
          const today = isToday(day);
          const hasApt = dayHasAppointment(day);
          return (
            <button
              key={day.toISOString()}
              onClick={() => onSelect(day)}
              className={cn(
                "relative h-8 w-full rounded-md text-xs font-medium transition-colors",
                !inMonth && "text-muted-foreground/40",
                inMonth && !selected && "text-foreground hover:bg-accent",
                today && !selected && "ring-1 ring-primary/30",
                selected && "bg-primary text-primary-foreground",
              )}
            >
              {format(day, "d")}
              {hasApt && !selected && (
                <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 h-1 w-1 rounded-full bg-primary" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ── Booking modal ── */
function BookingModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [bookingDate, setBookingDate] = useState<Date>();

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Book New Appointment</DialogTitle>
          <DialogDescription>Fill in the details to schedule a new appointment.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-2">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Patient Name</Label>
              <Input placeholder="Search patient…" />
            </div>
            <div className="space-y-2">
              <Label>Doctor</Label>
              <Select>
                <SelectTrigger><SelectValue placeholder="Select doctor" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="adebayo">Dr. Adebayo</SelectItem>
                  <SelectItem value="nnamdi">Dr. Nnamdi</SelectItem>
                  <SelectItem value="okonkwo">Dr. Okonkwo</SelectItem>
                  <SelectItem value="ibrahim">Dr. Ibrahim</SelectItem>
                  <SelectItem value="balogun">Dr. Balogun</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Department</Label>
              <Select>
                <SelectTrigger><SelectValue placeholder="Select department" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="cardiology">Cardiology</SelectItem>
                  <SelectItem value="orthopedics">Orthopedics</SelectItem>
                  <SelectItem value="dermatology">Dermatology</SelectItem>
                  <SelectItem value="pediatrics">Pediatrics</SelectItem>
                  <SelectItem value="neurology">Neurology</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Type</Label>
              <Select>
                <SelectTrigger><SelectValue placeholder="OPD / IPD" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="OPD">OPD (Outpatient)</SelectItem>
                  <SelectItem value="IPD">IPD (Inpatient)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className={cn("w-full justify-start text-left font-normal", !bookingDate && "text-muted-foreground")}>
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {bookingDate ? format(bookingDate, "PPP") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar mode="single" selected={bookingDate} onSelect={setBookingDate} initialFocus className="p-3 pointer-events-auto" />
                </PopoverContent>
              </Popover>
            </div>
            <div className="space-y-2">
              <Label>Time</Label>
              <Select>
                <SelectTrigger><SelectValue placeholder="Select time" /></SelectTrigger>
                <SelectContent>
                  {["08:00", "08:30", "09:00", "09:30", "10:00", "10:30", "11:00", "11:30", "12:00", "13:00", "13:30", "14:00", "14:30", "15:00", "15:30", "16:00"].map((t) => (
                    <SelectItem key={t} value={t}>{t}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-2">
            <Label>Reason / Notes</Label>
            <Textarea placeholder="Brief reason for the appointment…" rows={3} />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={onClose}>Book Appointment</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

/* ── Main page ── */
export function AppointmentsPage() {
  const [selectedDate, setSelectedDate] = useState(new Date(2026, 1, 21));
  const [typeFilter, setTypeFilter] = useState<"all" | "OPD" | "IPD">("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [bookingOpen, setBookingOpen] = useState(false);

  const filtered = useMemo(() => {
    return APPOINTMENTS.filter((a) => {
      const matchDate = isSameDay(parseISO(a.date), selectedDate);
      const matchType = typeFilter === "all" || a.type === typeFilter;
      const matchStatus = statusFilter === "all" || a.status === statusFilter;
      const matchSearch =
        a.patientName.toLowerCase().includes(search.toLowerCase()) ||
        a.doctorName.toLowerCase().includes(search.toLowerCase()) ||
        a.id.toLowerCase().includes(search.toLowerCase());
      return matchDate && matchType && matchStatus && matchSearch;
    });
  }, [selectedDate, typeFilter, statusFilter, search]);

  const todayAll = APPOINTMENTS.filter((a) => isSameDay(parseISO(a.date), selectedDate));
  const counts = {
    total: todayAll.length,
    scheduled: todayAll.filter((a) => a.status === "Scheduled").length,
    completed: todayAll.filter((a) => a.status === "Completed").length,
    cancelled: todayAll.filter((a) => a.status === "Cancelled" || a.status === "No Show").length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Appointments</h1>
          <p className="text-sm text-muted-foreground">Schedule and manage patient appointments</p>
        </div>
        <Button className="gap-2 self-start" onClick={() => setBookingOpen(true)}>
          <Plus className="h-4 w-4" /> New Appointment
        </Button>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Today's Total" value={counts.total} icon={CalendarIcon} iconClass="bg-primary" />
        <StatCard label="Scheduled" value={counts.scheduled} icon={Clock} iconClass="bg-[hsl(var(--secondary))]" />
        <StatCard label="Completed" value={counts.completed} icon={CheckCircle2} iconClass="bg-[hsl(var(--success))]" />
        <StatCard label="Cancelled / No Show" value={counts.cancelled} icon={XCircle} iconClass="bg-[hsl(var(--destructive))]" />
      </div>

      {/* Main layout: sidebar calendar + list */}
      <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6">
        {/* Calendar sidebar */}
        <div className="space-y-4">
          <MiniCalendarGrid selectedDate={selectedDate} onSelect={setSelectedDate} appointments={APPOINTMENTS} />
          <div className="rounded-xl border border-border bg-card p-4 space-y-3" style={{ boxShadow: "var(--shadow-sm)" }}>
            <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Selected Date</h4>
            <p className="text-sm font-semibold text-foreground">{format(selectedDate, "EEEE, MMMM d, yyyy")}</p>
            <p className="text-xs text-muted-foreground">{todayAll.length} appointment{todayAll.length !== 1 ? "s" : ""} scheduled</p>
          </div>
        </div>

        {/* List panel */}
        <div className="space-y-4">
          {/* Filters bar */}
          <div className="rounded-xl border border-border bg-card p-4" style={{ boxShadow: "var(--shadow-sm)" }}>
            <div className="flex flex-col md:flex-row gap-3 items-start md:items-center">
              <Tabs value={typeFilter} onValueChange={(v) => setTypeFilter(v as typeof typeFilter)} className="shrink-0">
                <TabsList>
                  <TabsTrigger value="all">All</TabsTrigger>
                  <TabsTrigger value="OPD">OPD</TabsTrigger>
                  <TabsTrigger value="IPD">IPD</TabsTrigger>
                </TabsList>
              </Tabs>
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search patient or doctor…" value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full md:w-[160px]">
                  <Filter className="h-3.5 w-3.5 mr-1.5 text-muted-foreground" />
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="Scheduled">Scheduled</SelectItem>
                  <SelectItem value="In Progress">In Progress</SelectItem>
                  <SelectItem value="Completed">Completed</SelectItem>
                  <SelectItem value="Cancelled">Cancelled</SelectItem>
                  <SelectItem value="No Show">No Show</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Appointment cards */}
          {filtered.length === 0 ? (
            <div className="rounded-xl border border-border bg-card p-12 text-center" style={{ boxShadow: "var(--shadow-sm)" }}>
              <CalendarIcon className="h-10 w-10 text-muted-foreground/40 mx-auto mb-3" />
              <p className="text-sm font-medium text-muted-foreground">No appointments found for this date.</p>
              <Button variant="outline" size="sm" className="mt-4 gap-2" onClick={() => setBookingOpen(true)}>
                <Plus className="h-3.5 w-3.5" /> Book Appointment
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {filtered.map((apt) => (
                <div
                  key={apt.id}
                  className="rounded-xl border border-border bg-card p-4 group hover:shadow-md transition-shadow"
                  style={{ boxShadow: "var(--shadow-sm)" }}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3 flex-1 min-w-0">
                      {/* Time badge */}
                      <div className="shrink-0 flex flex-col items-center rounded-lg bg-primary/10 px-3 py-2 min-w-[56px]">
                        <Clock className="h-3.5 w-3.5 text-primary mb-0.5" />
                        <span className="text-sm font-bold text-primary">{apt.time}</span>
                      </div>
                      {/* Details */}
                      <div className="flex-1 min-w-0 space-y-1.5">
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="text-sm font-semibold text-foreground">{apt.patientName}</p>
                          <span className="text-xs text-muted-foreground">({apt.patientId})</span>
                          <Badge variant="outline" className="text-[10px] px-1.5 py-0">{apt.type}</Badge>
                        </div>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground flex-wrap">
                          <span className="flex items-center gap-1"><Stethoscope className="h-3 w-3" />{apt.doctorName}</span>
                          <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{apt.room}</span>
                          <span className="flex items-center gap-1"><Phone className="h-3 w-3" />{apt.phone}</span>
                        </div>
                        <p className="text-xs text-muted-foreground">{apt.department} · {apt.reason}</p>
                      </div>
                    </div>
                    {/* Right side */}
                    <div className="flex items-center gap-2 shrink-0">
                      <StatusBadge status={apt.status} />
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>View Details</DropdownMenuItem>
                          <DropdownMenuItem>Mark Completed</DropdownMenuItem>
                          <DropdownMenuItem>Reschedule</DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive">Cancel</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <BookingModal open={bookingOpen} onClose={() => setBookingOpen(false)} />
    </div>
  );
}
