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

// API Base URL
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

// Zod Schema for Validation
const subjectSchema = z.object({
    name: z.string().min(3, { message: "Subject name must be at least 3 characters" }),
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
            name: "",
            code: "",
            description: "",
        },
    });

    console.log("subId--->", id)

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
                reset(response.data); // Pre-fill form with fetched data
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
            router.push("/admin/subjects");
        } catch (error) {
            console.error("Error updating subject:", error);
            toast.error("Failed to update subject. Please try again.");
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
                            <div className="bg-white rounded-lg mx-auto shadow-md w-[600px] p-6 py-8">
                                <h1 className="text-2xl font-bold mb-4">Edit Subject</h1>
                                {fetching ? (
                                    <div className="space-y-6 mt-8">
                                        <Skeleton className="h-10 w-full" />
                                        <Skeleton className="h-10 w-full" />
                                        <Skeleton className="h-24 w-full" />
                                    </div>
                                ) : (
                                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                                        {/* Subject Name */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">
                                                Subject Name
                                            </label>
                                            <Input
                                                {...register("name")}
                                                placeholder="Enter subject name"
                                                className="mt-1"
                                            />
                                            {errors.name && (
                                                <p className="text-red-500 text-sm mt-1">
                                                    {errors.name.message}
                                                </p>
                                            )}
                                        </div>

                                        {/* Subject Code */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">
                                                Subject Code
                                            </label>
                                            <Input
                                                {...register("code")}
                                                placeholder="Enter subject code"
                                                className="mt-1"
                                            />
                                            {errors.code && (
                                                <p className="text-red-500 text-sm mt-1">
                                                    {errors.code.message}
                                                </p>
                                            )}
                                        </div>

                                        {/* Description */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">
                                                Description
                                            </label>
                                            <textarea
                                                {...register("description")}
                                                placeholder="Optional description"
                                                className="w-full mt-1 px-3 py-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-300"
                                            />
                                        </div>

                                        {/* Submit Button */}
                                        <Button
                                            type="submit"
                                            className="w-full bg-blue-500 hover:bg-blue-600"
                                            disabled={loading}
                                        >
                                            {loading ? "Updating..." : "Update Subject"}
                                        </Button>
                                    </form>
                                )}
                            </div>
                        </div>
                    </Container>
                </div>
            </div>
            <ToastContainer />
        </div>
    );
};

export default EditSubject;
