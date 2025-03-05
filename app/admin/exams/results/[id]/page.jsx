
"use client"
import React, { useState } from "react";
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

const ExamResultTable = () => {
  const { id } = useParams(); // Get Exam ID from URL
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  React.useEffect(() => {
    const fetchResults = async () => {
      try {
        const res = await fetch(`/api/admin/exams/${id}/result`);
        const results = await res.json();
        setData(
          results.map((result) => ({
            studentId: result.studentId,
            name: result.studentName,
            totalScore: result.totalScore,
            totalCorrect: result.totalCorrect,
            totalAnswers: result.totalAnswers,
            percentage: ((result.totalScore / result.totalAnswers) * 100).toFixed(2) + "%",
          }))
        );
      } catch (error) {
        console.error("Error fetching results:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchResults();
  }, [id]);

  const columns = [
    {
      accessorKey: "studentId",
      header: "Student ID",
      cell: ({ row }) => <div>{row.getValue("studentId")}</div>,
    },
    {
      accessorKey: "name",
      header: "Name",
      cell: ({ row }) => <div>{row.getValue("name")}</div>,
    },
    {
      accessorKey: "totalScore",
      header: "Total Score",
      cell: ({ row }) => <div className="font-semibold">{row.getValue("totalScore")}</div>,
    },
    {
      accessorKey: "totalCorrect",
      header: "Correct Answers",
      cell: ({ row }) => <div>{row.getValue("totalCorrect")}</div>,
    },
    {
      accessorKey: "totalAnswers",
      header: "Total Questions",
      cell: ({ row }) => <div>{row.getValue("totalAnswers")}</div>,
    },
    {
      accessorKey: "percentage",
      header: "Score Percentage",
      cell: ({ row }) => (
        <div className="font-semibold text-blue-600">{row.getValue("percentage")}</div>
      ),
    },
  ];

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
