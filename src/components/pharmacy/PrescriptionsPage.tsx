import { useState, useMemo } from "react";
import {
  ClipboardList, Search, Plus, User, Pill, MoreHorizontal,
  CheckCircle, Clock, XCircle, Trash2, Eye,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription,
} from "@/components/ui/dialog";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

/* ── Types ── */
type PrescriptionItem = {
  drug: string;
  dosage: string;
  frequency: string;
  duration: string;
};

type Prescription = {
  id: string;
  patientName: string;
  patientId: string;
  doctorName: string;
  date: string;
  status: "Active" | "Completed" | "Cancelled" | "Pending";
  items: PrescriptionItem[];
  notes: string;
};

/* ── Mock data ── */
const PRESCRIPTIONS: Prescription[] = [
  { id: "RX-001", patientName: "Amina Yusuf", patientId: "PAT-001", doctorName: "Dr. Hassan Ali", date: "2026-02-22", status: "Active", items: [{ drug: "Amoxicillin 500mg", dosage: "1 capsule", frequency: "3x daily", duration: "7 days" }, { drug: "Ibuprofen 400mg", dosage: "1 tablet", frequency: "As needed", duration: "5 days" }], notes: "Take after meals" },
  { id: "RX-002", patientName: "James Ochieng", patientId: "PAT-002", doctorName: "Dr. Fatima Noor", date: "2026-02-21", status: "Completed", items: [{ drug: "Metformin 850mg", dosage: "1 tablet", frequency: "2x daily", duration: "30 days" }], notes: "Monitor blood glucose weekly" },
  { id: "RX-003", patientName: "Grace Wanjiku", patientId: "PAT-003", doctorName: "Dr. Hassan Ali", date: "2026-02-20", status: "Active", items: [{ drug: "Lisinopril 10mg", dosage: "1 tablet", frequency: "Once daily", duration: "30 days" }, { drug: "Atorvastatin 20mg", dosage: "1 tablet", frequency: "Once daily", duration: "30 days" }], notes: "Evening dose preferred for statin" },
  { id: "RX-004", patientName: "Mohamed Abdi", patientId: "PAT-004", doctorName: "Dr. Sarah Kimani", date: "2026-02-19", status: "Cancelled", items: [{ drug: "Ciprofloxacin 250mg", dosage: "1 tablet", frequency: "2x daily", duration: "5 days" }], notes: "Patient allergic — switched to alternative" },
  { id: "RX-005", patientName: "Lucy Muthoni", patientId: "PAT-005", doctorName: "Dr. Fatima Noor", date: "2026-02-23", status: "Pending", items: [{ drug: "Salbutamol Inhaler", dosage: "2 puffs", frequency: "As needed", duration: "Ongoing" }, { drug: "Paracetamol 500mg", dosage: "2 tablets", frequency: "3x daily", duration: "3 days" }], notes: "Asthma flare-up management" },
  { id: "RX-006", patientName: "Peter Kamau", patientId: "PAT-006", doctorName: "Dr. Hassan Ali", date: "2026-02-18", status: "Active", items: [{ drug: "Omeprazole 20mg", dosage: "1 capsule", frequency: "Once daily", duration: "14 days" }], notes: "Take 30 min before breakfast" },
  { id: "RX-007", patientName: "Halima Omar", patientId: "PAT-007", doctorName: "Dr. Sarah Kimani", date: "2026-02-17", status: "Completed", items: [{ drug: "Diazepam 5mg", dosage: "1 tablet", frequency: "At bedtime", duration: "7 days" }], notes: "Short course only — review at follow-up" },
];

const PATIENTS = [
  { id: "PAT-001", name: "Amina Yusuf" },
  { id: "PAT-002", name: "James Ochieng" },
  { id: "PAT-003", name: "Grace Wanjiku" },
  { id: "PAT-004", name: "Mohamed Abdi" },
  { id: "PAT-005", name: "Lucy Muthoni" },
  { id: "PAT-006", name: "Peter Kamau" },
  { id: "PAT-007", name: "Halima Omar" },
  { id: "PAT-008", name: "David Njoroge" },
];

const DOCTORS = ["Dr. Hassan Ali", "Dr. Fatima Noor", "Dr. Sarah Kimani"];
const STATUSES: Prescription["status"][] = ["Active", "Completed", "Cancelled", "Pending"];
const PAGE_SIZE = 6;

