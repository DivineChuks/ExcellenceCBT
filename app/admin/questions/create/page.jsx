"use client";
import React, { useCallback, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import AdminNavBar from "../../_components/AdminNavBar";
import AdminSideBar from "../../_components/AdminSideBar";
import Container from "@/app/components/Container";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import TiptapEditor from "../../dashboard/_components/TipTapEditor";
import dynamic from "next/dynamic";
// Dynamically import ReactQuill to avoid SSR issues
const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });

import "react-quill/dist/quill.snow.css"; // Import styles

const schema = z.object({
    subject: z.string().min(1, "Subject is required"),
    questionText: z.string().min(5, "Question must be at least 5 characters"),
    questionNumber: z.string().min(1, "Question number is required"),
    options: z.array(z.string().min(1, "Option cannot be empty")).length(4, "Must have 4 options"),
    correctAnswer: z.string().min(1, "Select the correct answer"),
});

const AddQuestion = () => {
    const router = useRouter();
    const [selectedSubject, setSelectedSubject] = useState("");
    const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm({
        resolver: zodResolver(schema),
        defaultValues: {
            subject: "",
            questionNumber: "",
            questionText: "",
            options: ["", "", "", ""],
            correctAnswer: "",
        },
    });

    const options = watch("options");
    const onSubmit = (data) => {
        console.log("Submitting", data);
        // TODO: Send data to API
        // After submitting, reset the question-related fields, but keep the subject
        reset({
            subject: selectedSubject, // Keep subject intact
            questionNumber: "",
            questionText: "",
            options: ["", "", "", ""],
            correctAnswer: "",
        });
    };

    const editor = useEditor({
        extensions: [StarterKit],
        content: "",
        onUpdate: ({ editor }) => {
            setValue("questionText", editor.getHTML());
        },
    });


    const handleChange = useCallback(value => {
        setValueSlate(value);
    }, []);

    const handleSave = () => {
        const questionText = value.map(node => node.children.map(child => child.text).join('')).join('\n');
        setValue("questionText", questionText);
    };


    const handleSubjectChange = (value) => {
        setSelectedSubject(value);
        setValue("subject", value); // Set the form value for subject
    };

    return (
        <div className="flex md:pl-8 min-h-screen">
            <AdminSideBar />
            <div className="flex flex-col w-full">
                <AdminNavBar />
                <div className="px-4 py-3 md:py-8 w-full flex justify-center items-start">
                    <Container>
                        <h1 className="text-2xl font-bold mb-4">Add Question</h1>
                        <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-lg p-8 mx-auto shadow-md w-[700px]">
                            <div className="mb-4">
                                <label className="block text-gray-700 mb-2">Select Subject</label>
                                <Select value={selectedSubject} onValueChange={handleSubjectChange}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select subject" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Mathematics">Mathematics</SelectItem>
                                        <SelectItem value="English">English</SelectItem>
                                        <SelectItem value="Physics">Physics</SelectItem>
                                    </SelectContent>
                                </Select>
                                {errors.subject && <p className="text-red-500 text-sm">{errors.subject.message}</p>}
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700 mb-2">Question Number</label>
                                <Input {...register("questionNumber")} placeholder="Enter question no" />
                                {errors.questionText && <p className="text-red-500 text-sm">{errors.questionText.message}</p>}
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700 mb-2">Question</label>
                                <TiptapEditor value={watch("questionText")} onChange={(value) => setValue("questionText", value)} />
                                {errors.questionText && <p className="text-red-500 text-sm">{errors.questionText.message}</p>}

                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700 mb-2">Options</label>
                                {options.map((_, index) => (
                                    <div key={index} className="flex items-center gap-2">
                                        <span className="w-6">{String.fromCharCode(65 + index)}.</span>
                                        <Input {...register(`options.${index}`)} placeholder={`Option ${index + 1}`} className="mb-3" />
                                    </div>
                                ))}
                                {errors.options && <p className="text-red-500 text-sm">{errors.options.message}</p>}
                            </div>

                            <div className="mb-4">
                                <label className="block text-gray-700 mb-2">Correct Answer</label>

                                <Select
                                    onValueChange={(value) => setValue("correctAnswer", value)}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select subject" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {options.map((opt, idx) => (
                                            <SelectItem key={idx} value={opt || `option-${idx}`}>Option {String.fromCharCode(65 + idx)}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {errors.correctAnswer && <p className="text-red-500 text-sm">{errors.correctAnswer.message}</p>}
                            </div>

                            <Button type="submit" className="w-full bg-blue-500">Add Question</Button>
                        </form>
                    </Container>
                </div>
            </div>
        </div>
    );
};

export default AddQuestion;
