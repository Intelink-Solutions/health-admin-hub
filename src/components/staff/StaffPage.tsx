import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Search, Plus, Users, UserCheck, UserX, Stethoscope, MoreHorizontal, Pencil, Trash2, Eye } from "lucide-react";

type StaffMember = {
  id: string;
  name: string;
  role: "Doctor" | "Nurse" | "Technician" | "Admin" | "Pharmacist" | "Receptionist";
  department: string;
  email: string;
  phone: string;
  status: "Active" | "On Leave" | "Inactive";
  joinDate: string;
  specialization: string;
};

const STAFF: StaffMember[] = [
  { id: "STF-001", name: "Dr. Adebayo Ogunlade", role: "Doctor", department: "Cardiology", email: "adebayo@hospital.ng", phone: "+234 801 234 5678", status: "Active", joinDate: "2021-03-15", specialization: "Cardiologist" },
  { id: "STF-002", name: "Nurse Amina Bello", role: "Nurse", department: "Emergency", email: "amina@hospital.ng", phone: "+234 802 345 6789", status: "Active", joinDate: "2020-07-01", specialization: "Emergency Care" },
  { id: "STF-003", name: "Dr. Chidi Eze", role: "Doctor", department: "Pediatrics", email: "chidi@hospital.ng", phone: "+234 803 456 7890", status: "On Leave", joinDate: "2019-11-20", specialization: "Pediatrician" },
  { id: "STF-004", name: "Fatima Yusuf", role: "Admin", department: "Administration", email: "fatima@hospital.ng", phone: "+234 804 567 8901", status: "Active", joinDate: "2022-01-10", specialization: "HR Management" },
  { id: "STF-005", name: "Emeka Nwosu", role: "Technician", department: "Laboratory", email: "emeka@hospital.ng", phone: "+234 805 678 9012", status: "Active", joinDate: "2021-06-25", specialization: "Lab Analyst" },
  { id: "STF-006", name: "Dr. Ngozi Okafor", role: "Doctor", department: "Obstetrics", email: "ngozi@hospital.ng", phone: "+234 806 789 0123", status: "Active", joinDate: "2018-09-12", specialization: "Obstetrician" },
  { id: "STF-007", name: "Ibrahim Musa", role: "Pharmacist", department: "Pharmacy", email: "ibrahim@hospital.ng", phone: "+234 807 890 1234", status: "Inactive", joinDate: "2020-02-18", specialization: "Clinical Pharmacy" },
  { id: "STF-008", name: "Grace Obi", role: "Receptionist", department: "Front Desk", email: "grace@hospital.ng", phone: "+234 808 901 2345", status: "Active", joinDate: "2023-04-05", specialization: "Patient Relations" },
  { id: "STF-009", name: "Dr. Tunde Bakare", role: "Doctor", department: "Surgery", email: "tunde@hospital.ng", phone: "+234 809 012 3456", status: "Active", joinDate: "2017-08-30", specialization: "General Surgeon" },
  { id: "STF-010", name: "Nurse Blessing Udo", role: "Nurse", department: "ICU", email: "blessing@hospital.ng", phone: "+234 810 123 4567", status: "On Leave", joinDate: "2021-12-01", specialization: "Critical Care" },
];

const DEPARTMENTS = [...new Set(STAFF.map(s => s.department))];
const ROLES: StaffMember["role"][] = ["Doctor", "Nurse", "Technician", "Admin", "Pharmacist", "Receptionist"];
const STATUSES: StaffMember["status"][] = ["Active", "On Leave", "Inactive"];
const PAGE_SIZE = 8;

const roleBadgeClass: Record<StaffMember["role"], string> = {
  Doctor: "bg-blue-100 text-blue-700 border-blue-200",
  Nurse: "bg-emerald-100 text-emerald-700 border-emerald-200",
  Technician: "bg-amber-100 text-amber-700 border-amber-200",
  Admin: "bg-purple-100 text-purple-700 border-purple-200",
  Pharmacist: "bg-cyan-100 text-cyan-700 border-cyan-200",
  Receptionist: "bg-pink-100 text-pink-700 border-pink-200",
};