/* ── Helpers ── */
function statusBadgeClass(s: Prescription["status"]) {
  switch (s) {
    case "Active":    return "bg-emerald-500/15 text-emerald-400 border-emerald-500/30";
    case "Completed": return "bg-sky-500/15 text-sky-400 border-sky-500/30";
    case "Cancelled": return "bg-red-500/15 text-red-400 border-red-500/30";
    case "Pending":   return "bg-amber-500/15 text-amber-400 border-amber-500/30";
  }
}

function statusIcon(s: Prescription["status"]) {
  switch (s) {
    case "Active":    return <CheckCircle className="h-3 w-3" />;
    case "Completed": return <CheckCircle className="h-3 w-3" />;
    case "Cancelled": return <XCircle className="h-3 w-3" />;
    case "Pending":   return <Clock className="h-3 w-3" />;
  }
}

function StatCard({ label, value, icon: Icon, iconClass }: { label: string; value: number; icon: React.ElementType; iconClass: string }) {
  return (
    <Card className="bg-card border-border">
      <CardContent className="p-4 flex items-center gap-3">
        <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${iconClass}`}>
          <Icon className="h-5 w-5" />
        </div>
        <div>
          <p className="text-2xl font-bold text-foreground">{value}</p>
          <p className="text-xs text-muted-foreground">{label}</p>
        </div>
      </CardContent>
    </Card>
  );
}

/* ── Empty medication row for form ── */
const emptyItem = (): PrescriptionItem => ({ drug: "", dosage: "", frequency: "", duration: "" });

/* ── Create Prescription Modal ── */
function CreatePrescriptionModal({ open, onOpenChange }: { open: boolean; onOpenChange: (o: boolean) => void }) {
  const [patientId, setPatientId] = useState("");
  const [patientSearch, setPatientSearch] = useState("");
  const [doctor, setDoctor] = useState("");
  const [notes, setNotes] = useState("");
  const [items, setItems] = useState<PrescriptionItem[]>([emptyItem()]);

  const filteredPatients = useMemo(
    () => PATIENTS.filter((p) => p.name.toLowerCase().includes(patientSearch.toLowerCase()) || p.id.toLowerCase().includes(patientSearch.toLowerCase())),
    [patientSearch],
  );

  const selectedPatient = PATIENTS.find((p) => p.id === patientId);

  const updateItem = (idx: number, field: keyof PrescriptionItem, val: string) => {
    setItems((prev) => prev.map((it, i) => (i === idx ? { ...it, [field]: val } : it)));
  };
  const removeItem = (idx: number) => setItems((prev) => prev.filter((_, i) => i !== idx));
  const addItem = () => setItems((prev) => [...prev, emptyItem()]);

  const canSubmit = patientId && doctor && items.every((it) => it.drug && it.dosage && it.frequency && it.duration);

  const handleClose = (o: boolean) => {
    if (!o) {
      setPatientId(""); setPatientSearch(""); setDoctor(""); setNotes(""); setItems([emptyItem()]);
    }
    onOpenChange(o);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-2xl bg-card border-border max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-foreground">Create Prescription</DialogTitle>
          <DialogDescription className="text-muted-foreground">Search for a patient and add medications to the prescription.</DialogDescription>
        </DialogHeader>

        <div className="space-y-5 py-2">
          {/* Patient Lookup */}
          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">Patient</Label>
            {selectedPatient ? (
              <div className="flex items-center justify-between rounded-lg bg-muted/30 p-3">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center">
                    <User className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">{selectedPatient.name}</p>
                    <p className="text-xs text-muted-foreground">{selectedPatient.id}</p>
                  </div>
                </div>
                <Button variant="ghost" size="sm" onClick={() => { setPatientId(""); setPatientSearch(""); }}>Change</Button>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="Search patient by name or ID…" className="pl-9 bg-background border-border" value={patientSearch} onChange={(e) => setPatientSearch(e.target.value)} />
                </div>
                {patientSearch && (
                  <div className="rounded-lg border border-border bg-background max-h-36 overflow-y-auto">
                    {filteredPatients.length === 0 && <p className="text-xs text-muted-foreground p-3">No patients found.</p>}
                    {filteredPatients.map((p) => (
                      <button key={p.id} className="w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-muted/50 transition-colors" onClick={() => { setPatientId(p.id); setPatientSearch(""); }}>
                        <User className="h-3.5 w-3.5 text-muted-foreground" />
                        <span className="text-foreground">{p.name}</span>
                        <span className="text-xs text-muted-foreground ml-auto">{p.id}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Doctor */}
          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">Prescribing Doctor</Label>
            <Select value={doctor} onValueChange={setDoctor}>
              <SelectTrigger className="bg-background border-border"><SelectValue placeholder="Select doctor" /></SelectTrigger>
              <SelectContent>
                {DOCTORS.map((d) => <SelectItem key={d} value={d}>{d}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>

          {/* Medications */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">Medications</Label>
              <Button variant="outline" size="sm" onClick={addItem}><Plus className="h-3.5 w-3.5 mr-1" /> Add Drug</Button>
            </div>
            {items.map((it, idx) => (
              <div key={idx} className="rounded-lg border border-border p-3 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-muted-foreground">Drug #{idx + 1}</span>
                  {items.length > 1 && (
                    <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => removeItem(idx)}><Trash2 className="h-3.5 w-3.5 text-muted-foreground" /></Button>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <Input placeholder="Drug name" className="bg-background border-border" value={it.drug} onChange={(e) => updateItem(idx, "drug", e.target.value)} />
                  <Input placeholder="Dosage (e.g. 1 tablet)" className="bg-background border-border" value={it.dosage} onChange={(e) => updateItem(idx, "dosage", e.target.value)} />
                  <Input placeholder="Frequency (e.g. 2x daily)" className="bg-background border-border" value={it.frequency} onChange={(e) => updateItem(idx, "frequency", e.target.value)} />
                  <Input placeholder="Duration (e.g. 7 days)" className="bg-background border-border" value={it.duration} onChange={(e) => updateItem(idx, "duration", e.target.value)} />
                </div>
              </div>
            ))}
          </div>

          {/* Notes */}
          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">Notes</Label>
            <Textarea placeholder="Special instructions or notes…" className="bg-background border-border resize-none" rows={2} value={notes} onChange={(e) => setNotes(e.target.value)} />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => handleClose(false)}>Cancel</Button>
          <Button disabled={!canSubmit} onClick={() => handleClose(false)}>
            <ClipboardList className="h-4 w-4 mr-1" /> Create Prescription
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

/* ── View Prescription Modal ── */
function ViewPrescriptionModal({ rx, open, onOpenChange }: { rx: Prescription | null; open: boolean; onOpenChange: (o: boolean) => void }) {
  if (!rx) return null;
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg bg-card border-border">
        <DialogHeader>
          <DialogTitle className="text-foreground">Prescription {rx.id}</DialogTitle>
          <DialogDescription className="text-muted-foreground">Prescribed on {rx.date} by {rx.doctorName}</DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div className="flex items-center gap-3 rounded-lg bg-muted/30 p-3">
            <div className="h-9 w-9 rounded-full bg-primary/20 flex items-center justify-center">
              <User className="h-4 w-4 text-primary" />
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">{rx.patientName}</p>
              <p className="text-xs text-muted-foreground">{rx.patientId}</p>
            </div>
            <Badge className={`ml-auto ${statusBadgeClass(rx.status)}`}>{statusIcon(rx.status)} <span className="ml-1">{rx.status}</span></Badge>
          </div>

          <div className="space-y-2">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Medications</p>
            {rx.items.map((it, i) => (
              <div key={i} className="flex items-start gap-2 rounded-lg border border-border p-3">
                <Pill className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                <div className="space-y-0.5">
                  <p className="text-sm font-medium text-foreground">{it.drug}</p>
                  <p className="text-xs text-muted-foreground">{it.dosage} · {it.frequency} · {it.duration}</p>
                </div>
              </div>
            ))}
          </div>

          {rx.notes && (
            <div className="rounded-lg bg-muted/30 p-3">
              <p className="text-xs font-semibold text-muted-foreground mb-1">Notes</p>
              <p className="text-sm text-foreground">{rx.notes}</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

/* ── Main Page ── */
export function PrescriptionsPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [createOpen, setCreateOpen] = useState(false);
  const [viewRx, setViewRx] = useState<Prescription | null>(null);

  const filtered = useMemo(() => {
    const s = search.toLowerCase();
    return PRESCRIPTIONS.filter((rx) => {
      if (s && !rx.patientName.toLowerCase().includes(s) && !rx.id.toLowerCase().includes(s) && !rx.patientId.toLowerCase().includes(s) && !rx.doctorName.toLowerCase().includes(s)) return false;
      if (statusFilter !== "all" && rx.status !== statusFilter) return false;
      return true;
    });
  }, [search, statusFilter]);

  const paginated = useMemo(() => filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE), [filtered, page]);
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));

  const counts = useMemo(() => ({
    total: PRESCRIPTIONS.length,
    active: PRESCRIPTIONS.filter((r) => r.status === "Active").length,
    pending: PRESCRIPTIONS.filter((r) => r.status === "Pending").length,
    completed: PRESCRIPTIONS.filter((r) => r.status === "Completed").length,
  }), []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Prescriptions</h1>
          <p className="text-sm text-muted-foreground">Manage and create patient prescriptions</p>
        </div>
        <Button size="sm" onClick={() => setCreateOpen(true)}><Plus className="h-4 w-4 mr-1" /> New Prescription</Button>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total" value={counts.total} icon={ClipboardList} iconClass="bg-primary/20 text-primary" />
        <StatCard label="Active" value={counts.active} icon={CheckCircle} iconClass="bg-emerald-500/20 text-emerald-400" />
        <StatCard label="Pending" value={counts.pending} icon={Clock} iconClass="bg-amber-500/20 text-amber-400" />
        <StatCard label="Completed" value={counts.completed} icon={CheckCircle} iconClass="bg-sky-500/20 text-sky-400" />
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search by patient, prescription ID, or doctor…" className="pl-9 bg-background border-border" value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} />
        </div>
        <Select value={statusFilter} onValueChange={(v) => { setStatusFilter(v); setPage(1); }}>
          <SelectTrigger className="w-full sm:w-40 bg-background border-border"><SelectValue placeholder="Status" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            {STATUSES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <Card className="bg-card border-border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-border">
              <TableHead className="text-muted-foreground">Prescription</TableHead>
              <TableHead className="text-muted-foreground">Patient</TableHead>
              <TableHead className="text-muted-foreground">Doctor</TableHead>
              <TableHead className="text-muted-foreground">Drugs</TableHead>
              <TableHead className="text-muted-foreground">Date</TableHead>
              <TableHead className="text-muted-foreground">Status</TableHead>
              <TableHead className="text-muted-foreground w-10" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginated.map((rx) => (
              <TableRow key={rx.id} className="border-border">
                <TableCell className="text-sm font-mono font-medium text-foreground">{rx.id}</TableCell>
                <TableCell>
                  <div>
                    <p className="text-sm font-medium text-foreground">{rx.patientName}</p>
                    <p className="text-xs text-muted-foreground">{rx.patientId}</p>
                  </div>
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">{rx.doctorName}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-1 flex-wrap">
                    {rx.items.slice(0, 2).map((it, i) => (
                      <Badge key={i} variant="outline" className="text-xs border-border text-muted-foreground">{it.drug}</Badge>
                    ))}
                    {rx.items.length > 2 && <Badge variant="outline" className="text-xs border-border text-muted-foreground">+{rx.items.length - 2}</Badge>}
                  </div>
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">{rx.date}</TableCell>
                <TableCell>
                  <Badge className={statusBadgeClass(rx.status)}>
                    {statusIcon(rx.status)} <span className="ml-1">{rx.status}</span>
                  </Badge>
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8"><MoreHorizontal className="h-4 w-4" /></Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="bg-card border-border">
                      <DropdownMenuItem onClick={() => setViewRx(rx)}><Eye className="h-4 w-4 mr-2" /> View Details</DropdownMenuItem>
                      <DropdownMenuItem><Pill className="h-4 w-4 mr-2" /> Dispense</DropdownMenuItem>
                      <DropdownMenuItem className="text-red-400"><XCircle className="h-4 w-4 mr-2" /> Cancel</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
            {paginated.length === 0 && (
              <TableRow><TableCell colSpan={7} className="text-center py-10 text-muted-foreground">No prescriptions found.</TableCell></TableRow>
            )}
          </TableBody>
        </Table>
      </Card>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <p className="text-xs text-muted-foreground">Showing {paginated.length} of {filtered.length} prescriptions</p>
        <div className="flex gap-1">
          <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage(page - 1)}>Previous</Button>
          <Button variant="outline" size="sm" disabled={page >= totalPages} onClick={() => setPage(page + 1)}>Next</Button>
        </div>
      </div>

      {/* Modals */}
      <CreatePrescriptionModal open={createOpen} onOpenChange={setCreateOpen} />
      <ViewPrescriptionModal rx={viewRx} open={!!viewRx} onOpenChange={(o) => !o && setViewRx(null)} />
    </div>
  );
}
