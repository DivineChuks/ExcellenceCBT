"use client";
import React, { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import Container from "@/app/components/Container";
import { Edit, Trash } from "lucide-react";
import AdminSideBar from "../_components/AdminSideBar";
import AdminNavBar from "../_components/AdminNavBar";
import { Button } from "@/components/ui/button";

const AllSubjects = () => {
    const [subjects, setSubjects] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Simulating fetch from API
        setTimeout(() => {
            setSubjects([
                { id: 1, name: "Mathematics", code: "MTH", lastUpdated: "2025-01-10", },
                { id: 2, name: "English", code: "ENG", lastUpdated: "2025-01-10", },
                { id: 3, name: "Biology", code: "BIO", lastUpdated: "2025-01-10", },
                { id: 4, name: "Physics", code: "PHY", lastUpdated: "2025-01-10", },
                { id: 5, name: "Chemistry", code: "CHE", lastUpdated: "2025-01-10", },
                { id: 6, name: "Economics", code: "ECN", lastUpdated: "2025-01-10", },
            ]);
            setLoading(false);
        }, 1000);
    }, []);

    const handleEdit = (id) => {
        console.log("Edit subject with ID:", id);
        // Add navigation or modal logic for editing
    };

    const handleDelete = (id) => {
        if (confirm("Are you sure you want to delete this subject?")) {
            setSubjects((prev) => prev.filter((subject) => subject.id !== id));
        }
    };

    return (
        // <PrivateAdminRoute>
        <div className="flex md:pl-8 min-h-screen">
            <AdminSideBar />
            <div className="flex flex-col w-full">
                <AdminNavBar />
                <div className="px-10 py-3 mt-10 md:py-8 w-full flex justify-center items-start">
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
                        ) : subjects.length > 0 ? (
                            <table className="w-full border-collapse border border-gray-200 shadow-sm">
                                <thead>
                                    <tr className="bg-gray-100">
                                        <th className="border border-gray-300 p-2 px-2">ID</th>
                                        <th className="border border-gray-300 text-left p-2 px-2">Subject Name</th>
                                        <th className="border border-gray-300 text-left p-2 px-2">Subject Code</th>
                                        <th className="border border-gray-300 text-left p-2 px-2">Last Updated</th>
                                        <th className="border border-gray-300 p-2 text-left">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {subjects.map((subject) => (
                                        <tr key={subject.id} className="hover:bg-gray-50">
                                            <td className="border border-gray-300 p-3 text-center">{subject.id}</td>
                                            <td className="border border-gray-300  p-3">{subject.name}</td>
                                            <td className="border border-gray-300  p-3">{subject.code}</td>
                                            <td className="border border-gray-300  p-3">{subject.lastUpdated}</td>
                                            <td className="border border-gray-300 p-3 space-x-4">
                                                <Button
                                                    variant="outline"
                                                    onClick={() => handleEdit(subject.id)}
                                                    className="text-blue-600 hover:bg-blue-50"
                                                >
                                                    <Edit className="w-4 h-4 mr-2 inline" /> Edit
                                                </Button>
                                                <Button
                                                    variant="destructive"
                                                    onClick={() => handleDelete(subject.id)}
                                                    className=" text-white hover:bg-red-50"
                                                >
                                                    <Trash className="w-4 text-white h-4 mr-2 inline" /> Delete
                                                </Button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : (
                            <p>No subjects available.</p>
                        )}
                    </Container>
                </div>
            </div>
        </div>
        // </PrivateAdminRoute>
    );
};

export default AllSubjects;
