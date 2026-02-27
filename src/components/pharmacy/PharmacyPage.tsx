import { useState, useMemo } from "react";
import {
  Package, Search, Plus, Pill, AlertTriangle, CheckCircle,
  XCircle, MoreHorizontal, ArrowUpDown, Calendar, ShoppingCart,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription,
} from "@/components/ui/dialog";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";

/* ── Types ── */
type Drug = {
  id: string;
  name: string;
  genericName: string;
  category: string;
  batchNo: string;
  stock: number;
  maxStock: number;
  unit: string;
  price: number;
  expiryDate: string;
  supplier: string;
  status: "In Stock" | "Low Stock" | "Out of Stock" | "Expired";
};

/* ── Mock data ── */
const DRUGS: Drug[] = [
  { id: "DRG-001", name: "Amoxicillin 500mg", genericName: "Amoxicillin", category: "Antibiotics", batchNo: "BT-2024-001", stock: 450, maxStock: 500, unit: "Capsules", price: 12.50, expiryDate: "2026-08-15", supplier: "PharmaCorp Ltd", status: "In Stock" },
  { id: "DRG-002", name: "Paracetamol 500mg", genericName: "Acetaminophen", category: "Analgesics", batchNo: "BT-2024-012", stock: 1200, maxStock: 2000, unit: "Tablets", price: 3.00, expiryDate: "2027-03-20", supplier: "MediSupply Inc", status: "In Stock" },
  { id: "DRG-003", name: "Metformin 850mg", genericName: "Metformin HCl", category: "Antidiabetics", batchNo: "BT-2024-045", stock: 30, maxStock: 400, unit: "Tablets", price: 8.75, expiryDate: "2026-11-10", supplier: "GlucoPharm", status: "Low Stock" },
  { id: "DRG-004", name: "Omeprazole 20mg", genericName: "Omeprazole", category: "Gastrointestinal", batchNo: "BT-2023-098", stock: 0, maxStock: 300, unit: "Capsules", price: 15.00, expiryDate: "2026-01-05", supplier: "GastroMed", status: "Out of Stock" },
  { id: "DRG-005", name: "Lisinopril 10mg", genericName: "Lisinopril", category: "Antihypertensives", batchNo: "BT-2024-023", stock: 280, maxStock: 350, unit: "Tablets", price: 10.25, expiryDate: "2027-06-30", supplier: "CardioPharm", status: "In Stock" },
  { id: "DRG-006", name: "Ciprofloxacin 250mg", genericName: "Ciprofloxacin", category: "Antibiotics", batchNo: "BT-2023-077", stock: 15, maxStock: 200, unit: "Tablets", price: 18.00, expiryDate: "2025-12-01", supplier: "PharmaCorp Ltd", status: "Expired" },
  { id: "DRG-007", name: "Atorvastatin 20mg", genericName: "Atorvastatin", category: "Statins", batchNo: "BT-2024-056", stock: 520, maxStock: 600, unit: "Tablets", price: 22.00, expiryDate: "2027-09-15", supplier: "LipidCare", status: "In Stock" },
  { id: "DRG-008", name: "Salbutamol Inhaler", genericName: "Albuterol", category: "Respiratory", batchNo: "BT-2024-034", stock: 45, maxStock: 150, unit: "Inhalers", price: 35.00, expiryDate: "2026-05-20", supplier: "BreathEasy", status: "Low Stock" },
  { id: "DRG-009", name: "Ibuprofen 400mg", genericName: "Ibuprofen", category: "Analgesics", batchNo: "BT-2024-089", stock: 800, maxStock: 1000, unit: "Tablets", price: 5.50, expiryDate: "2027-01-10", supplier: "MediSupply Inc", status: "In Stock" },
  { id: "DRG-010", name: "Diazepam 5mg", genericName: "Diazepam", category: "Sedatives", batchNo: "BT-2024-015", stock: 0, maxStock: 100, unit: "Tablets", price: 28.00, expiryDate: "2026-07-25", supplier: "NeuroPharm", status: "Out of Stock" },
];

const CATEGORIES = [...new Set(DRUGS.map((d) => d.category))];
const STATUSES: Drug["status"][] = ["In Stock", "Low Stock", "Out of Stock", "Expired"];
const PAGE_SIZE = 8;

