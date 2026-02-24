import { useState } from "react";
import {
  Users, Search, Plus, MoreHorizontal, Calendar, Clock,
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

type NurseAssignment = {
  id: string;
  nurseId: string;
  nurseName: string;
  ward: string;
  assignedPatients: number;
  shift: "Morning" | "Evening" | "Night";
  startTime: string;
  endTime: string;
  date: string;
  status: "Active" | "On Break" | "Off Duty";
};

const ASSIGNMENTS: NurseAssignment[] = [
  { id: "NASS-001", nurseId: "STF-002", nurseName: "Amina Bello", ward: "Ward A", assignedPatients: 6, shift: "Morning", startTime: "06:00 AM", endTime: "02:00 PM", date: "2026-02-23", status: "Active" },
  { id: "NASS-002", nurseId: "STF-010", nurseName: "Blessing Udo", ward: "ICU", assignedPatients: 4, shift: "Morning", startTime: "06:00 AM", endTime: "02:00 PM", date: "2026-02-23", status: "Active" },
  { id: "NASS-003", nurseId: "STF-002", nurseName: "Amina Bello", ward: "Ward A", assignedPatients: 5, shift: "Evening", startTime: "02:00 PM", endTime: "10:00 PM", date: "2026-02-24", status: "Active" },
  { id: "NASS-004", nurseId: "STF-010", nurseName: "Blessing Udo", ward: "Ward B", assignedPatients: 6, shift: "Night", startTime: "10:00 PM", endTime: "06:00 AM", date: "2026-02-24", status: "Off Duty" },
];

function StatusBadge({ status }: { status: NurseAssignment["status"] }) {
  const map: Record<NurseAssignment["status"], string> = {
    Active: "badge-success",
    "On Break": "badge-warning",
    "Off Duty": "badge-neutral",
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

export function NurseAssignmentsPage() {
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);

  const filtered = ASSIGNMENTS.filter(
    (a) =>
      a.nurseName.toLowerCase().includes(search.toLowerCase()) ||
      a.ward.toLowerCase().includes(search.toLowerCase())
  );

  const activeNurses = ASSIGNMENTS.filter((a) => a.status === "Active").length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Nurse Assignments</h1>
          <p className="text-sm text-muted-foreground">Manage nurse schedules and patient assignments</p>
        </div>
        <Button className="gap-2 self-start" onClick={() => setModalOpen(true)}>
          <Plus className="h-4 w-4" /> New Assignment
        </Button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Assignments" value={ASSIGNMENTS.length} icon={Calendar} />
        <StatCard label="Active Nurses" value={activeNurses} icon={Users} />
        <StatCard label="Avg Patients/Nurse" value={3} icon={Users} />
        <StatCard label="On Break" value={ASSIGNMENTS.filter((a) => a.status === "On Break").length} icon={Clock} />
      </div>

      <div className="rounded-xl border border-border bg-card p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by nurse name or ward..."
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
              <TableHead>Nurse</TableHead>
              <TableHead>Ward</TableHead>
              <TableHead>Shift</TableHead>
              <TableHead>Time</TableHead>
              <TableHead>Patients</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-12"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((assignment) => (
              <TableRow key={assignment.id}>
                <TableCell>
                  <div>
                    <p className="font-medium">{assignment.nurseName}</p>
                    <p className="text-xs text-muted-foreground">{assignment.nurseId}</p>
                  </div>
                </TableCell>
                <TableCell>{assignment.ward}</TableCell>
                <TableCell>
                  <Badge variant="outline">{assignment.shift}</Badge>
                </TableCell>
                <TableCell className="text-sm">{assignment.startTime} - {assignment.endTime}</TableCell>
                <TableCell className="font-medium">{assignment.assignedPatients}</TableCell>
                <TableCell>
                  <StatusBadge status={assignment.status} />
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
                      <DropdownMenuItem>Modify Assignment</DropdownMenuItem>
                      <DropdownMenuItem>Take Break</DropdownMenuItem>
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
            <DialogTitle>New Assignment</DialogTitle>
            <DialogDescription>Assign nurse to ward and patients</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Nurse</Label>
              <select className="w-full px-3 py-2 border border-border rounded-lg text-foreground bg-background">
                <option>Amina Bello</option>
                <option>Blessing Udo</option>
              </select>
            </div>
            <div>
              <Label>Ward</Label>
              <select className="w-full px-3 py-2 border border-border rounded-lg text-foreground bg-background">
                <option>Ward A</option>
                <option>Ward B</option>
                <option>ICU</option>
              </select>
            </div>
            <div>
              <Label>Shift</Label>
              <select className="w-full px-3 py-2 border border-border rounded-lg text-foreground bg-background">
                <option>Morning</option>
                <option>Evening</option>
                <option>Night</option>
              </select>
            </div>
            <div>
              <Label>Date</Label>
              <BaseInput type="date" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button onClick={() => setModalOpen(false)}>Create Assignment</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
