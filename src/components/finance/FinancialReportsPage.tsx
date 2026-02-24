import { useState } from "react";
import {
  BarChart3, Download, Filter, Calendar, TrendingUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, PieChart, Pie, Cell,
} from "recharts";

const revenueByMonth = [
  { month: "Jan", revenue: 456000, expenses: 180000 },
  { month: "Feb", revenue: 389000, expenses: 165000 },
  { month: "Mar", revenue: 412000, expenses: 172000 },
  { month: "Apr", revenue: 478000, expenses: 195000 },
  { month: "May", revenue: 521000, expenses: 210000 },
  { month: "Jun", revenue: 589000, expenses: 235000 },
];

const departmentRevenue = [
  { name: "Cardiology", value: 145000 },
  { name: "Orthopedics", value: 98000 },
  { name: "Maternity", value: 87000 },
  { name: "Emergency", value: 120000 },
  { name: "Others", value: 152000 },
];

const paymentMethods = [
  { method: "Insurance", amount: 425000, percentage: 48 },
  { method: "Cash", amount: 312000, percentage: 35 },
  { method: "Card", amount: 145000, percentage: 16 },
  { method: "Transfer", amount: 20000, percentage: 2 },
];

const COLORS = ["hsl(210,88%,42%)", "hsl(168,60%,40%)", "hsl(38,92%,50%)", "hsl(0,72%,51%)"];

function StatCard({ label, value, change }: { label: string; value: string; change?: string }) {
  return (
    <Card>
      <CardContent className="p-5">
        <p className="text-xs font-medium text-muted-foreground uppercase mb-2">{label}</p>
        <p className="text-2xl font-bold text-foreground">{value}</p>
        {change && (
          <p className="text-xs text-success mt-2 flex items-center gap-1">
            <TrendingUp className="h-3 w-3" /> {change}
          </p>
        )}
      </CardContent>
    </Card>
  );
}

export function FinancialReportsPage() {
  const [dateRange, setDateRange] = useState("6months");

  const totalRevenue = revenueByMonth.reduce((sum, m) => sum + m.revenue, 0);
  const totalExpenses = revenueByMonth.reduce((sum, m) => sum + m.expenses, 0);
  const netProfit = totalRevenue - totalExpenses;
  const profitMargin = ((netProfit / totalRevenue) * 100).toFixed(1);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Financial Reports</h1>
          <p className="text-sm text-muted-foreground">Hospital financial analytics and reports</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <Download className="h-4 w-4" /> Export
          </Button>
          <select 
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="px-3 py-2 border border-border rounded-lg text-foreground bg-background text-sm"
          >
            <option value="3months">Last 3 months</option>
            <option value="6months">Last 6 months</option>
            <option value="12months">Last 12 months</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Revenue" value={`₵${(totalRevenue / 1000000).toFixed(1)}M`} change="+12.5%" />
        <StatCard label="Total Expenses" value={`₵${(totalExpenses / 1000000).toFixed(1)}M`} change="+5.2%" />
        <StatCard label="Net Profit" value={`₵${(netProfit / 1000000).toFixed(1)}M`} change="+18.9%" />
        <StatCard label="Profit Margin" value={`${profitMargin}%`} change="+2.1%" />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Revenue vs Expenses</span>
              <Badge variant="outline">Monthly</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={revenueByMonth}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))" }} />
                <Legend />
                <Bar dataKey="revenue" fill="hsl(210,88%,42%)" />
                <Bar dataKey="expenses" fill="hsl(0,72%,51%)" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Revenue by Department</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={departmentRevenue}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name} ₵${(value / 1000).toFixed(0)}K`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {departmentRevenue.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Payment Methods Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 font-medium">Payment Method</th>
                  <th className="text-right py-3 px-4 font-medium">Amount</th>
                  <th className="text-right py-3 px-4 font-medium">Percentage</th>
                </tr>
              </thead>
              <tbody>
                {paymentMethods.map((pm) => (
                  <tr key={pm.method} className="border-b border-border hover:bg-muted/30">
                    <td className="py-3 px-4">{pm.method}</td>
                    <td className="text-right py-3 px-4 font-medium">₵{pm.amount.toLocaleString()}</td>
                    <td className="text-right py-3 px-4">
                      <div className="flex items-center justify-end gap-2">
                        <div className="h-2 w-24 bg-muted rounded-full overflow-hidden">
                          <div className="h-full bg-primary" style={{ width: `${pm.percentage}%` }} />
                        </div>
                        <span className="text-muted-foreground">{pm.percentage}%</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
