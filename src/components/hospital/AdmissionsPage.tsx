import { useState, useMemo } from "react";
import {
  Heart, Search, Plus, Filter, MoreHorizontal, ChevronLeft, ChevronRight,
  Calendar, Clock, User, Bed, AlertCircle, CheckCircle2,
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
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription,
} from "@/components/ui/dialog";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input as BaseInput } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

type Admission = {
  id: string;
  patientId: string;
  patientName: string;
  department: string;
  ward: string;
  bed: string;
  admissionDate: string;
  admissionTime: string;
  diagnosis: string;
  doctor: string;
  status: "Active" | "Discharged" | "Transferred" | "Left AMA";
  emergencyContact: string;
  phone: string;
};

const ADMISSIONS: Admission[] = [
  { id: "ADM-001", patientId: "P-10001", patientName: "Aisha Mohammed", department: "Cardiology", ward: "Ward A", bed: "A-12", admissionDate: "2026-02-15", admissionTime: "10:30 AM", diagnosis: "Acute coronary syndrome", doctor: "Dr. Adebayo", status: "Active", emergencyContact: "Ahmed Mohammed", phone: "+234 801 234 5678" },
  { id: "ADM-002", patientId: "P-10002", patientName: "John Okafor", department: "Orthopedics", ward: "Ward B", bed: "B-04", admissionDate: "2026-02-12", admissionTime: "02:15 PM", diagnosis: "Femur fracture", doctor: "Dr. Nnamdi", status: "Active", emergencyContact: "Mary Okafor", phone: "+234 802 345 6789" },
  { id: "ADM-003", patientId: "P-10004", patientName: "Emeka Nwosu", department: "ICU", ward: "ICU", bed: "ICU-02", admissionDate: "2026-02-18", admissionTime: "11:45 AM", diagnosis: "Post-stroke monitoring", doctor: "Dr. Ibrahim", status: "Active", emergencyContact: "Chioma Nwosu", phone: "+234 804 567 8901" },
  { id: "ADM-004", patientId: "P-10005", patientName: "Grace Adeyemi", department: "General Medicine", ward: "Ward C", bed: "C-08", admissionDate: "2026-02-08", admissionTime: "09:00 AM", diagnosis: "Pneumonia", doctor: "Dr. Olatunji", status: "Discharged", emergencyContact: "David Adeyemi", phone: "+234 805 678 9012" },
  { id: "ADM-005", patientId: "P-10007", patientName: "Ngozi Eze", department: "Obstetrics", ward: "Maternity", bed: "M-06", admissionDate: "2026-02-20", admissionTime: "03:30 PM", diagnosis: "Antenatal care", doctor: "Dr. Adeleke", status: "Active", emergencyContact: "Ikechukwu Eze", phone: "+234 807 890 1234" },
];

function StatusBadge({ status }: { status: Admission["status"] }) {
  const map: Record<Admission["status"], string> = {
    Active: "badge-info",
    Discharged: "badge-success",
    Transferred: "badge-warning",
    "Left AMA": "badge-danger",
  };
  return <span className={map[status]}>{status}</span>;
}

interface StatCardProps {
  label: string;
  value: number;
  icon: React.ElementType;
  iconClass: string;
}

