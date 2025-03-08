"use client";
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { LogOut, Clock3 } from "lucide-react";
import StudentSideBar from "../_components/StudentSideBar";
import StudentNavBar from "../_components/StudentNavBar";
import ExamStart from "./ExamStart"
import { Dialog, DialogContent, DialogHeader, DialogFooter } from "@/components/ui/dialog";

const questions = [
    {
        subject: "English",
        text: "Identify the option with a different stress pattern",
        options: ["recommend", "understand", "photograph", "entertain"],
        answer: "photograph",
    },
    {
        subject: "English",
        text: "Select the word with a different stress pattern",
        options: ["attitude", "beneath", "catalogue", "paradigm"],
        answer: "beneath",
    },
    {
        subject: "English",
        text: "Choose the word whose stress pattern differs from the others",
        options: ["adventure", "celebrate", "committee", "conclusion"],
        answer: "celebrate",
    }
];

const ExamPage = () => {
    const [started, setStarted] = useState(false);
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [selectedOption, setSelectedOption] = useState(null);
    const [timeLeft, setTimeLeft] = useState(7200); // 2 hours in seconds
    const [showSubmitDialog, setShowSubmitDialog] = useState(false);
    const [answers, setAnswers] = useState({});

    useEffect(() => {
        if (started) {
            const timer = setInterval(() => {
                setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
            }, 1000);
            return () => clearInterval(timer);
        }
    }, [started]);

    const handleOptionSelect = (option) => {
        setSelectedOption(option);
        setAnswers({ ...answers, [currentQuestion]: option });
    };

    const handleNext = () => {
        setCurrentQuestion((prev) => (prev < questions.length - 1 ? prev + 1 : prev));
        setSelectedOption(answers[currentQuestion + 1] || null);
    };

    const handlePrevious = () => {
        setCurrentQuestion((prev) => (prev > 0 ? prev - 1 : prev));
        setSelectedOption(answers[currentQuestion - 1] || null);
    };

    const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${minutes}:${secs < 10 ? "0" : ""}${secs}`;
    };

    return (
        <div className="flex md:pl-8 min-h-screen">
            <StudentSideBar />
            <div className="flex flex-col w-full">
                <StudentNavBar />
                <div className="px-8 py-6">
                    {!started ? (
                        <ExamStart onStart={() => setStarted(true)} />
                    ) : (
                        <>
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-xl font-bold">Exam - {questions[currentQuestion].subject}</h2>
                                <div className="flex items-center gap-2 text-red-600 font-semibold">
                                    <Clock3 size={20} /> {formatTime(timeLeft)}
                                </div>
                            </div>

                            <Progress value={(currentQuestion + 1) / questions.length * 100} className="mb-4" />

                            <Card className="p-4">
                                <h3 className="text-lg font-medium">Question {currentQuestion + 1}/{questions.length}</h3>
                                <p className="mt-2 text-gray-700">{questions[currentQuestion].text}</p>
                                <div className="mt-4 space-y-2">
                                    {questions[currentQuestion].options.map((option, index) => (
                                        <div key={index} className="flex items-center gap-2">
                                            <input
                                                type="radio"
                                                name="option"
                                                id={`option-${index}`}
                                                checked={selectedOption === option}
                                                onChange={() => handleOptionSelect(option)}
                                                className="h-4 w-4"
                                            />
                                            <label htmlFor={`option-${index}`} className="text-gray-800">
                                                {option}
                                            </label>
                                        </div>
                                    ))}
                                </div>
                            </Card>

                            <div className="flex justify-between items-center mt-6">
                                <Button variant="outline" disabled={currentQuestion === 0} onClick={handlePrevious}>Previous</Button>
                                {currentQuestion === questions.length - 1 ? (
                                    <Button onClick={() => setShowSubmitDialog(true)}>Submit Exam</Button>
                                ) : (
                                    <Button onClick={handleNext}>Next</Button>
                                )}
                            </div>

                            <div className="mt-6 grid grid-cols-10 gap-2">
                                {Array.from({ length: questions.length }, (_, i) => (
                                    <button
                                        key={i}
                                        className={`p-2 border rounded ${currentQuestion === i ? "bg-blue-500 text-white" : answers[i] ? "bg-green-500 text-white" : "bg-gray-200"}`}
                                        onClick={() => setCurrentQuestion(i)}
                                    >
                                        {i + 1}
                                    </button>
                                ))}
                            </div>
                        </>
                    )}
                </div>
            </div>

            <Dialog open={showSubmitDialog} onOpenChange={setShowSubmitDialog}>
                <DialogContent>
                    <DialogHeader>Confirm Submission</DialogHeader>
                    <p>Are you sure you want to submit the exam?</p>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setShowSubmitDialog(false)}>Cancel</Button>
                        <Button onClick={() => alert("Exam submitted!")}>Submit</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default ExamPage;
