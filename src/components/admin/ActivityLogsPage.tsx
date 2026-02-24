import { useState, useMemo } from "react";
import {
  MoreHorizontal, Search, Filter, Eye, Clock, User,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from "@/components/ui/dialog";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";

type ActivityLog = {
  id: string;
  timestamp: string;
  user: string;
  role: string;
  action: string;
  resource: string;
  status: "Success" | "Failed" | "Pending";
  details: string;
  ipAddress: string;
};

const ACTIVITY_LOGS: ActivityLog[] = [
  { id: "LOG-001", timestamp: "2026-02-23 10:45:32", user: "Dr. Adebayo", role: "Doctor", action: "Created", resource: "Patient Record", status: "Success", details: "Created record for P-10051", ipAddress: "192.168.1.45" },
  { id: "LOG-002", timestamp: "2026-02-23 10:42:15", user: "Amina Bello", role: "Nurse", action: "Updated", resource: "Vitals", status: "Success", details: "Updated vitals for P-10001", ipAddress: "192.168.1.78" },
  { id: "LOG-003", timestamp: "2026-02-23 10:35:44", user: "Ibrahim Musa", role: "Pharmacist", action: "Dispensed", resource: "Medication", status: "Success", details: "Dispensed Amoxicillin to P-10052", ipAddress: "192.168.1.92" },
  { id: "LOG-004", timestamp: "2026-02-23 10:30:22", user: "Grace Obi", role: "Receptionist", action: "Deleted", resource: "Appointment", status: "Failed", details: "Attempted to delete past appointment", ipAddress: "192.168.1.33" },
  { id: "LOG-005", timestamp: "2026-02-23 10:25:11", user: "System Admin", role: "Admin", action: "Accessed", resource: "Reports", status: "Success", details: "Downloaded financial report", ipAddress: "192.168.1.1" },
];

function StatusBadge({ status }: { status: ActivityLog["status"] }) {
  const map: Record<ActivityLog["status"], string> = {
    Success: "badge-success",
    Failed: "badge-danger",
    Pending: "badge-warning",
  };
  return <span className={map[status]}>{status}</span>;
}

function ActionBadge({ action }: { action: string }) {
  const colors: Record<string, string> = {
    Created: "bg-emerald-600/20 text-emerald-600",
    Updated: "bg-blue-600/20 text-blue-600",
    Deleted: "bg-red-600/20 text-red-600",
    Accessed: "bg-amber-600/20 text-amber-600",
    Dispensed: "bg-purple-600/20 text-purple-600",
  };
  return <Badge className={colors[action] || "bg-gray-600/20 text-gray-600"}>{action}</Badge>;
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

export function ActivityLogsPage() {
  const [search, setSearch] = useState("");
  const [actionFilter, setActionFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [selectedLog, setSelectedLog] = useState<ActivityLog | null>(null);

  const filtered = useMemo(() => {
    return ACTIVITY_LOGS.filter((log) => {
      const matchSearch =
        log.user.toLowerCase().includes(search.toLowerCase()) ||
        log.action.toLowerCase().includes(search.toLowerCase()) ||
        log.resource.toLowerCase().includes(search.toLowerCase());
      const matchAction = actionFilter === "all" || log.action === actionFilter;
      const matchStatus = statusFilter === "all" || log.status === statusFilter;
      return matchSearch && matchAction && matchStatus;
    });
  }, [search, actionFilter, statusFilter]);

  const PAGE_SIZE = 10;
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Activity Logs</h1>
        <p className="text-sm text-muted-foreground">Monitor system activities and user actions</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Logs" value={ACTIVITY_LOGS.length} icon={Clock} />
        <StatCard label="Success" value={ACTIVITY_LOGS.filter((l) => l.status === "Success").length} icon={User} />
        <StatCard label="Failed" value={ACTIVITY_LOGS.filter((l) => l.status === "Failed").length} icon={User} />
        <StatCard label="Today" value={ACTIVITY_LOGS.length} icon={Clock} />
      </div>

      <div className="rounded-xl border border-border bg-card p-4 space-y-3">
        <div className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by user, action, or resource..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              className="pl-9"
            />
          </div>
          <select 
            value={statusFilter}
            onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
            className="px-3 py-2 border border-border rounded-lg text-foreground bg-background"
          >
            <option value="all">All Status</option>
            <option value="Success">Success</option>
            <option value="Failed">Failed</option>
          </select>
        </div>
      </div>

      <div className="rounded-xl border border-border bg-card overflow-hidden" style={{ boxShadow: "var(--shadow-sm)" }}>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Timestamp</TableHead>
              <TableHead>User</TableHead>
              <TableHead>Action</TableHead>
              <TableHead>Resource</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>IP Address</TableHead>
              <TableHead className="w-12"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginated.map((log) => (
              <TableRow key={log.id}>
                <TableCell className="text-sm text-muted-foreground">{log.timestamp}</TableCell>
                <TableCell>
                  <div>
                    <p className="font-medium">{log.user}</p>
                    <p className="text-xs text-muted-foreground">{log.role}</p>
                  </div>
                </TableCell>
                <TableCell>
                  <ActionBadge action={log.action} />
                </TableCell>
                <TableCell className="text-sm">{log.resource}</TableCell>
                <TableCell>
                  <StatusBadge status={log.status} />
                </TableCell>
                <TableCell className="text-xs font-mono text-muted-foreground">{log.ipAddress}</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => setSelectedLog(log)}>
                        <Eye className="h-4 w-4 mr-2" /> View Details
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {selectedLog && (
        <Dialog open={!!selectedLog} onOpenChange={() => setSelectedLog(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Activity Details</DialogTitle>
            </DialogHeader>
            <div className="space-y-3">
              <div>
                <p className="text-xs text-muted-foreground uppercase">Timestamp</p>
                <p className="font-medium">{selectedLog.timestamp}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase">User</p>
                <p className="font-medium">{selectedLog.user} ({selectedLog.role})</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase">Action</p>
                <p className="font-medium">{selectedLog.action}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase">Resource</p>
                <p className="font-medium">{selectedLog.resource}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase">Details</p>
                <p className="text-sm">{selectedLog.details}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase">IP Address</p>
                <p className="font-mono text-sm">{selectedLog.ipAddress}</p>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
