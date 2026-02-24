import {
  Users, Calendar, BedDouble, TrendingUp, TrendingDown,
  Activity, AlertCircle, CheckCircle2, Clock, Pill,
  CreditCard, HeartPulse, ArrowUpRight, ArrowDownRight,
  Stethoscope, FlaskConical, Shield, ArrowRight,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line,
} from "recharts";

/* ── Helpers ── */
const admissionsData = [
  { day: "Mon", opd: 142, ipd: 28, emergency: 14 },
  { day: "Tue", opd: 168, ipd: 31, emergency: 19 },
  { day: "Wed", opd: 155, ipd: 26, emergency: 11 },
  { day: "Thu", opd: 187, ipd: 34, emergency: 22 },
  { day: "Fri", opd: 173, ipd: 29, emergency: 17 },
  { day: "Sat", opd: 120, ipd: 22, emergency: 13 },
  { day: "Sun", opd: 98,  ipd: 18, emergency: 9  },
];

const revenueData = [
  { month: "Aug", revenue: 312000, claims: 88000 },
  { month: "Sep", revenue: 345000, claims: 95000 },
  { month: "Oct", revenue: 298000, claims: 82000 },
  { month: "Nov", revenue: 387000, claims: 104000 },
  { month: "Dec", revenue: 421000, claims: 118000 },
  { month: "Jan", revenue: 456000, claims: 127000 },
];

const bedOccupancyData = [
  { name: "Occupied",  value: 187, color: "hsl(210,88%,42%)" },
  { name: "Available", value: 63,  color: "hsl(168,60%,40%)" },
  { name: "Reserved",  value: 24,  color: "hsl(38,92%,50%)"  },
];

const RECENT_PATIENTS = [
  { id: "P-2041", name: "Sarah Mitchell",  age: 34, dept: "Cardiology",  status: "Admitted",    doctor: "Dr. Chen",   time: "09:14 AM" },
  { id: "P-2042", name: "Robert Kimani",   age: 67, dept: "Orthopedics", status: "OPD",         doctor: "Dr. Patel",  time: "09:22 AM" },
  { id: "P-2043", name: "Aisha Nwosu",     age: 28, dept: "Maternity",   status: "In Labor",    doctor: "Dr. Osei",   time: "09:35 AM" },
  { id: "P-2044", name: "James Hartwell",  age: 52, dept: "Emergency",   status: "Critical",    doctor: "Dr. Rivera", time: "09:41 AM" },
  { id: "P-2045", name: "Lin Wei",         age: 45, dept: "Radiology",   status: "Discharged",  doctor: "Dr. Smith",  time: "09:55 AM" },
  { id: "P-2046", name: "Fatima Al-Amin",  age: 61, dept: "Oncology",    status: "Admitted",    doctor: "Dr. Kumar",  time: "10:03 AM" },
];

const RECENT_APPOINTMENTS = [
  { id: "A-1001", patient: "Sarah Mitchell", doctor: "Dr. Chen",   dept: "Cardiology",  time: "10:00 AM", status: "Scheduled" },
  { id: "A-1002", patient: "Robert Kimani",  doctor: "Dr. Patel",  dept: "Orthopedics", time: "10:30 AM", status: "In Progress" },
  { id: "A-1003", patient: "Aisha Nwosu",    doctor: "Dr. Osei",   dept: "Maternity",   time: "11:00 AM", status: "Completed" },
  { id: "A-1004", patient: "James Hartwell", doctor: "Dr. Rivera", dept: "Emergency",   time: "11:15 AM", status: "Scheduled" },
  { id: "A-1005", patient: "Lin Wei",        doctor: "Dr. Smith",  dept: "Radiology",   time: "11:45 AM", status: "Cancelled" },
];

const QUICK_ACTIONS = [
  { label: "View Patients",     icon: Users,      path: "/patients",         color: "gradient-primary" },
  { label: "Appointments",      icon: Calendar,   path: "/appointments",     color: "bg-secondary" },
  { label: "Billing & Payments",icon: CreditCard, path: "/finance/billing",  color: "bg-success" },
  { label: "Staff Directory",   icon: Stethoscope,path: "/admin/staff",      color: "bg-warning" },
];

