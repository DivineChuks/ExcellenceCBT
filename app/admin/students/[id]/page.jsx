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
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useRouter, useParams } from "next/navigation";
import Image from "next/image";
import { UserIcon, MailIcon, GraduationCap, IdCard } from "lucide-react";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

const EditStudent = () => {
    const [loading, setLoading] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [exams, setExams] = useState([]);
    const router = useRouter();
    const { id } = useParams();
    const token = localStorage.getItem("token");

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

    // Fetch student data for editing
    useEffect(() => {
        const fetchStudent = async () => {
            try {
                setLoading(true);
                const response = await axios.get(`${API_BASE_URL}/admin/students/getStudent/${id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    }
                });
                const student = response.data;
                setValue("name", student.name);
                setValue("email", student.email);
                setValue("regNo", student.regNo);
                setValue("examId", student.examId);
            } catch (error) {
                console.error("Error fetching student:", error);
                toast.error("Failed to load student data");
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchStudent();
        }
    }, [id, setValue, token]);

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
                toast.error("Failed to load available exams");
            } finally {
                setLoading(false);
            }
        };
        fetchExams();
    }, [token]);

    // Handle form submission
    const onSubmit = async (data) => {
        setIsEditing(true);
        try {
            await axios.put(
                `${API_BASE_URL}/admin/students/editStudent/${id}`,
                data,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    }
                }
            );
            // If an exam is selected, assign the exam to the student
            if (data.examId) {
                await axios.post(
                    `${API_BASE_URL}/admin/exams/assign`,
                    {
                        studentId: id,
                        examId: data.examId
                    },
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            "Content-Type": "application/json",
                        }
                    }
                );
            }
            toast.success("Student updated successfully!");
            router.push("/admin/students/view");
        } catch (error) {
            console.error("Error updating student:", error);
            toast.error("Failed to update student");
        } finally {
            setIsEditing(false);
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
                            {loading ? (
                                <div className="flex justify-center items-center h-64">
                                    <Image
                                        src="/loader.gif"
                                        alt="Loading..."
                                        width={50}
                                        height={50}
                                    />
                                </div>
                            ) : (
                                <div className="bg-white rounded-xl mx-auto shadow-md w-full max-w-xl p-8 border border-gray-100">
                                    <div className="flex items-center mb-6">
                                        <div className="bg-blue-100 p-3 rounded-full mr-4">
                                            <UserIcon className="h-6 w-6 text-blue-600" />
                                        </div>
                                        <div>
                                            <h1 className="text-2xl font-bold text-gray-800">Edit Student</h1>
                                            <p className="text-gray-500 text-sm">Update student information and exam assignment</p>
                                        </div>
                                    </div>
                                    
                                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                                        {/* Name Field */}
                                        <div>
                                            <label className="block text-gray-700 text-sm font-medium mb-2">Full Name</label>
                                            <div className="relative">
                                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                    <UserIcon className="h-5 w-5 text-gray-400" />
                                                </div>
                                                <input
                                                    {...register("name")}
                                                    type="text"
                                                    placeholder="Enter Student Name"
                                                    className="w-full pl-10 px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                                />
                                            </div>
                                            {errors.name && (
                                                <p className="text-red-500 text-xs mt-1">
                                                    {errors.name.message}
                                                </p>
                                            )}
                                        </div>

                                        {/* Email Field */}
                                        <div>
                                            <label className="block text-gray-700 text-sm font-medium mb-2">Email Address</label>
                                            <div className="relative">
                                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                    <MailIcon className="h-5 w-5 text-gray-400" />
                                                </div>
                                                <input
                                                    {...register("email")}
                                                    type="email"
                                                    placeholder="Enter Email"
                                                    className="w-full pl-10 px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                                />
                                            </div>
                                            {errors.email && (
                                                <p className="text-red-500 text-xs mt-1">
                                                    {errors.email.message}
                                                </p>
                                            )}
                                        </div>

                                        {/* Reg Number */}
                                        <div>
                                            <label className="block text-gray-700 text-sm font-medium mb-2">Registration Number</label>
                                            <div className="relative">
                                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                    <IdCard className="h-5 w-5 text-gray-400" />
                                                </div>
                                                <input
                                                    {...register("regNo")}
                                                    placeholder="Enter Registration Number"
                                                    type="text"
                                                    className="w-full pl-10 px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                                />
                                            </div>
                                            {errors.regNo && (
                                                <p className="text-red-500 text-xs mt-1">
                                                    {errors.regNo.message}
                                                </p>
                                            )}
                                        </div>

                                        {/* Select Exam */}
                                        {exams.length > 0 && (
                                            <div>
                                                <label className="block text-gray-700 text-sm font-medium mb-2">Assigned Exam</label>
                                                <div className="relative">
                                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                        <GraduationCap className="h-5 w-5 text-gray-400"  />
                                                    </div>
                                                    <Select
                                                        onValueChange={(value) => setValue("examId", value)}
                                                        defaultValue=""
                                                    >
                                                        <SelectTrigger className="w-full pl-10 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all">
                                                            <SelectValue placeholder="Select Exam" className="text-gray-500" />
                                                        </SelectTrigger>
                                                        <SelectContent className="border border-gray-200 shadow-lg rounded-lg">
                                                            {exams.map((exam) => (
                                                                <SelectItem key={exam._id} value={exam._id} className="hover:bg-blue-50">
                                                                    {exam.title}
                                                                </SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                            </div>
                                        )}

                                        {/* Action Buttons */}
                                        <div className="flex space-x-4 pt-2">
                                            <Button
                                                type="button"
                                                className="w-full py-2.5 border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 rounded-lg font-medium transition-all"
                                                onClick={() => router.push("/admin/students/view")}
                                                disabled={isEditing}
                                            >
                                                Cancel
                                            </Button>
                                            <Button
                                                type="submit"
                                                className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-all shadow-md"
                                                disabled={isEditing}
                                            >
                                                {isEditing ? (
                                                    <div className="flex items-center justify-center">
                                                        <Image
                                                            src="/loader.gif"
                                                            alt="Saving..."
                                                            width={20}
                                                            height={20}
                                                            className="mr-2"
                                                        />
                                                        <span>Updating...</span>
                                                    </div>
                                                ) : (
                                                    "Save Changes"
                                                )}
                                            </Button>
                                        </div>
                                    </form>
                                </div>
                            )}
                        </div>
                    </Container>
                </div>
            </div>
            <ToastContainer position="top-right" autoClose={3000} />
        </div>
    );
};

export default EditStudent;