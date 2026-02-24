import { useState } from "react";
import {
  Calendar, Plus, MoreHorizontal, Clock, Users, AlertCircle,
} from "lucide-react";
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
import { Input } from "@/components/ui/input";

type Schedule = {
  id: string;
  staffName: string;
  department: string;
  role: string;
  dateFrom: string;
  dateTo: string;
  shiftType: string;
  status: "Approved" | "Pending" | "Urgent Change";
};

const SCHEDULES: Schedule[] = [
  { id: "SCH-001", staffName: "Dr. Adebayo", department: "Cardiology", role: "Doctor", dateFrom: "2026-02-23", dateTo: "2026-03-02", shiftType: "Morning", status: "Approved" },
  { id: "SCH-002", staffName: "Amina Bello", department: "Emergency", role: "Nurse", dateFrom: "2026-02-23", dateTo: "2026-02-28", shiftType: "Day/Night", status: "Approved" },
  { id: "SCH-003", staffName: "Ibrahim Musa", department: "Pharmacy", role: "Pharmacist", dateFrom: "2026-02-25", dateTo: "2026-03-05", shiftType: "Morning", status: "Pending" },
  { id: "SCH-004", staffName: "Grace Obi", department: "Front Desk", role: "Receptionist", dateFrom: "2026-02-23", dateTo: "2026-02-27", shiftType: "Evening", status: "Urgent Change" },
];

function StatusBadge({ status }: { status: Schedule["status"] }) {
  const map: Record<Schedule["status"], string> = {
    Approved: "badge-success",
    Pending: "badge-warning",
    "Urgent Change": "badge-danger",
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

export function SchedulingPage() {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Staff Scheduling</h1>
          <p className="text-sm text-muted-foreground">Manage staff schedules and shifts</p>
        </div>
        <Button className="gap-2 self-start" onClick={() => setModalOpen(true)}>
          <Plus className="h-4 w-4" /> New Schedule
        </Button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Schedules" value={SCHEDULES.length} icon={Calendar} />
        <StatCard label="Approved" value={SCHEDULES.filter((s) => s.status === "Approved").length} icon={Users} />
        <StatCard label="Pending" value={SCHEDULES.filter((s) => s.status === "Pending").length} icon={Clock} />
        <StatCard label="Urgent Changes" value={SCHEDULES.filter((s) => s.status === "Urgent Change").length} icon={AlertCircle} />
      </div>

      <div className="rounded-xl border border-border bg-card overflow-hidden" style={{ boxShadow: "var(--shadow-sm)" }}>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Staff</TableHead>
              <TableHead>Department</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Period</TableHead>
              <TableHead>Shift</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-12"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {SCHEDULES.map((schedule) => (
              <TableRow key={schedule.id}>
                <TableCell>
                  <div>
                    <p className="font-medium">{schedule.staffName}</p>
                  </div>
                </TableCell>
                <TableCell>{schedule.department}</TableCell>
                <TableCell>{schedule.role}</TableCell>
                <TableCell className="text-sm">
                  <div>
                    <p>{schedule.dateFrom}</p>
                    <p className="text-xs text-muted-foreground">to {schedule.dateTo}</p>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline">{schedule.shiftType}</Badge>
                </TableCell>
                <TableCell>
                  <StatusBadge status={schedule.status} />
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
                      <DropdownMenuItem>Approve</DropdownMenuItem>
                      <DropdownMenuItem>Modify</DropdownMenuItem>
                      <DropdownMenuItem>Cancel</DropdownMenuItem>
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
            <DialogTitle>Create New Schedule</DialogTitle>
            <DialogDescription>Schedule staff for shifts</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Staff Member</Label>
              <select className="w-full px-3 py-2 border border-border rounded-lg text-foreground bg-background">
                <option>Dr. Adebayo</option>
                <option>Amina Bello</option>
                <option>Ibrahim Musa</option>
              </select>
            </div>
            <div>
              <Label>Shift Type</Label>
              <select className="w-full px-3 py-2 border border-border rounded-lg text-foreground bg-background">
                <option>Morning</option>
                <option>Evening</option>
                <option>Night</option>
                <option>Day/Night</option>
              </select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>From Date</Label>
                <Input type="date" />
              </div>
              <div>
                <Label>To Date</Label>
                <Input type="date" />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button onClick={() => setModalOpen(false)}>Create Schedule</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
