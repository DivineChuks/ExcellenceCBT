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

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL

const RegisterStudent = () => {
    const [loading, setLoading] = useState(false);
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

    // Fetch exams from API
    useEffect(() => {
        const fetchExams = async () => {
            try {
                const response = await axios.get(`${API_BASE_URL}/admin/exams`);
                setExams(response.data.exams);
            } catch (error) {
                console.error("Error fetching exams:", error);
            }
        };
        fetchExams();
    }, []);

    console.log("token---->", token)


    const onSubmit = async (data) => {
        setLoading(true);
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
        } finally {
            setLoading(false);
        }
    };


    return (
        <div className="flex md:pl-8 min-h-screen">
            <AdminSideBar />
            <div className="flex flex-col w-full">
                <AdminNavBar />
                <div className="px-4 py-3 md:py-8 w-full flex justify-center items-start">
                    <Container>
                        <div className="p-6 flex flex-col items-center justify-center min-h-[80vh]">
                            <div className="bg-white rounded-lg mx-auto shadow-md w-[700px] p-6 py-8">
                                <h1 className="text-2xl font-bold mb-4">Register Student</h1>
                                <form onSubmit={handleSubmit(onSubmit)}>
                                    {/* Name Field */}
                                    <div className="mb-4">
                                        <label className="block text-gray-700 text-base mb-2">Name</label>
                                        <input
                                            {...register("name")}
                                            type="text"
                                            placeholder="Enter Student Name"
                                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
                                        />
                                        {errors.name && (
                                            <p className="text-red-500 text-sm">
                                                {errors.name.message}
                                            </p>
                                        )}
                                    </div>

                                    {/* Email Field */}
                                    <div className="mb-4">
                                        <label className="block text-gray-700 mb-2">Email</label>
                                        <input
                                            {...register("email")}
                                            type="email"
                                            placeholder="Enter Email"
                                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
                                        />
                                        {errors.email && (
                                            <p className="text-red-500 text-sm">
                                                {errors.email.message}
                                            </p>
                                        )}
                                    </div>

                                    {/* Reg Number */}
                                    <div className="mb-4">
                                        <label className="block text-gray-700 mb-2">Reg No</label>
                                        <input
                                            {...register("regNo")}
                                            placeholder="Enter Reg No"
                                            type="text"
                                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
                                        />
                                        {errors.regNo && (
                                            <p className="text-red-500 text-sm">
                                                {errors.regNo.message}
                                            </p>
                                        )}
                                    </div>

                                    {/* Select Exam */}
                                    {exams.length > 0 && (<div className="mb-4">
                                        <label className="block text-gray-700 mb-2">Select Exam</label>
                                        <Select
                                            onValueChange={(value) => setValue("examId", value)}
                                            defaultValue=""
                                        >
                                            <SelectTrigger className="w-full">
                                                <SelectValue placeholder="Select Exam" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {exams.map((exam) => (
                                                    <SelectItem key={exam.id} value={exam.id}>
                                                        {exam.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        {/* {errors.examId && (
                                            <p className="text-red-500 text-sm">
                                                {errors.examId.message}
                                            </p>
                                        )} */}
                                    </div>)}

                                    {/* Submit Button */}
                                    <Button
                                        type="submit"
                                        className="mt-6 w-full bg-blue-500 hover:bg-blue-400 text-base text-semibold text-white"
                                        disabled={loading}
                                    >
                                        {loading ? "Registering..." : "Register"}
                                    </Button>
                                </form>
                            </div>
                        </div>
                    </Container>
                </div>
            </div>
            <ToastContainer />
        </div>
    );
};

export default RegisterStudent;
