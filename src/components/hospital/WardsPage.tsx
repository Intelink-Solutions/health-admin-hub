import { useState } from "react";
import {
  Building2, Search, Plus, AlertCircle, Users, Bed, Clock, MoreHorizontal,
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
import { cn } from "@/lib/utils";

type Ward = {
  id: string;
  name: string;
  type: "General" | "ICU" | "Maternity" | "Pediatrics" | "Isolation";
  totalBeds: number;
  occupiedBeds: number;
  availableBeds: number;
  superviser: string;
  contactPhone: string;
};

const WARDS: Ward[] = [
  { id: "W-001", name: "Ward A - Cardiology", type: "General", totalBeds: 20, occupiedBeds: 18, availableBeds: 2, superviser: "Sr. Ngozi", contactPhone: "+234 801 123 4567" },
  { id: "W-002", name: "Ward B - Orthopedics", type: "General", totalBeds: 16, occupiedBeds: 14, availableBeds: 2, superviser: "Sr. Amina", contactPhone: "+234 802 234 5678" },
  { id: "W-003", name: "ICU - Intensive Care", type: "ICU", totalBeds: 8, occupiedBeds: 7, availableBeds: 1, superviser: "Sr. Blessing", contactPhone: "+234 803 345 6789" },
  { id: "W-004", name: "Maternity - OB/GYN", type: "Maternity", totalBeds: 12, occupiedBeds: 9, availableBeds: 3, superviser: "Sr. Fatima", contactPhone: "+234 804 456 7890" },
  { id: "W-005", name: "Pediatrics", type: "Pediatrics", totalBeds: 14, occupiedBeds: 10, availableBeds: 4, superviser: "Sr. Mary", contactPhone: "+234 805 567 8901" },
];

function getOccupancyColor(occupied: number, total: number) {
  const percentage = (occupied / total) * 100;
  if (percentage >= 90) return "bg-destructive";
  if (percentage >= 75) return "bg-warning";
  return "bg-success";
}

function StatCard({ label, value, icon: Icon, iconClass }: { label: string; value: number; icon: React.ElementType; iconClass: string }) {
  return (
    <div className="stat-card">
      <div className="flex items-center justify-between">
        <p className="text-xs font-medium text-muted-foreground uppercase">{label}</p>
        <div className={cn("h-8 w-8 rounded-lg flex items-center justify-center", iconClass)}>
          <Icon className="h-4 w-4 text-primary-foreground" />
        </div>
      </div>
      <p className="text-2xl font-bold text-foreground">{value}</p>
    </div>
  );
}

export function WardsPage() {
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);

  const filtered = WARDS.filter(
    (w) =>
      w.name.toLowerCase().includes(search.toLowerCase()) ||
      w.superviser.toLowerCase().includes(search.toLowerCase())
  );

  const totalBeds = WARDS.reduce((sum, w) => sum + w.totalBeds, 0);
  const totalOccupied = WARDS.reduce((sum, w) => sum + w.occupiedBeds, 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Wards & Clinics</h1>
          <p className="text-sm text-muted-foreground">Manage ward occupancy and bed allocation</p>
        </div>
        <Button className="gap-2 self-start" onClick={() => setModalOpen(true)}>
          <Plus className="h-4 w-4" /> Add Ward
        </Button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Wards" value={WARDS.length} icon={Building2} iconClass="bg-primary" />
        <StatCard label="Total Beds" value={totalBeds} icon={Bed} iconClass="bg-secondary" />
        <StatCard label="Occupied" value={totalOccupied} icon={Users} iconClass="bg-warning" />
        <StatCard label="Available" value={totalBeds - totalOccupied} icon={Bed} iconClass="bg-success" />
      </div>

      <div className="rounded-xl border border-border bg-card p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by ward name or superviser..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      <div className="grid gap-4">
        {filtered.map((ward) => {
          const occupancyPercent = (ward.occupiedBeds / ward.totalBeds) * 100;
          return (
            <div key={ward.id} className="rounded-xl border border-border bg-card p-5" style={{ boxShadow: "var(--shadow-sm)" }}>
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <Building2 className="h-5 w-5 text-primary" />
                    <div>
                      <h3 className="font-semibold text-foreground">{ward.name}</h3>
                      <p className="text-xs text-muted-foreground">{ward.type} Ward</p>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2 mt-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Occupancy</span>
                      <span className="font-medium">{ward.occupiedBeds}/{ward.totalBeds} beds</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className={cn("h-full transition-all", getOccupancyColor(ward.occupiedBeds, ward.totalBeds))}
                        style={{ width: `${occupancyPercent}%` }}
                      />
                    </div>
                  </div>
                </div>
                <div className="sm:text-right text-sm">
                  <p className="text-xs text-muted-foreground mb-2">Superviser</p>
                  <p className="font-medium">{ward.superviser}</p>
                  <p className="text-xs text-muted-foreground">{ward.contactPhone}</p>
                  <div className="mt-3">
                    <Badge className="bg-success/20 text-success">
                      {ward.availableBeds} available
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Ward</DialogTitle>
            <DialogDescription>Create a new ward or clinic</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Ward Name</label>
              <Input placeholder="Ward A - Cardiology" />
            </div>
            <div>
              <label className="text-sm font-medium">Type</label>
              <select className="w-full px-3 py-2 border border-border rounded-lg text-foreground bg-background">
                <option>General</option>
                <option>ICU</option>
                <option>Maternity</option>
                <option>Pediatrics</option>
                <option>Isolation</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium">Total Beds</label>
              <Input type="number" placeholder="20" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button onClick={() => setModalOpen(false)}>Add Ward</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
