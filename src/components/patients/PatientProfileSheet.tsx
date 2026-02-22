import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import {
  Phone, Mail, MapPin, Calendar, Heart, Thermometer,
  Activity, Droplets, Weight, Ruler, Clock, FileText,
  Pill, AlertTriangle,
} from "lucide-react";

type Patient = {
  id: string;
  name: string;
  age: number;
  gender: "Male" | "Female" | "Other";
  phone: string;
  email: string;
  address: string;
  status: "Active" | "Admitted" | "Discharged" | "Critical" | "Inactive";
  lastVisit: string;
  registeredDate: string;
  bloodGroup: string;
  department: string;
};

const statusClass: Record<Patient["status"], string> = {
  Active: "badge-success",
  Admitted: "badge-info",
  Discharged: "badge-neutral",
  Critical: "badge-danger",
  Inactive: "badge-warning",
};

// Mock vitals
const VITALS = [
  { label: "Blood Pressure", value: "120/80", unit: "mmHg", icon: Heart, status: "normal" },
  { label: "Heart Rate", value: "72", unit: "bpm", icon: Activity, status: "normal" },
  { label: "Temperature", value: "36.8", unit: "°C", icon: Thermometer, status: "normal" },
  { label: "SpO2", value: "98", unit: "%", icon: Droplets, status: "normal" },
  { label: "Weight", value: "74", unit: "kg", icon: Weight, status: "normal" },
  { label: "Height", value: "172", unit: "cm", icon: Ruler, status: "normal" },
];

const VISIT_HISTORY = [
  { date: "2026-02-18", type: "OPD", doctor: "Dr. Adebayo Ogunlade", department: "Cardiology", diagnosis: "Routine cardiac checkup", notes: "ECG normal, cholesterol slightly elevated" },
  { date: "2026-01-05", type: "OPD", doctor: "Dr. Ngozi Okafor", department: "General Medicine", diagnosis: "Upper respiratory infection", notes: "Prescribed antibiotics, 5-day course" },
  { date: "2025-11-12", type: "IPD", doctor: "Dr. Tunde Bakare", department: "Surgery", diagnosis: "Appendectomy", notes: "Successful laparoscopic procedure, discharged after 3 days" },
  { date: "2025-08-20", type: "OPD", doctor: "Dr. Chidi Eze", department: "Dermatology", diagnosis: "Eczema follow-up", notes: "Skin improving, continue topical treatment" },
];

const MEDICAL_HISTORY = [
  { condition: "Hypertension", diagnosed: "2023-04-10", status: "Ongoing", severity: "Moderate" },
  { condition: "Type 2 Diabetes", diagnosed: "2024-01-15", status: "Managed", severity: "Mild" },
  { condition: "Appendicitis", diagnosed: "2025-11-10", status: "Resolved", severity: "Acute" },
];

const MEDICATIONS = [
  { name: "Amlodipine 5mg", frequency: "Once daily", prescribed: "2023-04-10", status: "Active" },
  { name: "Metformin 500mg", frequency: "Twice daily", prescribed: "2024-01-15", status: "Active" },
  { name: "Vitamin D3", frequency: "Once daily", prescribed: "2025-06-01", status: "Active" },
];

const ALLERGIES = ["Penicillin", "Sulfonamides"];