function StatCard({ label, value, icon: Icon, iconClass }: StatCardProps) {
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

export function AdmissionsPage() {
  const [search, setSearch] = useState("");
  const [deptFilter, setDeptFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [editData, setEditData] = useState<Partial<Admission>>({});

  const departments = useMemo(
    () => Array.from(new Set(ADMISSIONS.map((a) => a.department))).sort(),
    []
  );

  const filtered = useMemo(() => {
    return ADMISSIONS.filter((a) => {
      const matchSearch =
        a.patientName.toLowerCase().includes(search.toLowerCase()) ||
        a.patientId.toLowerCase().includes(search.toLowerCase()) ||
        a.bed.toLowerCase().includes(search.toLowerCase());
      const matchDept = deptFilter === "all" || a.department === deptFilter;
      const matchStatus = statusFilter === "all" || a.status === statusFilter;
      return matchSearch && matchDept && matchStatus;
    });
  }, [search, deptFilter, statusFilter]);

  const PAGE_SIZE = 8;
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const stats = {
    total: ADMISSIONS.filter((a) => a.status === "Active").length,
    icu: ADMISSIONS.filter((a) => a.ward === "ICU").length,
    maternity: ADMISSIONS.filter((a) => a.department === "Obstetrics").length,
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Admissions & Discharge</h1>
          <p className="text-sm text-muted-foreground">Manage patient admissions and discharges</p>
        </div>
        <Button className="gap-2 self-start" onClick={() => setModalOpen(true)}>
          <Plus className="h-4 w-4" /> New Admission
        </Button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        <StatCard label="Active Admissions" value={stats.total} icon={Heart} iconClass="bg-primary" />
        <StatCard label="ICU Patients" value={stats.icu} icon={AlertCircle} iconClass="bg-destructive" />
        <StatCard label="Maternity" value={stats.maternity} icon={User} iconClass="bg-secondary" />
      </div>

      <div className="rounded-xl border border-border bg-card p-4" style={{ boxShadow: "var(--shadow-sm)" }}>
        <div className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by patient name, ID, or bed..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              className="pl-9"
            />
          </div>
          <Select value={deptFilter} onValueChange={(v) => { setDeptFilter(v); setPage(1); }}>
            <SelectTrigger className="w-full md:w-[180px]">
              <SelectValue placeholder="Department" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Departments</SelectItem>
              {departments.map((d) => (
                <SelectItem key={d} value={d}>{d}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={(v) => { setStatusFilter(v); setPage(1); }}>
            <SelectTrigger className="w-full md:w-[150px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="Active">Active</SelectItem>
              <SelectItem value="Discharged">Discharged</SelectItem>
              <SelectItem value="Transferred">Transferred</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="rounded-xl border border-border bg-card overflow-hidden" style={{ boxShadow: "var(--shadow-sm)" }}>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Patient</TableHead>
              <TableHead>Ward / Bed</TableHead>
              <TableHead>Admission Date</TableHead>
              <TableHead>Diagnosis</TableHead>
              <TableHead>Doctor</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-12"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginated.map((admission) => (
              <TableRow key={admission.id}>
                <TableCell>
                  <div>
                    <p className="font-medium text-foreground">{admission.patientName}</p>
                    <p className="text-xs text-muted-foreground">{admission.patientId}</p>
                  </div>
                </TableCell>
                <TableCell>
                  <div>
                    <p className="font-medium">{admission.ward}</p>
                    <p className="text-xs text-muted-foreground">Bed {admission.bed}</p>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="text-sm">
                    <p>{admission.admissionDate}</p>
                    <p className="text-xs text-muted-foreground">{admission.admissionTime}</p>
                  </div>
                </TableCell>
                <TableCell className="text-sm">{admission.diagnosis}</TableCell>
                <TableCell className="text-sm">{admission.doctor}</TableCell>
                <TableCell>
                  <StatusBadge status={admission.status} />
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>View Details</DropdownMenuItem>
                      <DropdownMenuItem>Discharge Patient</DropdownMenuItem>
                      <DropdownMenuItem>Transfer Ward</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Showing {paginated.length > 0 ? (page - 1) * PAGE_SIZE + 1 : 0} to {Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length}
        </p>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => setPage(Math.max(1, page - 1))} disabled={page === 1}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={() => setPage(Math.min(totalPages, page + 1))} disabled={page === totalPages}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>New Admission</DialogTitle>
            <DialogDescription>Register a new patient admission</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Patient ID</Label>
              <BaseInput placeholder="P-10001" />
            </div>
            <div>
              <Label>Department</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select department" />
                </SelectTrigger>
                <SelectContent>
                  {departments.map((d) => (
                    <SelectItem key={d} value={d}>{d}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Ward</Label>
              <BaseInput placeholder="Ward A" />
            </div>
            <div>
              <Label>Bed Number</Label>
              <BaseInput placeholder="A-12" />
            </div>
            <div>
              <Label>Diagnosis</Label>
              <Textarea placeholder="Primary diagnosis..." />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button onClick={() => setModalOpen(false)}>Save Admission</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
