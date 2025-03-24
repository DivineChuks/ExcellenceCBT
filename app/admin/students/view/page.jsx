"use client";
import React, { useEffect, useState } from "react";
import AdminNavBar from "../../_components/AdminNavBar";
import { Skeleton } from "@/components/ui/skeleton";
import AdminSideBar from "../../_components/AdminSideBar";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import Container from "@/app/components/Container";
import {
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { 
    MoreHorizontal, 
    PlusCircle, 
    Search, 
    UserPlus, 
    FileText, 
    Edit2, 
    Trash2,
    ChevronLeft,
    ChevronRight 
} from "lucide-react";
import axios from "axios";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL

const AllStudents = () => {
    const [loading, setLoading] = useState(true);
    const [students, setStudents] = useState([]);
    const [sorting, setSorting] = useState([]);
    const [columnFilters, setColumnFilters] = useState([]);
    const [columnVisibility, setColumnVisibility] = useState({});
    const [rowSelection, setRowSelection] = useState({});
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [selectedStudentId, setSelectedStudentId] = useState(null);
    const router = useRouter();
    const token = localStorage.getItem("token");
    
    // Fetch students
    useEffect(() => {
        const fetchStudents = async () => {
            try {
                setLoading(true);
                const response = await axios.get(`${API_BASE_URL}/admin/students/getStudents`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    }
                });
                setStudents(response.data);
            } catch (error) {
                console.error("Failed to fetch students:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchStudents();
    }, []);

    const handleDeleteStudent = async (id) => {
        setIsDeleting(true);
        try {
            await axios.delete(`${API_BASE_URL}/admin/students/deleteStudent/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });
            // Remove the deleted student from the state
            setStudents((prevStudents) => prevStudents.filter((student) => student._id !== id));
            setIsDialogOpen(false);
        } catch (error) {
            console.error("Failed to delete student:", error);
        } finally {
            setIsDeleting(false);
        }
    };

    const columns = [
        {
            accessorKey: "name",
            header: "Student Name",
            cell: ({ row }) => (
                <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-700 font-medium">
                        {row.original.name.charAt(0)}
                    </div>
                    <div className="font-medium">{row.original.name}</div>
                </div>
            ),
        },
        {
            accessorKey: "email",
            header: "Email Address",
        },
        {
            accessorKey: "regNo",
            header: "Registration No.",
        },
        // {
        //     accessorKey: "assignedExam",
        //     header: "Assigned Exam",
        //     cell: ({ row }) => {
        //         // Display assigned exam or a badge indicating none
        //         return row.original.assignedExam ? (
        //             <div className="flex items-center gap-2">
        //                 <FileText size={16} className="text-blue-500" />
        //                 <span>{row.original.assignedExam}</span>
        //             </div>
        //         ) : (
        //             <Badge variant="outline" className="bg-amber-50 text-amber-600 border-amber-200">
        //                 Not Assigned
        //             </Badge>
        //         );
        //     },
        // },
        {
            accessorKey: "dateRegistered",
            header: "Registration Date",
            cell: ({ row }) => {
                const date = new Date(row.original.dateRegistered);
                return (
                    <div className="font-medium">
                        {date.toLocaleDateString("en-GB", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric"
                        })}
                    </div>
                );
            },
        },
        {
            id: "actions",
            enableHiding: false,
            header: "Actions",
            cell: ({ row }) => {
                return (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Open menu</span>
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-[180px]">
                            <DropdownMenuLabel>Student Actions</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => router.push(`/admin/students/${row.original._id}`)} className="cursor-pointer">
                                <FileText className="mr-2 h-4 w-4 text-blue-500" />
                                <span>Assign Exam</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => router.push(`/admin/students/${row.original._id}`)} className="cursor-pointer">
                                <Edit2 className="mr-2 h-4 w-4 text-amber-500" />
                                <span>Edit Details</span>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem 
                                onClick={() => {
                                    setSelectedStudentId(row.original._id);
                                    setIsDialogOpen(true);
                                }}
                                className="cursor-pointer text-red-600"
                            >
                                <Trash2 className="mr-2 h-4 w-4" />
                                <span>Delete</span>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                )
            }
        }
    ];

    const table = useReactTable({
        data: students,
        columns,
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onColumnVisibilityChange: setColumnVisibility,
        onRowSelectionChange: setRowSelection,
        state: {
            sorting,
            columnFilters,
            columnVisibility,
            rowSelection,
        },
    });

    return (
        <div className="flex md:pl-8 min-h-screen bg-gray-50">
            <AdminSideBar />
            <div className="flex flex-col w-full">
                <AdminNavBar />
                <div className="px-4 py-3 md:py-6 w-full">
                    <Container>
                        <Card className="border-none shadow-sm">
                            <CardHeader className="bg-white rounded-t-lg border-b pb-6">
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                    <CardTitle className="text-2xl font-bold text-gray-800">
                                        Students Management
                                    </CardTitle>
                                    <div className="flex flex-col sm:flex-row gap-3">
                                        <div className="relative">
                                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                                            <Input
                                                placeholder="Search students..."
                                                className="pl-8 bg-gray-50 border-gray-200"
                                                value={(table.getColumn("name")?.getFilterValue()) ?? ""}
                                                onChange={(event) =>
                                                    table.getColumn("name")?.setFilterValue(event.target.value)
                                                }
                                            />
                                        </div>
                                        <Link href="/admin/students/register">
                                            <Button className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 h-10 flex gap-2 items-center">
                                                <UserPlus className="h-4 w-4" />
                                                Register Student
                                            </Button>
                                        </Link>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="p-0">
                                {loading ? (
                                    <div className="space-y-4 p-6">
                                        <Skeleton className="h-12 w-full rounded-md" />
                                        <Skeleton className="h-12 w-full rounded-md" />
                                        <Skeleton className="h-12 w-full rounded-md" />
                                        <Skeleton className="h-12 w-full rounded-md" />
                                    </div>
                                ) : (
                                    <>
                                        <div className="rounded-md overflow-hidden">
                                            <Table>
                                                <TableHeader className="bg-gray-50">
                                                    {table.getHeaderGroups().map((headerGroup) => (
                                                        <TableRow key={headerGroup.id} className="hover:bg-gray-50 border-b border-gray-200">
                                                            {headerGroup.headers.map((header) => (
                                                                <TableHead 
                                                                    key={header.id} 
                                                                    className="text-sm font-semibold text-gray-700 py-4"
                                                                >
                                                                    {header.isPlaceholder
                                                                        ? null
                                                                        : flexRender(
                                                                            header.column.columnDef.header,
                                                                            header.getContext()
                                                                        )}
                                                                </TableHead>
                                                            ))}
                                                        </TableRow>
                                                    ))}
                                                </TableHeader>
                                                <TableBody>
                                                    {table.getRowModel().rows?.length ? (
                                                        table.getRowModel().rows.map((row) => (
                                                            <TableRow
                                                                key={row.id}
                                                                data-state={row.getIsSelected() && "selected"}
                                                                className="hover:bg-gray-50 border-b border-gray-100"
                                                            >
                                                                {row.getVisibleCells().map((cell) => (
                                                                    <TableCell key={cell.id} className="py-3 text-sm text-gray-700">
                                                                        {flexRender(
                                                                            cell.column.columnDef.cell,
                                                                            cell.getContext()
                                                                        )}
                                                                    </TableCell>
                                                                ))}
                                                            </TableRow>
                                                        ))
                                                    ) : (
                                                        <TableRow>
                                                            <TableCell
                                                                colSpan={columns.length}
                                                                className="h-24 text-center text-gray-500"
                                                            >
                                                                No students found.
                                                            </TableCell>
                                                        </TableRow>
                                                    )}
                                                </TableBody>
                                            </Table>
                                        </div>
                                        <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100">
                                            <div className="text-sm text-gray-500">
                                                Showing {table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1}-
                                                {Math.min(
                                                    (table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize,
                                                    table.getFilteredRowModel().rows.length
                                                )} of {table.getFilteredRowModel().rows.length} students
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => table.previousPage()}
                                                    disabled={!table.getCanPreviousPage()}
                                                    className="h-8 px-3 text-gray-700 border-gray-200"
                                                >
                                                    <ChevronLeft className="h-4 w-4 mr-1" />
                                                    Previous
                                                </Button>
                                                <div className="text-sm text-gray-600 font-medium">
                                                    Page {table.getState().pagination.pageIndex + 1} of{" "}
                                                    {table.getPageCount()}
                                                </div>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => table.nextPage()}
                                                    disabled={!table.getCanNextPage()}
                                                    className="h-8 px-3 text-gray-700 border-gray-200"
                                                >
                                                    Next
                                                    <ChevronRight className="h-4 w-4 ml-1" />
                                                </Button>
                                            </div>
                                        </div>
                                    </>
                                )}
                            </CardContent>
                        </Card>
                    </Container>
                </div>
            </div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="mx-auto max-w-[90%] md:max-w-[500px] bg-white">
                    <DialogHeader>
                        <DialogTitle className="text-xl font-bold text-gray-800">Confirm Delete</DialogTitle>
                        <DialogDescription className="text-gray-600 pt-2">
                            Are you sure you want to delete this student? This action cannot
                            be undone and all associated data will be permanently removed.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="flex flex-col-reverse sm:flex-row gap-2 sm:gap-0">
                        <Button
                            variant="outline"
                            onClick={() => setIsDialogOpen(false)}
                            className="border-gray-200 text-gray-700 hover:bg-gray-50"
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={() => handleDeleteStudent(selectedStudentId)}
                            className="bg-red-600 hover:bg-red-700 text-white flex gap-2 items-center"
                            disabled={isDeleting}
                        >
                            {isDeleting ? (
                                <Image
                                    src="/loader.gif"
                                    className="text-white"
                                    alt="loader"
                                    width={20}
                                    height={20}
                                />
                            ) : (
                                <Trash2 className="h-4 w-4" />
                            )}
                            Delete Student
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default AllStudents;