"use client";
import React, { useState, useEffect } from "react";
import AdminNavBar from "../_components/AdminNavBar";
import { Skeleton } from "@/components/ui/skeleton";
import AdminSideBar from "../_components/AdminSideBar";
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
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    MoreHorizontal,
    PlusCircle,
    Search,
    BookOpen,
    Edit,
    Trash2,
    Calendar,
    RefreshCw,
    ChevronLeft,
    ChevronRight,
    AlertTriangle
} from "lucide-react";
import axios from "axios";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Input } from "@/components/ui/input";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL

const AllSubjects = () => {
    const [loading, setLoading] = useState(true);
    const [subjects, setSubjects] = useState([]);
    const router = useRouter();
    const [error, setError] = useState("");
    const token = localStorage.getItem("token");
    const [sorting, setSorting] = useState([]);
    const [columnFilters, setColumnFilters] = useState([]);
    const [columnVisibility, setColumnVisibility] = useState({});
    const [rowSelection, setRowSelection] = useState({});
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [selectedSubjectId, setSelectedSubjectId] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        const fetchSubjects = async () => {
            try {
                setLoading(true);
                const response = await axios.get(`${API_BASE_URL}/admin/subject/getSubjects`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    }
                });
                setSubjects(response.data);
            } catch (error) {
                console.error("Failed to fetch subjects:", error);
                setError("Failed to load subjects. Please try again later.");
            } finally {
                setLoading(false);
            }
        };
        fetchSubjects();
    }, [token]);

    const columns = [
        {
            accessorKey: "title",
            header: "Subject Title",
            cell: ({ row }) => (
                <div className="flex items-center gap-2">
                    <div className="p-2 bg-blue-100 rounded-full">
                        <BookOpen className="h-4 w-4 text-blue-600" />
                    </div>
                    <span className="font-medium text-gray-800">{row.original.title}</span>
                </div>
            )
        },
        {
            accessorKey: "code",
            header: "Subject Code",
            cell: ({ row }) => (
                <span className="px-2.5 py-1 bg-gray-100 rounded-md text-gray-700 font-mono text-sm">{row.original.code}</span>
            )
        },
        {
            accessorKey: "createdAt",
            header: () => (
                <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    <span>Created At</span>
                </div>
            ),
            cell: ({ row }) => (
                <div className="flex items-center gap-2">
                    <span className="text-gray-600">{new Date(row.original.createdAt).toLocaleDateString("en-GB")}</span>
                </div>
            )
        },
        {
            accessorKey: "updatedAt",
            header: () => (
                <div className="flex items-center gap-1">
                    <RefreshCw className="h-4 w-4" />
                    <span>Last Updated</span>
                </div>
            ),
            cell: ({ row }) => (
                <div className="flex items-center gap-2">
                    <span className="text-gray-600">{new Date(row.original.updatedAt).toLocaleDateString("en-GB")}</span>
                </div>
            )
        },
        {
            id: "actions",
            enableHiding: false,
            cell: ({ row }) => {
                return (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0 rounded-full hover:bg-gray-100">
                                <span className="sr-only">Open menu</span>
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-[160px] p-2">
                            <DropdownMenuLabel className="text-gray-500 text-xs font-normal">Actions</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                                onClick={() => router.push(`/admin/subjects/edit/${row.original._id}`)}
                                className="flex items-center gap-2 cursor-pointer py-2 text-sm"
                            >
                                <Edit className="h-4 w-4 text-blue-600" />
                                <span>Edit Subject</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                onClick={() => {
                                    setSelectedSubjectId(row.original._id);
                                    setIsDialogOpen(true);
                                }}
                                className="flex items-center gap-2 cursor-pointer py-2 text-sm text-red-600"
                            >
                                <Trash2 className="h-4 w-4" />
                                <span>Delete Subject</span>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                );
            },
        },
    ];

    const handleDeleteSubject = async (id) => {
        setIsDeleting(true);
        try {
            await axios.delete(`${API_BASE_URL}/admin/subject/deleteSubject/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });
            // Remove the deleted subject from the state
            setSubjects((prevSubjects) => prevSubjects.filter((subject) => subject._id !== id));
            setIsDialogOpen(false);
        } catch (error) {
            console.error("Failed to delete subject:", error);
        } finally {
            setIsDeleting(false);
        }
    };

    // Filter subjects based on search query
    useEffect(() => {
        if (searchQuery) {
            const filtered = table.getColumn("title")?.setFilterValue(searchQuery);
        } else {
            table.getColumn("title")?.setFilterValue("");
        }
    }, [searchQuery]);

    const table = useReactTable({
        data: subjects,
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
                <div className="px-4 py-3 md:py-8 w-full flex justify-center items-start">
                    <Container>
                        {loading ? (
                            <div className="space-y-6 mt-8 p-6">
                                <div className="space-y-2">
                                    <Skeleton className="h-10 w-full max-w-sm mb-4" />
                                    <Skeleton className="h-12 w-full" />
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                    {[...Array(8)].map((_, i) => (
                                        <Skeleton key={i} className="h-16 rounded-lg" />
                                    ))}
                                </div>
                                <Skeleton className="h-14 w-full" />
                            </div>
                        ) : error ? (
                            <div className="p-6 flex flex-col items-center justify-center bg-white rounded-lg shadow mt-8">
                                <AlertTriangle className="h-12 w-12 text-amber-500 mb-2" />
                                <h3 className="text-lg font-semibold text-gray-900">Error Loading Subjects</h3>
                                <p className="text-gray-600 mb-4">{error}</p>
                                <Button
                                    variant="outline"
                                    onClick={() => window.location.reload()}
                                    className="gap-2"
                                >
                                    <RefreshCw className="h-4 w-4" /> Try Again
                                </Button>
                            </div>
                        ) : (
                            <div className="bg-white rounded-xl shadow-sm p-6 mt-3">
                                <div className="mb-6">
                                    <h1 className="text-2xl font-bold text-gray-800 mb-2">Subject Management</h1>
                                    <p className="text-gray-500">Manage all your academic subjects from one place</p>
                                </div>

                                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                                    <div className="relative w-full md:w-80">
                                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                        <Input
                                            placeholder="Search subjects..."
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            className="pl-9 py-2 h-10 focus-visible:ring-blue-500"
                                        />
                                    </div>

                                    <Link href="/admin/subjects/add">
                                        <Button className="bg-blue-600 hover:bg-blue-700 px-4 py-2 h-10 flex gap-2 items-center text-white rounded-md shadow-sm transition-all">
                                            <PlusCircle className="h-4 w-4" />
                                            Add New Subject
                                        </Button>
                                    </Link>
                                </div>

                                <div className="rounded-lg border border-gray-200 overflow-hidden">
                                    <Table>
                                        <TableHeader className="bg-gray-50">
                                            {table.getHeaderGroups().map((headerGroup) => (
                                                <TableRow key={headerGroup.id} className="hover:bg-gray-50 border-b">
                                                    {headerGroup.headers.map((header) => (
                                                        <TableHead
                                                            key={header.id}
                                                            className="text-sm font-semibold text-gray-700 py-4 px-4"
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
                                                table.getRowModel().rows.map((row, i) => (
                                                    <TableRow
                                                        key={row.id}
                                                        data-state={row.getIsSelected() && "selected"}
                                                        className={`hover:bg-blue-50 transition-colors ${i % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}`}
                                                    >
                                                        {row.getVisibleCells().map((cell) => (
                                                            <TableCell key={cell.id} className="py-3 px-4">
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
                                                        className="h-24 text-center"
                                                    >
                                                        <div className="flex flex-col items-center justify-center text-gray-500 py-6">
                                                            <BookOpen className="h-8 w-8 text-gray-300 mb-2" />
                                                            <p>No subjects found</p>
                                                            {searchQuery && (
                                                                <p className="text-sm">Try adjusting your search criteria</p>
                                                            )}
                                                        </div>
                                                    </TableCell>
                                                </TableRow>
                                            )}
                                        </TableBody>
                                    </Table>
                                </div>

                                <div className="flex items-center justify-between mt-4 p-2">
                                    <div className="text-sm text-gray-500 hidden md:block">
                                        Showing <span className="font-medium">{table.getRowModel().rows.length}</span> of{" "}
                                        <span className="font-medium">{subjects.length}</span> subjects
                                    </div>
                                    <div className="flex items-center space-x-2 ml-auto">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => table.previousPage()}
                                            disabled={!table.getCanPreviousPage()}
                                            className="h-8 px-3 flex items-center gap-1 text-sm"
                                        >
                                            <ChevronLeft className="h-4 w-4" />
                                            Previous
                                        </Button>
                                        <div className="text-sm text-gray-600 px-2">
                                            Page {table.getState().pagination.pageIndex + 1} of{" "}
                                            {table.getPageCount()}
                                        </div>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => table.nextPage()}
                                            disabled={!table.getCanNextPage()}
                                            className="h-8 px-3 flex items-center gap-1 text-sm"
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

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="mx-auto max-w-[90%] md:max-w-[500px] p-0 overflow-hidden rounded-lg">
                    <div className="bg-red-50 p-4 flex items-center gap-3 border-b border-red-100">
                        <div className="bg-red-100 p-2 rounded-full">
                            <AlertTriangle className="h-6 w-6 text-red-600" />
                        </div>
                        <DialogHeader className="p-0 m-0 text-left space-y-1">
                            <DialogTitle className="text-lg font-semibold text-gray-900">Confirm Deletion</DialogTitle>
                            <DialogDescription className="text-gray-600 text-sm">
                                This action cannot be undone. The subject will be permanently deleted.
                            </DialogDescription>
                        </DialogHeader>
                    </div>

                    <div className="p-6">
                        <p className="text-sm text-gray-600 mb-4">
                            Are you sure you want to delete this subject? This will remove it from your system and any associated records.
                        </p>

                        <DialogFooter className="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 border-t border-gray-100 pt-4">
                            <Button
                                variant="outline"
                                onClick={() => setIsDialogOpen(false)}
                                className="mt-3 sm:mt-0"
                            >
                                Cancel
                            </Button>
                            <Button
                                variant="destructive"
                                onClick={() => handleDeleteSubject(selectedSubjectId)}
                                className="bg-red-600 hover:bg-red-700 flex items-center gap-2"
                                disabled={isDeleting}
                            >
                                {isDeleting ? (
                                    <>
                                        <Image
                                            src="/loader.gif"
                                            alt="Deleting..."
                                            width={16}
                                            height={16}
                                        />
                                        <span>Deleting...</span>
                                    </>
                                ) : (
                                    <>
                                        <Trash2 className="h-4 w-4" />
                                        <span>Delete Subject</span>
                                    </>
                                )}
                            </Button>
                        </DialogFooter>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default AllSubjects;