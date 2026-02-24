import { useState } from "react";
import {
  BookOpen, Search, Plus, MoreHorizontal, Calendar, DollarSign,
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

type Booking = {
  id: string;
  customerName: string;
  serviceType: string;
  bookingDate: string;
  appointmentDate: string;
  time: string;
  amount: number;
  status: "Pending" | "Confirmed" | "Completed" | "Cancelled";
  paymentStatus: "Paid" | "Pending" | "Failed";
};

const BOOKINGS: Booking[] = [
  { id: "BK-001", customerName: "Aisha Mohammed", serviceType: "Health Screening", bookingDate: "2026-02-21", appointmentDate: "2026-02-27", time: "10:00 AM", amount: 5000, status: "Confirmed", paymentStatus: "Paid" },
  { id: "BK-002", customerName: "John Okafor", serviceType: "Consultation", bookingDate: "2026-02-22", appointmentDate: "2026-02-24", time: "02:00 PM", amount: 2500, status: "Confirmed", paymentStatus: "Paid" },
  { id: "BK-003", customerName: "Fatima Bello", serviceType: "Home Visit", bookingDate: "2026-02-22", appointmentDate: "2026-02-25", time: "11:00 AM", amount: 8000, status: "Pending", paymentStatus: "Pending" },
  { id: "BK-004", customerName: "Emeka Nwosu", serviceType: "Lab Tests", bookingDate: "2026-02-20", appointmentDate: "2026-02-23", time: "09:00 AM", amount: 3500, status: "Completed", paymentStatus: "Paid" },
];

function StatusBadge({ status }: { status: Booking["status"] }) {
  const map: Record<Booking["status"], string> = {
    Pending: "badge-warning",
    Confirmed: "badge-info",
    Completed: "badge-success",
    Cancelled: "badge-danger",
  };
  return <span className={map[status]}>{status}</span>;
}

function PaymentBadge({ status }: { status: Booking["paymentStatus"] }) {
  const map: Record<Booking["paymentStatus"], string> = {
    Paid: "badge-success",
    Pending: "badge-warning",
    Failed: "badge-danger",
  };
  return <span className={map[status]}>{status}</span>;
}

function StatCard({ label, value, icon: Icon }: { label: string; value: string | number; icon: React.ElementType }) {
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

export function BookingsPage() {
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);

  const filtered = BOOKINGS.filter(
    (b) =>
      b.customerName.toLowerCase().includes(search.toLowerCase()) ||
      b.serviceType.toLowerCase().includes(search.toLowerCase()) ||
      b.id.toLowerCase().includes(search.toLowerCase())
  );

  const totalRevenue = BOOKINGS.filter((b) => b.paymentStatus === "Paid").reduce((sum, b) => sum + b.amount, 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Online Bookings</h1>
          <p className="text-sm text-muted-foreground">Manage service bookings and appointments</p>
        </div>
        <Button className="gap-2 self-start" onClick={() => setModalOpen(true)}>
          <Plus className="h-4 w-4" /> New Booking
        </Button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Bookings" value={BOOKINGS.length} icon={BookOpen} />
        <StatCard label="Confirmed" value={BOOKINGS.filter((b) => b.status === "Confirmed").length} icon={Calendar} />
        <StatCard label="Revenue" value={`₦${(totalRevenue / 1000).toFixed(0)}K`} icon={DollarSign} />
        <StatCard label="Pending Payment" value={BOOKINGS.filter((b) => b.paymentStatus === "Pending").length} icon={DollarSign} />
      </div>

      <div className="rounded-xl border border-border bg-card p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by customer name or service..."
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
              <TableHead>Booking ID</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Service</TableHead>
              <TableHead>Appointment Date</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Payment</TableHead>
              <TableHead className="w-12"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((booking) => (
              <TableRow key={booking.id}>
                <TableCell className="font-medium">{booking.id}</TableCell>
                <TableCell>{booking.customerName}</TableCell>
                <TableCell>{booking.serviceType}</TableCell>
                <TableCell className="text-sm">
                  <div>
                    <p>{booking.appointmentDate}</p>
                    <p className="text-xs text-muted-foreground">{booking.time}</p>
                  </div>
                </TableCell>
                <TableCell className="font-medium">₦{booking.amount.toLocaleString()}</TableCell>
                <TableCell>
                  <StatusBadge status={booking.status} />
                </TableCell>
                <TableCell>
                  <PaymentBadge status={booking.paymentStatus} />
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
                      <DropdownMenuItem>Confirm Booking</DropdownMenuItem>
                      <DropdownMenuItem>Request Payment</DropdownMenuItem>
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
            <DialogTitle>New Booking</DialogTitle>
            <DialogDescription>Create a new service booking</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Customer Name</Label>
              <BaseInput placeholder="Customer name" />
            </div>
            <div>
              <Label>Service Type</Label>
              <select className="w-full px-3 py-2 border border-border rounded-lg text-foreground bg-background">
                <option>Health Screening</option>
                <option>Consultation</option>
                <option>Vaccination</option>
                <option>Lab Tests</option>
              </select>
            </div>
            <div>
              <Label>Appointment Date & Time</Label>
              <BaseInput type="datetime-local" />
            </div>
            <div>
              <Label>Amount</Label>
              <BaseInput type="number" placeholder="0" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button onClick={() => setModalOpen(false)}>Create Booking</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
