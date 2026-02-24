import { useState } from "react";
import {
  Hand, Search, Plus, Filter, MoreHorizontal, CheckCircle2, Clock,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription,
} from "@/components/ui/dialog";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";
import { Input as BaseInput } from "@/components/ui/input";

type DispenseRecord = {
  id: string;
  prescriptionId: string;
  patientName: string;
  drugName: string;
  quantity: number;
  dispensedDate: string;
  dispensedBy: string;
  status: "Completed" | "Pending" | "Rejected";
  notes: string;
};

const DISPENSE_RECORDS: DispenseRecord[] = [
  { id: "DISP-001", prescriptionId: "RX-001", patientName: "Amina Yusuf", drugName: "Amoxicillin 500mg", quantity: 21, dispensedDate: "2026-02-22", dispensedBy: "Ibrahim", status: "Completed", notes: "Standard course" },
  { id: "DISP-002", prescriptionId: "RX-002", patientName: "James Ochieng", drugName: "Metformin 850mg", quantity: 60, dispensedDate: "2026-02-21", dispensedBy: "Fatima", status: "Completed", notes: "Monthly supply" },
  { id: "DISP-003", prescriptionId: "RX-003", patientName: "Grace Wanjiku", drugName: "Lisinopril 10mg", quantity: 30, dispensedDate: "2026-02-20", dispensedBy: "Ibrahim", status: "Completed", notes: "Refill" },
  { id: "DISP-004", prescriptionId: "RX-005", patientName: "Lucy Muthoni", drugName: "Salbutamol Inhaler", quantity: 1, dispensedDate: "2026-02-23", dispensedBy: "Fatima", status: "Pending", notes: "Waiting collection" },
];

function StatusBadge({ status }: { status: DispenseRecord["status"] }) {
  const map: Record<DispenseRecord["status"], string> = {
    Completed: "badge-success",
    Pending: "badge-warning",
    Rejected: "badge-danger",
  };
  return <span className={map[status]}>{status}</span>;
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="stat-card">
      <p className="text-xs font-medium text-muted-foreground uppercase">{label}</p>
      <p className="text-2xl font-bold text-foreground">{value}</p>
    </div>
  );
}

export function DispensingPage() {
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);

  const filtered = DISPENSE_RECORDS.filter(
    (r) =>
      r.patientName.toLowerCase().includes(search.toLowerCase()) ||
      r.prescriptionId.toLowerCase().includes(search.toLowerCase()) ||
      r.drugName.toLowerCase().includes(search.toLowerCase())
  );

  const stats = {
    today: DISPENSE_RECORDS.filter((r) => r.dispensedDate === "2026-02-23").length,
    pending: DISPENSE_RECORDS.filter((r) => r.status === "Pending").length,
    total: DISPENSE_RECORDS.length,
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Pharmacy Dispensing</h1>
          <p className="text-sm text-muted-foreground">Manage drug dispensing operations</p>
        </div>
        <Button className="gap-2 self-start" onClick={() => setModalOpen(true)}>
          <Plus className="h-4 w-4" /> New Dispensing
        </Button>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <StatCard label="Total Dispensed" value={stats.total} />
        <StatCard label="Today" value={stats.today} />
        <StatCard label="Pending" value={stats.pending} />
      </div>

      <div className="rounded-xl border border-border bg-card p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by patient name, prescription ID, or drug..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      <div className="rounded-xl border border-border bg-card overflow-hidden" style={{ boxShadow: "var(--shadow-sm)" }}>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Prescription ID</TableHead>
              <TableHead>Patient</TableHead>
              <TableHead>Drug</TableHead>
              <TableHead>Quantity</TableHead>
              <TableHead>Dispensed By</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-12"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((record) => (
              <TableRow key={record.id}>
                <TableCell className="font-medium">{record.prescriptionId}</TableCell>
                <TableCell>{record.patientName}</TableCell>
                <TableCell>{record.drugName}</TableCell>
                <TableCell className="text-center">{record.quantity}</TableCell>
                <TableCell>{record.dispensedBy}</TableCell>
                <TableCell>{record.dispensedDate}</TableCell>
                <TableCell>
                  <StatusBadge status={record.status} />
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
                      <DropdownMenuItem>Print Label</DropdownMenuItem>
                      <DropdownMenuItem>Mark Complete</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>New Dispensing Record</DialogTitle>
            <DialogDescription>Add a drug dispensing record</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Prescription ID</Label>
              <BaseInput placeholder="RX-001" />
            </div>
            <div>
              <Label>Patient Name</Label>
              <BaseInput placeholder="Search patient..." />
            </div>
            <div>
              <Label>Drug Name</Label>
              <BaseInput placeholder="Drug name" />
            </div>
            <div>
              <Label>Quantity</Label>
              <BaseInput type="number" placeholder="21" />
            </div>
            <div>
              <Label>Dispensed By</Label>
              <BaseInput placeholder="Pharmacist name" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button onClick={() => setModalOpen(false)}>Save Record</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
