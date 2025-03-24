"use client";
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import axios from "axios";
import { useRouter } from "next/navigation";
import AdminNavBar from "../../_components/AdminNavBar";
import AdminSideBar from "../../_components/AdminSideBar";
import Container from "@/app/components/Container";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import RichTextEditor from "../../dashboard/_components/Editor";
import Image from "next/image";
import { BookOpen, Book, HelpCircle, CheckCircle, FileText, Plus } from "lucide-react";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
const token = localStorage.getItem("token");

// Schema validation
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

const AddQuestion = () => {
    const router = useRouter();
    const [exams, setExams] = useState([]);
    const [subjects, setSubjects] = useState([]);
    const [loading, setLoading] = useState(false);
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

    // Fetch available exams
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
                toast.error("Failed to load exams");
            } finally {
                setLoading(false);
            }
        };
        fetchExams();
    }, []);

    useEffect(() => {
        const fetchSubjects = async () => {
            try {
                const response = await axios.get(`${API_BASE_URL}/admin/subject/getSubjects`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    }
                });
                setSubjects(response.data);
            } catch (error) {
                console.error("Error fetching subjects:", error);
                toast.error("Failed to load subjects");
            }
        };
        fetchSubjects();
    }, []);

    // Handle form submission
    const onSubmit = async (data) => {
        setLoading(true);
        try {
            await axios.post(`${API_BASE_URL}/admin/exams/addQuestions`, data, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });
            toast.success("Question added successfully!");
            // Reset form but keep the same exam and subject
            reset({
                exam: watch("exam"),  // Keep selected exam
                subjectId: watch("subjectId"),  // Keep selected subject
                question: "",
                options: {
                    optionA: "",
                    optionB: "",
                    optionC: "",
                    optionD: "",
                },
                correctOption: "",
            });
            setValue("question", "");
            setValue("correctOption", "");
            Object.keys(data.options).forEach(key => {
                setValue(`options.${key}`, "");
            });
            setEditorResetTrigger(prev => !prev);
        } catch (error) {
            console.error("Failed to add question:", error);
            toast.error("Failed to add question. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex md:pl-8 min-h-screen bg-gray-50">
            <AdminSideBar />
            <div className="flex flex-col w-full">
                <AdminNavBar />
                <div className="px-4 py-6 md:py-12 w-full">
                    <Container>
                        <div className="max-w-4xl mx-auto">
                            {/* Header Section */}
                            <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-t-xl p-6 text-white flex items-center shadow-md">
                                <div className="bg-white/20 p-3 rounded-full mr-4">
                                    <HelpCircle size={28} className="text-white" />
                                </div>
                                <div>
                                    <h1 className="text-2xl font-bold">Add New Question</h1>
                                    <p className="text-blue-100">Create exam questions with multiple choice options</p>
                                </div>
                            </div>
                            
                            {/* Form Content */}
                            <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-b-xl p-8 shadow-lg border border-gray-100">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Select Exam */}
                                    <div className="space-y-2">
                                        <label className="flex items-center text-gray-700 font-medium">
                                            <BookOpen className="h-4 w-4 mr-2 text-blue-600" />
                                            Select Exam
                                        </label>
                                        <Select onValueChange={(value) => setValue("exam", value)}>
                                            <SelectTrigger className="border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all">
                                                <SelectValue placeholder="Choose an exam" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {exams?.map((exam) => (
                                                    <SelectItem key={exam._id} value={exam._id}>
                                                        {exam.title}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        {errors.exam && <p className="text-red-500 text-sm mt-1">{errors.exam.message}</p>}
                                    </div>

                                    {/* Select Subject */}
                                    <div className="space-y-2">
                                        <label className="flex items-center text-gray-700 font-medium">
                                            <Book className="h-4 w-4 mr-2 text-blue-600" />
                                            Select Subject
                                        </label>
                                        <Select onValueChange={(value) => setValue("subjectId", value)}>
                                            <SelectTrigger className="border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all">
                                                <SelectValue placeholder="Choose a subject" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {subjects?.map((subject) => (
                                                    <SelectItem key={subject._id} value={subject._id}>
                                                        {subject.title}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        {errors.subjectId && <p className="text-red-500 text-sm mt-1">{errors.subjectId.message}</p>}
                                    </div>
                                </div>

                                {/* Question Section */}
                                <div className="mt-6">
                                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                                        <label className="flex items-center text-gray-700 font-medium mb-3">
                                            <FileText className="h-4 w-4 mr-2 text-blue-600" />
                                            Question Content
                                        </label>
                                        <div className="bg-white rounded-md border border-gray-200">
                                            <RichTextEditor
                                                value={watch("question")}
                                                onChange={(content) => setValue("question", content)}
                                                reset={editorResetTrigger}
                                                placeholder="Type your question here..."
                                            />
                                        </div>
                                        {errors.question && <p className="text-red-500 text-sm mt-2">{errors.question.message}</p>}
                                    </div>
                                </div>

                                {/* Options Section */}
                                <div className="mt-6">
                                    <h3 className="text-lg font-medium text-gray-800 mb-4 flex items-center">
                                        <CheckCircle className="h-5 w-5 mr-2 text-blue-600" />
                                        Answer Options
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {["optionA", "optionB", "optionC", "optionD"].map((option, index) => (
                                            <div key={index} className="relative">
                                                <div className="absolute left-0 top-0 flex items-center justify-center h-full ml-3">
                                                    <span className="h-6 w-6 rounded-full bg-blue-100 flex items-center justify-center text-blue-800 font-semibold text-sm">
                                                        {String.fromCharCode(65 + index)}
                                                    </span>
                                                </div>
                                                <Input 
                                                    {...register(`options.${option}`)} 
                                                    placeholder={`Option ${String.fromCharCode(65 + index)}`} 
                                                    className="pl-12 py-6 border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all" 
                                                />
                                                {errors.options && errors.options[option] && (
                                                    <p className="text-red-500 text-sm mt-1">{errors.options[option].message}</p>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Correct Answer */}
                                <div className="mt-6">
                                    <label className="flex items-center text-gray-700 font-medium mb-2">
                                        <CheckCircle className="h-4 w-4 mr-2 text-green-600" />
                                        Correct Answer
                                    </label>
                                    <Select value={watch("correctOption")} onValueChange={(value) => setValue("correctOption", value)}>
                                        <SelectTrigger className="border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all">
                                            <SelectValue placeholder="Select correct answer" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {["optionA", "optionB", "optionC", "optionD"].map((opt, idx) => (
                                                <SelectItem key={idx} value={opt}>
                                                    Option {String.fromCharCode(65 + idx)}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {errors.correctOption && <p className="text-red-500 text-sm mt-1">{errors.correctOption.message}</p>}
                                </div>

                                {/* Action Buttons */}
                                <div className="mt-8 flex flex-col md:flex-row gap-4">
                                    <Button 
                                        disabled={loading} 
                                        type="submit" 
                                        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-6 rounded-lg shadow-md hover:shadow-lg transition-all"
                                    >
                                        {loading ? (
                                            <div className="flex items-center justify-center">
                                                <Image
                                                    src="/loader.gif"
                                                    alt="loading"
                                                    width={24}
                                                    height={24}
                                                    className="mr-2"
                                                />
                                                <span>Saving Question...</span>
                                            </div>
                                        ) : (
                                            <div className="flex items-center justify-center">
                                                <Plus className="h-5 w-5 mr-2" />
                                                <span>Add Question</span>
                                            </div>
                                        )}
                                    </Button>
                                    <Button 
                                        type="button" 
                                        className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-6 rounded-lg shadow-sm transition-all"
                                        onClick={() => router.push("/admin/exams/view")}
                                    >
                                        View All Exams
                                    </Button>
                                </div>
                            </form>
                        </div>
                    </Container>
                </div>
            </div>
            <ToastContainer 
                position="top-right"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
            />
        </div>
    );
};

export default AddQuestion;