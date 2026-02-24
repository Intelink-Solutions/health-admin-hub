import { useState } from "react";
import {
  FileText, Search, Plus, Download, File, Eye, MoreHorizontal,
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
import { Textarea } from "@/components/ui/textarea";

type EHRRecord = {
  id: string;
  patientId: string;
  patientName: string;
  dateCreated: string;
  recordType: string;
  provider: string;
  status: "Complete" | "Pending" | "Archived";
  summary: string;
};

const EHR_RECORDS: EHRRecord[] = [
  { id: "EHR-001", patientId: "P-10001", patientName: "Aisha Mohammed", dateCreated: "2026-02-22", recordType: "Consultation", provider: "Dr. Adebayo", status: "Complete", summary: "Regular checkup, BP normal" },
  { id: "EHR-002", patientId: "P-10002", patientName: "John Okafor", dateCreated: "2026-02-21", recordType: "Lab Results", provider: "Lab Tech", status: "Complete", summary: "Blood test completed successfully" },
  { id: "EHR-003", patientId: "P-10003", patientName: "Fatima Bello", dateCreated: "2026-02-20", recordType: "Imaging", provider: "Dr. Smith", status: "Pending", summary: "X-ray pending review" },
  { id: "EHR-004", patientId: "P-10004", patientName: "Emeka Nwosu", dateCreated: "2026-02-19", recordType: "Discharge Summary", provider: "Dr. Ibrahim", status: "Complete", summary: "Patient discharged in stable condition" },
];

function StatusBadge({ status }: { status: EHRRecord["status"] }) {
  const map: Record<EHRRecord["status"], string> = {
    Complete: "badge-success",
    Pending: "badge-warning",
    Archived: "badge-neutral",
  };
  return <span className={map[status]}>{status}</span>;
}

function StatCard({ label, value, icon: Icon }: { label: string; value: number; icon: React.ElementType }) {
  return (
    <div className="stat-card">
      <div className="flex items-center justify-between">
        <p className="text-xs font-medium text-muted-foreground uppercase">{label}</p>
        <Icon className="h-5 w-5 text-primary" />
      </div>
      <p className="text-2xl font-bold text-foreground">{value}</p>
    </div>
  );
}

export function EHRPage() {
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);

  const filtered = EHR_RECORDS.filter(
    (r) =>
      r.patientName.toLowerCase().includes(search.toLowerCase()) ||
      r.patientId.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">EHR / EMR</h1>
          <p className="text-sm text-muted-foreground">Electronic Health & Medical Records</p>
        </div>
        <Button className="gap-2 self-start" onClick={() => setModalOpen(true)}>
          <Plus className="h-4 w-4" /> New Record
        </Button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Records" value={EHR_RECORDS.length} icon={FileText} />
        <StatCard label="Complete" value={EHR_RECORDS.filter((r) => r.status === "Complete").length} icon={FileText} />
        <StatCard label="Pending" value={EHR_RECORDS.filter((r) => r.status === "Pending").length} icon={FileText} />
        <StatCard label="Archived" value={EHR_RECORDS.filter((r) => r.status === "Archived").length} icon={FileText} />
      </div>

      <div className="rounded-xl border border-border bg-card p-4 space-y-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by patient name or ID..."
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
              <TableHead>Patient</TableHead>
              <TableHead>Record Type</TableHead>
              <TableHead>Date Created</TableHead>
              <TableHead>Provider</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-12"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((record) => (
              <TableRow key={record.id}>
                <TableCell>
                  <div>
                    <p className="font-medium">{record.patientName}</p>
                    <p className="text-xs text-muted-foreground">{record.patientId}</p>
                  </div>
                </TableCell>
                <TableCell>{record.recordType}</TableCell>
                <TableCell>{record.dateCreated}</TableCell>
                <TableCell>{record.provider}</TableCell>
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
                      <DropdownMenuItem>
                        <Eye className="h-4 w-4 mr-2" /> View Record
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Download className="h-4 w-4 mr-2" /> Download
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <File className="h-4 w-4 mr-2" /> Print
                      </DropdownMenuItem>
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
            <DialogTitle>Create New Record</DialogTitle>
            <DialogDescription>Add a new EHR/EMR record</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Patient</Label>
              <Input placeholder="Search patient..." />
            </div>
            <div>
              <Label>Record Type</Label>
              <select className="w-full px-3 py-2 border border-border rounded-lg text-foreground bg-background">
                <option>Consultation</option>
                <option>Lab Results</option>
                <option>Imaging</option>
                <option>Discharge Summary</option>
              </select>
            </div>
            <div>
              <Label>Summary</Label>
              <Textarea placeholder="Record summary..." />
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
