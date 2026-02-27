import { useState } from "react";
import { useLocation, Link } from "react-router-dom";
import {
  LayoutDashboard, Users, Calendar, BedDouble, FileText,
  Building2, Pill, Package, ClipboardList, ShoppingCart,
  FlaskConical, Microscope, ImageIcon, BarChart3,
  CreditCard, Banknote, Shield, TrendingUp,
  Stethoscope, HeartPulse, UserCog, KeyRound,
  Clock, Activity, Video, MessageSquare, Home,
  Heart, Store, ShoppingBag, Receipt, PieChart,
  Lock, Eye, History, ChevronDown, ChevronRight,
  Hospital, Syringe, AlertCircle, X, Menu,
} from "lucide-react";
import { cn } from "@/lib/utils";

/* ── Types ── */
interface NavItem {
  label: string;
  path: string;
  icon: React.ElementType;
}
interface NavSection {
  id: string;
  label: string;
  icon: React.ElementType;
  color: string;
  items: NavItem[];
}

/* ── Navigation tree ── */
const NAV_SECTIONS: NavSection[] = [
  {
    id: "hospital",
    label: "Hospital Management",
    icon: Hospital,
    color: "text-blue-400",
    items: [
      { label: "Dashboard",            path: "/admin/dashboard",             icon: LayoutDashboard },
      { label: "Patients",             path: "/patients",     icon: Users },
      { label: "Appointments",         path: "/appointments", icon: Calendar },
      { label: "Admissions & Discharge", path: "/hospital/admissions",        icon: BedDouble },
      { label: "EHR / EMR",            path: "/hospital/ehr",          icon: FileText },
      { label: "Wards & Clinics",      path: "/hospital/wards",        icon: Building2 },
    ],
  },
  {
    id: "pharmacy",
    label: "Pharmacy Management",
    icon: Pill,
    color: "text-teal-400",
    items: [
      { label: "Inventory",        path: "/pharmacy/inventory",    icon: Package },
      { label: "Prescriptions",    path: "/pharmacy/prescriptions", icon: ClipboardList },
      { label: "Dispensing",       path: "/pharmacy/dispensing",   icon: Syringe },
      { label: "Pharmacy Sales",   path: "/pharmacy/sales",        icon: ShoppingCart },
    ],
  },
  {
    id: "lab",
    label: "Laboratory & Radiology",
    icon: FlaskConical,
    color: "text-purple-400",
    items: [
      { label: "Lab Tests",    path: "/laboratory/tests",  icon: ClipboardList },
      { label: "Sample Collection", path: "/laboratory/tests",  icon: Microscope },
      { label: "Lab Results",      path: "/laboratory/tests",   icon: BarChart3 },
      { label: "Imaging & Reports", path: "/laboratory/radiology",  icon: ImageIcon },
    ],
  },
  {
    id: "finance",
    label: "Finance, Billing & Claims",
    icon: CreditCard,
    color: "text-amber-400",
    items: [
      { label: "Billing",          path: "/finance/billing",   icon: Receipt },
      { label: "Payments",         path: "/finance/payments",  icon: Banknote },
      { label: "Insurance Claims", path: "/finance/billing", icon: Shield },
      { label: "Financial Reports", path: "/finance/reports",  icon: TrendingUp },
    ],
  },
  {
    id: "nursing",
    label: "Nursing & Consultation",
    icon: Stethoscope,
    color: "text-rose-400",
    items: [
      { label: "Nurse Assignments",  path: "/nursing/assignments", icon: UserCog },
      { label: "Consultation Queue", path: "/nursing/queue",       icon: Clock },
      { label: "Doctor Orders (CPOE)", path: "/nursing/orders",    icon: FileText },
      { label: "Vitals Monitoring",  path: "/nursing/vitals",      icon: HeartPulse },
    ],
  },
  {
    id: "hr",
    label: "Administration & HR",
    icon: UserCog,
    color: "text-indigo-400",
    items: [
      { label: "Staff Management",   path: "/admin/staff",       icon: Users },
      { label: "Roles & Permissions", path: "/admin/roles",      icon: KeyRound },
      { label: "Scheduling",         path: "/admin/scheduling",  icon: Calendar },
      { label: "Activity Logs",      path: "/admin/logs",        icon: Activity },
    ],
  },
  {
    id: "telemedicine",
    label: "Telemedicine & Home Care",
    icon: Video,
    color: "text-cyan-400",
    items: [
      { label: "Virtual Consultations", path: "/telemedicine/consultations", icon: Video },
      { label: "Home Visits",  path: "/telemedicine/home-visits",      icon: Home },
    ],
  },
  {
    id: "ecommerce",
    label: "E-Commerce Management",
    icon: Store,
    color: "text-orange-400",
    items: [
      { label: "Online Bookings",    path: "/ecommerce/bookings",      icon: Calendar },
      { label: "Service Listings",   path: "/ecommerce/services",      icon: Store },
    ],
  },
  {
    id: "analytics",
    label: "Analytics, AI & Reporting",
    icon: PieChart,
    color: "text-emerald-400",
    items: [
      { label: "Dashboard",         path: "/analytics/dashboard",  icon: LayoutDashboard },
      { label: "Clinical Reports",   path: "/analytics/clinical-reports",  icon: FileText },
    ],
  },
  {
    id: "security",
    label: "Security & Access Control",
    icon: Lock,
    color: "text-red-400",
    items: [
      { label: "Access Control",   path: "/security", icon: KeyRound },
    ],
  },
];