/* ── Helpers ── */
function statusBadgeClass(s: Drug["status"]) {
  switch (s) {
    case "In Stock":     return "bg-emerald-500/15 text-emerald-400 border-emerald-500/30";
    case "Low Stock":    return "bg-amber-500/15 text-amber-400 border-amber-500/30";
    case "Out of Stock": return "bg-red-500/15 text-red-400 border-red-500/30";
    case "Expired":      return "bg-gray-500/15 text-gray-400 border-gray-500/30";
  }
}

function stockColor(stock: number, max: number) {
  const pct = (stock / max) * 100;
  if (pct === 0) return "bg-red-500";
  if (pct <= 20) return "bg-amber-500";
  return "bg-emerald-500";
}

function daysUntilExpiry(date: string) {
  return Math.ceil((new Date(date).getTime() - Date.now()) / 86_400_000);
}

function expiryBadge(date: string) {
  const days = daysUntilExpiry(date);
  if (days <= 0) return <Badge className="bg-red-500/15 text-red-400 border-red-500/30">Expired</Badge>;
  if (days <= 90) return <Badge className="bg-amber-500/15 text-amber-400 border-amber-500/30">{days}d left</Badge>;
  return <Badge className="bg-emerald-500/15 text-emerald-400 border-emerald-500/30">{days}d left</Badge>;
}

