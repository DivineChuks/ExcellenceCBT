"use client";
import React, { useState, useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Container from "@/app/components/Container";
import {
    flexRender,
    getCoreRowModel,
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
    FileText,
    Clock,
    BookOpen,
    List,
    ChevronLeft,
    ChevronRight,
    AlertTriangle
} from "lucide-react";
import axios from "axios";
import { useRouter } from "next/navigation";
import AdminSideBar from "../../_components/AdminSideBar";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import AdminNavBar from "../../_components/AdminNavBar";
import Link from "next/link";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm } from "react-hook-form";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

const AllExams = () => {
    const [loading, setLoading] = useState(true);
    const [exams, setExams] = useState([]);
    const [filteredExams, setFilteredExams] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const router = useRouter();
    const token = localStorage.getItem("token");
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [selectedExamId, setSelectedExamId] = useState("");
    const [subjects, setSubjects] = useState([]);
    const [stats, setStats] = useState({
        totalExams: 0,
        totalQuestions: 0,
        totalSubjects: 0
    });

    const {
        register,
        handleSubmit,
        setValue,
        watch,
        formState: { errors },
    } = useForm({
        defaultValues: {
            subject: "",
        },
    });

    useEffect(() => {
        const fetchExams = async () => {
            try {
                setLoading(true);
                const response = await axios.get(`${API_BASE_URL}/admin/exams/getExams`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    }
                });
                const examsData = response.data.findExams;
                setExams(examsData);
                setFilteredExams(examsData);

                // Calculate stats correctly
                const uniqueSubjects = new Set();
                let questionsCount = 0;

                examsData.forEach(exam => {
                    // Ensure we're adding a number, not concatenating strings
                    questionsCount += Number(exam.numberQuestions) || 0;
                    exam.subjects?.forEach(subject => {
                        uniqueSubjects.add(subject._id);
                    });
                });

                setStats({
                    totalExams: examsData.length,
                    totalQuestions: questionsCount,
                    totalSubjects: uniqueSubjects.size
                });

            } catch (error) {
                console.error("Failed to fetch exams:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchExams();
    }, []);

    useEffect(() => {
        if (searchQuery.trim() === "") {
            setFilteredExams(exams);
        } else {
            const filtered = exams.filter(exam =>
                exam.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                exam.subjects?.some(subject =>
                    subject.title.toLowerCase().includes(searchQuery.toLowerCase())
                )
            );
            setFilteredExams(filtered);
        }
    }, [searchQuery, exams]);

    const handleDeleteExam = async (id) => {
        setIsDeleting(true);
        try {
            await axios.delete(`${API_BASE_URL}/admin/exams/deleteExam/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            // Find the deleted exam to update stats correctly
            const deletedExam = exams.find(exam => exam._id === id);
            const deletedQuestions = Number(deletedExam?.numberQuestions) || 0;

            // Update exams state
            setExams((prevExams) => prevExams.filter((exam) => exam._id !== id));
            setFilteredExams((prevExams) => prevExams.filter((exam) => exam._id !== id));
            setIsDeleteOpen(false);

            // Update stats correctly
            setStats(prev => ({
                ...prev,
                totalExams: prev.totalExams - 1,
                totalQuestions: prev.totalQuestions - deletedQuestions
            }));

        } catch (error) {
            console.error("Failed to delete exam:", error);
        } finally {
            setIsDeleting(false);
        }
    };

    const columns = [
        {
            accessorKey: "title",
            header: "Exam Title",
            cell: ({ row }) => {
                return (
                    <div className="flex items-center">
                        <FileText className="mr-2 h-4 w-4 text-blue-500" />
                        <span className="font-medium">{row.original.title}</span>
                    </div>
                );
            }
        },
        {
            accessorKey: "duration",
            header: "Duration",
            cell: ({ row }) => {
                return (
                    <div className="flex items-center text-nowrap">
                        <Clock className="mr-1 h-4 w-8 text-gray-500" />
                        <span className="text-sm">{row.original.duration} min</span>
                    </div>
                );
            }
        },
        {
            accessorKey: "subjects",
            header: "Subjects",
            cell: ({ row }) => {
                const subjects = row.original.subjects || [];
                if (subjects.length === 0) return <span className="text-gray-500">No subjects</span>;

                return (
                    <div className="flex flex-wrap gap-1">
                        {subjects.map(subject => (
                            <Badge key={subject._id} variant="outline" className="bg-blue-50">
                                <BookOpen className="mr-1 h-3 w-3" />
                                {subject.title}
                            </Badge>
                        ))}
                    </div>
                );
            },
        },
        {
            accessorKey: "numberQuestions",
            header: "Questions",
            cell: ({ row }) => {
                return (
                    <div className="flex items-center">
                        <List className="mr-2 h-4 w-4 text-gray-500" />
                        <span>{row.original.numberQuestions}</span>
                    </div>
                );
            }
        },
        {
            id: "actions",
            cell: ({ row }) => {
                return (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => router.push(`/admin/exams/manage/${row.original._id}`)} className="cursor-pointer">
                                <FileText className="mr-2 h-4 w-4" />
                                <span>Manage Exam</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => router.push(`/admin/exams/results/${row.original._id}`)} className="cursor-pointer">
                                <BookOpen className="mr-2 h-4 w-4" />
                                <span>View Results</span>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                                onClick={() => {
                                    setSelectedExamId(row.original._id);
                                    setIsDeleteOpen(true);
                                }}
                                className="text-red-600 cursor-pointer"
                            >
                                <AlertTriangle className="mr-2 h-4 w-4" />
                                <span>Delete</span>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                );
            },
        },
    ];

    const table = useReactTable({
        data: filteredExams,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        initialState: {
            pagination: {
                pageSize: 8,
            },
        },
    });

    return (
        <div className="flex md:pl-8 min-h-screen bg-gray-50">
            <AdminSideBar />
            <div className="flex flex-col w-full">
                <AdminNavBar />
                <div className="px-4 py-3 md:py-8 w-full flex justify-center items-start">
                    <Container>
                        {loading ? (
                            <div className="p-6 space-y-4">
                                <Skeleton className="h-24 w-full" />
                                <Skeleton className="h-64 w-full" />
                            </div>
                        ) : (
                            <div className="p-6 space-y-6">
                                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                                    <div>
                                        <h1 className="text-2xl font-bold text-gray-800">Exam Management</h1>
                                        <p className="text-gray-500 mt-1">View and manage all exams in the system</p>
                                    </div>
                                    <Link href="/admin/exams/add">
                                        <Button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 flex gap-2 items-center rounded-md transition-all">
                                            <PlusCircle className="h-4 w-4" />
                                            Create New Exam
                                        </Button>
                                    </Link>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <Card className="bg-white shadow-sm hover:shadow-md transition-shadow">
                                        <CardHeader className="pb-2">
                                            <CardTitle className="text-lg text-gray-600">Total Exams</CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="flex items-center">
                                                <FileText className="h-8 w-8 text-blue-500 mr-3" />
                                                <span className="text-3xl font-bold text-gray-800">{stats.totalExams}</span>
                                            </div>
                                        </CardContent>
                                    </Card>
                                    <Card className="bg-white shadow-sm hover:shadow-md transition-shadow">
                                        <CardHeader className="pb-2">
                                            <CardTitle className="text-lg text-gray-600">Total Questions</CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="flex items-center">
                                                <List className="h-8 w-8 text-green-500 mr-3" />
                                                <span className="text-3xl font-bold text-gray-800">{stats.totalQuestions.toLocaleString()}</span>
                                            </div>
                                        </CardContent>
                                    </Card>
                                    <Card className="bg-white shadow-sm hover:shadow-md transition-shadow">
                                        <CardHeader className="pb-2">
                                            <CardTitle className="text-lg text-gray-600">Subjects Covered</CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="flex items-center">
                                                <BookOpen className="h-8 w-8 text-purple-500 mr-3" />
                                                <span className="text-3xl font-bold text-gray-800">{stats.totalSubjects}</span>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>

                                <div className="relative">
                                    <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                    <Input
                                        placeholder="Search exams by title or subject..."
                                        className="pl-10 bg-white"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                    />
                                </div>

                                <Card className="bg-white shadow-sm overflow-hidden border-0">
                                    <Table>
                                        <TableHeader className="bg-gray-50">
                                            {table.getHeaderGroups().map((headerGroup) => (
                                                <TableRow key={headerGroup.id}>
                                                    {headerGroup.headers.map((header) => (
                                                        <TableHead key={header.id} className="text-base font-semibold text-gray-700">
                                                            {flexRender(header.column.columnDef.header, header.getContext())}
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
                                                        data-state={row.getIsSelected() && "selected"}
                                                    >
                                                        {row.getVisibleCells().map((cell) => (
                                                            <TableCell key={cell.id} className="text-base py-4">
                                                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                                            </TableCell>
                                                        ))}
                                                    </TableRow>
                                                ))
                                            ) : (
                                                <TableRow>
                                                    <TableCell colSpan={columns.length} className="h-24 text-center">
                                                        <div className="flex flex-col items-center justify-center text-gray-500">
                                                            <FileText className="h-12 w-12 mb-2 text-gray-300" />
                                                            <p className="text-lg">No exams available</p>
                                                            <p className="text-sm">Create a new exam to get started</p>
                                                        </div>
                                                    </TableCell>
                                                </TableRow>
                                            )}
                                        </TableBody>
                                    </Table>
                                </Card>

                                <div className="flex items-center justify-between">
                                    <div className="text-sm text-gray-500">
                                        Showing {table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1} to{" "}
                                        {Math.min(
                                            (table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize,
                                            filteredExams.length
                                        )}{" "}
                                        of {filteredExams.length} exams
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => table.previousPage()}
                                            disabled={!table.getCanPreviousPage()}
                                            className="flex items-center gap-1"
                                        >
                                            <ChevronLeft className="h-4 w-4" />
                                            Previous
                                        </Button>
                                        <div className="text-sm text-gray-700">
                                            Page {table.getState().pagination.pageIndex + 1} of{" "}
                                            {table.getPageCount()}
                                        </div>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => table.nextPage()}
                                            disabled={!table.getCanNextPage()}
                                            className="flex items-center gap-1"
                                        >
                                            Next
                                            <ChevronRight className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </Container>
                </div>
            </div>

            {/* Delete Confirmation Dialog */}
            <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
                <DialogContent className="mx-auto max-w-[90%] md:max-w-[500px]">
                    <DialogHeader>
                        <DialogTitle className="text-xl font-bold text-gray-800">Confirm Delete</DialogTitle>
                        <DialogDescription className="text-gray-600 mt-2">
                            Are you sure you want to delete this exam? This action cannot
                            be undone and all associated data will be permanently removed.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="bg-amber-50 border border-amber-200 rounded-md p-4 flex items-start">
                        <AlertTriangle className="h-5 w-5 text-amber-500 mr-3 mt-0.5" />
                        <div>
                            <p className="text-amber-700 font-medium">Warning</p>
                            <p className="text-amber-600 text-sm">Deleting this exam will also remove all student results and analytics associated with it.</p>
                        </div>
                    </div>
                    <DialogFooter className="sm:justify-end gap-2 mt-2">
                        <Button
                            variant="outline"
                            onClick={() => setIsDeleteOpen(false)}
                            className="border-gray-300 text-gray-700"
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={() => handleDeleteExam(selectedExamId)}
                            className="bg-red-600 hover:bg-red-700 text-white flex gap-2"
                            disabled={isDeleting}
                        >
                            {isDeleting ? (
                                <>
                                    <Image
                                        src="/loader.gif"
                                        alt="loader"
                                        width={20}
                                        height={20}
                                    />
                                    Deleting...
                                </>
                            ) : (
                                <>Delete Permanently</>
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Subject Selection Dialog */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="mx-auto max-w-[90%] md:max-w-[500px]">
                    <DialogHeader>
                        <DialogTitle className="text-xl font-bold text-gray-800">Select Subject</DialogTitle>
                        <DialogDescription className="text-gray-600 mt-2">
                            Please select a subject to proceed with the exam management.
                        </DialogDescription>
                    </DialogHeader>
                    <form className="space-y-4">
                        <div>
                            <label className="block text-gray-700 text-sm font-medium mb-2">Subject</label>
                            <Select onValueChange={(value) => setValue("subject", value)}>
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Choose a subject" />
                                </SelectTrigger>
                                <SelectContent>
                                    {subjects.map((sub) => (
                                        <SelectItem key={sub._id} value={sub._id}>
                                            {sub.title}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {errors.subject && (
                                <p className="text-red-500 text-sm mt-1">Please select a subject</p>
                            )}
                        </div>
                        <Button
                            type="submit"
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 text-base font-semibold transition-colors"
                        >
                            Proceed
                        </Button>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default AllExams;