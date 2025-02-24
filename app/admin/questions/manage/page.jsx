"use client";
import React, { useEffect, useState } from "react";
import AdminNavBar from "../../_components/AdminNavBar";
import { Skeleton } from "@/components/ui/skeleton";
import AdminSideBar from "../../_components/AdminSideBar";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Edit, Trash } from "lucide-react";
import Container from "@/app/components/Container";

const ManageQuestions = () => {
    const [loading, setLoading] = useState(false);
    const [questions, setQuestions] = useState([]);
    const [activeTab, setActiveTab] = useState("English");

    useEffect(() => {
        fetch("/api/questions") // Replace with actual API
            .then((res) => res.json())
            .then((data) => setQuestions(data));
    }, []);

    const handleDelete = (id) => {
        fetch(`/api/questions/${id}`, { method: "DELETE" })
            .then(() => setQuestions((prev) => prev.filter((q) => q.id !== id)));
    };

    const handleTabClick = (subject) => {
        setActiveTab(subject);
    };

    const renderQuestions = () => {
        // Filter questions based on active subject
        const filteredQuestions = questions.filter((q) => q.subject === activeTab);
        
        return (
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Question</TableHead>
                        <TableHead>Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {filteredQuestions.map((question) => (
                        <TableRow key={question.id}>
                            <TableCell>{question.text}</TableCell>
                            <TableCell>
                                <Button
                                    variant="outline"
                                    className="mr-2"
                                    onClick={() => console.log("Edit", question.id)}
                                >
                                    <Edit className="w-4 h-4" />
                                </Button>
                                <Button
                                    variant="outline"
                                    className="text-red-500"
                                    onClick={() => handleDelete(question.id)}
                                >
                                    <Trash className="w-4 h-4" />
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        );
    };

    return (
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
                                <h1 className="text-2xl font-bold mb-4">Manage Questions</h1>
                                
                                {/* Tab Navigation */}
                                <div className="flex mb-4">
                                    {["English", "Maths", "Bio", "Physics", "Chemistry"].map((subject) => (
                                        <Button
                                            key={subject}
                                            onClick={() => handleTabClick(subject)}
                                            variant={activeTab === subject ? "default" : "outline"}
                                            className="mr-2"
                                        >
                                            {subject}
                                        </Button>
                                    ))}
                                </div>

                                {/* Render Questions for Active Tab */}
                                {renderQuestions()}
                            </div>
                        )}
                    </Container>
                </div>
            </div>
        </div>
    );
};

export default ManageQuestions;
