"use client";
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import Container from "@/app/components/Container";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import TiptapEditor from "@/app/admin/dashboard/_components/TipTapEditor";
import AdminSideBar from "@/app/admin/_components/AdminSideBar";
import AdminNavBar from "@/app/admin/_components/AdminNavBar";
import Image from "next/image";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
const token = localStorage.getItem("token");

const schema = z.object({
    exam: z.string().min(1, "Exam is required"),
    subjectId: z.string().min(1, "Subject is required"),
    question: z.string().min(1, "Question is required"),
    options: z.object({
        optionA: z.string().min(1, "Option A is required"),
        optionB: z.string().min(1, "Option B is required"),
        optionC: z.string().min(1, "Option C is required"),
        optionD: z.string().min(1, "Option D is required"),
    }),
    correctOption: z.string().min(1, "Correct answer is required"),
});

const EditQuestion = () => {
    const router = useRouter();
    const { id, subjectId } = useParams();
    const [exams, setExams] = useState([]);
    const [subjects, setSubjects] = useState([]);
    const [loading, setLoading] = useState(false)
    const [editorResetTrigger, setEditorResetTrigger] = useState(false);
    const { register, handleSubmit, setValue, watch, reset, formState: { errors } } = useForm({
        resolver: zodResolver(schema),
        defaultValues: {
            exam: "",
            subjectId: "",
            question: "",
            options: {
                optionA: "",
                optionB: "",
                optionC: "",
                optionD: "",
            },
            correctOption: "",
        },
    });

    // Fetch question details and set values
    useEffect(() => {
        const fetchQuestion = async () => {
            try {
                const response = await axios.get(`${API_BASE_URL}/admin/exams/questions/${id}/subject/${subjectId}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                const questionData = response.data;

                setValue("exam", questionData.exam._id); // Set exam ID
                setValue("subjectId", questionData.subjectId._id); // Set subject ID
                setValue("question", questionData.question); // Set question
                setValue("options.optionA", questionData.options.optionA);
                setValue("options.optionB", questionData.options.optionB);
                setValue("options.optionC", questionData.options.optionC);
                setValue("options.optionD", questionData.options.optionD);
                setValue("correctOption", questionData.correctOption);

                setEditorResetTrigger((prev) => !prev); // Reset editor with new data
            } catch (error) {
                console.error("Failed to fetch question:", error);
            }
        };
        fetchQuestion();
    }, [id, subjectId, setValue]);

    useEffect(() => {
        const fetchExams = async () => {
            try {
                const response = await axios.get(`${API_BASE_URL}/admin/exams/getExams`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setExams(response.data.findExams);
            } catch (error) {
                console.error("Failed to fetch exams:", error);
            }
        };
        fetchExams();
    }, []);

    useEffect(() => {
        const fetchSubjects = async () => {
            try {
                const response = await axios.get(`${API_BASE_URL}/admin/subject/getSubject`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setSubjects(response.data);
            } catch (error) {
                console.error("Failed to fetch subjects:", error);
            }
        };
        fetchSubjects();
    }, []);

    const onSubmit = async (data) => {
        setLoading(true)
        try {
            await axios.put(`${API_BASE_URL}/admin/exams/editQuestion/${id}`, data, {
                headers: { Authorization: `Bearer ${token}` }
            });
            toast.success("Question updated successfully!");
            router.push("/admin/questions");
        } catch (error) {
            console.error("Failed to update question:", error);
            toast.error("Error updating question.");
            setLoading(false)
        } finally {
            setLoading(false)
        }
    };

    return (
        <div className="flex md:pl-8 min-h-screen">
            <AdminSideBar />
            <div className="flex flex-col w-full">
                <AdminNavBar />
                <Container>
                    <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-lg p-8 shadow-md w-[700px] mx-auto">
                        <h1 className="text-2xl font-bold mb-4">Edit Question</h1>

                        {/* Exam Selection (Read-only) */}
                        <div className="mb-4">
                            <label className="block text-gray-700 mb-2">Exam</label>
                            <Select value={watch("exam")} disabled>
                                <SelectTrigger className="bg-gray-100 cursor-not-allowed">
                                    <SelectValue placeholder="Exam" />
                                </SelectTrigger>
                                <SelectContent>
                                    {exams.map((exam) => (
                                        <SelectItem key={exam._id} value={exam._id}>{exam.title}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Subject Selection (Read-only) */}
                        <div className="mb-4">
                            <label className="block text-gray-700 mb-2">Subject</label>
                            <Select value={watch("subjectId")} disabled>
                                <SelectTrigger className="bg-gray-100 cursor-not-allowed">
                                    <SelectValue placeholder="Subject" />
                                </SelectTrigger>
                                <SelectContent>
                                    {subjects.map((subject) => (
                                        <SelectItem key={subject._id} value={subject._id}>{subject.title}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Question */}
                        <div className="mb-4">
                            <TiptapEditor
                                value={watch("question")}
                                onChange={(value) => setValue("question", value)}
                                reset={editorResetTrigger}
                            />
                        </div>

                        {/* Options */}
                        <div className="mb-4">
                            <label className="block text-gray-700 mb-2">Options</label>
                            {["optionA", "optionB", "optionC", "optionD"].map((option, index) => (
                                <div key={index} className="flex items-center gap-2">
                                    <span className="w-6">{String.fromCharCode(65 + index)}.</span>
                                    <Input {...register(`options.${option}`)} placeholder={`Option ${index + 1}`} className="mb-3" />
                                </div>
                            ))}
                        </div>

                        {/* Correct Answer */}
                        <div className="mb-4">
                            <Select onValueChange={(value) => setValue("correctOption", value)} value={watch("correctOption")}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select answer" />
                                </SelectTrigger>
                                <SelectContent>
                                    {["optionA", "optionB", "optionC", "optionD"].map((opt, idx) => (
                                        <SelectItem key={idx} value={opt}>{String.fromCharCode(65 + idx)}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <Button type="submit" className="w-full bg-blue-500 mt-4 font-semibold py-2 hover:bg-blue-400"> {loading ? <Image
                            src="/loader.gif"
                            className="text-white"
                            alt="loader"
                            width={20}
                            height={20}
                        /> : "Update Question"}</Button>
                    </form>
                </Container>
            </div>
            <ToastContainer />
        </div>
    );
};

export default EditQuestion;
