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
import TiptapEditor from "../../dashboard/_components/TipTapEditor";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import RichTextEditor from "../../dashboard/_components/Editor"
import Image from "next/image";

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
    const [subjects, setSubjects] = useState([])
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
                console.error("Error fetching exams:", error);
            }
        };
        fetchSubjects();
    }, []);

    console.log("subjects--->", subjects)

    // Handle form submission
    const onSubmit = async (data) => {
        setLoading(true)
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
            // router.push("/admin/questions"); // Redirect if needed
        } catch (error) {
            console.error("Failed to add question:", error);
            alert("Error adding question. Try again.");
        } finally {
            setLoading(false)
        }
    };

    return (
        <div className="flex md:pl-8 min-h-screen">
            <AdminSideBar />
            <div className="flex flex-col w-full">
                <AdminNavBar />
                <div className="px-4 py-3 md:py-8 w-full flex justify-center items-start">
                    <Container>
                        <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-lg p-8 mx-auto shadow-md w-[700px]">
                            <h1 className="text-2xl font-bold mb-4">Add Question</h1>

                            {/* Select Exam */}
                            <div className="mb-4">
                                <label className="block text-gray-700 mb-2">Select Exam</label>
                                <Select onValueChange={(value) => setValue("exam", value)}>
                                    <SelectTrigger>
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
                                {errors.exam && <p className="text-red-500 text-sm">{errors.exam.message}</p>}
                            </div>

                            {/* Select Subject (Depends on Exam) */}
                            <div className="mb-4">
                                <label className="block text-gray-700 mb-2">Select Subject</label>
                                <Select onValueChange={(value) => setValue("subjectId", value)}>
                                    <SelectTrigger>
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
                                {errors.subjectId && <p className="text-red-500 text-sm">{errors.subjectId.message}</p>}
                            </div>
                            {/* Question */}
                            <div className="mb-4">
                                <label className="block text-gray-700 mb-2">Question</label>
                                <RichTextEditor
                                    value={watch("question")}
                                    onChange={(content) => setValue("question", content)}
                                    reset={editorResetTrigger}
                                    placeholder="Type your question here..."
                                />
                                {errors.question && <p className="text-red-500 text-sm">{errors.question.message}</p>}
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
                                {errors.options && <p className="text-red-500 text-sm">{errors.options.message}</p>}
                            </div>

                            {/* Correct Answer */}
                            <div className="mb-8">
                                <label className="block text-gray-700 mb-2">Correct Answer</label>
                                <Select value={watch("correctOption")} onValueChange={(value) => setValue("correctOption", value)}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select answer" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {["optionA", "optionB", "optionC", "optionD"].map((opt, idx) => (
                                            <SelectItem key={idx} value={opt}>
                                                {String.fromCharCode(65 + idx)}.
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {errors.correctOption && <p className="text-red-500 text-sm">{errors.correctOption.message}</p>}
                            </div>

                            {/* Submit Button */}
                            <Button disabled={loading} type="submit" className="w-full bg-blue-500 text-base font-semibold py-2 hover:bg-blue-400">{loading ? (
                                <Image
                                    src="/loader.gif"
                                    className="text-white"
                                    alt="loader"
                                    width={20}
                                    height={20}
                                />
                            ) : "Add Question"}</Button>
                        </form>
                    </Container>
                </div>
            </div>
            <ToastContainer />
        </div>
    );
};

export default AddQuestion;
