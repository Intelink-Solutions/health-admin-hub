import { useState } from "react";
import {
  Receipt, CreditCard, Shield, TrendingUp, Search,
  Filter, Plus, MoreHorizontal, ArrowUpRight, ArrowDownRight,
  DollarSign, Clock, CheckCircle2, XCircle, AlertCircle,
  ChevronLeft, ChevronRight, Eye, Download, Send,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Table, TableHeader, TableRow, TableHead,
  TableBody, TableCell,
} from "@/components/ui/table";
import {
  Select, SelectTrigger, SelectValue, SelectContent, SelectItem,
} from "@/components/ui/select";
import {
  DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

/* ── Mock data ── */
const INVOICES = [
  { id: "INV-2024-001", patient: "Ahmed Hassan", patientId: "PT-1001", dept: "Cardiology", amount: 4500, paid: 4500, status: "paid", date: "2024-12-18", due: "2025-01-18", method: "Insurance" },
  { id: "INV-2024-002", patient: "Fatima Al-Rashid", patientId: "PT-1002", dept: "Orthopedics", amount: 12800, paid: 8000, status: "partial", date: "2024-12-17", due: "2025-01-17", method: "Cash + Insurance" },
  { id: "INV-2024-003", patient: "Omar Yusuf", patientId: "PT-1003", dept: "Emergency", amount: 2200, paid: 0, status: "pending", date: "2024-12-16", due: "2025-01-16", method: "Pending" },
  { id: "INV-2024-004", patient: "Layla Ibrahim", patientId: "PT-1004", dept: "Pediatrics", amount: 3600, paid: 3600, status: "paid", date: "2024-12-15", due: "2025-01-15", method: "Card" },
  { id: "INV-2024-005", patient: "Khalid Mansoor", patientId: "PT-1005", dept: "Neurology", amount: 18500, paid: 0, status: "overdue", date: "2024-11-20", due: "2024-12-20", method: "Insurance" },
  { id: "INV-2024-006", patient: "Noura Saleh", patientId: "PT-1006", dept: "Dermatology", amount: 950, paid: 950, status: "paid", date: "2024-12-14", due: "2025-01-14", method: "Cash" },
  { id: "INV-2024-007", patient: "Samir Qasim", patientId: "PT-1007", dept: "Oncology", amount: 32000, paid: 24000, status: "partial", date: "2024-12-12", due: "2025-01-12", method: "Insurance" },
  { id: "INV-2024-008", patient: "Hana Farouk", patientId: "PT-1008", dept: "OB/GYN", amount: 7200, paid: 0, status: "pending", date: "2024-12-19", due: "2025-01-19", method: "Pending" },
];

const CLAIMS = [
  { id: "CLM-4501", patient: "Ahmed Hassan", provider: "National Health Insurance", amount: 4500, status: "approved", submitted: "2024-12-10", resolved: "2024-12-16" },
  { id: "CLM-4502", patient: "Fatima Al-Rashid", provider: "Gulf Medical Cover", amount: 8000, status: "processing", submitted: "2024-12-12", resolved: "—" },
  { id: "CLM-4503", patient: "Khalid Mansoor", provider: "National Health Insurance", amount: 18500, status: "rejected", submitted: "2024-11-15", resolved: "2024-12-01" },
  { id: "CLM-4504", patient: "Samir Qasim", provider: "Premium Care Plan", amount: 24000, status: "approved", submitted: "2024-12-05", resolved: "2024-12-14" },
  { id: "CLM-4505", patient: "Layla Ibrahim", provider: "Family Shield Insurance", amount: 3600, status: "processing", submitted: "2024-12-17", resolved: "—" },
  { id: "CLM-4506", patient: "Omar Yusuf", provider: "National Health Insurance", amount: 2200, status: "submitted", submitted: "2024-12-18", resolved: "—" },
];

/* ── Helpers ── */
function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { cls: string; label: string }> = {
    paid:       { cls: "badge-success", label: "Paid" },
    partial:    { cls: "badge-warning", label: "Partial" },
    pending:    { cls: "badge-info",    label: "Pending" },
    overdue:    { cls: "badge-danger",  label: "Overdue" },
    approved:   { cls: "badge-success", label: "Approved" },
    processing: { cls: "badge-info",    label: "Processing" },
    rejected:   { cls: "badge-danger",  label: "Rejected" },
    submitted:  { cls: "badge-neutral", label: "Submitted" },
  };
  const s = map[status] ?? { cls: "badge-neutral", label: status };
  return <span className={s.cls}>{s.label}</span>;
}

