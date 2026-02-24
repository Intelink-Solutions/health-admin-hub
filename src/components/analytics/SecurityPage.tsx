import { useState } from "react";
import {
  Search, Plus, MoreHorizontal, Lock, Eye, EyeOff,
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
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type LoginSession = {
  id: string;
  username: string;
  role: string;
  loginTime: string;
  logoutTime: string;
  ipAddress: string;
  device: string;
  status: "Active" | "Inactive";
  duration: string;
};

const LOGIN_SESSIONS: LoginSession[] = [
  { id: "LS-001", username: "dr_adekunle", role: "Doctor", loginTime: "2026-02-23 08:30 AM", logoutTime: "2026-02-23 05:15 PM", ipAddress: "192.168.1.100", device: "Desktop", status: "Active", duration: "8h 45m" },
  { id: "LS-002", username: "nurse_amina", role: "Nurse", loginTime: "2026-02-23 07:00 AM", logoutTime: "2026-02-23 03:45 PM", ipAddress: "192.168.1.105", device: "Tablet", status: "Inactive", duration: "8h 45m" },
  { id: "LS-003", username: "admin_boss", role: "Admin", loginTime: "2026-02-23 06:00 AM", logoutTime: "—", ipAddress: "192.168.1.50", device: "Desktop", status: "Active", duration: "9h 15m" },
  { id: "LS-004", username: "pharmacist_john", role: "Pharmacist", loginTime: "2026-02-22 08:00 AM", logoutTime: "2026-02-22 04:30 PM", ipAddress: "192.168.1.110", device: "Desktop", status: "Inactive", duration: "8h 30m" },
  { id: "LS-005", username: "lab_tech_grace", role: "Lab Tech", loginTime: "2026-02-22 09:15 AM", logoutTime: "2026-02-22 05:45 PM", ipAddress: "192.168.1.115", device: "Desktop", status: "Inactive", duration: "8h 30m" },
];

function StatusBadge({ status }: { status: LoginSession["status"] }) {
  const map: Record<LoginSession["status"], string> = {
    Active: "badge-success",
    Inactive: "badge-neutral",
  };
  return <span className={map[status]}>{status}</span>;
}

function StatCard({ label, value, icon: Icon }: { label: string; value: number; icon: React.ElementType }) {
  return (
    <Card>
      <CardContent className="p-5">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-primary/20 flex items-center justify-center">
            <Icon className="h-5 w-5 text-primary" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground uppercase">{label}</p>
            <p className="text-2xl font-bold text-foreground">{value}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function SecurityPage() {
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const filtered = LOGIN_SESSIONS.filter(
    (s) =>
      s.username.toLowerCase().includes(search.toLowerCase()) ||
      s.role.toLowerCase().includes(search.toLowerCase()) ||
      s.ipAddress.includes(search)
  );

  const activeSessions = LOGIN_SESSIONS.filter((s) => s.status === "Active").length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Security & Access Control</h1>
          <p className="text-sm text-muted-foreground">User sessions, access logs, and security settings</p>
        </div>
        <Button className="gap-2 self-start" onClick={() => setModalOpen(true)}>
          <Plus className="h-4 w-4" /> User Access Policy
        </Button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Sessions" value={LOGIN_SESSIONS.length} icon={Lock} />
        <StatCard label="Active Now" value={activeSessions} icon={Eye} />
        <StatCard label="Inactive" value={LOGIN_SESSIONS.filter((s) => s.status === "Inactive").length} icon={EyeOff} />
        <StatCard label="Unique Users" value={new Set(LOGIN_SESSIONS.map((s) => s.username)).size} icon={Lock} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Password Policy</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div className="flex items-center gap-2">
              <Checkbox defaultChecked />
              Min 12 characters required
            </div>
            <div className="flex items-center gap-2">
              <Checkbox defaultChecked />
              Must include special characters
            </div>
            <div className="flex items-center gap-2">
              <Checkbox defaultChecked />
              Expire every 90 days
            </div>
            <div className="flex items-center gap-2">
              <Checkbox />
              Require two-factor authentication
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Session Controls</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div>
              <p className="font-medium text-foreground">Session Timeout</p>
              <p className="text-muted-foreground">30 minutes of inactivity</p>
            </div>
            <div>
              <p className="font-medium text-foreground">Max Sessions</p>
              <p className="text-muted-foreground">3 devices per user</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Audit Logging</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div>
              <p className="font-medium text-foreground">Retention Period</p>
              <p className="text-muted-foreground">12 months</p>
            </div>
            <div>
              <p className="font-medium text-foreground">Logged Actions</p>
              <p className="text-muted-foreground">All system activities</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="rounded-xl border border-border bg-card p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by username, role, or IP address..."
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
              <TableHead>Username</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Login Time</TableHead>
              <TableHead>Logout Time</TableHead>
              <TableHead>IP Address</TableHead>
              <TableHead>Device</TableHead>
              <TableHead>Duration</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-12"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((session) => (
              <TableRow key={session.id}>
                <TableCell className="font-medium">{session.username}</TableCell>
                <TableCell>
                  <Badge variant="outline">{session.role}</Badge>
                </TableCell>
                <TableCell className="text-sm">{session.loginTime}</TableCell>
                <TableCell className="text-sm">{session.logoutTime}</TableCell>
                <TableCell className="font-mono text-sm">{session.ipAddress}</TableCell>
                <TableCell className="text-sm">{session.device}</TableCell>
                <TableCell className="text-sm">{session.duration}</TableCell>
                <TableCell>
                  <StatusBadge status={session.status} />
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
                      <DropdownMenuItem>Force Logout</DropdownMenuItem>
                      <DropdownMenuItem>Restrict IP</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Access Control Policy</DialogTitle>
            <DialogDescription>Configure user access permissions</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Policy Name</Label>
              <BaseInput placeholder="Policy name" />
            </div>
            <div>
              <Label>Role</Label>
              <select className="w-full px-3 py-2 border border-border rounded-lg text-foreground bg-background">
                <option>Admin</option>
                <option>Doctor</option>
                <option>Nurse</option>
                <option>Pharmacist</option>
                <option>Lab Tech</option>
              </select>
            </div>
            <div>
              <Label>Permissions</Label>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Checkbox defaultChecked />
                  <span className="text-sm">View Patient Records</span>
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox defaultChecked />
                  <span className="text-sm">Edit Records</span>
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox />
                  <span className="text-sm">Delete Records</span>
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox defaultChecked />
                  <span className="text-sm">Create Orders</span>
                </div>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button onClick={() => setModalOpen(false)}>Save Policy</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
