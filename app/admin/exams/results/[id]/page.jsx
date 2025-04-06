"use client"
import React, { useEffect, useState } from "react";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Container from "@/app/components/Container";
import { Skeleton } from "@/components/ui/skeleton";
import AdminSideBar from "@/app/admin/_components/AdminSideBar";
import AdminNavBar from "@/app/admin/_components/AdminNavBar";
import axios from "axios";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

const ExamResultTable = () => {
  const { id } = useParams();
  const [data, setData] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [examName, setExamName] = useState("Exam Results");

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await axios.get(`${API_BASE_URL}/admin/exams/result/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        console.log("API Response:", res.data);

        // Set exam name if available
        if (res.data?.examName) {
          setExamName(res.data.examName);
        }

        if (!res.data?.subjects || !Array.isArray(res.data.subjects)) {
          setData([]);
          setLoading(false);
          return;
        }

        // Extract unique subjects
        const subjectsList = res.data.subjects.map(item => item.subject.toUpperCase());
        const uniqueSubjects = [...new Set(subjectsList)];
        setSubjects(uniqueSubjects);

        // Create a map of students and their scores
        const studentMap = new Map();

        // Process each subject and its results
        res.data.subjects.forEach(subjectData => {
          const subject = subjectData.subject.toUpperCase();

          // Process each student result
          subjectData.results.forEach(result => {
            const studentName = result.student;
            const score = result.score;

            // If student doesn't exist in map, add them
            if (!studentMap.has(studentName)) {
              studentMap.set(studentName, {
                name: studentName,
                scores: {},
                totalScore: 0,
                totalPossible: 0
              });
            }

            // Add this subject score to the student's record
            const student = studentMap.get(studentName);
            student.scores[subject] = score;
            student.totalScore += score;
          });
        });

        // Calculate maximum possible score per subject
        const maxScorePerSubject = 100;

        // Convert the map to an array and calculate percentages
        const studentsArray = Array.from(studentMap.values()).map(student => {
          const subjectsAttempted = Object.keys(student.scores).length;
          const totalPossible = subjectsAttempted * maxScorePerSubject;
          const percentage = totalPossible > 0
            ? ((student.totalScore / totalPossible) * 100).toFixed(2) + "%"
            : "0.00%";
          
          // Calculate a numeric percentage for sorting
          const numericPercentage = totalPossible > 0
            ? (student.totalScore / totalPossible) * 100
            : 0;

          return {
            ...student,
            percentage,
            numericPercentage
          };
        });

        // Sort students by percentage (highest first)
        studentsArray.sort((a, b) => b.numericPercentage - a.numericPercentage);

        setData(studentsArray);
      } catch (error) {
        console.error("Error fetching results:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchResults();
    }
  }, [id]);

  // Function to get score color class based on score value
  const getScoreColorClass = (score) => {
    if (score === undefined) return "text-gray-400";
    if (score >= 80) return "text-green-600 font-medium";
    if (score >= 70) return "text-blue-600 font-medium";
    if (score >= 60) return "text-yellow-600 font-medium";
    return "text-red-600 font-medium";
  };

  // Function to get percentage badge color
  const getPercentageBadgeVariant = (percentageStr) => {
    const percentage = parseFloat(percentageStr);
    if (percentage >= 80) return "success";
    if (percentage >= 70) return "default";
    if (percentage >= 60) return "warning";
    return "destructive";
  };

  const columns = React.useMemo(() => [
    {
      accessorKey: "name",
      header: "STUDENT NAME",
      cell: ({ row }) => (
        <div className="font-medium text-gray-900">
          {row.getValue("name")}
        </div>
      ),
    },
    // Dynamically add a column for each subject
    ...subjects.map(subject => ({
      accessorKey: `scores.${subject}`,
      header: subject,
      cell: ({ row }) => {
        const score = row.original.scores[subject];
        return (
          <div className={getScoreColorClass(score)}>
            {score !== undefined ? score : "-"}
          </div>
        );
      },
    })),
    {
      accessorKey: "totalScore",
      header: "TOTAL SCORE",
      cell: ({ row }) => (
        <div className="font-semibold text-gray-900">
          {row.getValue("totalScore")}
        </div>
      ),
    },
  ], [subjects]);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    initialState: {
      pagination: {
        pageSize: 10,
      },
    },
  });

  return (
    <div className="flex md:pl-8 min-h-screen bg-gray-50">
      <AdminSideBar />
      <div className="flex flex-col w-full">
        <AdminNavBar />
        <div className="px-10 py-8">
          <Card className="shadow-sm border-gray-200">
            <CardHeader className="pb-2 border-b bg-gray-50">
              <CardTitle className="text-2xl font-bold text-gray-800">{examName}</CardTitle>
              <div className="text-sm text-gray-500 mt-1">
                Showing {data.length} student results across {subjects.length} subjects
              </div>
            </CardHeader>
            <CardContent className="p-0">
              {loading ? (
                <div className="p-12">
                  <div className="space-y-4">
                    <Skeleton className="w-full h-12" />
                    <Skeleton className="w-full h-12" />
                    <Skeleton className="w-full h-12" />
                    <Skeleton className="w-full h-12" />
                  </div>
                </div>
              ) : (
                <div className="overflow-x-auto rounded-b-lg">
                  <Table>
                    <TableHeader className="bg-gray-100">
                      {table.getHeaderGroups().map((headerGroup) => (
                        <TableRow key={headerGroup.id}>
                          {headerGroup.headers.map((header) => (
                            <TableHead 
                              key={header.id} 
                              className="text-sm font-semibold text-gray-700 py-4"
                            >
                              {header.isPlaceholder
                                ? null
                                : flexRender(header.column.columnDef.header, header.getContext())}
                            </TableHead>
                          ))}
                        </TableRow>
                      ))}
                    </TableHeader>
                    <TableBody>
                      {table.getRowModel().rows?.length ? (
                        table.getRowModel().rows.map((row, index) => (
                          <TableRow 
                            key={row.id} 
                            className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
                          >
                            {row.getVisibleCells().map((cell) => (
                              <TableCell 
                                key={cell.id} 
                                className="py-3 text-sm"
                              >
                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                              </TableCell>
                            ))}
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={columns.length} className="h-24 text-center text-gray-500">
                            No results found for this exam.
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              )}
              <div className="flex items-center justify-between p-4 border-t">
                <div className="text-sm text-gray-500">
                  Page {table.getState().pagination.pageIndex + 1} of{" "}
                  {table.getPageCount()}
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => table.previousPage()}
                    disabled={!table.getCanPreviousPage()}
                    className="h-8 px-3 text-xs"
                  >
                    <ChevronLeft className="h-4 w-4 mr-1" />
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => table.nextPage()}
                    disabled={!table.getCanNextPage()}
                    className="h-8 px-3 text-xs"
                  >
                    Next
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ExamResultTable;