# Component Quick Reference Guide

## 📂 File Organization

```
src/
├── pages/                           # Page wrapper components
│   ├── Index.tsx                   # Dashboard (existing)
│   ├── Patients.tsx                # Patients (existing)
│   ├── Appointments.tsx            # Appointments (existing)
│   ├── Billing.tsx                 # Billing (existing)
│   ├── Staff.tsx                   # Staff (existing)
│   ├── Pharmacy.tsx                # Pharmacy Inventory (existing)
│   ├── Prescriptions.tsx           # Prescriptions (existing)
│   ├── Admissions.tsx              # NEW
│   ├── EHR.tsx                     # NEW
│   ├── Wards.tsx                   # NEW
│   ├── Dispensing.tsx              # NEW
│   ├── PharmacySales.tsx           # NEW
│   ├── Laboratory.tsx              # NEW
│   ├── Radiology.tsx               # NEW
│   ├── Payments.tsx                # NEW
│   ├── FinancialReports.tsx        # NEW
│   ├── NurseAssignments.tsx        # NEW
│   ├── ConsultationQueue.tsx       # NEW
│   ├── DoctorOrders.tsx            # NEW
│   ├── VitalsMonitoring.tsx        # NEW
│   ├── Roles.tsx                   # NEW
│   ├── Scheduling.tsx              # NEW
│   ├── ActivityLogs.tsx            # NEW
│   ├── VirtualConsultations.tsx    # NEW
│   ├── HomeVisits.tsx              # NEW
│   ├── Bookings.tsx                # NEW
│   ├── Services.tsx                # NEW
│   ├── Analytics.tsx               # NEW
│   ├── ClinicalReports.tsx         # NEW
│   └── Security.tsx                # NEW
│
└── components/
    ├── hospital/
    │   ├── AdmissionsPage.tsx      # Admissions & discharge management
    │   ├── EHRPage.tsx             # Electronic health records
    │   └── WardsPage.tsx           # Ward occupancy management
    │
    ├── pharmacy/
    │   ├── PharmacyPage.tsx        # Inventory (existing)
    │   ├── PrescriptionsPage.tsx   # Prescriptions (existing)
    │   ├── DispensingPage.tsx      # Dispensing workflow
    │   └── PharmacySalesPage.tsx   # Sales tracking
    │
    ├── laboratory/
    │   ├── LaboratoryPage.tsx      # Lab tests management
    │   └── RadiologyPage.tsx       # Imaging & radiology
    │
    ├── finance/
    │   ├── BillingPage.tsx         # Billing (existing)
    │   ├── PaymentsPage.tsx        # Payment transactions
    │   └── FinancialReportsPage.tsx # Financial analytics
    │
    ├── nursing/
    │   ├── NurseAssignmentsPage.tsx    # Nurse scheduling
    │   ├── ConsultationQueuePage.tsx   # Patient queue
    │   ├── DoctorOrdersPage.tsx        # CPOE system
    │   └── VitalsMonitoringPage.tsx    # Vitals tracking
    │
    ├── admin/
    │   ├── StaffPage.tsx           # Staff management (existing)
    │   ├── RolesPermissionsPage.tsx # Access control
    │   ├── SchedulingPage.tsx      # Staff scheduling
    │   └── ActivityLogsPage.tsx    # Audit logs
    │
    ├── telemedicine/
    │   ├── VirtualConsultationsPage.tsx # Virtual consultations
    │   └── HomeVisitsPage.tsx          # Home visits
    │
    ├── ecommerce/
    │   ├── BookingsPage.tsx        # Online bookings
    │   └── ServicesPage.tsx        # Service catalog
    │
    └── analytics/
        ├── AnalyticsPage.tsx       # System analytics
        ├── ClinicalReportsPage.tsx # Clinical reports
        └── SecurityPage.tsx        # Security & sessions
```

---

## 🎯 Component Import Patterns

### Page Wrapper Example:
```tsx
import { AdminLayout } from "@/components/layout/AdminLayout";
import { ComponentPage } from "@/components/module/ComponentPage";

export default function PageName() {
  return (
    <AdminLayout>
      <ComponentPage />
    </AdminLayout>
  );
}
```

### Feature Component Example:
```tsx
import { useState } from "react";
import { Search, Plus, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";

export function ComponentPage() {
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  
  // Component logic here
  
  return (
    <div className="space-y-6">
      {/* Stat cards, tables, forms */}
    </div>
  );
}
```

---

## 📋 Common Data Type Patterns

### Admission Record:
```typescript
type Admission = {
  id: string;
  patientName: string;
  admissionDate: string;
  department: string;
  bedNumber: string;
  admittingDoctor: string;
  status: "Admitted" | "Discharged" | "In Progress";
  reason: string;
};
```

### Financial Transaction:
```typescript
type Payment = {
  id: string;
  patientName: string;
  invoiceRef: string;
  amount: number;
  paymentMethod: "Cash" | "Card" | "Bank Transfer" | "Check" | "Insurance";
  date: string;
  status: "Completed" | "Pending" | "Failed";
};
```

