"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import AdminNavBar from "../../_components/AdminNavBar";
import AdminSideBar from "../../_components/AdminSideBar";
import Container from "@/app/components/Container";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { Pencil } from "lucide-react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

const QuestionsList = () => {
    const [loading, setLoading] = useState(true);
    const [questions, setQuestions] = useState([]);
    const router = useRouter();

    useEffect(() => {
        const fetchQuestions = async () => {
            try {
                const response = await axios.get(`${API_BASE_URL}/admin/exams/getQuestions`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setQuestions(response.data);
            } catch (error) {
                toast.error("Failed to fetch questions.");
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchQuestions();
    }, []);

    return (
        <div className="flex md:pl-8 min-h-screen">
            <AdminSideBar />
            <div className="flex flex-col w-full">
                <AdminNavBar />
                <div className="px-4 py-3 md:py-8 w-full flex justify-center items-start">
                    <Container>
                        <Card className="w-full max-w-4xl mx-auto">
                            <CardHeader>
                                <CardTitle className="text-2xl font-bold">All Questions</CardTitle>
                            </CardHeader>
                            <CardContent>
                                {loading ? (
                                    <Skeleton className="h-48 w-full" />
                                ) : (
                                    <Accordion type="single" collapsible className="w-full">
                                        {questions.map((subject) => (
                                            <AccordionItem key={subject._id} value={subject._id}>
                                                <AccordionTrigger>{subject.title}</AccordionTrigger>
                                                <AccordionContent>
                                                    {subject.questions.map((question) => (
                                                        <div key={question._id} className="flex justify-between items-center border-b py-3">
                                                            <p className="text-gray-800">{question.text}</p>
                                                            <Button 
                                                                variant="outline" 
                                                                size="icon" 
                                                                className="hover:bg-blue-500 hover:text-white"
                                                                onClick={() => router.push(`/admin/questions/edit/${question._id}`)}
                                                            >
                                                                <Pencil size={16} />
                                                            </Button>
                                                        </div>
                                                    ))}
                                                </AccordionContent>
                                            </AccordionItem>
                                        ))}
                                    </Accordion>
                                )}
                            </CardContent>
                        </Card>
                    </Container>
                </div>
            </div>
        </div>
    );
};

export default QuestionsList;
