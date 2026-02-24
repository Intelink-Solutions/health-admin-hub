import { useState } from "react";
import {
  Video, Search, Plus, MoreHorizontal, Clock, User, Phone,
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

type Consultation = {
  id: string;
  patientName: string;
  doctorName: string;
  scheduledTime: string;
  duration: string;
  platform: string;
  status: "Scheduled" | "In Progress" | "Completed" | "Cancelled";
  notes: string;
};

const CONSULTATIONS: Consultation[] = [
  { id: "VC-001", patientName: "Alicia Khan", doctorName: "Dr. Sarah Kimani", scheduledTime: "2026-02-23 10:00 AM", duration: "30 mins", platform: "Video Call", status: "Scheduled", notes: "Follow-up consultation" },
  { id: "VC-002", patientName: "David Njoroge", doctorName: "Dr. Hassan Ali", scheduledTime: "2026-02-23 11:00 AM", duration: "45 mins", platform: "Video Call", status: "Scheduled", notes: "General checkup" },
  { id: "VC-003", patientName: "Esther Mwangi", doctorName: "Dr. Fatima Noor", scheduledTime: "2026-02-22 02:00 PM", duration: "30 mins", platform: "Video Call", status: "Completed", notes: "Medication adjustment" },
  { id: "VC-004", patientName: "Frank Osei", doctorName: "Dr. Hassan Ali", scheduledTime: "2026-02-22 04:00 PM", duration: "20 mins", platform: "Audio Call", status: "Completed", notes: "Quick consultation" },
];

function StatusBadge({ status }: { status: Consultation["status"] }) {
  const map: Record<Consultation["status"], string> = {
    Scheduled: "badge-info",
    "In Progress": "badge-warning",
    Completed: "badge-success",
    Cancelled: "badge-danger",
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

export function VirtualConsultationsPage() {
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);

  const filtered = CONSULTATIONS.filter(
    (c) =>
      c.patientName.toLowerCase().includes(search.toLowerCase()) ||
      c.doctorName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Virtual Consultations</h1>
          <p className="text-sm text-muted-foreground">Manage telemedicine consultations</p>
        </div>
        <Button className="gap-2 self-start" onClick={() => setModalOpen(true)}>
          <Plus className="h-4 w-4" /> Schedule Consultation
        </Button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total" value={CONSULTATIONS.length} icon={Video} />
        <StatCard label="Scheduled" value={CONSULTATIONS.filter((c) => c.status === "Scheduled").length} icon={Clock} />
        <StatCard label="Completed" value={CONSULTATIONS.filter((c) => c.status === "Completed").length} icon={User} />
        <StatCard label="This Week" value={2} icon={Clock} />
      </div>

      <div className="rounded-xl border border-border bg-card p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by patient or doctor..."
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
              <TableHead>Doctor</TableHead>
              <TableHead>Scheduled Time</TableHead>
              <TableHead>Platform</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-12"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((consultation) => (
              <TableRow key={consultation.id}>
                <TableCell className="font-medium">{consultation.patientName}</TableCell>
                <TableCell>{consultation.doctorName}</TableCell>
                <TableCell className="text-sm">{consultation.scheduledTime}</TableCell>
                <TableCell>
                  <Badge variant="outline">{consultation.platform}</Badge>
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
                      {consultation.status === "Scheduled" && (
                        <>
                          <DropdownMenuItem>
                            <Phone className="h-4 w-4 mr-2" /> Start Call
                          </DropdownMenuItem>
                          <DropdownMenuItem>Reschedule</DropdownMenuItem>
                          <DropdownMenuItem>Cancel</DropdownMenuItem>
                        </>
                      )}
                      {consultation.status === "Completed" && (
                        <DropdownMenuItem>View Record</DropdownMenuItem>
                      )}
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
            <DialogTitle>Schedule Virtual Consultation</DialogTitle>
            <DialogDescription>Book a telemedicine appointment</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Patient</Label>
              <BaseInput placeholder="Search patient..." />
            </div>
            <div>
              <Label>Doctor</Label>
              <select className="w-full px-3 py-2 border border-border rounded-lg text-foreground bg-background">
                <option>Dr. Sarah Kimani</option>
                <option>Dr. Hassan Ali</option>
                <option>Dr. Fatima Noor</option>
              </select>
            </div>
            <div>
              <Label>Date & Time</Label>
              <BaseInput type="datetime-local" />
            </div>
            <div>
              <Label>Platform</Label>
              <select className="w-full px-3 py-2 border border-border rounded-lg text-foreground bg-background">
                <option>Video Call</option>
                <option>Audio Call</option>
              </select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button onClick={() => setModalOpen(false)}>Schedule</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