### Vitals Record:
```typescript
type Vital = {
  id: string;
  patientName: string;
  timestamp: string;
  heartRate: number;
  bloodPressure: string;
  temperature: number;
  respiratoryRate: number;
  spo2: number;
  status: "Normal" | "Warning" | "Critical";
};
```

---

## 🎨 UI Component Usage

### Stat Card Pattern:
```tsx
function StatCard({ label, value, icon: Icon }: { 
  label: string; 
  value: number | string; 
  icon: React.ElementType 
}) {
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
```

### Status Badge Pattern:
```tsx
function StatusBadge({ status }: { status: "Active" | "Inactive" | "Pending" }) {
  const map: Record<typeof status, string> = {
    Active: "badge-success",
    Inactive: "badge-neutral",
    Pending: "badge-warning",
  };
  return <span className={map[status]}>{status}</span>;
}
```

### Search Input Pattern:
```tsx
<div className="rounded-xl border border-border bg-card p-4">
  <div className="relative">
    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
    <Input
      placeholder="Search..."
      value={search}
      onChange={(e) => setSearch(e.target.value)}
      className="pl-9"
    />
  </div>
</div>
```

---

## 📊 Chart Integration (Recharts)

### Line Chart Example:
```tsx
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

<ResponsiveContainer width="100%" height={300}>
  <LineChart data={chartData}>
    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
    <XAxis dataKey="month" stroke="var(--muted-foreground)" />
    <YAxis stroke="var(--muted-foreground)" />
    <Tooltip contentStyle={{ backgroundColor: "var(--card)", border: "1px solid var(--border)" }} />
    <Legend />
    <Line type="monotone" dataKey="value" stroke="#3b82f6" />
  </LineChart>
</ResponsiveContainer>
```

---

## 🔧 Filter & Search Logic

### useMemo Filter Pattern:
```tsx
const filtered = useMemo(() => {
  return DATA.filter((item) => {
    const matchSearch = 
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.id.toLowerCase().includes(search.toLowerCase());
    
    const matchFilter = filter === "all" || item.category === filter;
    
    return matchSearch && matchFilter;
  });
}, [search, filter]);
```

---

## 🗄️ CRUD Dialog Pattern

```tsx
<Dialog open={modalOpen} onOpenChange={setModalOpen}>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Create New Record</DialogTitle>
      <DialogDescription>Fill in the form below</DialogDescription>
    </DialogHeader>
    <div className="space-y-4">
      <div>
        <Label>Field Name</Label>
        <Input placeholder="Enter value..." />
      </div>
      {/* More fields */}
    </div>
    <DialogFooter>
      <Button variant="outline" onClick={() => setModalOpen(false)}>Cancel</Button>
      <Button onClick={() => setModalOpen(false)}>Save</Button>
    </DialogFooter>
  </DialogContent>
</Dialog>
```

---

## 🎯 Action Menu Dropdown

```tsx
<DropdownMenu>
  <DropdownMenuTrigger asChild>
    <Button variant="ghost" size="sm">
      <MoreHorizontal className="h-4 w-4" />
    </Button>
  </DropdownMenuTrigger>
  <DropdownMenuContent align="end">
    <DropdownMenuItem>View Details</DropdownMenuItem>
    <DropdownMenuItem>Edit Record</DropdownMenuItem>
    <DropdownMenuItem>Delete</DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>
```

---

## 🚀 Running the Application

### Development:
```bash
npm install
npm run dev
```

### Production Build:
```bash
npm run build
npm run preview
```

### Using Bun:
```bash
bun install
bun dev
```

---

## 📦 Key Dependencies

```json
{
  "dependencies": {
    "react": "^18.x",
    "react-router-dom": "^6.x",
    "@tanstack/react-query": "^5.x",
    "lucide-react": "latest",
    "recharts": "^2.x",
    "next-themes": "latest"
  }
}
```

---

## 🎨 Custom CSS Classes (index.css)

```css
/* Stat Card */
.stat-card {
  @apply rounded-xl bg-card p-5 border border-border flex flex-col gap-3;
}

/* Status Badges */
.badge-success { background: hsl(var(--success) / 0.12); color: hsl(var(--success)); }
.badge-warning { background: hsl(var(--warning) / 0.12); color: hsl(var(--warning)); }
.badge-danger  { background: hsl(var(--destructive) / 0.12); color: hsl(var(--destructive)); }
.badge-info    { background: hsl(var(--primary) / 0.12); color: hsl(var(--primary)); }
.badge-neutral { background: hsl(var(--muted)); color: hsl(var(--muted-foreground)); }
```

---

## ✅ Quality Checklist

For each new component:
- [ ] TypeScript interfaces defined
- [ ] Mock data with 5-15 realistic records
- [ ] Stat cards with icons
- [ ] Search and filter functionality
- [ ] Responsive table with proper columns
- [ ] CRUD modal dialog
- [ ] Status badges with proper colors
- [ ] Action dropdown menu
- [ ] Responsive layout (mobile + desktop)
- [ ] Proper shadcn/ui component usage

---

**Last Updated**: February 2026  
**Maintainer**: Development Team