interface StatCardProps {
  title: string;
  value: string;
  sub: string;
  icon: React.ElementType;
  iconBg: string;
  trend?: "up" | "down";
  trendValue?: string;
}

function StatCard({ title, value, sub, icon: Icon, iconBg, trend, trendValue }: StatCardProps) {
  return (
    <div className="stat-card">
      <div className="flex items-center justify-between">
        <div className={`h-10 w-10 rounded-lg ${iconBg} flex items-center justify-center`}>
          <Icon className="h-5 w-5 text-primary-foreground" />
        </div>
        {trend && (
          <span className={`flex items-center gap-0.5 text-xs font-semibold ${trend === "up" ? "text-[hsl(var(--success))]" : "text-[hsl(var(--destructive))]"}`}>
            {trend === "up" ? <ArrowUpRight className="h-3.5 w-3.5" /> : <ArrowDownRight className="h-3.5 w-3.5" />}
            {trendValue}
          </span>
        )}
      </div>
      <div>
        <p className="text-2xl font-bold text-foreground">{value}</p>
        <p className="text-xs text-muted-foreground mt-0.5">{sub}</p>
      </div>
      <p className="text-xs font-medium text-muted-foreground">{title}</p>
    </div>
  );
}

/* ── Revenue mini-chart (bar visualization) ── */
const REVENUE_MONTHS = [
  { month: "Jul", revenue: 82000, claims: 54000 },
  { month: "Aug", revenue: 95000, claims: 68000 },
  { month: "Sep", revenue: 78000, claims: 52000 },
  { month: "Oct", revenue: 110000, claims: 74000 },
  { month: "Nov", revenue: 98000, claims: 62000 },
  { month: "Dec", revenue: 125000, claims: 88000 },
];

