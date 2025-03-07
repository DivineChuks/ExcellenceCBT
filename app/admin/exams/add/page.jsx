"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import axios from "axios";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useRouter } from "next/navigation";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AdminNavBar from "../../_components/AdminNavBar";
import AdminSideBar from "../../_components/AdminSideBar";
import Container from "@/app/components/Container";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

// Validation schema with Zod
const examSchema = z.object({
    title: z.string().min(3, "Title must be at least 3 characters long"),
    duration: z.string().refine((val) => !isNaN(val) && Number(val) > 0, {
        message: "Duration must be a valid number greater than 0",
    }),
    numberQuestions: z.string().refine((val) => !isNaN(val) && Number(val) > 0, {
        message: "Number of questions must be a valid number greater than 0",
    }),
    subjects: z.array(z.string()).min(1, "Please select at least one subject"),
    status: z.boolean(),
});

const CreateExam = () => {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [subjects, setSubjects] = useState([])
    const token = localStorage.getItem("token")

    const {
        register,
        handleSubmit,
        setValue,
        watch,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(examSchema),
        defaultValues: {
            title: "",
            duration: "",
            numberQuestions: "",
            subjects: [],
            status: false,
        },
    });

    const onSubmit = async (data) => {
        setLoading(true);
        const token = localStorage.getItem("token");

        try {
            await axios.post(`${API_BASE_URL}/admin/exams/addExams`, data, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });
            toast.success("Exam created successfully!");
            router.push("/admin/exams/view");
        } catch (error) {
            console.error("Failed to create exam:", error);
            toast.error("Error creating exam. Please try again.");
        } finally {
            setLoading(false);
        }
    };

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

    return (
        <div className="flex md:pl-8 min-h-screen">
            <AdminSideBar />
            <div className="flex flex-col w-full">
                <AdminNavBar />
                {/* <h1 className="text-2xl font-bold mt-8 px-10">Create Exam</h1> */}
                <div className="px-10 pb-3 mt-10 md:pb-8 w-full flex justify-center items-start">
                    <Container>
                        <div className="p-6 w-[700px] mx-auto">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-2xl">Create New Exam</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                                        {/* Exam Title */}
                                        <div>
                                            <label className="block text-base mb-2 font-medium text-gray-700">
                                                Exam Title
                                            </label>
                                            <Input
                                                placeholder="Enter Exam Title"
                                                {...register("title")}
                                            />
                                            {errors.title && (
                                                <p className="text-red-500 text-sm">{errors.title.message}</p>
                                            )}
                                        </div>

                                        {/* Duration */}
                                        <div>
                                            <label className="block text-base mb-2 font-medium text-gray-700">
                                                Duration (in minutes)
                                            </label>
                                            <Input
                                                placeholder="Enter Duration"
                                                type="number"
                                                {...register("duration")}
                                            />
                                            {errors.duration && (
                                                <p className="text-red-500 text-sm">{errors.duration.message}</p>
                                            )}
                                        </div>

                                        {/* Number of Questions */}
                                        <div>
                                            <label className="block text-base mb-2 font-medium text-gray-700">
                                                Number of Questions
                                            </label>
                                            <Input
                                                placeholder="Enter Number of Questions"
                                                type="number"
                                                {...register("numberQuestions")}
                                            />
                                            {errors.numberQuestions && (
                                                <p className="text-red-500 text-sm">{errors.numberQuestions.message}</p>
                                            )}
                                        </div>

                                        {subjects.length > 0 && (
                                            <div className="mb-4">
                                                <label className="block text-gray-700 text-base mb-2">Select Subjects</label>
                                                <div className="grid grid-cols-4 gap-2">
                                                    {subjects.map((sub) => (
                                                        <label key={sub._id} className="flex items-center space-x-2">
                                                            <input
                                                                type="checkbox"
                                                                value={sub._id}
                                                                onChange={(e) => {
                                                                    const checked = e.target.checked;
                                                                    const currentSubjects = watch("subjects") || []; // Ensure it's always an array

                                                                    setValue(
                                                                        "subjects",
                                                                        checked
                                                                            ? [...currentSubjects, sub._id]
                                                                            : currentSubjects.filter(id => id !== sub._id)
                                                                    );
                                                                }}
                                                            />
                                                            <span>{sub.title}</span>
                                                        </label>
                                                    ))}
                                                </div>
                                                {errors.subjects && <p className="text-red-500 text-sm">{errors.subjects.message}</p>}
                                            </div>
                                        )}


                                        {/* Active/Inactive Toggle */}
                                        <div className="flex items-center text-base mb-4 gap-2">
                                            <Switch
                                                checked={watch("status")}
                                                onCheckedChange={(checked) => setValue("status", checked)}
                                            />
                                            <span>{watch("status") ? "Active" : "Inactive"}</span>
                                        </div>

                                        {/* Submit Button */}
                                        <Button type="submit" disabled={loading} className="bg-blue-500 px-6 my-8 w-full py-2 font-semibold text-base">
                                            {loading ? "Creating..." : "Create Exam"}
                                        </Button>
                                    </form>
                                </CardContent>
                            </Card>
                        </div>
                    </Container>
                </div>
            </div>
            <ToastContainer />
        </div>
    );
};

export default CreateExam;
