
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


const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
const token = localStorage.getItem("token");

const ExamResultTable = () => {
  const { id } = useParams(); // Get Exam ID from URL
  const [data, setData] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        // Get token from localStorage inside the useEffect to avoid SSR issues
        const token = localStorage.getItem("token");

        const res = await axios.get(`${API_BASE_URL}/admin/exams/result/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        console.log("API Response:", res.data);

        if (!res.data?.subjects || !Array.isArray(res.data.subjects)) {
          console.error("Invalid response format:", res.data);
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
        // For simplicity, we'll assume each subject has an equal weight
        // You may need to adjust this logic based on your actual requirements
        const maxScorePerSubject = 100; // Example value

        // Convert the map to an array and calculate percentages
        const studentsArray = Array.from(studentMap.values()).map(student => {
          const subjectsAttempted = Object.keys(student.scores).length;
          const totalPossible = subjectsAttempted * maxScorePerSubject;
          const percentage = totalPossible > 0
            ? ((student.totalScore / totalPossible) * 100).toFixed(2) + "%"
            : "0.00%";

          return {
            ...student,
            percentage
          };
        });

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


  const columns = React.useMemo(() => [
    {
      accessorKey: "name",
      header: "Student Name",
      cell: ({ row }) => <div className="font-medium">{row.getValue("name")}</div>,
    },
    // Dynamically add a column for each subject
    ...subjects.map(subject => ({
      accessorKey: `scores.${subject}`,
      header: subject,
      cell: ({ row }) => {
        const score = row.original.scores[subject];
        return <div className="">{score !== undefined ? score : "-"}</div>;
      },
    })),
    {
      accessorKey: "percentage",
      header: "Overall Score (%)",
      cell: ({ row }) => (
        <div className="font-semibold text-blue-600">
          {row.getValue("percentage")}
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
  });

  return (
    <div className="flex md:pl-8 min-h-screen">
      <AdminSideBar />
      <div className="flex flex-col w-full">
        <AdminNavBar />
        <h1 className="text-2xl font-bold mt-8 px-10">Exam Results</h1>
        <div className="px-10 pb-3 mt-10 md:pb-8 w-full flex justify-center items-start">
          <Container>
            <div className="rounded-md border">
              {loading ? (
                <div className="p-6 text-center"><Skeleton /></div>
              ) : (
                <Table>
                  <TableHeader>
                    {table.getHeaderGroups().map((headerGroup) => (
                      <TableRow key={headerGroup.id}>
                        {headerGroup.headers.map((header) => (
                          <TableHead key={header.id} className="text-base">
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
                      table.getRowModel().rows.map((row) => (
                        <TableRow key={row.id}>
                          {row.getVisibleCells().map((cell) => (
                            <TableCell key={cell.id} className="text-base">
                              {flexRender(cell.column.columnDef.cell, cell.getContext())}
                            </TableCell>
                          ))}
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={columns.length} className="h-24 text-center">
                          No results found.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              )}
            </div>
            <div className="flex items-center justify-end space-x-2 py-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
              >
                Next
              </Button>
            </div>
          </Container>
        </div>
      </div>
    </div>
  );
};

export default ExamResultTable;
