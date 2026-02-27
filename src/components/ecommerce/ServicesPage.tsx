import { useState } from "react";
import {
  Package, Plus, MoreHorizontal, Zap, Eye,
} from "lucide-react";
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
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type Service = {
  id: string;
  name: string;
  category: string;
  description: string;
  basePrice: number;
  duration: string;
  availability: string;
  listings: number;
  status: "Active" | "Inactive";
};

const SERVICES: Service[] = [
  { id: "SRV-001", name: "Full Health Screening", category: "Preventive Care", description: "Complete physical examination with lab tests", basePrice: 5000, duration: "2 hours", availability: "Mon-Fri", listings: 12, status: "Active" },
  { id: "SRV-002", name: "Vaccination Services", category: "Immunization", description: "Various vaccines for children and adults", basePrice: 1500, duration: "30 min", availability: "Daily", listings: 8, status: "Active" },
  { id: "SRV-003", name: "Home Visit Service", category: "Home Care", description: "Doctor/Nurse home visits for consultation", basePrice: 8000, duration: "1-2 hours", availability: "Mon-Sat", listings: 5, status: "Active" },
  { id: "SRV-004", name: "Virtual Consultation", category: "Telemedicine", description: "Online consultation with specialists", basePrice: 2500, duration: "30 min", availability: "24/7", listings: 20, status: "Active" },
  { id: "SRV-005", name: "Lab Tests Package", category: "Diagnostics", description: "Comprehensive lab testing package", basePrice: 3500, duration: "1 hour", availability: "Mon-Fri", listings: 6, status: "Inactive" },
];

function StatusBadge({ status }: { status: Service["status"] }) {
  const map: Record<Service["status"], string> = {
    Active: "badge-success",
    Inactive: "badge-neutral",
  };
  return <span className={map[status]}>{status}</span>;
}

function StatCard({ label, value, icon: Icon }: { label: string; value: number; icon: React.ElementType }) {
  return (
    <Card>
      <CardContent className="p-5 flex items-center gap-3">
        <div className="h-10 w-10 rounded-lg bg-primary/20 flex items-center justify-center">
          <Icon className="h-5 w-5 text-primary" />
        </div>
        <div>
          <p className="text-xs text-muted-foreground uppercase">{label}</p>
          <p className="text-2xl font-bold text-foreground">{value}</p>
        </div>
      </CardContent>
    </Card>
  );
}

export function ServicesPage() {
  const [modalOpen, setModalOpen] = useState(false);

  const activeServices = SERVICES.filter((s) => s.status === "Active").length;
  const totalListings = SERVICES.reduce((sum, s) => sum + s.listings, 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Service Listings</h1>
          <p className="text-sm text-muted-foreground">Manage healthcare services and offerings</p>
        </div>
        <Button className="gap-2 self-start" onClick={() => setModalOpen(true)}>
          <Plus className="h-4 w-4" /> Add Service
        </Button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Services" value={SERVICES.length} icon={Package} />
        <StatCard label="Active" value={activeServices} icon={Zap} />
        <StatCard label="Listings" value={totalListings} icon={Eye} />
        <StatCard label="Categories" value={Array.from(new Set(SERVICES.map((s) => s.category))).length} icon={Package} />
      </div>

      <div className="grid gap-4">
        {SERVICES.map((service) => (
          <div key={service.id} className="rounded-xl border border-border bg-card p-5" style={{ boxShadow: "var(--shadow-sm)" }}>
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="text-lg font-semibold text-foreground">{service.name}</h3>
                  <StatusBadge status={service.status} />
                </div>
                <p className="text-sm text-muted-foreground mb-3">{service.description}</p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
                  <div>
                    <p className="text-xs text-muted-foreground">Category</p>
                    <p className="font-medium">{service.category}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Base Price</p>
                    <p className="font-medium">₵{service.basePrice.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Duration</p>
                    <p className="font-medium">{service.duration}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Listings</p>
                    <p className="font-medium">{service.listings}</p>
                  </div>
                </div>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>Edit Service</DropdownMenuItem>
                  <DropdownMenuItem>View Bookings</DropdownMenuItem>
                  <DropdownMenuItem>Toggle Status</DropdownMenuItem>
                  <DropdownMenuItem>Duplicate</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        ))}
      </div>

      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Service</DialogTitle>
            <DialogDescription>Create a new healthcare service listing</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Service Name</Label>
              <Input placeholder="Service name" />
            </div>
            <div>
              <Label>Category</Label>
              <select className="w-full px-3 py-2 border border-border rounded-lg text-foreground bg-background">
                <option>Preventive Care</option>
                <option>Immunization</option>
                <option>Home Care</option>
                <option>Telemedicine</option>
                <option>Diagnostics</option>
              </select>
            </div>
            <div>
              <Label>Base Price</Label>
              <Input type="number" placeholder="0" />
            </div>
            <div>
              <Label>Duration</Label>
              <Input placeholder="1 hour" />
            </div>
            <div>
              <Label>Description</Label>
              <textarea className="w-full px-3 py-2 border border-border rounded-lg text-foreground bg-background" placeholder="Service description..." />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button onClick={() => setModalOpen(false)}>Add Service</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
