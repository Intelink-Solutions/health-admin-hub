import { useState } from "react";
import {
  FlaskConical, Search, Plus, Filter, MoreHorizontal, CheckCircle2, Clock, AlertCircle,
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

type LabTest = {
  id: string;
  patientId: string;
  patientName: string;
  testName: string;
  testType: string;
  requestDate: string;
  sampleCollected: string;
  resultDate: string;
  status: "Requested" | "Sample Collected" | "In Progress" | "Completed" | "Reported";
  value: string;
  unit: string;
  refRange: string;
};

const LAB_TESTS: LabTest[] = [
  { id: "LAB-001", patientId: "P-10001", patientName: "Aisha Mohammed", testName: "Full Blood Count", testType: "Hematology", requestDate: "2026-02-20", sampleCollected: "2026-02-20", resultDate: "2026-02-22", status: "Completed", value: "7.2", unit: "10^3/µL", refRange: "4.5-11.0" },
  { id: "LAB-002", patientId: "P-10002", patientName: "John Okafor", testName: "Blood Glucose", testType: "Chemistry", requestDate: "2026-02-21", sampleCollected: "2026-02-21", resultDate: "", status: "In Progress", value: "-", unit: "mg/dL", refRange: "70-100" },
  { id: "LAB-003", patientId: "P-10003", patientName: "Fatima Bello", testName: "Lipid Profile", testType: "Chemistry", requestDate: "2026-02-19", sampleCollected: "2026-02-19", resultDate: "2026-02-22", status: "Completed", value: "180/120", unit: "mg/dL", refRange: "<200/150" },
  { id: "LAB-004", patientId: "P-10004", patientName: "Emeka Nwosu", testName: "Liver Function Test", testType: "Chemistry", requestDate: "2026-02-22", sampleCollected: "", resultDate: "", status: "Requested", value: "-", unit: "IU/L", refRange: "7-56" },
  { id: "LAB-005", patientId: "P-10005", patientName: "Grace Adeyemi", testName: "COVID-19 PCR", testType: "Microbiology", requestDate: "2026-02-22", sampleCollected: "2026-02-22", resultDate: "", status: "Sample Collected", value: "-", unit: "Positive/Negative", refRange: "Negative" },
];

function StatusBadge({ status }: { status: LabTest["status"] }) {
  const statusMap: Record<LabTest["status"], string> = {
    Requested: "badge-info",
    "Sample Collected": "badge-warning",
    "In Progress": "badge-warning",
    Completed: "badge-success",
    Reported: "badge-success",
  };
  return <span className={statusMap[status]}>{status}</span>;
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

export function LaboratoryPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [modalOpen, setModalOpen] = useState(false);

  const filtered = LAB_TESTS.filter(
    (t) =>
      (t.patientName.toLowerCase().includes(search.toLowerCase()) ||
        t.patientId.toLowerCase().includes(search.toLowerCase()) ||
        t.testName.toLowerCase().includes(search.toLowerCase())) &&
      (statusFilter === "all" || t.status === statusFilter)
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Laboratory</h1>
          <p className="text-sm text-muted-foreground">Manage lab tests and results</p>
        </div>
        <Button className="gap-2 self-start" onClick={() => setModalOpen(true)}>
          <Plus className="h-4 w-4" /> New Test Request
        </Button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Tests" value={LAB_TESTS.length} icon={FlaskConical} />
        <StatCard label="Pending" value={LAB_TESTS.filter((t) => t.status === "Requested").length} icon={Clock} />
        <StatCard label="In Progress" value={LAB_TESTS.filter((t) => t.status === "In Progress").length} icon={Clock} />
        <StatCard label="Completed" value={LAB_TESTS.filter((t) => t.status === "Completed").length} icon={CheckCircle2} />
      </div>

      <div className="rounded-xl border border-border bg-card p-4 space-y-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by patient, test name..."
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
              <TableHead>Test Name</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Request Date</TableHead>
              <TableHead>Result</TableHead>
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
                <TableCell className="font-medium">{test.testName}</TableCell>
                <TableCell className="text-sm">{test.testType}</TableCell>
                <TableCell className="text-sm">{test.requestDate}</TableCell>
                <TableCell className="text-sm">
                  {test.value !== "-" ? `${test.value} ${test.unit}` : "-"}
                </TableCell>
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
                      <DropdownMenuItem>View Details</DropdownMenuItem>
                      <DropdownMenuItem>Add Result</DropdownMenuItem>
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
            <DialogTitle>New Lab Test Request</DialogTitle>
            <DialogDescription>Request a new laboratory test</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Patient</Label>
              <BaseInput placeholder="Search patient..." />
            </div>
            <div>
              <Label>Test Name</Label>
              <select className="w-full px-3 py-2 border border-border rounded-lg text-foreground bg-background">
                <option>Full Blood Count</option>
                <option>Blood Glucose</option>
                <option>Lipid Profile</option>
                <option>Liver Function Test</option>
              </select>
            </div>
            <div>
              <Label>Test Type</Label>
              <select className="w-full px-3 py-2 border border-border rounded-lg text-foreground bg-background">
                <option>Hematology</option>
                <option>Chemistry</option>
                <option>Microbiology</option>
                <option>Serology</option>
              </select>
            </div>
            <div>
              <Label>Instructions</Label>
              <textarea className="w-full px-3 py-2 border border-border rounded-lg text-foreground bg-background" placeholder="Special instructions..." />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button onClick={() => setModalOpen(false)}>Request Test</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
