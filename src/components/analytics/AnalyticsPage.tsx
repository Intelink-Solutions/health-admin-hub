import { useState } from "react";
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from "recharts";
import {
  TrendingUp, Users, Activity, AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const chartData = [
  { month: "Jan", patients: 240, appointments: 221, revenue: 45000 },
  { month: "Feb", patients: 321, appointments: 281, revenue: 52000 },
  { month: "Mar", patients: 351, appointments: 300, revenue: 58000 },
  { month: "Apr", patients: 425, appointments: 390, revenue: 72000 },
  { month: "May", patients: 512, appointments: 480, revenue: 85000 },
  { month: "Jun", patients: 598, appointments: 550, revenue: 98000 },
];

const departmentData = [
  { name: "Cardiology", value: 28, color: "#ef4444" },
  { name: "Pediatrics", value: 22, color: "#f59e0b" },
  { name: "Orthopedics", value: 19, color: "#3b82f6" },
  { name: "Neurology", value: 16, color: "#8b5cf6" },
  { name: "Others", value: 15, color: "#10b981" },
];

const metricsData = [
  { label: "Total Patients", value: 2847, icon: Users, trend: "+12.5%" },
  { label: "Appointments", value: 2821, icon: Activity, trend: "+8.2%" },
  { label: "Avg Wait Time", value: "18 min", icon: AlertCircle, trend: "-2.3%" },
  { label: "Utilization", value: "87%", icon: TrendingUp, trend: "+5.1%" },
];

function MetricCard({ item }: { item: typeof metricsData[0] }) {
  const Icon = item.icon;
  return (
    <Card>
      <CardContent className="p-5">
        <div className="flex items-center justify-between mb-3">
          <p className="text-sm text-muted-foreground uppercase">{item.label}</p>
          <Icon className="h-5 w-5 text-primary" />
        </div>
        <p className="text-2xl font-bold text-foreground mb-2">{item.value}</p>
        <p className="text-xs text-green-600">{item.trend} vs last month</p>
      </CardContent>
    </Card>
  );
}

export function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState("6months");

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Analytics Dashboard</h1>
          <p className="text-sm text-muted-foreground">System-wide performance metrics and trends</p>
        </div>
        <select
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value)}
          className="px-4 py-2 border border-border rounded-lg text-foreground bg-background"
        >
          <option value="week">Last 7 days</option>
          <option value="month">Last 30 days</option>
          <option value="6months">Last 6 months</option>
          <option value="year">Last year</option>
        </select>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {metricsData.map((metric) => (
          <MetricCard key={metric.label} item={metric} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Patient & Appointment Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="month" stroke="var(--muted-foreground)" />
                <YAxis stroke="var(--muted-foreground)" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "var(--card)",
                    border: "1px solid var(--border)",
                  }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="patients"
                  stroke="#3b82f6"
                  dot={{ fill: "#3b82f6" }}
                  name="Patients"
                />
                <Line
                  type="monotone"
                  dataKey="appointments"
                  stroke="#10b981"
                  dot={{ fill: "#10b981" }}
                  name="Appointments"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Department Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={departmentData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name} ${value}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {departmentData.map((item) => (
                    <Cell key={`cell-${item.name}`} fill={item.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `${value}%`} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Revenue Trend</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="month" stroke="var(--muted-foreground)" />
              <YAxis stroke="var(--muted-foreground)" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "var(--card)",
                  border: "1px solid var(--border)",
                }}
              />
              <Bar dataKey="revenue" fill="#8b5cf6" name="Revenue (₦)" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <div className="flex gap-3">
        <Button variant="outline">Export Report</Button>
        <Button variant="outline">Print Dashboard</Button>
      </div>
    </div>
  );
}
