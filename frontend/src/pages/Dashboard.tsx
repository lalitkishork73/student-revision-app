import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Pagination, PaginationContent, PaginationItem, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const dashboardData = {
    message: "Dashboard data fetched successfully",
    data: [
        {
            date: "2025-10-08",
            subject: "Web Development",
            type: "MCQ",
            totalMarks: 27,
            attempts: 2,
        },
    ],
};

export default function Dashboard () {
    const totalPDF = 1; // sample static count (replace with real calc)
    const totalMarks = dashboardData.data.reduce((acc, cur) => acc + cur.totalMarks, 0);
    const totalAttempts = dashboardData.data.reduce((acc, cur) => acc + cur.attempts, 0);

    return (
        <div className="p-6 space-y-6 bg-background ">
            {/* Top Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="shadow-sm border-border">
                    <CardContent className="p-4">
                        <p className="text-sm text-muted-foreground">Total PDFs</p>
                        <h2 className="text-2xl font-bold">{totalPDF}</h2>
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

            {/* Chart Section */}
            <Card className="shadow-sm border-border">
                <CardContent className="p-6">
                    <h3 className="text-lg font-semibold mb-4">Performance Overview</h3>
                    <div className="h-72">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={dashboardData.data}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                                <XAxis dataKey="date" stroke="#888" />
                                <YAxis stroke="#888" />
                                <Tooltip />
                                <Line type="monotone" dataKey="totalMarks" stroke="#3b82f6" strokeWidth={2} dot={{ r: 4 }} />
                                <Line type="monotone" dataKey="attempts" stroke="#22c55e" strokeWidth={2} dot={{ r: 4 }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </CardContent>
            </Card>

            {/* Table Section */}
            <Card className="shadow-sm border-border">
                <CardContent className="p-6">
                    <h3 className="text-lg font-semibold mb-4">Detailed Records</h3>
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
                            {dashboardData.data.map((row, idx) => (
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

                    {/* Pagination */}
                    <div className="flex justify-end mt-4">
                        <Pagination>
                            <PaginationContent>
                                <PaginationItem>
                                    <PaginationPrevious href="#" />
                                </PaginationItem>
                                <PaginationItem>
                                    <Button variant="outline" size="sm">1</Button>
                                </PaginationItem>
                                <PaginationItem>
                                    <PaginationNext href="#" />
                                </PaginationItem>
                            </PaginationContent>
                        </Pagination>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
