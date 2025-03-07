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
import { MoreHorizontal, PlusCircle } from "lucide-react";
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

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

const AllExams = () => {
    const [loading, setLoading] = useState(true);
    const [exams, setExams] = useState([]);
    const router = useRouter();
    const token = localStorage.getItem("token");
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [isDeleting, setIsDeleting] = useState(false)
    const [isDeleteOpen, setIsDeleteOpen] = useState(false)
    const [selectedExamId, setSelectedExamId] = useState("")
    const [subjects, setSubjects] = useState([])

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
                setExams(response.data.findExams);
            } catch (error) {
                console.error("Failed to fetch exams:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchExams();
    }, []);


    const handleDeleteExam = async (id) => {
        setIsDeleting(true)
        try {
            await axios.delete(`${API_BASE_URL}/admin/exams/deleteExam/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setExams((prevExams) => prevExams.filter((exam) => exam._id !== id));
            setIsDeleteOpen(false)
        } catch (error) {
            console.error("Failed to delete exam:", error);
            setIsDeleting(false)
        } finally {
            setIsDeleting(false)
        }
    };


    const columns = [
        { accessorKey: "title", header: "Exam Title" },
        { accessorKey: "duration", header: "Duration (mins)" },
        {
            accessorKey: "subjects",
            header: "Subjects",
            cell: ({ row }) => {
                const subjects = row.original.subjects || [];
                return subjects.length > 0
                    ? subjects.slice(0, 4).map(subject => subject.title).join(", ") // Extract titles
                    : "No subjects";
            },
        },
        {
            accessorKey: "numberQuestions",
            header: "Number of Questions",
        },
        {
            id: "actions",
            cell: ({ row }) => {
                return (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                                <MoreHorizontal />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => router.push(`/admin/exams/manage/${row.original._id}`)}>
                                Manage Exams
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => router.push(`/admin/exams/results/${row.original._id}`)}>
                                View Results
                            </DropdownMenuItem>
                            {/* <DropdownMenuItem onClick={() => router.push(`/admin/exams/edit/${row.original._id}`)}>
                                Edit
                            </DropdownMenuItem> */}
                            <DropdownMenuItem onClick={() => {
                                setSelectedExamId(row.original._id);
                                setIsDeleteOpen(true);
                            }}>
                                Delete
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                );
            },
        },
    ];

    const table = useReactTable({
        data: exams,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
    });

    return (
        <div className="flex md:pl-8 min-h-screen">
            <AdminSideBar />
            <div className="flex flex-col w-full">
                <AdminNavBar />
                <div className="px-4 py-3 md:py-8 w-full flex justify-center items-start">
                    <Container>
                        {loading ? (
                            <div className="p-6">
                                <Skeleton className="h-24 w-full" />
                            </div>
                        ) : (
                            <div className="p-6">
                                <Link href="/admin/exams/add">
                                    <button className="bg-blue-500 px-6 py-2 flex gap-2 items-center rounded-md text-white mb-8"><PlusCircle />Create Exam</button>
                                </Link>
                                <div className="rounded-md border">
                                    <Table>
                                        <TableHeader>
                                            {table.getHeaderGroups().map((headerGroup) => (
                                                <TableRow key={headerGroup.id}>
                                                    {headerGroup.headers.map((header) => (
                                                        <TableHead key={header.id} className="text-base">
                                                            {flexRender(header.column.columnDef.header, header.getContext())}
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
                                                        No exams available.
                                                    </TableCell>
                                                </TableRow>
                                            )}
                                        </TableBody>
                                    </Table>
                                </div>
                                <div className="flex items-center justify-end space-x-2 py-4">
                                    <Button variant="outline" size="sm" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
                                        Previous
                                    </Button>
                                    <Button variant="outline" size="sm" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
                                        Next
                                    </Button>
                                </div>
                            </div>
                        )}
                    </Container>
                </div>
            </div>
            <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
                <DialogContent className="mx-auto max-w-[90%] md:max-w-[500px]">
                    <DialogHeader>
                        <DialogTitle>Confirm Delete</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete this exam? This action cannot
                            be undone.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setIsDeleteOpen(false)}
                            style={{ boxShadow: "none" }}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={() => handleDeleteExam(selectedExamId)}
                            className="mb-2 md:mb-0 flex gap-2"
                            disabled={isDeleting}
                        >
                            {isDeleting && (
                                <Image
                                    src="/loader.gif"
                                    className="text-white"
                                    alt="loader"
                                    width={20}
                                    height={20}
                                />
                            )}
                            Delete
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="mx-auto max-w-[90%] md:max-w-[500px]">
                    <DialogHeader>
                        <DialogTitle>Select Subject</DialogTitle>
                        <DialogDescription>
                            Please select subject to proceed!
                        </DialogDescription>
                    </DialogHeader>
                    <form className="mb-4">
                        <label className="block text-gray-700 mb-2">Select Exam</label>
                        <Select onValueChange={(value) => setValue("exam", value)}>
                            <SelectTrigger>
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
                        <Button className="bg-blue-500 mt-6 hover:bg-blue-400 py-2 text-base font-semibold">Proceed</Button>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default AllExams;
