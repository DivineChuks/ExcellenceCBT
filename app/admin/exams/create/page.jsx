"use client";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useRouter } from "next/navigation";
import AdminNavBar from "../../_components/AdminNavBar";
import AdminSideBar from "../../_components/AdminSideBar";
import Container from "@/app/components/Container";

const CreateExam = () => {
    const router = useRouter();
    const [title, setTitle] = useState("");
    const [duration, setDuration] = useState("");
    const [questionCount, setQuestionCount] = useState("");
    const [subject, setSubject] = useState("");
    const [isActive, setIsActive] = useState(true);

    const handleCreateExam = (e) => {
        e.preventDefault();

        // Mock data object to be sent to the backend
        const newExam = {
            title,
            duration,
            questionCount,
            subject,
            isActive,
        };

        console.log(newExam);
        // Simulate form submission
        // You would replace this with a POST request to your backend
        alert("Exam created successfully!");
        router.push("/admin/exams/active"); // Redirect to Active Exams page
    };

    return (
        <div className="flex md:pl-8 min-h-screen">
            <AdminSideBar />
            <div className="flex flex-col w-full">
                <AdminNavBar />
                <h1 className="text-2xl font-bold mt-8 px-10">Create Exam</h1>
                <div className="px-10 pb-3 mt-10 md:pb-8 w-full flex justify-center items-start">
                    <Container>
                        <div className="p-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Create New Exam</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <form onSubmit={handleCreateExam} className="space-y-4">
                                        {/* Exam Title */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">
                                                Exam Title
                                            </label>
                                            <Input
                                                placeholder="Enter Exam Title"
                                                value={title}
                                                onChange={(e) => setTitle(e.target.value)}
                                                required
                                            />
                                        </div>

                                        {/* Duration */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">
                                                Duration (in minutes)
                                            </label>
                                            <Input
                                                placeholder="Enter Duration"
                                                type="number"
                                                value={duration}
                                                onChange={(e) => setDuration(e.target.value)}
                                                required
                                            />
                                        </div>

                                        {/* Number of Questions */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">
                                                Number of Questions
                                            </label>
                                            <Input
                                                placeholder="Enter Number of Questions"
                                                type="number"
                                                value={questionCount}
                                                onChange={(e) => setQuestionCount(e.target.value)}
                                                required
                                            />
                                        </div>

                                        {/* Subject Selection */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">
                                                Subject
                                            </label>
                                            <Select
                                                placeholder="Select Subject"
                                                onValueChange={(value) => setSubject(value)}
                                                required
                                            >
                                                <SelectContent>
                                                    <SelectItem value="math">Mathematics</SelectItem>
                                                    <SelectItem value="english">English</SelectItem>
                                                    <SelectItem value="physics">Physics</SelectItem>
                                                </SelectContent>
                                                {/* Map over your subjects here if fetching from backend */}
                                            </Select>
                                        </div>

                                        {/* Active/Inactive Toggle */}
                                        <div className="flex items-center gap-2">
                                            <Switch
                                                checked={isActive}
                                                onCheckedChange={(checked) => setIsActive(checked)}
                                            />
                                            <span>{isActive ? "Active" : "Inactive"}</span>
                                        </div>

                                        {/* Submit Button */}
                                        <Button type="submit">Create Exam</Button>
                                    </form>
                                </CardContent>
                            </Card>
                        </div>
                    </Container>
                </div>
            </div>
        </div>

    );
};

export default CreateExam;