function RevenueChart() {
  const max = Math.max(...REVENUE_MONTHS.map((m) => m.revenue));
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-semibold">Revenue vs Claims (6 mo)</CardTitle>
          <Badge variant="secondary" className="text-[10px]">2024 H2</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-end gap-3 h-36">
          {REVENUE_MONTHS.map((m) => (
            <div key={m.month} className="flex-1 flex flex-col items-center gap-1">
              <div className="w-full flex gap-0.5 items-end" style={{ height: "100%" }}>
                <div
                  className="flex-1 rounded-t bg-primary/80 transition-all"
                  style={{ height: `${(m.revenue / max) * 100}%` }}
                />
                <div
                  className="flex-1 rounded-t bg-secondary/60 transition-all"
                  style={{ height: `${(m.claims / max) * 100}%` }}
                />
              </div>
              <span className="text-[10px] text-muted-foreground font-medium">{m.month}</span>
            </div>
          ))}
        </div>
        <div className="flex items-center gap-4 mt-3 pt-3 border-t border-border">
          <div className="flex items-center gap-1.5">
            <div className="h-2.5 w-2.5 rounded-sm bg-primary/80" />
            <span className="text-[10px] text-muted-foreground">Revenue</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="h-2.5 w-2.5 rounded-sm bg-secondary/60" />
            <span className="text-[10px] text-muted-foreground">Claims</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

/* ── Claim breakdown card ── */
function ClaimSummaryCard() {
  const approved = CLAIMS.filter((c) => c.status === "approved").length;
  const processing = CLAIMS.filter((c) => c.status === "processing" || c.status === "submitted").length;
  const rejected = CLAIMS.filter((c) => c.status === "rejected").length;
  const total = CLAIMS.length;

  const segments = [
    { label: "Approved", count: approved, color: "bg-[hsl(var(--success))]" },
    { label: "In Process", count: processing, color: "bg-primary" },
    { label: "Rejected", count: rejected, color: "bg-destructive" },
  ];

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-semibold">Claims Overview</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Progress bar */}
        <div className="flex h-2.5 rounded-full overflow-hidden bg-muted">
          {segments.map((s) => (
            <div
              key={s.label}
              className={`${s.color} transition-all`}
              style={{ width: `${(s.count / total) * 100}%` }}
            />
          ))}
        </div>
        <div className="space-y-2">
          {segments.map((s) => (
            <div key={s.label} className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <div className={`h-2 w-2 rounded-full ${s.color}`} />
                <span className="text-muted-foreground">{s.label}</span>
              </div>
              <span className="font-semibold text-foreground">{s.count}</span>
            </div>
          ))}
        </div>
        <div className="pt-2 border-t border-border">
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">Total Claims Value</span>
            <span className="text-sm font-bold text-foreground">
              ₵{CLAIMS.reduce((a, c) => a + c.amount, 0).toLocaleString()}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

/* ── Main Page ── */
export function BillingPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(1);
  const perPage = 6;

  /* filter invoices */
  const filtered = INVOICES.filter((inv) => {
    const matchSearch =
      inv.patient.toLowerCase().includes(search.toLowerCase()) ||
      inv.id.toLowerCase().includes(search.toLowerCase()) ||
      inv.patientId.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "all" || inv.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const totalPages = Math.ceil(filtered.length / perPage);
  const paged = filtered.slice((page - 1) * perPage, page * perPage);

  const totalRevenue = INVOICES.reduce((a, i) => a + i.amount, 0);
  const totalCollected = INVOICES.reduce((a, i) => a + i.paid, 0);
  const totalPending = totalRevenue - totalCollected;
  const overdueCount = INVOICES.filter((i) => i.status === "overdue").length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Billing & Payments</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Manage invoices, payments, and insurance claims</p>
        </div>
        <Button className="gap-2">
          <Plus className="h-4 w-4" /> New Invoice
        </Button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Revenue" value={`₵${totalRevenue.toLocaleString()}`} sub="All invoices" icon={DollarSign} iconBg="gradient-primary" trend="up" trendValue="12.5%" />
        <StatCard title="Collected" value={`₵${totalCollected.toLocaleString()}`} sub="Payments received" icon={CheckCircle2} iconBg="bg-[hsl(var(--success))]" trend="up" trendValue="8.3%" />
        <StatCard title="Outstanding" value={`₵${totalPending.toLocaleString()}`} sub="Awaiting payment" icon={Clock} iconBg="bg-[hsl(var(--warning))]" trend="down" trendValue="3.2%" />
        <StatCard title="Overdue" value={String(overdueCount)} sub="Past due date" icon={AlertCircle} iconBg="bg-destructive" />
      </div>

      {/* Tabs: Invoices / Claims */}
      <Tabs defaultValue="invoices">
        <TabsList>
          <TabsTrigger value="invoices" className="gap-1.5">
            <Receipt className="h-3.5 w-3.5" /> Invoices
          </TabsTrigger>
          <TabsTrigger value="claims" className="gap-1.5">
            <Shield className="h-3.5 w-3.5" /> Insurance Claims
          </TabsTrigger>
        </TabsList>

        {/* ── Invoices tab ── */}
        <TabsContent value="invoices" className="space-y-4">
          {/* Filters */}
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by patient, invoice ID…"
                    value={search}
                    onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                    className="pl-9"
                  />
                </div>
                <Select value={statusFilter} onValueChange={(v) => { setStatusFilter(v); setPage(1); }}>
                  <SelectTrigger className="w-full sm:w-40">
                    <Filter className="h-3.5 w-3.5 mr-1.5 text-muted-foreground" />
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="paid">Paid</SelectItem>
                    <SelectItem value="partial">Partial</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="overdue">Overdue</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Invoice table */}
          <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Invoice</TableHead>
                  <TableHead>Patient</TableHead>
                  <TableHead className="hidden md:table-cell">Department</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                  <TableHead className="text-right hidden sm:table-cell">Paid</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="hidden lg:table-cell">Method</TableHead>
                  <TableHead className="hidden lg:table-cell">Due Date</TableHead>
                  <TableHead className="w-10" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {paged.map((inv) => (
                  <TableRow key={inv.id}>
                    <TableCell className="font-medium text-xs">{inv.id}</TableCell>
                    <TableCell>
                      <div>
                        <p className="text-sm font-medium text-foreground">{inv.patient}</p>
                        <p className="text-[11px] text-muted-foreground">{inv.patientId}</p>
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell text-xs text-muted-foreground">{inv.dept}</TableCell>
                    <TableCell className="text-right font-semibold text-sm">₵{inv.amount.toLocaleString()}</TableCell>
                    <TableCell className="text-right text-sm hidden sm:table-cell">₵{inv.paid.toLocaleString()}</TableCell>
                    <TableCell><StatusBadge status={inv.status} /></TableCell>
                    <TableCell className="hidden lg:table-cell text-xs text-muted-foreground">{inv.method}</TableCell>
                    <TableCell className="hidden lg:table-cell text-xs text-muted-foreground">{inv.due}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem><Eye className="h-3.5 w-3.5 mr-2" /> View Invoice</DropdownMenuItem>
                          <DropdownMenuItem><Download className="h-3.5 w-3.5 mr-2" /> Download PDF</DropdownMenuItem>
                          <DropdownMenuItem><Send className="h-3.5 w-3.5 mr-2" /> Send Reminder</DropdownMenuItem>
                          <DropdownMenuItem><CreditCard className="h-3.5 w-3.5 mr-2" /> Record Payment</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {/* Pagination */}
            <div className="flex items-center justify-between px-4 py-3 border-t border-border">
              <p className="text-xs text-muted-foreground">
                {filtered.length === 0 ? "No results" : `${(page - 1) * perPage + 1}–${Math.min(page * perPage, filtered.length)} of ${filtered.length}`}
              </p>
              <div className="flex items-center gap-1">
                <Button variant="outline" size="icon" className="h-7 w-7" disabled={page <= 1} onClick={() => setPage(page - 1)}>
                  <ChevronLeft className="h-3.5 w-3.5" />
                </Button>
                {Array.from({ length: totalPages }, (_, i) => (
                  <Button
                    key={i}
                    variant={page === i + 1 ? "default" : "outline"}
                    size="icon"
                    className="h-7 w-7 text-xs"
                    onClick={() => setPage(i + 1)}
                  >
                    {i + 1}
                  </Button>
                ))}
                <Button variant="outline" size="icon" className="h-7 w-7" disabled={page >= totalPages} onClick={() => setPage(page + 1)}>
                  <ChevronRight className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          </Card>
        </TabsContent>

        {/* ── Claims tab ── */}
        <TabsContent value="claims" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Claims table */}
            <Card className="lg:col-span-2">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-semibold">Insurance Claims Tracker</CardTitle>
              </CardHeader>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Claim ID</TableHead>
                    <TableHead>Patient</TableHead>
                    <TableHead className="hidden md:table-cell">Provider</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="hidden sm:table-cell">Submitted</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {CLAIMS.map((c) => (
                    <TableRow key={c.id}>
                      <TableCell className="font-medium text-xs">{c.id}</TableCell>
                      <TableCell className="text-sm">{c.patient}</TableCell>
                      <TableCell className="hidden md:table-cell text-xs text-muted-foreground">{c.provider}</TableCell>
                      <TableCell className="text-right font-semibold text-sm">₵{c.amount.toLocaleString()}</TableCell>
                      <TableCell><StatusBadge status={c.status} /></TableCell>
                      <TableCell className="hidden sm:table-cell text-xs text-muted-foreground">{c.submitted}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>

            {/* Sidebar cards */}
            <div className="space-y-4">
              <ClaimSummaryCard />
              <RevenueChart />
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