const ALERTS = [
  { type: "danger",  text: "ICU beds at 92% capacity — 3 beds remaining" },
  { type: "warning", text: "Pharmacy low-stock: Amoxicillin (12 units left)" },
  { type: "info",    text: "6 lab results pending review — Dr. Chen's queue" },
  { type: "success", text: "7 insurance claims approved this morning" },
];

/* ── Stat Card ── */
interface StatCardProps {
  title: string;
  value: string;
  sub: string;
  icon: React.ElementType;
  iconBg: string;
  trend?: "up" | "down";
  trendValue?: string;
}

function StatCard({ title, value, sub, icon: Icon, iconBg, trend, trendValue }: StatCardProps) {
  return (
    <div className="stat-card">
      <div className="flex items-start justify-between">
        <div className={`h-10 w-10 rounded-xl flex items-center justify-center shrink-0 ${iconBg}`}>
          <Icon className="h-5 w-5 text-primary-foreground" />
        </div>
        {trend && (
          <span className={`flex items-center gap-0.5 text-xs font-semibold ${trend === "up" ? "text-success" : "text-destructive"}`}>
            {trend === "up" ? <ArrowUpRight className="h-3.5 w-3.5" /> : <ArrowDownRight className="h-3.5 w-3.5" />}
            {trendValue}
          </span>
        )}
      </div>
      <div>
        <p className="text-2xl font-bold text-foreground tracking-tight">{value}</p>
        <p className="text-sm font-medium text-foreground mt-0.5">{title}</p>
        <p className="text-xs text-muted-foreground mt-0.5">{sub}</p>
      </div>
    </div>
  );
}

/* ── Status badge ── */
function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    Admitted:   "badge-info",
    OPD:        "badge-neutral",
    Discharged: "badge-success",
    Critical:   "badge-danger",
    "In Labor": "badge-warning",
  };
  return <span className={map[status] ?? "badge-neutral"}>{status}</span>;
}

/* ── Appointment Status Badge ── */
function AppointmentBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    Scheduled:     "badge-info",
    "In Progress": "badge-warning",
    Completed:     "badge-success",
    Cancelled:     "badge-danger",
  };
  return <span className={map[status] ?? "badge-neutral"}>{status}</span>;
}

/* ── Custom Tooltip ── */
function ChartTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-card border border-border rounded-lg px-3 py-2 shadow-card-md text-xs">
      <p className="font-semibold text-foreground mb-1">{label}</p>
      {payload.map((p: any) => (
        <p key={p.dataKey} style={{ color: p.color }}>
          {p.name}: <span className="font-semibold">{typeof p.value === "number" && p.value > 1000 ? `$${(p.value/1000).toFixed(0)}k` : p.value}</span>
        </p>
      ))}
    </div>
  );
}

