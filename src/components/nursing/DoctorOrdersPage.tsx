import { useState } from "react";
import {
  ClipboardList, Search, Plus, Filter, MoreHorizontal, CheckCircle2, Clock,
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

type DoctorOrder = {
  id: string;
  patientId: string;
  patientName: string;
  orderDate: string;
  orderTime: string;
  doctor: string;
  orderType: string;
  description: string;
  status: "Pending" | "In Progress" | "Completed";
  priority: "Normal" | "Urgent" | "Emergency";
};

const DOCTOR_ORDERS: DoctorOrder[] = [
  { id: "ORDER-001", patientId: "P-10001", patientName: "Aisha Mohammed", orderDate: "2026-02-22", orderTime: "10:30 AM", doctor: "Dr. Adebayo", orderType: "Lab Test", description: "Full blood count, lipid profile", status: "Completed", priority: "Normal" },
  { id: "ORDER-002", patientId: "P-10002", patientName: "John Okafor", orderDate: "2026-02-22", orderTime: "11:15 AM", doctor: "Dr. Nnamdi", orderType: "Medication", description: "Antibiotics, pain management", status: "In Progress", priority: "Normal" },
  { id: "ORDER-003", patientId: "P-10003", patientName: "Fatima Bello", orderDate: "2026-02-22", orderTime: "12:00 PM", doctor: "Dr. Okonkwo", orderType: "Imaging", description: "X-ray chest, abdominal ultrasound", status: "Pending", priority: "Urgent" },
  { id: "ORDER-004", patientId: "P-10004", patientName: "Emeka Nwosu", orderDate: "2026-02-22", orderTime: "02:45 PM", doctor: "Dr. Ibrahim", orderType: "Medical Procedure", description: "IV fluids, oxygen therapy", status: "In Progress", priority: "Emergency" },
];

function StatusBadge({ status }: { status: DoctorOrder["status"] }) {
  const map: Record<DoctorOrder["status"], string> = {
    Pending: "badge-warning",
    "In Progress": "badge-info",
    Completed: "badge-success",
  };
  return <span className={map[status]}>{status}</span>;
}

function PriorityBadge({ priority }: { priority: DoctorOrder["priority"] }) {
  const map: Record<DoctorOrder["priority"], string> = {
    "Normal": "bg-blue-100 text-blue-700",
    "Urgent": "bg-orange-100 text-orange-700",
    "Emergency": "bg-red-100 text-red-700",
  };
  return <Badge className={map[priority]}>{priority}</Badge>;
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

export function DoctorOrdersPage() {
  const [search, setSearch] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [modalOpen, setModalOpen] = useState(false);

  const filtered = DOCTOR_ORDERS.filter(
    (o) =>
      (o.patientName.toLowerCase().includes(search.toLowerCase()) ||
        o.id.toLowerCase().includes(search.toLowerCase())) &&
      (priorityFilter === "all" || o.priority === priorityFilter)
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Doctor Orders (CPOE)</h1>
          <p className="text-sm text-muted-foreground">Computerized Physician Order Entry</p>
        </div>
        <Button className="gap-2 self-start" onClick={() => setModalOpen(true)}>
          <Plus className="h-4 w-4" /> New Order
        </Button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Orders" value={DOCTOR_ORDERS.length} icon={ClipboardList} />
        <StatCard label="Pending" value={DOCTOR_ORDERS.filter((o) => o.status === "Pending").length} icon={Clock} />
        <StatCard label="Urgent" value={DOCTOR_ORDERS.filter((o) => o.priority === "Urgent").length} icon={AlertCircle} />
        <StatCard label="Completed" value={DOCTOR_ORDERS.filter((o) => o.status === "Completed").length} icon={CheckCircle2} />
      </div>

      <div className="rounded-xl border border-border bg-card p-4 space-y-3">
        <div className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by patient name or order ID..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
          <select 
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="px-3 py-2 border border-border rounded-lg text-foreground bg-background"
          >
            <option value="all">All Priority</option>
            <option value="Normal">Normal</option>
            <option value="Urgent">Urgent</option>
            <option value="Emergency">Emergency</option>
          </select>
        </div>
      </div>

      <div className="rounded-xl border border-border bg-card overflow-hidden" style={{ boxShadow: "var(--shadow-sm)" }}>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order ID</TableHead>
              <TableHead>Patient</TableHead>
              <TableHead>Order Type</TableHead>
              <TableHead>Doctor</TableHead>
              <TableHead>Time</TableHead>
              <TableHead>Priority</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-12"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((order) => (
              <TableRow key={order.id}>
                <TableCell className="font-medium">{order.id}</TableCell>
                <TableCell>
                  <div>
                    <p className="font-medium">{order.patientName}</p>
                    <p className="text-xs text-muted-foreground">{order.patientId}</p>
                  </div>
                </TableCell>
                <TableCell>
                  <div>
                    <p className="font-medium text-sm">{order.orderType}</p>
                    <p className="text-xs text-muted-foreground">{order.description}</p>
                  </div>
                </TableCell>
                <TableCell>{order.doctor}</TableCell>
                <TableCell className="text-sm">{order.orderTime}</TableCell>
                <TableCell>
                  <PriorityBadge priority={order.priority} />
                </TableCell>
                <TableCell>
                  <StatusBadge status={order.status} />
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
                      <DropdownMenuItem>Mark Completed</DropdownMenuItem>
                      <DropdownMenuItem>Modify Order</DropdownMenuItem>
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
            <DialogTitle>New Doctor Order</DialogTitle>
            <DialogDescription>Create a computerized physician order</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Patient</Label>
              <BaseInput placeholder="Search patient..." />
            </div>
            <div>
              <Label>Order Type</Label>
              <select className="w-full px-3 py-2 border border-border rounded-lg text-foreground bg-background">
                <option>Lab Test</option>
                <option>Medication</option>
                <option>Imaging</option>
                <option>Medical Procedure</option>
              </select>
            </div>
            <div>
              <Label>Description</Label>
              <textarea className="w-full px-3 py-2 border border-border rounded-lg text-foreground bg-background" placeholder="Order details..." />
            </div>
            <div>
              <Label>Priority</Label>
              <select className="w-full px-3 py-2 border border-border rounded-lg text-foreground bg-background">
                <option>Normal</option>
                <option>Urgent</option>
                <option>Emergency</option>
              </select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button onClick={() => setModalOpen(false)}>Create Order</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

import { AlertCircle } from "lucide-react";
