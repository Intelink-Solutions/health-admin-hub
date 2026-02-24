import { useState } from "react";
import {
  FileText, Search, Plus, MoreHorizontal, TrendingUp, Users,
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type Report = {
  id: string;
  title: string;
  department: string;
  reportType: string;
  dateGenerated: string;
  author: string;
  successRate: number;
  patientCount: number;
  status: "Final" | "Draft" | "In Review";
};

const REPORTS: Report[] = [
  { id: "CLR-001", title: "Cardiology Outcomes Q1 2026", department: "Cardiology", reportType: "Clinical Outcomes", dateGenerated: "2026-02-20", author: "Dr. Adekunle", successRate: 94, patientCount: 245, status: "Final" },
  { id: "CLR-002", title: "Pediatrics Treatment Success", department: "Pediatrics", reportType: "Treatment Success", dateGenerated: "2026-02-19", author: "Dr. Amara", successRate: 96, patientCount: 312, status: "Final" },
  { id: "CLR-003", title: "Orthopedic Surgery Report", department: "Orthopedics", reportType: "Surgery Report", dateGenerated: "2026-02-18", author: "Dr. Chukwu", successRate: 91, patientCount: 178, status: "In Review" },
  { id: "CLR-004", title: "Neurology Patient Satisfaction", department: "Neurology", reportType: "Satisfaction Survey", dateGenerated: "2026-02-17", author: "Dr. Fekete", successRate: 88, patientCount: 152, status: "Draft" },
];

function StatusBadge({ status }: { status: Report["status"] }) {
  const map: Record<Report["status"], string> = {
    Final: "badge-success",
    "In Review": "badge-warning",
    Draft: "badge-neutral",
  };
  return <span className={map[status]}>{status}</span>;
}

function StatCard({ label, value, icon: Icon }: { label: string; value: number; icon: React.ElementType }) {
  return (
    <Card>
      <CardContent className="p-5">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-primary/20 flex items-center justify-center">
            <Icon className="h-5 w-5 text-primary" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground uppercase">{label}</p>
            <p className="text-2xl font-bold text-foreground">{value}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function ClinicalReportsPage() {
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);

  const filtered = REPORTS.filter(
    (r) =>
      r.title.toLowerCase().includes(search.toLowerCase()) ||
      r.department.toLowerCase().includes(search.toLowerCase()) ||
      r.author.toLowerCase().includes(search.toLowerCase())
  );

  const avgSuccessRate = Math.round(REPORTS.reduce((sum, r) => sum + r.successRate, 0) / REPORTS.length);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Clinical Reports</h1>
          <p className="text-sm text-muted-foreground">Treatment outcomes and clinical performance analysis</p>
        </div>
        <Button className="gap-2 self-start" onClick={() => setModalOpen(true)}>
          <Plus className="h-4 w-4" /> New Report
        </Button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Reports" value={REPORTS.length} icon={FileText} />
        <StatCard label="Final Reports" value={REPORTS.filter((r) => r.status === "Final").length} icon={FileText} />
        <StatCard label="Avg Success Rate" value={avgSuccessRate} icon={TrendingUp} />
        <StatCard label="Total Patients Reviewed" value={REPORTS.reduce((sum, r) => sum + r.patientCount, 0)} icon={Users} />
      </div>

      <div className="rounded-xl border border-border bg-card p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by title, department, or author..."
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
              <TableHead>Report ID</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Department</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Success Rate</TableHead>
              <TableHead>Patients</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-12"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((report) => (
              <TableRow key={report.id}>
                <TableCell className="font-medium">{report.id}</TableCell>
                <TableCell>{report.title}</TableCell>
                <TableCell>{report.department}</TableCell>
                <TableCell className="text-sm">{report.reportType}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <div className="w-12 bg-muted rounded h-2">
                      <div className="bg-green-500 h-2 rounded" style={{ width: `${report.successRate}%` }} />
                    </div>
                    <span className="text-sm font-medium">{report.successRate}%</span>
                  </div>
                </TableCell>
                <TableCell className="text-sm">{report.patientCount}</TableCell>
                <TableCell>
                  <StatusBadge status={report.status} />
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>View Report</DropdownMenuItem>
                      <DropdownMenuItem>Edit Report</DropdownMenuItem>
                      <DropdownMenuItem>Export PDF</DropdownMenuItem>
                      <DropdownMenuItem>Share</DropdownMenuItem>
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
            <DialogTitle>Generate Clinical Report</DialogTitle>
            <DialogDescription>Create a new clinical outcomes report</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Report Title</Label>
              <BaseInput placeholder="Report title" />
            </div>
            <div>
              <Label>Department</Label>
              <select className="w-full px-3 py-2 border border-border rounded-lg text-foreground bg-background">
                <option>Cardiology</option>
                <option>Pediatrics</option>
                <option>Orthopedics</option>
                <option>Neurology</option>
              </select>
            </div>
            <div>
              <Label>Report Type</Label>
              <select className="w-full px-3 py-2 border border-border rounded-lg text-foreground bg-background">
                <option>Clinical Outcomes</option>
                <option>Treatment Success</option>
                <option>Surgery Report</option>
                <option>Satisfaction Survey</option>
              </select>
            </div>
            <div>
              <Label>Date Period</Label>
              <BaseInput type="month" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button onClick={() => setModalOpen(false)}>Generate Report</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