/* ── Dashboard ── */
export function DashboardPage() {
  const navigate = useNavigate();
  return (
    <div className="space-y-6 pb-4">

      {/* Page header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-xl font-bold text-foreground">Hospital Dashboard</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Real-time overview — BesaPlus: Univeral Solution</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="badge-success flex items-center gap-1.5 px-3 py-1.5 text-xs">
            <span className="h-1.5 w-1.5 rounded-full bg-success animate-pulse-soft" />
            Live
          </span>
          <button className="flex items-center gap-2 text-xs font-medium text-muted-foreground border border-border rounded-lg px-3 py-1.5 hover:bg-muted transition-colors">
            <Clock className="h-3.5 w-3.5" />
            Today, Jan 20
          </button>
        </div>
      </div>

      {/* Alerts bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3">
        {ALERTS.map((a, i) => (
          <div
            key={i}
            className={`flex items-start gap-2.5 rounded-lg px-3 py-2.5 border text-xs font-medium ${
              a.type === "danger"  ? "bg-destructive/6 border-destructive/20 text-destructive" :
              a.type === "warning" ? "bg-warning/6 border-warning/20 text-warning" :
              a.type === "success" ? "bg-success/6 border-success/20 text-success" :
                                     "bg-primary/6 border-primary/20 text-primary"
            }`}
          >
            <AlertCircle className="h-3.5 w-3.5 shrink-0 mt-0.5" />
            <span>{a.text}</span>
          </div>
        ))}
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Patients Today"
          value="1,243"
          sub="OPD + IPD + Emergency"
          icon={Users}
          iconBg="gradient-primary"
          trend="up"
          trendValue="+12.4%"
        />
        <StatCard
          title="Appointments"
          value="287"
          sub="48 pending confirmation"
          icon={Calendar}
          iconBg="bg-secondary"
          trend="up"
          trendValue="+6.1%"
        />
        <StatCard
          title="Bed Occupancy"
          value="187/274"
          sub="68.2% occupied"
          icon={BedDouble}
          iconBg="bg-warning"
          trend="up"
          trendValue="+3.8%"
        />
        <StatCard
          title="Revenue Today"
          value="$48,320"
          sub="Claims: $12,480 pending"
          icon={CreditCard}
          iconBg="bg-success"
          trend="up"
          trendValue="+9.3%"
        />
      </div>

      {/* Second row KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Active Doctors"
          value="64"
          sub="12 on emergency duty"
          icon={Stethoscope}
          iconBg="bg-primary"
          trend="down"
          trendValue="-2"
        />
        <StatCard
          title="Lab Tests Pending"
          value="134"
          sub="28 urgent / STAT"
          icon={FlaskConical}
          iconBg="bg-purple-500"
        />
        <StatCard
          title="Prescriptions"
          value="389"
          sub="321 dispensed today"
          icon={Pill}
          iconBg="bg-teal-500"
          trend="up"
          trendValue="+5.2%"
        />
        <StatCard
          title="Insurance Claims"
          value="72"
          sub="7 approved this morning"
          icon={Shield}
          iconBg="bg-indigo-500"
          trend="up"
          trendValue="+14.2%"
        />
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

        {/* Admissions chart (2/3 width) */}
        <div className="lg:col-span-2 stat-card">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm font-semibold text-foreground">Weekly Patient Flow</p>
              <p className="text-xs text-muted-foreground">OPD · IPD · Emergency</p>
            </div>
            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-primary inline-block" />OPD</span>
              <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-secondary inline-block" />IPD</span>
              <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-destructive inline-block" />Emergency</span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={admissionsData} barSize={12} barGap={4}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
              <XAxis dataKey="day" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
              <Tooltip content={<ChartTooltip />} />
              <Bar dataKey="opd"       name="OPD"       fill="hsl(var(--primary))"     radius={[3,3,0,0]} />
              <Bar dataKey="ipd"       name="IPD"       fill="hsl(var(--secondary))"   radius={[3,3,0,0]} />
              <Bar dataKey="emergency" name="Emergency" fill="hsl(var(--destructive))" radius={[3,3,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Bed occupancy donut */}
        <div className="stat-card">
          <p className="text-sm font-semibold text-foreground mb-1">Bed Occupancy</p>
          <p className="text-xs text-muted-foreground mb-4">274 total beds</p>
          <div className="flex flex-col items-center">
            <ResponsiveContainer width="100%" height={160}>
              <PieChart>
                <Pie
                  data={bedOccupancyData}
                  cx="50%" cy="50%"
                  innerRadius={52} outerRadius={72}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {bedOccupancyData.map((entry, i) => (
                    <Cell key={i} fill={entry.color} stroke="none" />
                  ))}
                </Pie>
                <Tooltip content={<ChartTooltip />} />
              </PieChart>
            </ResponsiveContainer>
            <div className="w-full space-y-2 mt-2">
              {bedOccupancyData.map((d) => (
                <div key={d.name} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full shrink-0" style={{ background: d.color }} />
                    <span className="text-muted-foreground">{d.name}</span>
                  </div>
                  <span className="font-semibold text-foreground">{d.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Revenue trend */}
      <div className="stat-card">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-sm font-semibold text-foreground">Revenue & Insurance Claims</p>
            <p className="text-xs text-muted-foreground">Last 6 months</p>
          </div>
          <span className="badge-success">+18.2% YoY</span>
        </div>
        <ResponsiveContainer width="100%" height={180}>
          <AreaChart data={revenueData}>
            <defs>
              <linearGradient id="gradRevenue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%"  stopColor="hsl(var(--primary))" stopOpacity={0.15} />
                <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="gradClaims" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%"  stopColor="hsl(var(--secondary))" stopOpacity={0.15} />
                <stop offset="95%" stopColor="hsl(var(--secondary))" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
            <XAxis dataKey="month" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${v/1000}k`} />
            <Tooltip content={<ChartTooltip />} />
            <Area type="monotone" dataKey="revenue" name="Revenue" stroke="hsl(var(--primary))" fill="url(#gradRevenue)" strokeWidth={2} dot={false} />
            <Area type="monotone" dataKey="claims"  name="Claims"  stroke="hsl(var(--secondary))" fill="url(#gradClaims)" strokeWidth={2} dot={false} />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {QUICK_ACTIONS.map((a) => (
          <button
            key={a.path}
            onClick={() => navigate(a.path)}
            className="stat-card flex items-center gap-3 hover:border-primary/30 transition-all group cursor-pointer"
          >
            <div className={`h-10 w-10 rounded-xl flex items-center justify-center shrink-0 ${a.color}`}>
              <a.icon className="h-5 w-5 text-primary-foreground" />
            </div>
            <div className="text-left flex-1">
              <p className="text-sm font-semibold text-foreground">{a.label}</p>
            </div>
            <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
          </button>
        ))}
      </div>

      {/* Recent Appointments */}
      <div className="stat-card overflow-hidden p-0">
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <div>
            <p className="text-sm font-semibold text-foreground">Upcoming Appointments</p>
            <p className="text-xs text-muted-foreground">Today's scheduled appointments</p>
          </div>
          <button onClick={() => navigate("/appointments")} className="text-xs font-medium text-primary hover:underline">View all →</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                {["ID", "Patient", "Doctor", "Department", "Time", "Status"].map((h) => (
                  <th key={h} className="text-left text-xs font-semibold text-muted-foreground px-5 py-3 whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {RECENT_APPOINTMENTS.map((a) => (
                <tr key={a.id} className="hover:bg-muted/20 transition-colors cursor-pointer">
                  <td className="px-5 py-3 text-xs font-mono font-medium text-primary">{a.id}</td>
                  <td className="px-5 py-3 text-sm font-medium text-foreground whitespace-nowrap">{a.patient}</td>
                  <td className="px-5 py-3 text-sm text-muted-foreground whitespace-nowrap">{a.doctor}</td>
                  <td className="px-5 py-3 text-sm text-muted-foreground whitespace-nowrap">{a.dept}</td>
                  <td className="px-5 py-3 text-xs text-muted-foreground">{a.time}</td>
                  <td className="px-5 py-3"><AppointmentBadge status={a.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recent Patients Table */}
      <div className="stat-card overflow-hidden p-0">
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <div>
            <p className="text-sm font-semibold text-foreground">Recent Patient Activity</p>
            <p className="text-xs text-muted-foreground">Today's latest admissions and visits</p>
          </div>
          <button onClick={() => navigate("/patients")} className="text-xs font-medium text-primary hover:underline">View all →</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                {["Patient ID", "Name", "Age", "Department", "Status", "Doctor", "Time"].map((h) => (
                  <th key={h} className="text-left text-xs font-semibold text-muted-foreground px-5 py-3 whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {RECENT_PATIENTS.map((p) => (
                <tr key={p.id} className="hover:bg-muted/20 transition-colors cursor-pointer">
                  <td className="px-5 py-3 text-xs font-mono font-medium text-primary">{p.id}</td>
                  <td className="px-5 py-3 text-sm font-medium text-foreground whitespace-nowrap">{p.name}</td>
                  <td className="px-5 py-3 text-sm text-muted-foreground">{p.age}</td>
                  <td className="px-5 py-3 text-sm text-muted-foreground whitespace-nowrap">{p.dept}</td>
                  <td className="px-5 py-3"><StatusBadge status={p.status} /></td>
                  <td className="px-5 py-3 text-sm text-muted-foreground whitespace-nowrap">{p.doctor}</td>
                  <td className="px-5 py-3 text-xs text-muted-foreground">{p.time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
