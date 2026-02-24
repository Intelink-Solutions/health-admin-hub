import { useState } from "react";
import {
  ShoppingCart, Search, Plus, TrendingUp, DollarSign, Package, MoreHorizontal,
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

type PharmacySale = {
  id: string;
  date: string;
  customerName: string;
  customerType: "Patient" | "Pharmacy" | "Hospital";
  items: string;
  quantity: number;
  totalAmount: number;
  paymentMethod: string;
  status: "Completed" | "Pending" | "Cancelled";
};

const PHARMACY_SALES: PharmacySale[] = [
  { id: "SALE-001", date: "2026-02-22", customerName: "Aisha Mohammed", customerType: "Patient", items: "Amoxicillin, Paracetamol", quantity: 3, totalAmount: 15000, paymentMethod: "Cash", status: "Completed" },
  { id: "SALE-002", date: "2026-02-22", customerName: "City Pharmacy", customerType: "Pharmacy", items: "Metformin 500 pack", quantity: 2, totalAmount: 35000, paymentMethod: "Transfer", status: "Completed" },
  { id: "SALE-003", date: "2026-02-21", customerName: "James Okafor", customerType: "Patient", items: "Lisinopril, Atorvastatin", quantity: 2, totalAmount: 28000, paymentMethod: "Card", status: "Completed" },
  { id: "SALE-004", date: "2026-02-21", customerName: "Central Hospital", customerType: "Hospital", items: "Insulin vials (10 pack)", quantity: 1, totalAmount: 50000, paymentMethod: "Credit", status: "Pending" },
];

function StatusBadge({ status }: { status: PharmacySale["status"] }) {
  const map: Record<PharmacySale["status"], string> = {
    Completed: "badge-success",
    Pending: "badge-warning",
    Cancelled: "badge-danger",
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

export function PharmacySalesPage() {
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);

  const filtered = PHARMACY_SALES.filter(
    (s) =>
      s.customerName.toLowerCase().includes(search.toLowerCase()) ||
      s.id.toLowerCase().includes(search.toLowerCase())
  );

  const totalRevenue = PHARMACY_SALES.reduce((sum, s) => sum + s.totalAmount, 0);
  const todaySales = PHARMACY_SALES.filter((s) => s.date === "2026-02-22").length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Pharmacy Sales</h1>
          <p className="text-sm text-muted-foreground">Track pharmacy transactions and revenue</p>
        </div>
        <Button className="gap-2 self-start" onClick={() => setModalOpen(true)}>
          <Plus className="h-4 w-4" /> New Sale
        </Button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Sales" value={PHARMACY_SALES.length} icon={ShoppingCart} />
        <StatCard label="Today's Sales" value={todaySales} icon={TrendingUp} />
        <StatCard label="Total Revenue" value={`₦${(totalRevenue / 1000).toFixed(0)}K`} icon={DollarSign} />
        <StatCard label="Pending" value={PHARMACY_SALES.filter((s) => s.status === "Pending").length} icon={Package} />
      </div>

      <div className="rounded-xl border border-border bg-card p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by customer name or sale ID..."
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
              <TableHead>Sale ID</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Items</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Payment</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-12"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((sale) => (
              <TableRow key={sale.id}>
                <TableCell className="font-medium">{sale.id}</TableCell>
                <TableCell>{sale.customerName}</TableCell>
                <TableCell>
                  <Badge variant="outline">{sale.customerType}</Badge>
                </TableCell>
                <TableCell className="text-sm">{sale.items}</TableCell>
                <TableCell className="text-sm font-medium">₦{sale.totalAmount.toLocaleString()}</TableCell>
                <TableCell className="text-sm">{sale.paymentMethod}</TableCell>
                <TableCell>
                  <StatusBadge status={sale.status} />
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
                      <DropdownMenuItem>Print</DropdownMenuItem>
                      <DropdownMenuItem>Refund</DropdownMenuItem>
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
            <DialogTitle>New Sale Transaction</DialogTitle>
            <DialogDescription>Record a pharmacy sale</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Customer Name</Label>
              <BaseInput placeholder="Customer name" />
            </div>
            <div>
              <Label>Customer Type</Label>
              <select className="w-full px-3 py-2 border border-border rounded-lg text-foreground bg-background">
                <option>Patient</option>
                <option>Pharmacy</option>
                <option>Hospital</option>
              </select>
            </div>
            <div>
              <Label>Items</Label>
              <BaseInput placeholder="Drug names" />
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
                <option>Transfer</option>
                <option>Credit</option>
              </select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button onClick={() => setModalOpen(false)}>Save Sale</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
