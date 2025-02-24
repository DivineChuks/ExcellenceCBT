"use client";
import React, { useState } from "react";
import AdminNavBar from "../../_components/AdminNavBar";
import { Skeleton } from "@/components/ui/skeleton";
import AdminSideBar from "../../_components/AdminSideBar";
import Container from "@/app/components/Container";
import { Edit, Trash } from "lucide-react";

const AllStudents = () => {
    const [loading, setLoading] = useState(false)
    const students = [
        { id: 1, name: "John Doe", email: "john@example.com", class: "SS3", subjects: 8 },
        { id: 2, name: "Jane Smith", email: "jane@example.com", class: "SS2", subjects: 6 },
        { id: 3, name: "John Sunny", email: "sunny@example.com", class: "SS1", subjects: 9 },
        { id: 4, name: "Jude Smith", email: "jude@example.com", class: "SS2", subjects: 7 },
        { id: 5, name: "John Lewis", email: "lewis@example.com", class: "SS3", subjects: 9 },
        { id: 6, name: "Jude Smith", email: "jude@example.com", class: "SS4", subjects: 6 },
        // Add more student data here
    ];

    return (
        // <PrivateAdminRoute>
        <div className="flex md:pl-8 min-h-screen">
            <AdminSideBar />
            <div className="flex flex-col w-full">
                <AdminNavBar />
                <div className="px-4 py-3 md:py-8 w-full flex justify-center items-start">
                    <Container>
                        {loading ? (
                            <div className="space-y-6 mt-8">
                                <div className="flex flex-col md:flex-row gap-4 w-full">
                                    <Skeleton className="h-24 w-full md:w-1/3" />
                                    <Skeleton className="h-24 w-full md:w-1/3" />
                                    <Skeleton className="h-24 w-full md:w-1/3" />
                                </div>
                                <Skeleton className="h-40 w-full" />
                                <Skeleton className="h-40 w-full" />
                            </div>
                        ) : (
                            <div className="p-6">
                                <h1 className="text-2xl font-bold mb-6">All Students</h1>
                                <div className="bg-white rounded-lg shadow-md px-4 py-8">
                                    <table className="w-full text-left">
                                        <thead className="bg-gray-200 text-gray-600 uppercase text-sm">
                                            <tr>
                                                <th className="py-3 px-4">ID</th>
                                                <th className="py-3 px-4">Name</th>
                                                <th className="py-3 px-4">Email</th>
                                                <th className="py-3 px-4">Class</th>
                                                <th className="py-3 px-4">Subjects</th>
                                                <th className="py-3 px-4">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {students.map((student) => (
                                                <tr key={student.id} className="border-b hover:bg-gray-100">
                                                    <td className="py-3 px-4">{student.id}</td>
                                                    <td className="py-3 px-4">{student.name}</td>
                                                    <td className="py-3 px-4">{student.email}</td>
                                                    <td className="py-3 px-4">{student.class}</td>
                                                    <td className="py-3 px-4">{student.subjects}</td>
                                                    <td className="py-3 px-4 flex gap-2">
                                                        <button className="text-blue-500" ><Edit size="20" /></button>
                                                        <button><Trash color="red" size="20" /></button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}
                    </Container>
                </div>
            </div>
        </div>
        // </PrivateAdminRoute>
    );
};

export default AllStudents;
