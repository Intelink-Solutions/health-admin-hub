import { useState } from "react";
import {
  DollarSign, Search, Plus, Filter, MoreHorizontal, CheckCircle2, Clock,
  TrendingUp, CreditCard,
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

type Payment = {
  id: string;
  invoiceId: string;
  patientName: string;
  amount: number;
  paymentDate: string;
  paymentMethod: "Cash" | "Card" | "Bank Transfer" | "Check" | "Insurance";
  status: "Completed" | "Pending" | "Failed";
  reference: string;
  receivedBy: string;
};

const PAYMENTS: Payment[] = [
  { id: "PAY-001", invoiceId: "INV-2024-001", patientName: "Ahmed Hassan", amount: 4500, paymentDate: "2026-02-22", paymentMethod: "Card", status: "Completed", reference: "TXN-2024-4521", receivedBy: "Grace" },
  { id: "PAY-002", invoiceId: "INV-2024-002", patientName: "Fatima Al-Rashid", amount: 8000, paymentDate: "2026-02-22", paymentMethod: "Bank Transfer", status: "Completed", reference: "TRF-2024-0891", receivedBy: "Ibrahim" },
  { id: "PAY-003", invoiceId: "INV-2024-007", patientName: "Samir Qasim", amount: 24000, paymentDate: "2026-02-21", paymentMethod: "Insurance", status: "Completed", reference: "INS-2024-7821", receivedBy: "Amina" },
  { id: "PAY-004", invoiceId: "INV-2024-004", patientName: "Layla Ibrahim", amount: 3600, paymentDate: "2026-02-20", paymentMethod: "Cash", status: "Completed", reference: "CASH-2024-4421", receivedBy: "Grace" },
  { id: "PAY-005", invoiceId: "INV-2024-003", patientName: "Omar Yusuf", amount: 2200, paymentDate: "", paymentMethod: "Bank Transfer", status: "Pending", reference: "PENDING", receivedBy: "-" },
];

function StatusBadge({ status }: { status: Payment["status"] }) {
  const map: Record<Payment["status"], string> = {
    Completed: "badge-success",
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

export function PaymentsPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [modalOpen, setModalOpen] = useState(false);

  const filtered = PAYMENTS.filter(
    (p) =>
      (p.patientName.toLowerCase().includes(search.toLowerCase()) ||
        p.invoiceId.toLowerCase().includes(search.toLowerCase())) &&
      (statusFilter === "all" || p.status === statusFilter)
  );

  const totalPayments = PAYMENTS.filter((p) => p.status === "Completed").reduce((sum, p) => sum + p.amount, 0);
  const pendingAmount = PAYMENTS.filter((p) => p.status === "Pending").reduce((sum, p) => sum + p.amount, 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Payments</h1>
          <p className="text-sm text-muted-foreground">Track patient payments and transactions</p>
        </div>
        <Button className="gap-2 self-start" onClick={() => setModalOpen(true)}>
          <Plus className="h-4 w-4" /> Record Payment
        </Button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Payments" value={PAYMENTS.length} icon={DollarSign} />
        <StatCard label="Completed" value={`₵${(totalPayments / 1000).toFixed(0)}K`} icon={CreditCard} />
        <StatCard label="Pending" value={`₵${(pendingAmount / 1000).toFixed(0)}K`} icon={Clock} />
        <StatCard label="Success Rate" value="96%" icon={TrendingUp} />
      </div>

      <div className="rounded-xl border border-border bg-card p-4 space-y-3">
        <div className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by patient or invoice..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
          <select 
            value={statusFilter} 
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-border rounded-lg text-foreground bg-background"
          >
            <option value="all">All Status</option>
            <option value="Completed">Completed</option>
            <option value="Pending">Pending</option>
            <option value="Failed">Failed</option>
          </select>
        </div>
      </div>

      <div className="rounded-xl border border-border bg-card overflow-hidden" style={{ boxShadow: "var(--shadow-sm)" }}>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Payment ID</TableHead>
              <TableHead>Invoice</TableHead>
              <TableHead>Patient</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Method</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-12"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((payment) => (
              <TableRow key={payment.id}>
                <TableCell className="font-medium">{payment.id}</TableCell>
                <TableCell>{payment.invoiceId}</TableCell>
                <TableCell>{payment.patientName}</TableCell>
                <TableCell className="font-medium">₵{payment.amount.toLocaleString()}</TableCell>
                <TableCell>
                  <Badge variant="outline">{payment.paymentMethod}</Badge>
                </TableCell>
                <TableCell className="text-sm">{payment.paymentDate || "-"}</TableCell>
                <TableCell>
                  <StatusBadge status={payment.status} />
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>View Receipt</DropdownMenuItem>
                      <DropdownMenuItem>Print Receipt</DropdownMenuItem>
                      <DropdownMenuItem>Email Receipt</DropdownMenuItem>
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
            <DialogTitle>Record Payment</DialogTitle>
            <DialogDescription>Add a new payment transaction</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Invoice ID</Label>
              <BaseInput placeholder="INV-2024-001" />
            </div>
            <div>
              <Label>Patient Name</Label>
              <BaseInput placeholder="Patient name" />
            </div>
            <div>
              <Label>Amount</Label>
              <BaseInput type="number" placeholder="0" />
            </div>
            <div>
              <Label>Payment Method</Label>
              <select className="w-full px-3 py-2 border border-border rounded-lg text-foreground bg-background">
                <option>Cash</option>
                <option>Card</option>
                <option>Bank Transfer</option>
                <option>Check</option>
                <option>Insurance</option>
              </select>
            </div>
            <div>
              <Label>Reference Number</Label>
              <BaseInput placeholder="Transaction reference" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button onClick={() => setModalOpen(false)}>Save Payment</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