interface Props {
  patient: Patient | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function PatientProfileSheet({ patient, open, onOpenChange }: Props) {
  if (!patient) return null;

  const initials = patient.name.split(" ").map(n => n[0]).join("");

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-xl overflow-y-auto p-0">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-card border-b border-border p-6 pb-4">
          <SheetHeader className="mb-0">
            <div className="flex items-start gap-4">
              <div className="h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <span className="text-lg font-bold text-primary">{initials}</span>
              </div>
              <div className="flex-1 min-w-0">
                <SheetTitle className="text-lg">{patient.name}</SheetTitle>
                <SheetDescription className="flex flex-wrap items-center gap-2 mt-1">
                  <span>{patient.id}</span>
                  <span>·</span>
                  <span>{patient.gender}, {patient.age}y</span>
                  <span>·</span>
                  <Badge variant="outline" className="text-[11px]">{patient.bloodGroup}</Badge>
                </SheetDescription>
                <div className="mt-2 flex flex-wrap gap-2">
                  <span className={statusClass[patient.status]}>{patient.status}</span>
                  <Badge variant="outline" className="text-xs">{patient.department}</Badge>
                </div>
              </div>
            </div>
          </SheetHeader>

          {/* Contact row */}
          <div className="mt-4 flex flex-wrap gap-x-5 gap-y-1 text-xs text-muted-foreground">
            <span className="flex items-center gap-1"><Phone className="h-3 w-3" />{patient.phone}</span>
            <span className="flex items-center gap-1"><Mail className="h-3 w-3" />{patient.email}</span>
            <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{patient.address}</span>
          </div>
          <div className="mt-2 flex gap-4 text-xs text-muted-foreground">
            <span className="flex items-center gap-1"><Calendar className="h-3 w-3" />Registered: {patient.registeredDate}</span>
            <span className="flex items-center gap-1"><Clock className="h-3 w-3" />Last visit: {patient.lastVisit}</span>
          </div>
        </div>

        {/* Tabs */}
        <div className="p-6 pt-4">
          {/* Allergies banner */}
          {ALLERGIES.length > 0 && (
            <div className="mb-4 flex items-center gap-2 rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-sm">
              <AlertTriangle className="h-4 w-4 text-destructive shrink-0" />
              <span className="font-medium text-destructive">Allergies:</span>
              <span className="text-foreground">{ALLERGIES.join(", ")}</span>
            </div>
          )}

          <Tabs defaultValue="vitals" className="w-full">
            <TabsList className="w-full grid grid-cols-4">
              <TabsTrigger value="vitals">Vitals</TabsTrigger>
              <TabsTrigger value="visits">Visits</TabsTrigger>
              <TabsTrigger value="history">History</TabsTrigger>
              <TabsTrigger value="meds">Meds</TabsTrigger>
            </TabsList>

            {/* Vitals */}
            <TabsContent value="vitals" className="mt-4">
              <div className="grid grid-cols-2 gap-3">
                {VITALS.map(v => (
                  <div key={v.label} className="rounded-lg border border-border bg-muted/30 p-3">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
                      <v.icon className="h-3.5 w-3.5" />
                      {v.label}
                    </div>
                    <p className="text-lg font-bold text-foreground">
                      {v.value} <span className="text-xs font-normal text-muted-foreground">{v.unit}</span>
                    </p>
                  </div>
                ))}
              </div>
              <div className="mt-4 rounded-lg border border-border p-3">
                <p className="text-xs font-medium text-muted-foreground mb-2">BMI Score</p>
                <div className="flex items-center gap-3">
                  <Progress value={62} className="flex-1 h-2" />
                  <span className="text-sm font-semibold text-foreground">25.0</span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">Normal weight</p>
              </div>
            </TabsContent>

            {/* Visits */}
            <TabsContent value="visits" className="mt-4 space-y-3">
              {VISIT_HISTORY.map((v, i) => (
                <div key={i} className="rounded-lg border border-border p-3 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                      <span className="text-sm font-medium text-foreground">{v.date}</span>
                      <Badge variant="outline" className="text-[10px]">{v.type}</Badge>
                    </div>
                  </div>
                  <p className="text-sm font-semibold text-foreground">{v.diagnosis}</p>
                  <p className="text-xs text-muted-foreground">{v.doctor} · {v.department}</p>
                  <p className="text-xs text-muted-foreground italic">{v.notes}</p>
                </div>
              ))}
            </TabsContent>

            {/* History */}
            <TabsContent value="history" className="mt-4 space-y-3">
              {MEDICAL_HISTORY.map((h, i) => (
                <div key={i} className="rounded-lg border border-border p-3">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold text-foreground">{h.condition}</p>
                    <Badge variant={h.status === "Resolved" ? "secondary" : "outline"} className="text-[10px]">
                      {h.status}
                    </Badge>
                  </div>
                  <div className="flex gap-4 mt-1 text-xs text-muted-foreground">
                    <span>Diagnosed: {h.diagnosed}</span>
                    <span>Severity: {h.severity}</span>
                  </div>
                </div>
              ))}
            </TabsContent>

            {/* Medications */}
            <TabsContent value="meds" className="mt-4 space-y-3">
              {MEDICATIONS.map((m, i) => (
                <div key={i} className="rounded-lg border border-border p-3 flex items-start gap-3">
                  <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                    <Pill className="h-4 w-4 text-primary" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-semibold text-foreground">{m.name}</p>
                      <Badge variant="outline" className="text-[10px]">{m.status}</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">{m.frequency} · Since {m.prescribed}</p>
                  </div>
                </div>
              ))}
            </TabsContent>
          </Tabs>
        </div>
      </SheetContent>
    </Sheet>
  );
}
