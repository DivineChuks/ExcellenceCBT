"use client";
import React, { useState } from "react";
import AdminNavBar from "../../_components/AdminNavBar";
import { Skeleton } from "@/components/ui/skeleton";
import AdminSideBar from "../../_components/AdminSideBar";
import Container from "@/app/components/Container";
import { z } from "zod";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";



const subjectSchema = z.object({
    name: z.string().min(3, { message: "Subject name must be at least 3 characters" }),
    code: z.string().min(3, { message: "Subject code must be at least 3 characters" }),
    category: z.enum(["Compulsory", "Elective"], { required_error: "Category is required" }),
    description: z.string().optional(),
    teacher: z.string().min(3, { message: "Teacher's name must be at least 3 characters" }),
});

const AddSubjects = () => {
    const [loading, setLoading] = useState(false);

    const {
        register,
        handleSubmit,
        control,
        reset,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(subjectSchema),
        defaultValues: {
            name: "",
            code: "",
            category: "",
            description: "",
            teacher: "",
        },
    });

    const onSubmit = (data) => {
        console.log("Subject Added:", data);
        alert("Subject added successfully!");
        reset(); // Reset form after submission
    };

    return (
        <div className="flex md:pl-8 min-h-screen">
            <AdminSideBar />
            <div className="flex flex-col w-full">
                <AdminNavBar />
                <div className="px-4 py-3 md:py-8 w-full flex justify-center items-start">
                    <Container>
                        {loading ? (
                            <div className="space-y-6 mt-8">
                                <div className="flex flex-col md:flex-row gap-4 w-full">
                                    <Skeleton className="h-24 w-full md:w-1/3" />
                                    <Skeleton className="h-24 w-full md:w-1/3" />
                                    <Skeleton className="h-24 w-full md:w-1/3" />
                                </div>
                                <Skeleton className="h-40 w-full" />
                                <Skeleton className="h-40 w-full" />
                            </div>
                        ) : (
                            <div className="p-6 flex flex-col items-center justify-center min-h-[80vh]">
                                <div className="bg-white rounded-lg mx-auto shadow-md w-[600px] p-6 py-8">
                                    <h1 className="text-2xl font-bold mb-4">Add Subjects</h1>
                                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Subject Name</label>
                                            <Input
                                                {...register("name")}
                                                placeholder="Enter subject name"
                                                className="mt-1"
                                            />
                                            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Subject Code</label>
                                            <Input
                                                {...register("code")}
                                                placeholder="Enter subject code"
                                                className="mt-1"
                                            />
                                            {errors.code && <p className="text-red-500 text-sm mt-1">{errors.code.message}</p>}
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Description</label>
                                            <textarea
                                                {...register("description")}
                                                placeholder="Optional description"
                                                className="w-full mt-1 px-3 py-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-300"
                                            />
                                        </div>

                                        <Button type="submit" className="w-full bg-blue-500 hover:bg-blue-600">
                                            Add Subject
                                        </Button>
                                    </form>
                                </div>
                            </div>
                        )}
                    </Container>
                </div>
            </div>
        </div>
    );
};

export default AddSubjects;