function StatCard({ label, value, icon: Icon, iconClass }: { label: string; value: number; icon: React.ElementType; iconClass: string }) {
  return (
    <Card className="bg-card border-border">
      <CardContent className="p-4 flex items-center gap-3">
        <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${iconClass}`}>
          <Icon className="h-5 w-5" />
        </div>
        <div>
          <p className="text-2xl font-bold text-foreground">{value}</p>
          <p className="text-xs text-muted-foreground">{label}</p>
        </div>
      </CardContent>
    </Card>
  );
}

/* ── Dispense Modal ── */
function DispenseModal({ drug, open, onOpenChange }: { drug: Drug | null; open: boolean; onOpenChange: (o: boolean) => void }) {
  const [qty, setQty] = useState("1");
  const [patient, setPatient] = useState("");

  if (!drug) return null;
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-card border-border">
        <DialogHeader>
          <DialogTitle className="text-foreground">Dispense Medication</DialogTitle>
          <DialogDescription className="text-muted-foreground">Fill out the details to dispense {drug.name}.</DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div className="rounded-lg bg-muted/30 p-3 space-y-1">
            <p className="text-sm font-semibold text-foreground">{drug.name}</p>
            <p className="text-xs text-muted-foreground">Batch: {drug.batchNo} · Available: {drug.stock} {drug.unit}</p>
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">Patient Name / ID</Label>
            <Input placeholder="e.g. John Doe or PAT-001" value={patient} onChange={(e) => setPatient(e.target.value)} className="bg-background border-border" />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">Quantity ({drug.unit})</Label>
            <Input type="number" min={1} max={drug.stock} value={qty} onChange={(e) => setQty(e.target.value)} className="bg-background border-border" />
          </div>
          <div className="rounded-lg bg-muted/30 p-3 flex justify-between text-sm">
            <span className="text-muted-foreground">Total Cost</span>
            <span className="font-semibold text-foreground">₵{(drug.price * Number(qty || 0)).toFixed(2)}</span>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={() => onOpenChange(false)} disabled={!patient || Number(qty) < 1 || Number(qty) > drug.stock}>
            <ShoppingCart className="h-4 w-4 mr-1" /> Dispense
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

/* ── Main Page ── */
export function PharmacyPage() {
  const [search, setSearch] = useState("");
  const [catFilter, setCatFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [dispenseDrug, setDispenseDrug] = useState<Drug | null>(null);

  const filtered = useMemo(() => {
    const s = search.toLowerCase();
    return DRUGS.filter((d) => {
      if (s && !d.name.toLowerCase().includes(s) && !d.id.toLowerCase().includes(s) && !d.genericName.toLowerCase().includes(s)) return false;
      if (catFilter !== "all" && d.category !== catFilter) return false;
      if (statusFilter !== "all" && d.status !== statusFilter) return false;
      return true;
    });
  }, [search, catFilter, statusFilter]);

  const paginated = useMemo(() => filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE), [filtered, page]);
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));

  const counts = useMemo(() => ({
    total: DRUGS.length,
    inStock: DRUGS.filter((d) => d.status === "In Stock").length,
    lowStock: DRUGS.filter((d) => d.status === "Low Stock").length,
    expired: DRUGS.filter((d) => d.status === "Expired").length,
  }), []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Pharmacy Inventory</h1>
          <p className="text-sm text-muted-foreground">Manage drug inventory, stock levels, and dispensing</p>
        </div>
        <Button size="sm"><Plus className="h-4 w-4 mr-1" /> Add Drug</Button>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Drugs" value={counts.total} icon={Package} iconClass="bg-primary/20 text-primary" />
        <StatCard label="In Stock" value={counts.inStock} icon={CheckCircle} iconClass="bg-emerald-500/20 text-emerald-400" />
        <StatCard label="Low Stock" value={counts.lowStock} icon={AlertTriangle} iconClass="bg-amber-500/20 text-amber-400" />
        <StatCard label="Expired" value={counts.expired} icon={XCircle} iconClass="bg-red-500/20 text-red-400" />
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search drug name, ID, or generic name…" className="pl-9 bg-background border-border" value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} />
        </div>
        <Select value={catFilter} onValueChange={(v) => { setCatFilter(v); setPage(1); }}>
          <SelectTrigger className="w-full sm:w-44 bg-background border-border"><SelectValue placeholder="Category" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {CATEGORIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={statusFilter} onValueChange={(v) => { setStatusFilter(v); setPage(1); }}>
          <SelectTrigger className="w-full sm:w-40 bg-background border-border"><SelectValue placeholder="Status" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            {STATUSES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <Card className="bg-card border-border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-border">
              <TableHead className="text-muted-foreground">Drug</TableHead>
              <TableHead className="text-muted-foreground">Category</TableHead>
              <TableHead className="text-muted-foreground">Batch</TableHead>
              <TableHead className="text-muted-foreground">Stock Level</TableHead>
              <TableHead className="text-muted-foreground">Price</TableHead>
              <TableHead className="text-muted-foreground">Expiry</TableHead>
              <TableHead className="text-muted-foreground">Status</TableHead>
              <TableHead className="text-muted-foreground w-10" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginated.map((d) => (
              <TableRow key={d.id} className="border-border">
                <TableCell>
                  <div>
                    <p className="text-sm font-medium text-foreground">{d.name}</p>
                    <p className="text-xs text-muted-foreground">{d.genericName} · {d.id}</p>
                  </div>
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">{d.category}</TableCell>
                <TableCell className="text-sm text-muted-foreground font-mono">{d.batchNo}</TableCell>
                <TableCell>
                  <div className="space-y-1 min-w-[120px]">
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">{d.stock}/{d.maxStock}</span>
                      <span className="text-muted-foreground">{d.unit}</span>
                    </div>
                    <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
                      <div className={`h-full rounded-full transition-all ${stockColor(d.stock, d.maxStock)}`} style={{ width: `${(d.stock / d.maxStock) * 100}%` }} />
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-sm font-medium text-foreground">₵{d.price.toFixed(2)}</TableCell>
                <TableCell>{expiryBadge(d.expiryDate)}</TableCell>
                <TableCell><Badge className={statusBadgeClass(d.status)}>{d.status}</Badge></TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8"><MoreHorizontal className="h-4 w-4" /></Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="bg-card border-border">
                      <DropdownMenuItem onClick={() => setDispenseDrug(d)} disabled={d.stock === 0 || d.status === "Expired"}>
                        <ShoppingCart className="h-4 w-4 mr-2" /> Dispense
                      </DropdownMenuItem>
                      <DropdownMenuItem><Pill className="h-4 w-4 mr-2" /> View Details</DropdownMenuItem>
                      <DropdownMenuItem><ArrowUpDown className="h-4 w-4 mr-2" /> Restock</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
            {paginated.length === 0 && (
              <TableRow><TableCell colSpan={8} className="text-center py-10 text-muted-foreground">No drugs found.</TableCell></TableRow>
            )}
          </TableBody>
        </Table>
      </Card>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <p className="text-xs text-muted-foreground">Showing {paginated.length} of {filtered.length} drugs</p>
        <div className="flex gap-1">
          <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage(page - 1)}>Previous</Button>
          <Button variant="outline" size="sm" disabled={page >= totalPages} onClick={() => setPage(page + 1)}>Next</Button>
        </div>
      </div>

      {/* Dispense Modal */}
      <DispenseModal drug={dispenseDrug} open={!!dispenseDrug} onOpenChange={(o) => !o && setDispenseDrug(null)} />
    </div>
  );
}
