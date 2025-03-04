"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Pencil } from "lucide-react";
import AdminSideBar from "@/app/admin/_components/AdminSideBar";
import AdminNavBar from "@/app/admin/_components/AdminNavBar";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
const token = localStorage.getItem("token");

const QuestionsList = () => {
    const { id: examId } = useParams();
    const [questions, setQuestions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchQuestions = async () => {
            try {
                const response = await axios.get(`${API_BASE_URL}/admin/exams/questions/${examId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                });
                setQuestions(response.data.questions);
            } catch (error) {
                console.error("Failed to fetch questions:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchQuestions();
    }, [examId]);

    console.log("questions--->", questions)

    const groupedQuestions = questions.reduce((acc, question) => {
        if (!acc[question.subject.title]) {
            acc[question.subject.title] = [];
        }
        acc[question.subject.title].push(question);
        return acc;
    }, {});

    return (
        <div className="flex min-h-screen">
            <AdminSideBar />
            <div className="flex flex-col w-full">
                <AdminNavBar />
                <div className="p-6">
                    <h1 className="text-2xl font-bold mb-4">Manage Exam</h1>
                    {loading ? (
                        <div className="p-4">
                            <Skeleton className="h-32 w-full" />
                        </div>
                    ) : (
                        <>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default QuestionsList;
