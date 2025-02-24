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

const RegisterStudent = () => {
    const [loading, setLoading] = useState(false);

    // Define Zod schema for validation
    const studentSchema = z.object({
        name: z.string().min(2, { message: "Name must be at least 2 characters long" }),
        email: z.string().email({ message: "Invalid email address" }),
        class: z.string().nonempty({ message: "Please select a class" }),
        subjects: z.array(z.string()).min(4, { message: "Select at least 4 subjects" }),
    });

    // React Hook Form with Zod
    const {
        control,
        handleSubmit,
        register,
        setValue,
        watch,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(studentSchema),
        defaultValues: {
            name: "",
            email: "",
            class: "",
            subjects: [],
        },
    });

    const onSubmit = (data) => {
        console.log("Form Data:", data);
        // Submit logic here
    };

    // Available subjects
    const subjectsList = ["Mathematics", "English", "Biology", "Physics", "Chemistry", "Economics"];

    const selectedSubjects = watch("subjects", []);

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
                                    <h1 className="text-2xl font-bold mb-4">Register Student</h1>
                                    <form onSubmit={handleSubmit(onSubmit)}>
                                        {/* Name Field */}
                                        <div className="mb-4">
                                            <label className="block text-gray-700 mb-2">Name</label>
                                            <input
                                                {...register("name")}
                                                type="text"
                                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
                                            />
                                            {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
                                        </div>

                                        {/* Email Field */}
                                        <div className="mb-4">
                                            <label className="block text-gray-700 mb-2">Email</label>
                                            <input
                                                {...register("email")}
                                                type="email"
                                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
                                            />
                                            {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
                                        </div>

                                        {/* Reg Number */}
                                        <div className="mb-4">
                                            <label className="block text-gray-700 mb-2">Reg No</label>
                                            <input
                                                {...register("regNumber")}
                                                placeholder="Enter Reg No"
                                                type="text"
                                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
                                            />
                                            {errors.name && <p className="text-red-500 text-sm">{errors.regNumber.message}</p>}
                                        </div>

                                        {/* Class Select */}
                                        <div className="mb-4">

                                            <label className="block text-sm font-medium text-gray-700">Class</label>
                                            <Select
                                            // onValueChange={(value) => control.setValue("category", value)}
                                            // defaultValue=""
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select class" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="SS1">SS1</SelectItem>
                                                    <SelectItem value="SS2">SS2</SelectItem>
                                                    <SelectItem value="SS3">SS3</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            {errors.class && (
                                                <p className="text-red-500 text-sm mt-1">{errors.class.message}</p>
                                            )}

                                        </div>

                                        {/* Subjects Multi-Select */}
                                        <div className="mb-4">
                                            <label className="block text-gray-700 mb-2">Subjects (Select at least 4)</label>
                                            <div className="grid grid-cols-2 gap-2">
                                                {subjectsList.map((subject) => (
                                                    <div key={subject} className="flex items-center space-x-2">
                                                        <input
                                                            type="checkbox"
                                                            value={subject}
                                                            {...register("subjects")}
                                                            className="form-checkbox h-5 w-5 text-blue-600"
                                                            onChange={(e) => {
                                                                const value = e.target.value;
                                                                const isChecked = e.target.checked;
                                                                const currentSubjects = watch("subjects");
                                                                const updatedSubjects = isChecked
                                                                    ? [...currentSubjects, value]
                                                                    : currentSubjects.filter((s) => s !== value);
                                                                setValue("subjects", updatedSubjects);
                                                            }}
                                                        />
                                                        <label className="text-gray-700">{subject}</label>
                                                    </div>
                                                ))}
                                            </div>
                                            {errors.subjects && (
                                                <p className="text-red-500 text-sm">{errors.subjects.message}</p>
                                            )}
                                            <p className="text-gray-500 text-sm mt-1">
                                                Selected: {selectedSubjects.length} / 6
                                            </p>
                                        </div>

                                        {/* Submit Button */}
                                        <Button type="submit" className="mt-6 w-full bg-blue-500 hover:bg-blue-400 text-base text-semibold text-white">
                                            Register
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

export default RegisterStudent;
