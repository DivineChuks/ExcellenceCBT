"use client";
import React from "react";
import { PieChart, Pie, Cell, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { CheckCircle, XCircle } from "lucide-react";
import StudentSideBar from "../_components/StudentSideBar";
import StudentNavBar from "../_components/StudentNavBar";

const Scores = () => {
    // Example Score Data
    const scoresData = [
        { subject: "Mathematics", score: 80, grade: "A", status: "Passed" },
        { subject: "English", score: 65, grade: "B", status: "Passed" },
        { subject: "Physics", score: 45, grade: "C", status: "Failed" },
        { subject: "Biology", score: 75, grade: "A", status: "Passed" },
        { subject: "Chemistry", score: 50, grade: "C", status: "Failed" },
    ];

    // Pie Chart Data
    const pieData = [
        { name: "Passed", value: scoresData.filter((s) => s.status === "Passed").length },
        { name: "Failed", value: scoresData.filter((s) => s.status === "Failed").length },
    ];
    const COLORS = ["#4CAF50", "#FF5733"];

    // Bar Chart Data
    const barData = scoresData.map((s) => ({ subject: s.subject, score: s.score }));

    return (
        <div className="flex md:pl-8 min-h-screen">
            <StudentSideBar />
            <div className="flex flex-col w-full">
                <StudentNavBar />
                <div className="px-8 py-6">
                    <h2 className="text-2xl font-bold mb-8">Exam Scores</h2>
                    <div className="grid gap-8 mb-8">
                        {/* Score Table using ShadCN */}
                        <Card className="col-span-1">
                            <CardHeader>
                                <CardTitle>Score Breakdown</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <Table>
                                    <TableCaption>Summary of your exam performance</TableCaption>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Subject</TableHead>
                                            <TableHead className="text-center">Score</TableHead>
                                            <TableHead className="text-center">Grade</TableHead>
                                            <TableHead className="text-center">Status</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {scoresData.map((item, index) => (
                                            <TableRow key={index}>
                                                <TableCell>{item.subject}</TableCell>
                                                <TableCell className="text-center">{item.score}</TableCell>
                                                <TableCell className="text-center">{item.grade}</TableCell>
                                                <TableCell className="text-center">
                                                    <div className="flex items-center justify-center gap-2">
                                                        {item.status === "Passed" ? (
                                                            <CheckCircle className="text-green-500" size={18} />
                                                        ) : (
                                                            <XCircle className="text-red-500" size={18} />
                                                        )}
                                                        {item.status}
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </CardContent>
                        </Card>
                    </div>
                    {/* Progress Section */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Overall Exam Progress</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4 pb-8">
                                {scoresData.map((item, index) => (
                                    <div key={index}>
                                        <p className="text-sm font-medium">{item.subject}</p>
                                        <Progress value={item.score} className="h-2 bg-gray-200 [&::-webkit-progress-value]:bg-blue-500" />
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default Scores;
