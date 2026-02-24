import { useState } from "react";
import {
  MoreHorizontal, Clock, AlertCircle, CheckCircle2, Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type Consultation = {
  id: string;
  patientName: string;
  patientId: string;
  arrivalTime: string;
  waitTime: number;
  department: string;
  doctor: string;
  status: "Waiting" | "In Progress" | "Completed" | "Cancelled";
  reason: string;
};

const CONSULTATION_QUEUE: Consultation[] = [
  { id: "C-001", patientName: "Ahmed Hassan", patientId: "P-10001", arrivalTime: "09:15 AM", waitTime: 5, department: "Cardiology", doctor: "Dr. Adebayo", status: "In Progress", reason: "Follow-up consultation" },
  { id: "C-002", patientName: "Fatima Al-Rashid", patientId: "P-10002", arrivalTime: "09:20 AM", waitTime: 2, department: "Orthopedics", doctor: "Dr. Nnamdi", status: "Waiting", reason: "Post-surgery review" },
  { id: "C-003", patientName: "Omar Yusuf", patientId: "P-10003", arrivalTime: "09:35 AM", waitTime: 8, department: "Emergency", doctor: "Dr. Rivera", status: "Waiting", reason: "Acute abdomen" },
  { id: "C-004", patientName: "Layla Ibrahim", patientId: "P-10004", arrivalTime: "09:05 AM", waitTime: 12, department: "Pediatrics", doctor: "Dr. Osei", status: "Waiting", reason: "Child vaccination" },
  { id: "C-005", patientName: "Khalid Mansoor", patientId: "P-10005", arrivalTime: "08:50 AM", waitTime: 25, department: "Neurology", doctor: "Dr. Yusuf", status: "Completed", reason: "Migraine management" },
];

function StatusBadge({ status }: { status: Consultation["status"] }) {
  const map: Record<Consultation["status"], string> = {
    Waiting: "badge-warning",
    "In Progress": "badge-info",
    Completed: "badge-success",
    Cancelled: "badge-danger",
  };
  return <span className={map[status]}>{status}</span>;
}

function StatCard({ label, value, icon: Icon }: { label: string; value: number | string; icon: React.ElementType }) {
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

export function ConsultationQueuePage() {
  const waiting = CONSULTATION_QUEUE.filter((c) => c.status === "Waiting").length;
  const inProgress = CONSULTATION_QUEUE.filter((c) => c.status === "In Progress").length;
  const avgWait = Math.round(
    CONSULTATION_QUEUE.reduce((sum, c) => sum + c.waitTime, 0) / CONSULTATION_QUEUE.length
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Consultation Queue</h1>
        <p className="text-sm text-muted-foreground">Real-time patient consultation management</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="In Queue" value={waiting} icon={Clock} />
        <StatCard label="In Progress" value={inProgress} icon={Users} />
        <StatCard label="Avg Wait" value={`${avgWait}min`} icon={Clock} />
        <StatCard label="Completed Today" value={CONSULTATION_QUEUE.filter((c) => c.status === "Completed").length} icon={CheckCircle2} />
      </div>

      <div className="rounded-xl border border-border bg-card overflow-hidden" style={{ boxShadow: "var(--shadow-sm)" }}>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Patient</TableHead>
              <TableHead>Arrival Time</TableHead>
              <TableHead>Department</TableHead>
              <TableHead>Doctor</TableHead>
              <TableHead>Reason</TableHead>
              <TableHead>Wait Time</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-12"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {CONSULTATION_QUEUE.map((consultation) => (
              <TableRow key={consultation.id} className={consultation.status === "In Progress" ? "bg-primary/5" : ""}>
                <TableCell>
                  <div>
                    <p className="font-medium">{consultation.patientName}</p>
                    <p className="text-xs text-muted-foreground">{consultation.patientId}</p>
                  </div>
                </TableCell>
                <TableCell>{consultation.arrivalTime}</TableCell>
                <TableCell>{consultation.department}</TableCell>
                <TableCell>{consultation.doctor}</TableCell>
                <TableCell className="text-sm">{consultation.reason}</TableCell>
                <TableCell>
                  <Badge variant="outline">{consultation.waitTime} min</Badge>
                </TableCell>
                <TableCell>
                  <StatusBadge status={consultation.status} />
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>Move to Doctor</DropdownMenuItem>
                      <DropdownMenuItem>Reschedule</DropdownMenuItem>
                      <DropdownMenuItem>Cancel Consultation</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
