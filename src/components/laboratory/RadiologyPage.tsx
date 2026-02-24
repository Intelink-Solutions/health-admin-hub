import { useState } from "react";
import {
  RadioIcon, Search, Plus, MoreHorizontal, CheckCircle2, Clock,
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

type RadiologyTest = {
  id: string;
  patientId: string;
  patientName: string;
  imagingType: string;
  bodyPart: string;
  requestDate: string;
  scanDate: string;
  reportDate: string;
  status: "Requested" | "Scheduled" | "Completed" | "Reported";
  radiologist: string;
  findingsSummary: string;
};

const RADIOLOGY_TESTS: RadiologyTest[] = [
  { id: "RAD-001", patientId: "P-10001", patientName: "Aisha Mohammed", imagingType: "ECG", bodyPart: "Chest", requestDate: "2026-02-20", scanDate: "2026-02-21", reportDate: "2026-02-22", status: "Reported", radiologist: "Dr. Smith", findingsSummary: "Normal cardiac function" },
  { id: "RAD-002", patientId: "P-10002", patientName: "John Okafor", imagingType: "X-Ray", bodyPart: "Femur", requestDate: "2026-02-18", scanDate: "2026-02-19", reportDate: "2026-02-21", status: "Reported", radiologist: "Dr. Johnson", findingsSummary: "Fracture with minimal displacement" },
  { id: "RAD-003", patientId: "P-10003", patientName: "Fatima Bello", imagingType: "Ultrasound", bodyPart: "Abdomen", requestDate: "2026-02-21", scanDate: "2026-02-22", reportDate: "", status: "Completed", radiologist: "Dr. Lee", findingsSummary: "Pending interpretation" },
  { id: "RAD-004", patientId: "P-10004", patientName: "Emeka Nwosu", imagingType: "CT Scan", bodyPart: "Head", requestDate: "2026-02-22", scanDate: "", reportDate: "", status: "Scheduled", radiologist: "-", findingsSummary: "-" },
  { id: "RAD-005", patientId: "P-10005", patientName: "Grace Adeyemi", imagingType: "MRI", bodyPart: "Spine", requestDate: "2026-02-22", scanDate: "", reportDate: "", status: "Requested", radiologist: "-", findingsSummary: "-" },
];

function StatusBadge({ status }: { status: RadiologyTest["status"] }) {
  const map: Record<RadiologyTest["status"], string> = {
    Requested: "badge-info",
    Scheduled: "badge-warning",
    Completed: "badge-warning",
    Reported: "badge-success",
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

export function RadiologyPage() {
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);

  const filtered = RADIOLOGY_TESTS.filter(
    (t) =>
      t.patientName.toLowerCase().includes(search.toLowerCase()) ||
      t.patientId.toLowerCase().includes(search.toLowerCase()) ||
      t.imagingType.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Radiology & Imaging</h1>
          <p className="text-sm text-muted-foreground">Manage imaging requests and reports</p>
        </div>
        <Button className="gap-2 self-start" onClick={() => setModalOpen(true)}>
          <Plus className="h-4 w-4" /> New Request
        </Button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Scans" value={RADIOLOGY_TESTS.length} icon={RadioIcon} />
        <StatCard label="Pending" value={RADIOLOGY_TESTS.filter((t) => t.status === "Requested").length} icon={Clock} />
        <StatCard label="Scheduled" value={RADIOLOGY_TESTS.filter((t) => t.status === "Scheduled").length} icon={Clock} />
        <StatCard label="Completed" value={RADIOLOGY_TESTS.filter((t) => t.status === "Reported").length} icon={CheckCircle2} />
      </div>

      <div className="rounded-xl border border-border bg-card p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by patient or imaging type..."
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
              <TableHead>Imaging Type</TableHead>
              <TableHead>Body Part</TableHead>
              <TableHead>Request Date</TableHead>
              <TableHead>Radiologist</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-12"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((test) => (
              <TableRow key={test.id}>
                <TableCell>
                  <div>
                    <p className="font-medium">{test.patientName}</p>
                    <p className="text-xs text-muted-foreground">{test.patientId}</p>
                  </div>
                </TableCell>
                <TableCell className="font-medium">{test.imagingType}</TableCell>
                <TableCell>{test.bodyPart}</TableCell>
                <TableCell className="text-sm">{test.requestDate}</TableCell>
                <TableCell className="text-sm">{test.radiologist}</TableCell>
                <TableCell>
                  <StatusBadge status={test.status} />
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>View Images</DropdownMenuItem>
                      <DropdownMenuItem>Add Report</DropdownMenuItem>
                      <DropdownMenuItem>Print Report</DropdownMenuItem>
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
            <DialogTitle>New Imaging Request</DialogTitle>
            <DialogDescription>Request imaging or radiological examination</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Patient</Label>
              <BaseInput placeholder="Search patient..." />
            </div>
            <div>
              <Label>Imaging Type</Label>
              <select className="w-full px-3 py-2 border border-border rounded-lg text-foreground bg-background">
                <option>X-Ray</option>
                <option>CT Scan</option>
                <option>MRI</option>
                <option>Ultrasound</option>
                <option>ECG</option>
              </select>
            </div>
            <div>
              <Label>Body Part</Label>
              <BaseInput placeholder="Body part" />
            </div>
            <div>
              <Label>Clinical Indication</Label>
              <textarea className="w-full px-3 py-2 border border-border rounded-lg text-foreground bg-background" placeholder="Reason for imaging..." />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button onClick={() => setModalOpen(false)}>Submit Request</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
