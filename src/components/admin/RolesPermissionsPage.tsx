import { useState } from "react";
import {
  Shield, Plus, Search, MoreHorizontal, CheckCircle2, Users,
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

type Role = {
  id: string;
  name: string;
  description: string;
  staffCount: number;
  permissions: string[];
};

const ROLES: Role[] = [
  { id: "R-001", name: "Admin", description: "Full system access", staffCount: 2, permissions: ["View All", "Edit All", "Delete", "Reports", "Settings"] },
  { id: "R-002", name: "Doctor", description: "Clinical access", staffCount: 15, permissions: ["View Patients", "Edit Records", "Order Tests", "Write Notes"] },
  { id: "R-003", name: "Nurse", description: "Ward management", staffCount: 24, permissions: ["View Patients", "Update Vitals", "Record Medications"] },
  { id: "R-004", name: "Pharmacist", description: "Pharmacy access", staffCount: 5, permissions: ["Manage Inventory", "Dispense", "View Medications"] },
  { id: "R-005", name: "Lab Tech", description: "Lab access", staffCount: 8, permissions: ["Request Tests", "Record Results"] },
];

const ALL_PERMISSIONS = [
  "View All Patients", "View Own Patients", "Edit Patient Records", "Delete Records",
  "Order Lab Tests", "Order Imaging", "Prescribe Medications",
  "Access Finance", "Generate Reports", "Manage Staff",
  "Access Settings", "View Audit Logs",
];

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

export function RolesPermissionsPage() {
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);

  const filtered = ROLES.filter((r) =>
    r.name.toLowerCase().includes(search.toLowerCase())
  );

  const togglePermission = (perm: string) => {
    setSelectedPermissions((prev) =>
      prev.includes(perm) ? prev.filter((p) => p !== perm) : [...prev, perm]
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Roles & Permissions</h1>
          <p className="text-sm text-muted-foreground">Manage user roles and access control</p>
        </div>
        <Button className="gap-2 self-start" onClick={() => setModalOpen(true)}>
          <Plus className="h-4 w-4" /> New Role
        </Button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        <StatCard label="Total Roles" value={ROLES.length} icon={Shield} />
        <StatCard label="Total Staff" value={ROLES.reduce((sum, r) => sum + r.staffCount, 0)} icon={Users} />
        <StatCard label="Permissions" value={ALL_PERMISSIONS.length} icon={CheckCircle2} />
      </div>

      <div className="rounded-xl border border-border bg-card p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search roles..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      <div className="grid gap-4">
        {filtered.map((role) => (
          <div key={role.id} className="rounded-xl border border-border bg-card p-5" style={{ boxShadow: "var(--shadow-sm)" }}>
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="font-semibold text-lg text-foreground">{role.name}</h3>
                <p className="text-sm text-muted-foreground">{role.description}</p>
              </div>
              <Badge variant="outline">{role.staffCount} staff</Badge>
            </div>
            <div className="mb-4">
              <p className="text-sm font-medium text-muted-foreground mb-2">Permissions:</p>
              <div className="flex flex-wrap gap-2">
                {role.permissions.map((perm) => (
                  <Badge key={perm} variant="secondary">{perm}</Badge>
                ))}
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">Edit Role</Button>
              <Button variant="outline" size="sm">View Staff</Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>Duplicate Role</DropdownMenuItem>
                  <DropdownMenuItem>Delete Role</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        ))}
      </div>

      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create New Role</DialogTitle>
            <DialogDescription>Define role name and permissions</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Role Name</Label>
              <BaseInput placeholder="Role name" />
            </div>
            <div>
              <Label>Description</Label>
              <textarea className="w-full px-3 py-2 border border-border rounded-lg text-foreground bg-background" placeholder="Role description..." />
            </div>
            <div>
              <Label className="mb-3 block">Permissions</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-64 overflow-y-auto border border-border rounded-lg p-3">
                {ALL_PERMISSIONS.map((perm) => (
                  <label key={perm} className="flex items-center gap-2 cursor-pointer">
                    <Checkbox
                      checked={selectedPermissions.includes(perm)}
                      onCheckedChange={() => togglePermission(perm)}
                    />
                    <span className="text-sm">{perm}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button onClick={() => setModalOpen(false)}>Create Role</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