/* ── Sub-item ── */
function NavSubItem({ item, isActive }: { item: NavItem; isActive: boolean }) {
  return (
    <Link
      to={item.path}
      className={cn(
        "flex items-center gap-2.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-150",
        isActive
          ? "bg-primary/20 text-sidebar-primary"
          : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
      )}
    >
      <item.icon className="h-3.5 w-3.5 shrink-0" />
      <span className="truncate">{item.label}</span>
    </Link>
  );
}

/* ── Section ── */
function NavSection({
  section,
  defaultOpen,
}: {
  section: NavSection;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen ?? false);
  const location = useLocation();
  const hasActive = section.items.some((i) => i.path === location.pathname);

  return (
    <div className="mb-1">
      <button
        onClick={() => setOpen(!open)}
        className={cn(
          "w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all duration-150",
          hasActive
            ? "text-sidebar-primary"
            : "text-sidebar-muted-foreground hover:text-sidebar-foreground"
        )}
      >
        <section.icon className={cn("h-4 w-4 shrink-0", hasActive ? "text-sidebar-primary" : section.color)} />
        <span className="flex-1 text-left truncate">{section.label}</span>
        <ChevronDown
          className={cn("h-3.5 w-3.5 shrink-0 transition-transform duration-200", open ? "rotate-0" : "-rotate-90")}
        />
      </button>

      {open && (
        <div className="ml-3 mt-0.5 pl-3 border-l border-sidebar-border space-y-0.5 animate-fade-in">
          {section.items.map((item) => (
            <NavSubItem
              key={item.path}
              item={item}
              isActive={location.pathname === item.path}
            />
          ))}
        </div>
      )}
    </div>
  );
}

/* ── Main Sidebar ── */
interface AppSidebarProps {
  collapsed: boolean;
  onClose?: () => void;
}

export function AppSidebar({ collapsed, onClose }: AppSidebarProps) {
  return (
    <aside
      className={cn(
        "sidebar-bg flex flex-col h-full border-r border-sidebar-border transition-all duration-300 ease-in-out",
        collapsed ? "w-0 overflow-hidden" : "w-64"
      )}
    >
      {/* Logo / Brand */}
      <div className="flex items-center justify-between h-16 px-4 border-b border-sidebar-border shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="h-8 w-8 rounded-lg gradient-primary flex items-center justify-center shadow-primary shrink-0">
            <AlertCircle className="h-4.5 w-4.5 text-white" strokeWidth={2.5} />
          </div>
          <div className="leading-tight">
            <p className="text-xs font-bold text-sidebar-primary-foreground tracking-tight">BesaPlus</p>
            <p className="text-[10px] text-sidebar-muted-foreground">Universal Solution</p>
          </div>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="lg:hidden p-1 rounded-md text-sidebar-muted-foreground hover:text-sidebar-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Scrollable nav */}
      <nav className="flex-1 overflow-y-auto px-2 py-3 space-y-0.5">
        {NAV_SECTIONS.map((section) => (
          <NavSection
            key={section.id}
            section={section}
            defaultOpen={true}
          />
        ))}
      </nav>

      {/* Footer */}
      <div className="shrink-0 px-3 py-3 border-t border-sidebar-border">
        <div className="flex items-center gap-2.5 px-2 py-1.5 rounded-lg">
          <div className="h-7 w-7 rounded-full bg-primary/30 flex items-center justify-center shrink-0">
            <UserCog className="h-3.5 w-3.5 text-sidebar-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-sidebar-foreground truncate">Super Admin</p>
            <p className="text-[10px] text-sidebar-muted-foreground truncate">admin@besaplus.health</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
