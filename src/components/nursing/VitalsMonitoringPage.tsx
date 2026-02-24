import {
  Activity, Heart, Wind, Droplet, Thermometer, MoreHorizontal,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";

type VitalRecord = {
  patientId: string;
  patientName: string;
  ward: string;
  heartRate: number;
  bloodPressure: string;
  temperature: number;
  respiratoryRate: number;
  oxygenLevel: number;
  timestamp: string;
  lastUpdated: string;
};

const VITAL_RECORDS: VitalRecord[] = [
  { patientId: "P-10001", patientName: "Aisha Mohammed", ward: "Ward A", heartRate: 78, bloodPressure: "120/80", temperature: 37.2, respiratoryRate: 16, oxygenLevel: 98, timestamp: "Now", lastUpdated: "10:45 AM" },
  { patientId: "P-10002", patientName: "John Okafor", ward: "Ward B", heartRate: 92, bloodPressure: "135/88", temperature: 37.5, respiratoryRate: 18, oxygenLevel: 96, timestamp: "Now", lastUpdated: "10:42 AM" },
  { patientId: "P-10003", patientName: "Fatima Bello", ward: "Ward C", heartRate: 68, bloodPressure: "118/76", temperature: 36.8, respiratoryRate: 14, oxygenLevel: 99, timestamp: "Now", lastUpdated: "10:50 AM" },
  { patientId: "P-10004", patientName: "Emeka Nwosu", ward: "ICU", heartRate: 105, bloodPressure: "155/95", temperature: 38.1, respiratoryRate: 22, oxygenLevel: 92, timestamp: "Now", lastUpdated: "10:35 AM" },
];

const vitalsTrend = [
  { time: "08:00", heartRate: 76, bp: 118, temp: 37.0, spO2: 98 },
  { time: "09:00", heartRate: 78, bp: 120, temp: 37.2, spO2: 98 },
  { time: "10:00", heartRate: 80, bp: 122, temp: 37.3, spO2: 97 },
  { time: "11:00", heartRate: 78, bp: 120, temp: 37.2, spO2: 98 },
];

function getVitalStatus(value: number, type: string) {
  if (type === "heartRate") {
    return value >= 60 && value <= 100 ? "badge-success" : "badge-warning";
  }
  if (type === "temperature") {
    return value >= 36.5 && value <= 37.5 ? "badge-success" : "badge-warning";
  }
  if (type === "oxygenLevel") {
    return value >= 95 ? "badge-success" : "badge-danger";
  }
  return "badge-neutral";
}

function StatCard({ label, icon: Icon, color }: { label: string; icon: React.ElementType; color: string }) {
  return (
    <div className="stat-card">
      <div className="flex items-center justify-between">
        <p className="text-xs font-medium text-muted-foreground uppercase">{label}</p>
        <div className={`h-8 w-8 rounded-lg flex items-center justify-center ${color}`}>
          <Icon className="h-4 w-4 text-primary-foreground" />
        </div>
      </div>
      <p className="text-sm text-muted-foreground">Real-time</p>
    </div>
  );
}

export function VitalsMonitoringPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Vitals Monitoring</h1>
        <p className="text-sm text-muted-foreground">Real-time patient vitals tracking and monitoring</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Heart Rate" icon={Heart} color="bg-destructive" />
        <StatCard label="Blood Pressure" icon={Droplet} color="bg-warning" />
        <StatCard label="Temperature" icon={Thermometer} color="bg-secondary" />
        <StatCard label="Oxygen Level" icon={Wind} color="bg-primary" />
      </div>

      <div className="rounded-xl border border-border bg-card p-5" style={{ boxShadow: "var(--shadow-sm)" }}>
        <h3 className="font-semibold text-foreground mb-4">Heart Rate Trend (Patient P-10001)</h3>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={vitalsTrend}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="time" />
            <YAxis />
            <Tooltip contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))" }} />
            <Line type="monotone" dataKey="heartRate" stroke="hsl(0,72%,51%)" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="rounded-xl border border-border bg-card overflow-hidden" style={{ boxShadow: "var(--shadow-sm)" }}>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Patient</TableHead>
              <TableHead>Ward</TableHead>
              <TableHead>Heart Rate</TableHead>
              <TableHead>BP</TableHead>
              <TableHead>Temp (°C)</TableHead>
              <TableHead>RR</TableHead>
              <TableHead>SpO₂ (%)</TableHead>
              <TableHead>Last Updated</TableHead>
              <TableHead className="w-12"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {VITAL_RECORDS.map((record) => (
              <TableRow key={record.patientId}>
                <TableCell>
                  <div>
                    <p className="font-medium">{record.patientName}</p>
                    <p className="text-xs text-muted-foreground">{record.patientId}</p>
                  </div>
                </TableCell>
                <TableCell>{record.ward}</TableCell>
                <TableCell>
                  <Badge className={getVitalStatus(record.heartRate, "heartRate")}>
                    {record.heartRate} bpm
                  </Badge>
                </TableCell>
                <TableCell className="font-medium">{record.bloodPressure}</TableCell>
                <TableCell>
                  <Badge className={getVitalStatus(record.temperature, "temperature")}>
                    {record.temperature}°C
                  </Badge>
                </TableCell>
                <TableCell>{record.respiratoryRate}/min</TableCell>
                <TableCell>
                  <Badge className={getVitalStatus(record.oxygenLevel, "oxygenLevel")}>
                    {record.oxygenLevel}%
                  </Badge>
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">{record.lastUpdated}</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>View Trend</DropdownMenuItem>
                      <DropdownMenuItem>Alert Settings</DropdownMenuItem>
                      <DropdownMenuItem>History</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
