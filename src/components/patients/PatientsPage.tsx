import { useState, useMemo } from "react";
import {
  Search, Filter, Plus, ChevronLeft, ChevronRight,
  Phone, Mail, MapPin, Calendar, MoreHorizontal,
  Users, UserCheck, UserX, Clock,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

/* ── Mock data ── */
type Patient = {
  id: string;
  name: string;
  age: number;
  gender: "Male" | "Female" | "Other";
  phone: string;
  email: string;
  address: string;
  status: "Active" | "Admitted" | "Discharged" | "Critical" | "Inactive";
  lastVisit: string;
  registeredDate: string;
  bloodGroup: string;
  department: string;
};

const PATIENTS: Patient[] = [
  { id: "P-10001", name: "Aisha Mohammed", age: 34, gender: "Female", phone: "+234 801 234 5678", email: "aisha.m@email.com", address: "12 Marina Rd, Lagos", status: "Active", lastVisit: "2026-02-18", registeredDate: "2024-06-12", bloodGroup: "O+", department: "Cardiology" },
  { id: "P-10002", name: "John Okafor", age: 52, gender: "Male", phone: "+234 802 345 6789", email: "john.ok@email.com", address: "45 Allen Ave, Ikeja", status: "Admitted", lastVisit: "2026-02-20", registeredDate: "2023-11-03", bloodGroup: "A+", department: "Orthopedics" },
  { id: "P-10003", name: "Fatima Bello", age: 28, gender: "Female", phone: "+234 803 456 7890", email: "fatima.b@email.com", address: "8 Aminu Kano, Abuja", status: "Active", lastVisit: "2026-02-15", registeredDate: "2025-01-20", bloodGroup: "B+", department: "Dermatology" },
  { id: "P-10004", name: "Emeka Nwosu", age: 67, gender: "Male", phone: "+234 804 567 8901", email: "emeka.n@email.com", address: "22 Trans Amadi, PH", status: "Critical", lastVisit: "2026-02-21", registeredDate: "2022-09-15", bloodGroup: "AB-", department: "ICU" },
  { id: "P-10005", name: "Grace Adeyemi", age: 41, gender: "Female", phone: "+234 805 678 9012", email: "grace.a@email.com", address: "10 Ring Rd, Ibadan", status: "Discharged", lastVisit: "2026-02-10", registeredDate: "2025-08-07", bloodGroup: "O-", department: "General Medicine" },
  { id: "P-10006", name: "Ibrahim Musa", age: 45, gender: "Male", phone: "+234 806 789 0123", email: "ibrahim.m@email.com", address: "33 Borno Way, Maiduguri", status: "Active", lastVisit: "2026-02-19", registeredDate: "2024-03-28", bloodGroup: "A-", department: "ENT" },
  { id: "P-10007", name: "Ngozi Eze", age: 31, gender: "Female", phone: "+234 807 890 1234", email: "ngozi.e@email.com", address: "5 New Haven, Enugu", status: "Admitted", lastVisit: "2026-02-20", registeredDate: "2025-12-01", bloodGroup: "B-", department: "Obstetrics" },
  { id: "P-10008", name: "Tunde Bakare", age: 58, gender: "Male", phone: "+234 808 901 2345", email: "tunde.b@email.com", address: "18 Dugbe Rd, Ibadan", status: "Inactive", lastVisit: "2025-11-30", registeredDate: "2021-07-14", bloodGroup: "O+", department: "Neurology" },
  { id: "P-10009", name: "Amina Yusuf", age: 23, gender: "Female", phone: "+234 809 012 3456", email: "amina.y@email.com", address: "7 Zoo Rd, Kano", status: "Active", lastVisit: "2026-02-17", registeredDate: "2025-10-10", bloodGroup: "A+", department: "Pediatrics" },
  { id: "P-10010", name: "Chidi Anyanwu", age: 39, gender: "Male", phone: "+234 810 123 4567", email: "chidi.a@email.com", address: "14 Aba Rd, Port Harcourt", status: "Active", lastVisit: "2026-02-16", registeredDate: "2024-05-22", bloodGroup: "AB+", department: "Urology" },
  { id: "P-10011", name: "Halima Abdullahi", age: 50, gender: "Female", phone: "+234 811 234 5678", email: "halima.a@email.com", address: "9 Sultan Rd, Sokoto", status: "Admitted", lastVisit: "2026-02-21", registeredDate: "2023-02-18", bloodGroup: "B+", department: "Oncology" },
  { id: "P-10012", name: "Olumide Ajayi", age: 36, gender: "Male", phone: "+234 812 345 6789", email: "olumide.a@email.com", address: "27 Lekki Phase 1, Lagos", status: "Active", lastVisit: "2026-02-14", registeredDate: "2025-04-09", bloodGroup: "O+", department: "Cardiology" },
];

const PAGE_SIZE = 8;

/* ── Status badge ── */
function StatusBadge({ status }: { status: Patient["status"] }) {
  const map: Record<Patient["status"], string> = {
    Active: "badge-success",
    Admitted: "badge-info",
    Discharged: "badge-neutral",
    Critical: "badge-danger",
    Inactive: "badge-warning",
  };
  return <span className={map[status]}>{status}</span>;
}

/* ── Stat card ── */
function StatCard({
  label, value, icon: Icon, iconClass,
}: { label: string; value: number; icon: React.ElementType; iconClass: string }) {
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

/* ── Main page ── */
export function PatientsPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [departmentFilter, setDepartmentFilter] = useState<string>("all");
  const [page, setPage] = useState(1);

  const departments = useMemo(
    () => Array.from(new Set(PATIENTS.map((p) => p.department))).sort(),
    [],
  );

  const filtered = useMemo(() => {
    return PATIENTS.filter((p) => {
      const matchesSearch =
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.id.toLowerCase().includes(search.toLowerCase()) ||
        p.email.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = statusFilter === "all" || p.status === statusFilter;
      const matchesDept = departmentFilter === "all" || p.department === departmentFilter;
      return matchesSearch && matchesStatus && matchesDept;
    });
  }, [search, statusFilter, departmentFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const paginated = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const counts = {
    total: PATIENTS.length,
    active: PATIENTS.filter((p) => p.status === "Active").length,
    admitted: PATIENTS.filter((p) => p.status === "Admitted").length,
    critical: PATIENTS.filter((p) => p.status === "Critical").length,
  };

  return (
    <div className="space-y-6">
      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Patients</h1>
          <p className="text-sm text-muted-foreground">Manage patient records and profiles</p>
        </div>
        <Button className="gap-2 self-start">
          <Plus className="h-4 w-4" /> Register Patient
        </Button>
      </div>

      {/* ── KPI cards ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Patients" value={counts.total} icon={Users} iconClass="bg-primary" />
        <StatCard label="Active" value={counts.active} icon={UserCheck} iconClass="bg-[hsl(var(--success))]" />
        <StatCard label="Admitted" value={counts.admitted} icon={Clock} iconClass="bg-[hsl(var(--secondary))]" />
        <StatCard label="Critical" value={counts.critical} icon={UserX} iconClass="bg-[hsl(var(--destructive))]" />
      </div>

      {/* ── Search & Filters ── */}
      <div className="rounded-xl border border-border bg-card p-4" style={{ boxShadow: "var(--shadow-sm)" }}>
        <div className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by name, ID, or email…"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              className="pl-9"
            />
          </div>
          <Select value={statusFilter} onValueChange={(v) => { setStatusFilter(v); setPage(1); }}>
            <SelectTrigger className="w-full md:w-[160px]">
              <Filter className="h-3.5 w-3.5 mr-1.5 text-muted-foreground" />
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="Active">Active</SelectItem>
              <SelectItem value="Admitted">Admitted</SelectItem>
              <SelectItem value="Discharged">Discharged</SelectItem>
              <SelectItem value="Critical">Critical</SelectItem>
              <SelectItem value="Inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
          <Select value={departmentFilter} onValueChange={(v) => { setDepartmentFilter(v); setPage(1); }}>
            <SelectTrigger className="w-full md:w-[180px]">
              <Filter className="h-3.5 w-3.5 mr-1.5 text-muted-foreground" />
              <SelectValue placeholder="Department" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Departments</SelectItem>
              {departments.map((d) => (
                <SelectItem key={d} value={d}>{d}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* ── Data table ── */}
      <div className="rounded-xl border border-border bg-card overflow-hidden" style={{ boxShadow: "var(--shadow-sm)" }}>
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/40">
              <TableHead>Patient</TableHead>
              <TableHead className="hidden md:table-cell">Contact</TableHead>
              <TableHead className="hidden lg:table-cell">Department</TableHead>
              <TableHead className="hidden sm:table-cell">Blood</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="hidden lg:table-cell">Last Visit</TableHead>
              <TableHead className="w-10" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginated.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-12 text-muted-foreground">
                  No patients found matching your criteria.
                </TableCell>
              </TableRow>
            ) : (
              paginated.map((p) => (
                <TableRow key={p.id} className="group">
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                        <span className="text-xs font-bold text-primary">
                          {p.name.split(" ").map((n) => n[0]).join("")}
                        </span>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-foreground">{p.name}</p>
                        <p className="text-xs text-muted-foreground">{p.id} · {p.gender}, {p.age}y</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    <div className="space-y-0.5 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1.5"><Phone className="h-3 w-3" />{p.phone}</div>
                      <div className="flex items-center gap-1.5"><Mail className="h-3 w-3" />{p.email}</div>
                    </div>
                  </TableCell>
                  <TableCell className="hidden lg:table-cell">
                    <Badge variant="outline" className="text-xs font-medium">{p.department}</Badge>
                  </TableCell>
                  <TableCell className="hidden sm:table-cell">
                    <span className="badge-info text-[11px]">{p.bloodGroup}</span>
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={p.status} />
                  </TableCell>
                  <TableCell className="hidden lg:table-cell text-xs text-muted-foreground">
                    <div className="flex items-center gap-1.5"><Calendar className="h-3 w-3" />{p.lastVisit}</div>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>View Profile</DropdownMenuItem>
                        <DropdownMenuItem>Edit Details</DropdownMenuItem>
                        <DropdownMenuItem>View EHR</DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive">Deactivate</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>

        {/* ── Pagination ── */}
        <div className="flex items-center justify-between px-4 py-3 border-t border-border">
          <p className="text-xs text-muted-foreground">
            Showing {(currentPage - 1) * PAGE_SIZE + 1}–{Math.min(currentPage * PAGE_SIZE, filtered.length)} of {filtered.length}
          </p>
          <div className="flex items-center gap-1">
            <Button
              variant="outline" size="sm"
              disabled={currentPage <= 1}
              onClick={() => setPage((p) => p - 1)}
              className="h-8 gap-1"
            >
              <ChevronLeft className="h-3.5 w-3.5" /> Prev
            </Button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
              <Button
                key={n}
                variant={n === currentPage ? "default" : "outline"}
                size="sm"
                onClick={() => setPage(n)}
                className="h-8 w-8 p-0"
              >
                {n}
              </Button>
            ))}
            <Button
              variant="outline" size="sm"
              disabled={currentPage >= totalPages}
              onClick={() => setPage((p) => p + 1)}
              className="h-8 gap-1"
            >
              Next <ChevronRight className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
