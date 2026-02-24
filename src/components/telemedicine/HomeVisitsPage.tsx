import { useState } from "react";
import {
  Home, Search, Plus, MoreHorizontal, Clock, User,
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

type HomeVisit = {
  id: string;
  patientName: string;
  address: string;
  visitType: string;
  nurse: string;
  scheduledDate: string;
  time: string;
  status: "Scheduled" | "In Progress" | "Completed" | "Cancelled";
  notes: string;
};

const HOME_VISITS: HomeVisit[] = [
  { id: "HV-001", patientName: "Sarah Mitchell", address: "123 Oak Street", visitType: "Wound dressing", nurse: "Sr. Amina", scheduledDate: "2026-02-23", time: "10:00 AM", status: "Scheduled", notes: "Post-surgical wound care" },
  { id: "HV-002", patientName: "Robert Kimani", address: "456 Elm Avenue", visitType: "Vital signs check", nurse: "Sr. Blessing", scheduledDate: "2026-02-23", time: "02:00 PM", status: "Scheduled", notes: "BP and glucose monitoring" },
  { id: "HV-003", patientName: "Grace Okonkwo", address: "789 Pine Road", visitType: "Medication Management", nurse: "Sr. Mary", scheduledDate: "2026-02-22", time: "11:00 AM", status: "Completed", notes: "Diabetic medication administration" },
  { id: "HV-004", patientName: "Kwame Mensah", address: "321 Maple Lane", visitType: "Rehabilitation", nurse: "Sr. Fatima", scheduledDate: "2026-02-22", time: "03:00 PM", status: "Completed", notes: "Physical therapy session" },
];

function StatusBadge({ status }: { status: HomeVisit["status"] }) {
  const map: Record<HomeVisit["status"], string> = {
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

export function HomeVisitsPage() {
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);

  const filtered = HOME_VISITS.filter(
    (v) =>
      v.patientName.toLowerCase().includes(search.toLowerCase()) ||
      v.address.toLowerCase().includes(search.toLowerCase()) ||
      v.nurse.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Home Visits & Care</h1>
          <p className="text-sm text-muted-foreground">Schedule and manage home healthcare visits</p>
        </div>
        <Button className="gap-2 self-start" onClick={() => setModalOpen(true)}>
          <Plus className="h-4 w-4" /> Schedule Visit
        </Button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Visits" value={HOME_VISITS.length} icon={Home} />
        <StatCard label="Scheduled" value={HOME_VISITS.filter((v) => v.status === "Scheduled").length} icon={Clock} />
        <StatCard label="Completed" value={HOME_VISITS.filter((v) => v.status === "Completed").length} icon={User} />
        <StatCard label="This Week" value={2} icon={Clock} />
      </div>

      <div className="rounded-xl border border-border bg-card p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by patient, address, or nurse..."
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
              <TableHead>Address</TableHead>
              <TableHead>Visit Type</TableHead>
              <TableHead>Nurse</TableHead>
              <TableHead>Date & Time</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-12"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((visit) => (
              <TableRow key={visit.id}>
                <TableCell className="font-medium">{visit.patientName}</TableCell>
                <TableCell className="text-sm">{visit.address}</TableCell>
                <TableCell>{visit.visitType}</TableCell>
                <TableCell>{visit.nurse}</TableCell>
                <TableCell className="text-sm">
                  <div>
                    <p>{visit.scheduledDate}</p>
                    <p className="text-xs text-muted-foreground">{visit.time}</p>
                  </div>
                </TableCell>
                <TableCell>
                  <StatusBadge status={visit.status} />
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
                      <DropdownMenuItem>Confirm Visit</DropdownMenuItem>
                      <DropdownMenuItem>Reschedule</DropdownMenuItem>
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
            <DialogTitle>Schedule Home Visit</DialogTitle>
            <DialogDescription>Request a home healthcare visit</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Patient</Label>
              <BaseInput placeholder="Search patient..." />
            </div>
            <div>
              <Label>Visit Type</Label>
              <select className="w-full px-3 py-2 border border-border rounded-lg text-foreground bg-background">
                <option>Wound dressing</option>
                <option>Vital signs check</option>
                <option>Medication Management</option>
                <option>Rehabilitation</option>
              </select>
            </div>
            <div>
              <Label>Assigned Nurse</Label>
              <select className="w-full px-3 py-2 border border-border rounded-lg text-foreground bg-background">
                <option>Sr. Amina</option>
                <option>Sr. Blessing</option>
                <option>Sr. Mary</option>
              </select>
            </div>
            <div>
              <Label>Date & Time</Label>
              <BaseInput type="datetime-local" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button onClick={() => setModalOpen(false)}>Schedule Visit</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
