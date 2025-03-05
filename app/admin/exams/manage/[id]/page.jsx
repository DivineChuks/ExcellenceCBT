"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import Container from "@/app/components/Container";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AdminSideBar from "@/app/admin/_components/AdminSideBar";
import AdminNavBar from "@/app/admin/_components/AdminNavBar";
import Image from "next/image";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
const token = localStorage.getItem("token");

const ManageExams = () => {
    const { id: examId } = useParams();
    const [examData, setExamData] = useState({});
    const [loading, setLoading] = useState(true);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false)
    const [isDeleting, setIsDeleting] = useState(false)
    const [currentPage, setCurrentPage] = useState({});
    const [selectedSubject, setSelectedSubject] = useState(null);
    const [deletQuestionId, setDeleteQuestionId] = useState("")
    const router = useRouter();

    useEffect(() => {
        const fetchExams = async () => {
            try {
                const response = await axios.get(`${API_BASE_URL}/admin/exams/questions/${examId}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                // Group questions by subject
                const groupedData = response.data.reduce((acc, question) => {
                    const subjectTitle = question.subjectId.title;
                    if (!acc[subjectTitle]) acc[subjectTitle] = [];
                    acc[subjectTitle].push(question);
                    return acc;
                }, {});

                setExamData(groupedData);

                // Set the first subject as default selected
                const firstSubject = Object.keys(groupedData)[0] || null;
                setSelectedSubject(firstSubject);

                setCurrentPage(
                    Object.keys(groupedData).reduce((acc, subject) => {
                        acc[subject] = 1; // Start from page 1 for each subject
                        return acc;
                    }, {})
                );
            } catch (error) {
                toast.error("Failed to fetch exam data");
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchExams();
    }, [token]);

    const QUESTIONS_PER_PAGE = 3;

    const handlePageChange = (subject, direction) => {
        setCurrentPage((prev) => ({
            ...prev,
            [subject]: prev[subject] + direction,
        }));
    };

    const handleDelete = async (questionId) => {
        setIsDeleting(true)
        try {
            await axios.delete(`${API_BASE_URL}/admin/exams/deleteQuestion/${questionId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            toast.success("Question deleted successfully");
            setExamData((prev) => {
                const newData = { ...prev };
                for (let subject in newData) {
                    newData[subject] = newData[subject].filter(q => q._id !== questionId);
                }
                return newData;
            });
            setIsDeleteOpen(false)
        } catch (error) {
            toast.error("Failed to delete question");
        } finally {
            setIsDeleting(false)
        }
    };

    return (
        <div className="flex md:pl-8 min-h-screen">
            <AdminSideBar />
            <div className="flex flex-col w-full">
                <AdminNavBar />
                <div className="px-6 py-3 md:py-8 w-full">
                    <Container>
                        <h1 className="text-2xl font-bold mb-6">Manage Exams</h1>

                        {loading ? (
                            <Skeleton className="h-40 w-full" />
                        ) : (
                            <>
                                {/* Subject Tabs */}
                                <Tabs value={selectedSubject} onValueChange={setSelectedSubject} className="mb-6">
                                    <TabsList className="flex justify-start space-x-4 overflow-x-auto">
                                        {Object.keys(examData).map((subject) => (
                                            <TabsTrigger key={subject} value={subject}>
                                                {subject}
                                            </TabsTrigger>
                                        ))}
                                    </TabsList>
                                </Tabs>

                                {/* Display Selected Subject's Questions */}
                                {selectedSubject && examData[selectedSubject] ? (
                                    <Card className="mb-6">
                                        <CardHeader>
                                            <CardTitle>{selectedSubject}</CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            {(() => {
                                                const page = currentPage[selectedSubject] || 1;
                                                const startIndex = (page - 1) * QUESTIONS_PER_PAGE;
                                                const selectedQuestions = examData[selectedSubject].slice(startIndex, startIndex + QUESTIONS_PER_PAGE);
                                                const totalPages = Math.ceil(examData[selectedSubject].length / QUESTIONS_PER_PAGE);

                                                return (
                                                    <>
                                                        {selectedQuestions.map((question, index) => (
                                                            <div key={question._id} className="p-4 border-b flex justify-between">
                                                                <div>
                                                                    <p className="font-semibold">
                                                                        {index + 1 + startIndex}. {question.question}
                                                                    </p>
                                                                    <ul className="text-sm text-gray-600 mt-2">
                                                                        <li>A: {question.options.optionA}</li>
                                                                        <li>B: {question.options.optionB}</li>
                                                                        <li>C: {question.options.optionC}</li>
                                                                        <li>D: {question.options.optionD}</li>
                                                                    </ul>
                                                                    <p className="mt-2 text-green-600 font-medium">
                                                                        Correct: {question.correctOption.toUpperCase()}
                                                                    </p>
                                                                </div>
                                                                <div className="flex gap-2">
                                                                    <Button
                                                                        variant="outline"
                                                                        onClick={() => router.push(`/admin/questions/${question._id}/edit/${question.subjectId._id}`)}
                                                                    >
                                                                        Edit
                                                                    </Button>
                                                                    <Button variant="destructive" onClick={() => {
                                                                        setIsDeleteOpen(true)
                                                                        setDeleteQuestionId(question._id)
                                                                    }}>
                                                                        Delete
                                                                    </Button>
                                                                </div>
                                                            </div>
                                                        ))}

                                                        {/* Pagination Controls */}
                                                        {totalPages > 1 && (
                                                            <div className="flex justify-between items-center mt-4">
                                                                <Button
                                                                    variant="outline"
                                                                    disabled={page === 1}
                                                                    onClick={() => handlePageChange(selectedSubject, -1)}
                                                                >
                                                                    Previous
                                                                </Button>
                                                                <span className="text-sm font-medium">
                                                                    Page {page} of {totalPages}
                                                                </span>
                                                                <Button
                                                                    variant="outline"
                                                                    disabled={page === totalPages}
                                                                    onClick={() => handlePageChange(selectedSubject, 1)}
                                                                >
                                                                    Next
                                                                </Button>
                                                            </div>
                                                        )}
                                                    </>
                                                );
                                            })()}
                                        </CardContent>
                                    </Card>
                                ) : (
                                    <p className="text-gray-600 text-center">No questions available for this subject.</p>
                                )}
                            </>
                        )}
                    </Container>
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
                                onClick={() => handleDelete(deletQuestionId)}
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
            </div>
            <ToastContainer />
        </div>
    );
};

export default ManageExams;
