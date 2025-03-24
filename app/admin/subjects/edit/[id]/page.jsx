"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Skeleton } from "@/components/ui/skeleton";
import Container from "@/app/components/Container";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useRouter, useParams } from "next/navigation";
import AdminNavBar from "../../../_components/AdminNavBar";
import AdminSideBar from "@/app/admin/_components/AdminSideBar";
import { Pencil, ArrowLeft } from "lucide-react";

// API Base URL
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

// Zod Schema for Validation
const subjectSchema = z.object({
    title: z.string().min(3, { message: "Subject title must be at least 3 characters" }),
    code: z.string().min(3, { message: "Subject code must be at least 3 characters" }),
    description: z.string().optional(),
});

const EditSubject = () => {
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);
    const router = useRouter();
    const { id } = useParams(); // Get subId from URL
    const token = localStorage.getItem("token");

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(subjectSchema),
        defaultValues: {
            title: "",
            code: "",
            description: "",
        },
    });

    // Fetch Subject Data
    useEffect(() => {
        const fetchSubject = async () => {
            try {
                const response = await axios.get(
                    `${API_BASE_URL}/admin/subject/getSubject/${id}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );
                reset(response.data.results); // Pre-fill form with fetched data
            } catch (error) {
                console.error("Error fetching subject data:", error);
                toast.error("Failed to fetch subject data.");
            } finally {
                setFetching(false);
            }
        };

        fetchSubject();
    }, [id, token, reset]);

    // Submit Handler
    const onSubmit = async (data) => {
        setLoading(true);
        try {
            await axios.put(
                `${API_BASE_URL}/admin/subject/editSubject/${id}`,
                data,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                }
            );

            toast.success("Subject updated successfully!");
            router.push("/admin/subjects")
        } catch (error) {
            console.error("Error updating subject:", error);
            toast.error("Failed to update subject. Please try again.");
        } finally {
            setLoading(false);
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
                            <div className="bg-white rounded-xl mx-auto shadow-lg border border-gray-100 w-full max-w-2xl p-8 transition-all duration-300 hover:shadow-xl">
                                <div className="flex items-center space-x-3 mb-6">
                                    <div className="bg-indigo-500 p-2 rounded-lg">
                                        <Pencil className="h-6 w-6 text-white" />
                                    </div>
                                    <h1 className="text-2xl font-bold text-gray-800">Edit Subject</h1>
                                </div>

                                <div className="w-full h-1 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full mb-8"></div>

                                <Button
                                    type="button"
                                    onClick={() => router.push("/admin/subjects")}
                                    className="flex items-center text-indigo-600 hover:text-indigo-800 transition-colors duration-300 mb-6"
                                    variant="ghost"
                                >
                                    <ArrowLeft className="h-4 w-4 mr-2" />
                                    Back to Subjects
                                </Button>

                                {fetching ? (
                                    <div className="space-y-6 mt-4">
                                        <Skeleton className="h-12 w-full rounded-lg" />
                                        <Skeleton className="h-12 w-full rounded-lg" />
                                        <Skeleton className="h-32 w-full rounded-lg" />
                                        <Skeleton className="h-12 w-full rounded-lg" />
                                    </div>
                                ) : (
                                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                                        {/* Subject Name */}
                                        <div>
                                            <label className="block text-base mb-2 font-medium text-gray-700">
                                                Subject Name
                                            </label>
                                            <Input
                                                {...register("title")}
                                                placeholder="Enter subject title"
                                                className="mt-1 h-12 rounded-lg border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 transition-all duration-300"
                                            />
                                            {errors.title && (
                                                <p className="text-red-500 text-sm mt-1 font-medium">
                                                    {errors.title.message}
                                                </p>
                                            )}
                                        </div>

                                        {/* Subject Code */}
                                        <div>
                                            <label className="block text-base mb-2 font-medium text-gray-700">
                                                Subject Code
                                            </label>
                                            <Input
                                                {...register("code")}
                                                placeholder="Enter subject code"
                                                className="mt-1 h-12 rounded-lg border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 transition-all duration-300"
                                            />
                                            {errors.code && (
                                                <p className="text-red-500 text-sm mt-1 font-medium">
                                                    {errors.code.message}
                                                </p>
                                            )}
                                        </div>

                                        {/* Description */}
                                        <div>
                                            <label className="block text-base mb-2 font-medium text-gray-700">
                                                Description
                                            </label>
                                            <textarea
                                                {...register("description")}
                                                placeholder="Optional description"
                                                rows={4}
                                                className="w-full mt-1 px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-500 border-gray-300 transition-all duration-300"
                                            />
                                        </div>

                                        <div className="flex items-center pt-4">
                                            <Button
                                                type="button"
                                                onClick={() => router.push("/admin/subjects")}
                                                className="mr-4 px-6 py-3 h-12 rounded-lg border border-gray-300 text-white font-medium hover:bg-gray-100 transition-all duration-300"
                                            >
                                                Cancel
                                            </Button>
                                            <Button
                                                type="submit"
                                                className="flex-1 h-12 bg-blue-500 text-white text-base font-semibold rounded-lg hover:from-indigo-600 hover:to-indigo-700 transition-all duration-300 shadow-md hover:shadow-lg"
                                                disabled={loading}
                                            >
                                                {loading ? (
                                                    <div className="flex items-center justify-center">
                                                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                                                        Updating...
                                                    </div>
                                                ) : (
                                                    "Update Subject"
                                                )}
                                            </Button>
                                        </div>
                                    </form>
                                )}
                            </div>
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
                theme="colored"
            />
        </div>
    );
};

export default EditSubject;