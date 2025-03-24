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
import 'katex/dist/katex.min.css';
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
import Link from "next/link";
import { PlusCircle } from "lucide-react";
import katex from 'katex';

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

    // Add this function inside your ManageExams component
    const renderKatexExpression = (content) => {
        if (!content || typeof content !== 'string') return '';

        try {
            // Create a temporary div to work with
            const tempEl = document.createElement('div');
            tempEl.innerHTML = content;

            // Process inline math expressions ($...$)
            const processInlineMath = (text) => {
                let result = text;
                const regex = /\$(.*?)\$/g;
                return result.replace(regex, (match, equation) => {
                    try {
                        return katex.renderToString(equation, {
                            displayMode: false,
                            throwOnError: false
                        });
                    } catch (err) {
                        console.error('KaTeX error:', err);
                        return match;
                    }
                });
            };

            // Process block math expressions ($$...$$)
            const processBlockMath = (text) => {
                let result = text;
                const regex = /\$\$(.*?)\$\$/g;
                return result.replace(regex, (match, equation) => {
                    try {
                        return katex.renderToString(equation, {
                            displayMode: true,
                            throwOnError: false
                        });
                    } catch (err) {
                        console.error('KaTeX error:', err);
                        return match;
                    }
                });
            };

            // Apply transformations
            let processedContent = tempEl.innerHTML;
            processedContent = processBlockMath(processedContent);
            processedContent = processInlineMath(processedContent);

            return processedContent;
        } catch (error) {
            console.error('Error rendering KaTeX:', error);
            return content;
        }
    };


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
                        acc[subject] = 1;
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
                                                                        {index + 1 + startIndex}. <span dangerouslySetInnerHTML={{
                                                                            __html: renderKatexExpression(question.question)
                                                                        }} />
                                                                    </p>
                                                                    <ul className="text-sm text-gray-600 mt-2">
                                                                        <li>A: <span dangerouslySetInnerHTML={{
                                                                            __html: renderKatexExpression(question.options.optionA)
                                                                        }} /></li>
                                                                        <li>B: <span dangerouslySetInnerHTML={{
                                                                            __html: renderKatexExpression(question.options.optionB)
                                                                        }} /></li>
                                                                        <li>C: <span dangerouslySetInnerHTML={{
                                                                            __html: renderKatexExpression(question.options.optionC)
                                                                        }} /></li>
                                                                        <li>D: <span dangerouslySetInnerHTML={{
                                                                            __html: renderKatexExpression(question.options.optionD)
                                                                        }} /></li>
                                                                    </ul>
                                                                    <p className="mt-2 text-green-600 font-medium">
                                                                        Correct: {question.correctOption.toUpperCase()}
                                                                    </p>
                                                                </div>
                                                                {/* Rest of your code */}
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
                                    <div>
                                        <p className="text-gray-600 flex justify-center item-center text-center">No questions available for this exam.</p>
                                        <Link href="/admin/questions/create">
                                            <button className="bg-blue-500 px-6 py-2 mt-6 mx-auto flex gap-2 items-center rounded-md text-white mb-8"><PlusCircle />Add Questions</button>
                                        </Link>
                                    </div>
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