const statusBadgeClass: Record<StaffMember["status"], string> = {
  Active: "bg-green-100 text-green-700 border-green-200",
  "On Leave": "bg-yellow-100 text-yellow-700 border-yellow-200",
  Inactive: "bg-red-100 text-red-700 border-red-200",
};

function StatCard({ label, value, icon: Icon, iconClass }: { label: string; value: number; icon: React.ElementType; iconClass: string }) {
  return (
    <div className="stat-card flex items-center gap-4 rounded-xl border bg-card p-5 shadow-sm">
      <div className={`flex h-12 w-12 items-center justify-center rounded-lg ${iconClass}`}>
        <Icon className="h-6 w-6" />
      </div>
      <div>
        <p className="text-sm text-muted-foreground">{label}</p>
        <p className="text-2xl font-bold text-foreground">{value}</p>
      </div>
    </div>
  );
}

const emptyStaff = { name: "", role: "Doctor" as StaffMember["role"], department: "", email: "", phone: "", status: "Active" as StaffMember["status"], specialization: "" };

export function StaffPage() {
  const [search, setSearch] = useState("");
  const [deptFilter, setDeptFilter] = useState("all");
  const [roleFilter, setRoleFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [editData, setEditData] = useState<typeof emptyStaff>(emptyStaff);
  const [editId, setEditId] = useState<string | null>(null);

  const filtered = STAFF.filter(s => {
    const q = search.toLowerCase();
    const matchSearch = !q || s.name.toLowerCase().includes(q) || s.id.toLowerCase().includes(q) || s.email.toLowerCase().includes(q);
    const matchDept = deptFilter === "all" || s.department === deptFilter;
    const matchRole = roleFilter === "all" || s.role === roleFilter;
    return matchSearch && matchDept && matchRole;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const counts = {
    total: STAFF.length,
    active: STAFF.filter(s => s.status === "Active").length,
    onLeave: STAFF.filter(s => s.status === "On Leave").length,
    doctors: STAFF.filter(s => s.role === "Doctor").length,
  };

  function openAdd() {
    setEditId(null);
    setEditData(emptyStaff);
    setModalOpen(true);
  }
  function openEdit(s: StaffMember) {
    setEditId(s.id);
    setEditData({ name: s.name, role: s.role, department: s.department, email: s.email, phone: s.phone, status: s.status, specialization: s.specialization });
    setModalOpen(true);
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Staff Management</h1>
          <p className="text-sm text-muted-foreground">Manage hospital staff directory, roles, and departments</p>
        </div>
        <Button onClick={openAdd} className="gap-2">
          <Plus className="h-4 w-4" /> Add Staff
        </Button>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total Staff" value={counts.total} icon={Users} iconClass="bg-blue-100 text-blue-600" />
        <StatCard label="Active" value={counts.active} icon={UserCheck} iconClass="bg-green-100 text-green-600" />
        <StatCard label="On Leave" value={counts.onLeave} icon={UserX} iconClass="bg-yellow-100 text-yellow-600" />
        <StatCard label="Doctors" value={counts.doctors} icon={Stethoscope} iconClass="bg-purple-100 text-purple-600" />
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search by name, ID, or email…" value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} className="pl-10" />
        </div>
        <Select value={deptFilter} onValueChange={v => { setDeptFilter(v); setPage(1); }}>
          <SelectTrigger className="w-full sm:w-[180px]"><SelectValue placeholder="Department" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Departments</SelectItem>
            {DEPARTMENTS.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={roleFilter} onValueChange={v => { setRoleFilter(v); setPage(1); }}>
          <SelectTrigger className="w-full sm:w-[160px]"><SelectValue placeholder="Role" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Roles</SelectItem>
            {ROLES.map(r => <SelectItem key={r} value={r}>{r}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <div className="rounded-xl border bg-card shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Staff</TableHead>
              <TableHead>Role</TableHead>
              <TableHead className="hidden md:table-cell">Department</TableHead>
              <TableHead className="hidden lg:table-cell">Contact</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="hidden xl:table-cell">Join Date</TableHead>
              <TableHead className="w-10" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginated.length === 0 ? (
              <TableRow><TableCell colSpan={7} className="text-center py-10 text-muted-foreground">No staff found.</TableCell></TableRow>
            ) : paginated.map(s => (
              <TableRow key={s.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                      {s.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{s.name}</p>
                      <p className="text-xs text-muted-foreground">{s.id} · {s.specialization}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell><Badge className={roleBadgeClass[s.role]} variant="outline">{s.role}</Badge></TableCell>
                <TableCell className="hidden md:table-cell text-muted-foreground">{s.department}</TableCell>
                <TableCell className="hidden lg:table-cell">
                  <p className="text-sm text-foreground">{s.email}</p>
                  <p className="text-xs text-muted-foreground">{s.phone}</p>
                </TableCell>
                <TableCell><Badge className={statusBadgeClass[s.status]} variant="outline">{s.status}</Badge></TableCell>
                <TableCell className="hidden xl:table-cell text-muted-foreground">{s.joinDate}</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild><Button variant="ghost" size="icon"><MoreHorizontal className="h-4 w-4" /></Button></DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem><Eye className="mr-2 h-4 w-4" />View Profile</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => openEdit(s)}><Pencil className="mr-2 h-4 w-4" />Edit Details</DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive"><Trash2 className="mr-2 h-4 w-4" />Deactivate</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {/* Pagination */}
        <div className="flex items-center justify-between border-t px-4 py-3">
          <p className="text-sm text-muted-foreground">
            {filtered.length === 0 ? "No results" : `${(page - 1) * PAGE_SIZE + 1}–${Math.min(page * PAGE_SIZE, filtered.length)} of ${filtered.length}`}
          </p>
          <div className="flex gap-1">
            <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage(p => p - 1)}>Prev</Button>
            {Array.from({ length: totalPages }, (_, i) => (
              <Button key={i} variant={page === i + 1 ? "default" : "outline"} size="sm" onClick={() => setPage(i + 1)}>{i + 1}</Button>
            ))}
            <Button variant="outline" size="sm" disabled={page >= totalPages} onClick={() => setPage(p => p + 1)}>Next</Button>
          </div>
        </div>
      </div>

      {/* Add/Edit Modal */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{editId ? "Edit Staff Member" : "Add New Staff"}</DialogTitle>
            <DialogDescription>{editId ? "Update the staff member's information below." : "Fill in the details to add a new staff member."}</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-2">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Full Name</Label>
                <Input value={editData.name} onChange={e => setEditData(d => ({ ...d, name: e.target.value }))} placeholder="Dr. Jane Doe" />
              </div>
              <div className="space-y-2">
                <Label>Role</Label>
                <Select value={editData.role} onValueChange={v => setEditData(d => ({ ...d, role: v as StaffMember["role"] }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>{ROLES.map(r => <SelectItem key={r} value={r}>{r}</SelectItem>)}</SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Department</Label>
                <Select value={editData.department} onValueChange={v => setEditData(d => ({ ...d, department: v }))}>
                  <SelectTrigger><SelectValue placeholder="Select department" /></SelectTrigger>
                  <SelectContent>{DEPARTMENTS.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Specialization</Label>
                <Input value={editData.specialization} onChange={e => setEditData(d => ({ ...d, specialization: e.target.value }))} placeholder="e.g. Cardiologist" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Email</Label>
                <Input type="email" value={editData.email} onChange={e => setEditData(d => ({ ...d, email: e.target.value }))} placeholder="staff@hospital.ng" />
              </div>
              <div className="space-y-2">
                <Label>Phone</Label>
                <Input value={editData.phone} onChange={e => setEditData(d => ({ ...d, phone: e.target.value }))} placeholder="+234 800 000 0000" />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Status</Label>
              <Select value={editData.status} onValueChange={v => setEditData(d => ({ ...d, status: v as StaffMember["status"] }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{STATUSES.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button onClick={() => setModalOpen(false)}>{editId ? "Save Changes" : "Add Staff"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
