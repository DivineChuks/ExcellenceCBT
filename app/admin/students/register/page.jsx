"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import AdminNavBar from "../../_components/AdminNavBar";
import AdminSideBar from "../../_components/AdminSideBar";
import Container from "@/app/components/Container";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Image from "next/image";
import { UserPlus, Mail, UserCircle, BookOpen } from "lucide-react";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL

const RegisterStudent = () => {
    const [loading, setLoading] = useState(false);
    const [isRegistering, setIsRegistering] = useState(false)
    const [exams, setExams] = useState([]);
    const router = useRouter();
    const token = localStorage.getItem("token")

    // Define Zod schema for validation
    const studentSchema = z.object({
        name: z.string().min(2, { message: "Name must be at least 2 characters long" }),
        email: z.string().email({ message: "Invalid email address" }),
        regNo: z.string().min(4, { message: "Registration number is required" }),
        examId: z.string().optional(),
    });

    const {
        register,
        handleSubmit,
        setValue,
        watch,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(studentSchema),
        defaultValues: {
            name: "",
            email: "",
            regNo: "",
            examId: "",
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


    const onSubmit = async (data) => {
        setIsRegistering(true);
        try {
            const response = await axios.post(
                `${API_BASE_URL}/admin/students/register`, data, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                }
            }
            );
            toast.success("Student registered successfully!");
            router.push("/admin/students/view");
        } catch (error) {
            console.error("Error registering student:", error);
            toast.error("Registration failed. Please try again.");
        } finally {
            setIsRegistering(false);
        }
    };


    return (
        <div className="flex md:pl-8 min-h-screen bg-gray-50">
            <AdminSideBar />
            <div className="flex flex-col w-full">
                <AdminNavBar />
                <div className="px-4 py-3 md:py-8 w-full flex justify-center items-start">
                    <Container>
                        <div className="p-6 flex flex-col items-center justify-center min-h-[80vh]">
                            <div className="bg-white rounded-xl mx-auto shadow-lg w-full max-w-2xl p-8 border border-gray-100">
                                <div className="flex items-center mb-8">
                                    <div className="bg-blue-100 p-3 rounded-full mr-4">
                                        <UserPlus className="h-8 w-8 text-blue-600" />
                                    </div>
                                    <div>
                                        <h1 className="text-2xl font-bold text-gray-800">Register New Student</h1>
                                        <p className="text-gray-500">Enter student details to create a new account</p>
                                    </div>
                                </div>
                                
                                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                                    {/* Name Field */}
                                    <div>
                                        <label className="block text-gray-700 font-medium mb-2">Full Name</label>
                                        <div className="relative">
                                            <UserCircle className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                            <input
                                                {...register("name")}
                                                type="text"
                                                placeholder="Enter student's full name"
                                                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                            />
                                        </div>
                                        {errors.name && (
                                            <p className="text-red-500 text-sm mt-1">
                                                {errors.name.message}
                                            </p>
                                        )}
                                    </div>

                                    {/* Email Field */}
                                    <div>
                                        <label className="block text-gray-700 font-medium mb-2">Email Address</label>
                                        <div className="relative">
                                            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                            <input
                                                {...register("email")}
                                                type="email"
                                                placeholder="student@example.com"
                                                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                            />
                                        </div>
                                        {errors.email && (
                                            <p className="text-red-500 text-sm mt-1">
                                                {errors.email.message}
                                            </p>
                                        )}
                                    </div>

                                    {/* Reg Number */}
                                    <div>
                                        <label className="block text-gray-700 font-medium mb-2">Registration Number</label>
                                        <div className="relative">
                                            <BookOpen className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                            <input
                                                {...register("regNo")}
                                                placeholder="e.g. STU2025001"
                                                type="text"
                                                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                            />
                                        </div>
                                        {errors.regNo && (
                                            <p className="text-red-500 text-sm mt-1">
                                                {errors.regNo.message}
                                            </p>
                                        )}
                                    </div>

                                    {/* Select Exam - Uncomment when needed */}
                                    {exams.length > 0 && (
                                        <div>
                                            <label className="block text-gray-700 font-medium mb-2">Choose Exam</label>
                                            <Select
                                                onValueChange={(value) => setValue("examId", value)}
                                                defaultValue=""
                                            >
                                                <SelectTrigger className="w-full py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                                                    <SelectValue placeholder="Select an exam" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {exams.map((exam) => (
                                                        <SelectItem key={exam._id} value={exam._id}>
                                                            {exam.title}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    )}

                                    {/* Submit Button */}
                                    <div className="pt-2">
                                        <Button
                                            type="submit"
                                            className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors shadow-md hover:shadow-lg"
                                            disabled={isRegistering}
                                        >
                                            {isRegistering ? (
                                                <div className="flex items-center justify-center">
                                                    <Image
                                                        src="/loader.gif"
                                                        className="mr-2"
                                                        alt="loader"
                                                        width={24}
                                                        height={24}
                                                    />
                                                    <span>Registering...</span>
                                                </div>
                                            ) : (
                                                "Register Student"
                                            )}
                                        </Button>
                                    </div>
                                </form>
                                
                                <div className="mt-6 pt-4 border-t border-gray-100 text-center">
                                    <button 
                                        onClick={() => router.push("/admin/students/view")}
                                        className="text-blue-600 hover:text-blue-800 font-medium transition-colors"
                                    >
                                        View all students
                                    </button>
                                </div>
                            </div>
                        </div>
                    </Container>
                </div>
            </div>
            <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />
        </div>
    );
};

export default RegisterStudent;