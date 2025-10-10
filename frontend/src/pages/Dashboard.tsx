import { useEffect } from "react";
import { useDashboardStore } from "@/store/dashboardStore";
import { usePDFStore } from "../store/pdfStore";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function Dashboard() {
  const {
    data,
    loading,
    error,
    subject,
    type,
    fromDate,
    toDate,
    setFilters,
    fetchDashboard,
  } = useDashboardStore();
  const { total } = usePDFStore();
  // console.log(data)

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  const safeData = Array.isArray(data) ? data : [];
  const totalPDF = 1;
  const totalMarks = safeData.reduce((acc, cur) => acc + cur.totalMarks, 0);
  const totalAttempts = safeData.reduce((acc, cur) => acc + cur.attempts, 0);

  return (
    <div className="p-6 space-y-6 bg-background">
      {/* Filters */}
      <Card className="shadow-sm border-border">
        <CardContent className="p-4 flex flex-col md:flex-row md:items-end gap-4">
          {/* Subject */}
          <div className="flex-1">
            <label className="text-sm text-muted-foreground">Subject</label>
            <Input
              value={subject}
              onChange={(e) => setFilters({ subject: e.target.value })}
              placeholder="Enter subject"
            />
          </div>

          {/* Type */}
          <div className="flex-1">
            <label className="text-sm text-muted-foreground">Type</label>
            <Select
              value={type}
              onValueChange={(val) => setFilters({ type: val })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="MCQ">MCQ</SelectItem>
                <SelectItem value="SAQ">SAQ</SelectItem>
                <SelectItem value="LAQ">LAQ</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Date From */}
          <div className="flex-1">
            <label className="text-sm text-muted-foreground">From Date</label>
            <Input
              type="date"
              value={fromDate}
              onChange={(e) => setFilters({ fromDate: e.target.value })}
            />
          </div>

          {/* Date To */}
          <div className="flex-1">
            <label className="text-sm text-muted-foreground">To Date</label>
            <Input
              type="date"
              value={toDate}
              onChange={(e) => setFilters({ toDate: e.target.value })}
            />
          </div>

          {/* Apply Button */}
          <Button onClick={() => fetchDashboard()} className="mt-2">
            Apply Filters
          </Button>
        </CardContent>
      </Card>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="shadow-sm border-border">
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Total PDFs</p>
            <h2 className="text-2xl font-bold">{total}</h2>
          </CardContent>
        </Card>
        <Card className="shadow-sm border-border">
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Total Marks</p>
            <h2 className="text-2xl font-bold">{totalMarks}</h2>
          </CardContent>
        </Card>
        <Card className="shadow-sm border-border">
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Total Attempts</p>
            <h2 className="text-2xl font-bold">{totalAttempts}</h2>
          </CardContent>
        </Card>
      </div>

      {/* Chart */}
      <Card className="shadow-sm border-border">
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold mb-4">Performance Overview</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={safeData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                <XAxis dataKey="date" stroke="#888" />
                <YAxis stroke="#888" />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="totalMarks"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                />
                <Line
                  type="monotone"
                  dataKey="attempts"
                  stroke="#22c55e"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card className="shadow-sm border-border">
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold mb-4">Detailed Records</h3>
          {loading ? (
            <p>Loading...</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Subject</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Total Marks</TableHead>
                  <TableHead>Attempts</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {safeData.map((row, idx) => (
                  <TableRow key={idx}>
                    <TableCell>{row.date}</TableCell>
                    <TableCell>{row.subject}</TableCell>
                    <TableCell>{row.type}</TableCell>
                    <TableCell>{row.totalMarks}</TableCell>
                    <TableCell>{row.attempts}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
