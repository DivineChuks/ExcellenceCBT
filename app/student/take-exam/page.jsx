"use client";
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { LogOut, Clock3, ChevronLeft, ChevronRight, Loader } from "lucide-react";
import StudentSideBar from "../_components/StudentSideBar";
import StudentNavBar from "../_components/StudentNavBar";
import ExamStart from "./ExamStart";
import { Dialog, DialogContent, DialogHeader, DialogFooter, DialogTitle } from "@/components/ui/dialog";
import SubmitExamModal from "../_components/SubmitExamModal"
import axios from "axios";
import { Skeleton } from "@/components/ui/skeleton";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

const ExamPage = () => {
    const [started, setStarted] = useState(false);
    const token = localStorage.getItem("token");
    const [showCalculator, setShowCalculator] = useState(false);
    const [calcInput, setCalcInput] = useState("");
    const [timeLeft, setTimeLeft] = useState(0);
    const [showSubmitDialog, setShowSubmitDialog] = useState(false);
    const [modal, setModal] = useState(false)
    const [answers, setAnswers] = useState({});
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [examData, setExamData] = useState(null);
    const userId = useSelector((state) => state.user.user.userId);
    const user = useSelector((state) => state.user.user)
    const router = useRouter()

    // Subject pagination state
    const [currentSubjectIndex, setCurrentSubjectIndex] = useState(0);
    const [subjectKeys, setSubjectKeys] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const questionsPerPage = 1;
    const [questionsBySubject, setQuestionsBySubject] = useState({});
    const [totalQuestionsAnswered, setTotalQuestionsAnswered] = useState(0);
    const [totalQuestions, setTotalQuestions] = useState(0);

    useEffect(() => {
        if (started) {
            fetchExamData();
        }
    }, [started]);

    useEffect(() => {
        if (timeLeft > 0) {
            const timer = setInterval(() => {
                setTimeLeft((prev) => {
                    if (prev <= 1) {
                        clearInterval(timer);
                        handleAutoSubmit();
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
            return () => clearInterval(timer);
        }
    }, [timeLeft]);

    useEffect(() => {
        // Reset page when changing subject
        if (subjectKeys.length > 0) {
            setCurrentPage(0);
        }
    }, [currentSubjectIndex]);

    useEffect(() => {
        // Update total questions answered whenever answers change
        if (Object.keys(questionsBySubject).length > 0) {
            setTotalQuestionsAnswered(Object.keys(answers).length);

            // Calculate total questions
            let total = 0;
            Object.values(questionsBySubject).forEach(subject => {
                total += subject.questions.length;
            });
            setTotalQuestions(total);
        }
    }, [answers, questionsBySubject]);

    const fetchExamData = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.get(`${API_BASE_URL}/students/getExams`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            const exam = response.data[0];
            setExamData(exam);
            setTimeLeft(Number(exam.duration) * 60);

            const groupedQuestions = exam.subjects.reduce((acc, subject) => {
                acc[subject._id] = {
                    title: subject.title,
                    questions: [],
                    id: subject._id
                };
                return acc;
            }, {});

            exam.question.forEach((q) => {
                if (groupedQuestions[q.subjectId]) {
                    groupedQuestions[q.subjectId].questions.push(q);
                }
            });

            setQuestionsBySubject(groupedQuestions);
            const keys = Object.keys(groupedQuestions);
            setSubjectKeys(keys);

        } catch (err) {
            console.error("Error fetching exam data:", err);
            setError("Failed to load exam. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleCalculatorInput = (value) => {
        if (value === "=") {
            try {
                setCalcInput(eval(calcInput.replace("×", "*").replace("÷", "/")).toString());
            } catch {
                setCalcInput("Error");
            }
        } else {
            setCalcInput(calcInput + value);
        }
    };

    const handleOptionSelect = async (questionId, option) => {
        setAnswers({ ...answers, [questionId]: option });

        try {
            await axios.post(`${API_BASE_URL}/students/answer`, {
                user: userId,
                questionId: questionId,
                selectedOption: option,
            }, {
                headers: { Authorization: `Bearer ${token}` },
            });
        } catch (error) {
            console.error("Error submitting answer", error);
        }
    };

    const onClose = () => {
        setModal(false)
    }

    const handleNextPage = () => {
        const currentSubject = questionsBySubject[subjectKeys[currentSubjectIndex]];
        const totalPages = Math.ceil(currentSubject.questions.length / questionsPerPage);

        if (currentPage < totalPages - 1) {
            setCurrentPage(currentPage + 1);
        } else if (currentSubjectIndex < subjectKeys.length - 1) {
            setCurrentSubjectIndex(currentSubjectIndex + 1);
            setCurrentPage(0);
        }
    };

    const handlePreviousPage = () => {
        if (currentPage > 0) {
            setCurrentPage(currentPage - 1);
        } else if (currentSubjectIndex > 0) {
            setCurrentSubjectIndex(currentSubjectIndex - 1);
            const prevSubject = questionsBySubject[subjectKeys[currentSubjectIndex - 1]];
            const totalPages = Math.ceil(prevSubject.questions.length / questionsPerPage);
            setCurrentPage(totalPages - 1);
        }
    };

    const handleAutoSubmit = () => {
        setShowSubmitDialog(true);
    };

    const handleFinalSubmit = () => {
        setShowSubmitDialog(false);
        setModal(true)
        // router.push("/student/auth")
    }

    const formatTime = (seconds) => {
        const totalMinutes = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${totalMinutes}:${secs < 10 ? "0" : ""}${secs}`;
    };

    const isLastPage = () => {
        const isLastSubject = currentSubjectIndex === subjectKeys.length - 1;
        if (!isLastSubject) return false;

        const currentSubject = questionsBySubject[subjectKeys[currentSubjectIndex]];
        const totalPages = Math.ceil(currentSubject.questions.length / questionsPerPage);
        return currentPage === totalPages - 1;
    };

    const getCurrentQuestions = () => {
        if (!subjectKeys.length) return [];

        const currentSubject = questionsBySubject[subjectKeys[currentSubjectIndex]];
        const start = currentPage * questionsPerPage;
        return currentSubject.questions.slice(start, start + questionsPerPage);
    };

    const getTotalPagesForSubject = (subjectKey) => {
        const subject = questionsBySubject[subjectKey];
        return Math.ceil(subject.questions.length / questionsPerPage);
    };

    const handleJumpToQuestion = (subjectKey, localQuestionIndex) => {
        // Find subject index
        const subjectIndex = subjectKeys.indexOf(subjectKey);
        if (subjectIndex === -1) return;

        // Set the subject
        setCurrentSubjectIndex(subjectIndex);

        // Calculate which page this question is on within the subject
        const pageIndex = Math.floor(localQuestionIndex / questionsPerPage);
        setCurrentPage(pageIndex);
    };

    const getQuestionNumberWithinSubject = (subjectKey, questionIndex) => {
        let count = 1;
        const subjects = Object.keys(questionsBySubject);

        for (let i = 0; i < subjects.length; i++) {
            const subject = subjects[i];
            if (subject === subjectKey) {
                return count + questionIndex;
            }
            count += questionsBySubject[subject].questions.length;
        }

        return questionIndex + 1; // Fallback
    };

    console.log("timeLeft---->", timeLeft)

    if (loading) {
        return (
            <div className="flex md:pl-8 min-h-screen">
                <StudentSideBar />
                <div className="flex flex-col w-full">
                    <StudentNavBar />
                    <div className="flex justify-center items-center h-screen">
                        <div className="flex flex-col items-center">
                            <Loader className="animate-spin h-8 w-8 text-gray-500" />
                            <p className="mt-4 text-gray-600">Loading exams...</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex md:pl-8 min-h-screen">
            <StudentSideBar />
            <div className="flex flex-col w-full">
                <StudentNavBar />
                <div className="px-8 py-6">
                    {!started ? (
                        <ExamStart onStart={() => setStarted(true)} examData={examData} />
                    ) : Object.keys(questionsBySubject).length === 0 ? (
                        <p className="text-center mt-10">No questions available.</p>
                    ) : (
                        <>
                            <h2 className="text-base mb-4">Welcome,<span className="text-xl font-semibold text-blue-600"> {user?.name}</span></h2>
                            <div className="mt-3 mb-4 rounded-none flex justify-between items-center">
                                <div className="text-sm text-gray-600">
                                    Answered: {totalQuestionsAnswered} of {totalQuestions} questions
                                </div>
                                <Button onClick={() => setShowCalculator(true)} className="bg-blue-600 text-white">
                                    Open Calculator
                                </Button>
                            </div>
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-xl font-bold">{examData?.title}</h2>
                                <div className="flex items-center gap-2 text-red-600 font-semibold">
                                    <Clock3 size={20} /> {formatTime(timeLeft)} mins
                                </div>
                            </div>

                            {/* Subject Navigation */}
                            <div className="flex mb-4 overflow-x-auto pb-2">
                                {subjectKeys.map((key, index) => (
                                    <Button
                                        key={key}
                                        variant={currentSubjectIndex === index ? "default" : "outline"}
                                        onClick={() => setCurrentSubjectIndex(index)}
                                        className="mr-2 whitespace-nowrap"
                                    >
                                        {questionsBySubject[key].title}
                                    </Button>
                                ))}
                            </div>

                            {/* Progress Bar for current subject */}
                            <div className="mb-4">
                                <div className="flex justify-between text-sm mb-1">
                                    <span>
                                        Subject Progress: {currentSubjectIndex + 1} of {subjectKeys.length}
                                    </span>
                                    <span>
                                        Page {currentPage + 1} of {getTotalPagesForSubject(subjectKeys[currentSubjectIndex])}
                                    </span>
                                </div>
                                <Progress
                                    value={(currentPage + 1) / getTotalPagesForSubject(subjectKeys[currentSubjectIndex]) * 100}
                                />
                            </div>

                            {/* Current Subject */}
                            {subjectKeys.length > 0 && (
                                <div className="mb-6">
                                    <h2 className="text-xl font-bold mb-4 px-2 py-1 bg-gray-100 rounded">
                                        {questionsBySubject[subjectKeys[currentSubjectIndex]].title}
                                    </h2>

                                    {/* Current Questions */}
                                    {getCurrentQuestions().map((question, idx) => {
                                        const localQuestionIndex = currentPage * questionsPerPage + idx;
                                        const currentSubjectKey = subjectKeys[currentSubjectIndex];
                                        const subjectQuestions = questionsBySubject[currentSubjectKey].questions;

                                        return (
                                            <Card key={question._id} className="p-4 mb-3">
                                                <div className="font-medium text-sm text-gray-500 mb-2">
                                                    Question {localQuestionIndex + 1} of {subjectQuestions.length}
                                                </div>
                                                <div dangerouslySetInnerHTML={{ __html: question.question }} />
                                                <div className="mt-2">
                                                    {Object.entries(question.options).map(([key, value]) => (
                                                        <label key={`${question._id}-${key}`} className="block cursor-pointer">
                                                            <input
                                                                type="radio"
                                                                name={`question-${question._id}`}
                                                                value={key}
                                                                checked={answers[question._id] === key}
                                                                onChange={() => handleOptionSelect(question._id, key)}
                                                                className="mr-2"
                                                            />
                                                            {value}
                                                        </label>
                                                    ))}
                                                </div>
                                            </Card>
                                        );
                                    })}

                                    {/* Navigation Buttons */}
                                    <div className="flex justify-between items-center mt-6">
                                        <Button
                                            variant="outline"
                                            disabled={currentSubjectIndex === 0 && currentPage === 0}
                                            onClick={handlePreviousPage}
                                        >
                                            <ChevronLeft className="mr-1" size={16} /> Previous
                                        </Button>

                                        {isLastPage() ? (
                                            <Button
                                                className="bg-green-600 font-bold hover:bg-green-500 py-6 rounded-md px-6"
                                                onClick={() => setShowSubmitDialog(true)}
                                            >
                                                Submit Exam
                                            </Button>
                                        ) : (
                                            <Button onClick={handleNextPage}>
                                                Next <ChevronRight className="ml-1" size={16} />
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Question Navigation Grids - Separated by Subject */}
                            <div className="mt-6">
                                <h3 className="font-medium mb-4">Question Navigator</h3>

                                {subjectKeys.length > 0 && (
                                    <div className="mb-4">
                                        <div className="grid grid-cols-10 gap-2">
                                            {questionsBySubject[subjectKeys[currentSubjectIndex]].questions.map((question, index) => {
                                                const hasAnswer = answers[question._id];
                                                const isCurrentQuestion = index === currentPage; // Since we show one question per page

                                                return (
                                                    <button
                                                        key={question._id}
                                                        className={`p-2 border rounded ${isCurrentQuestion
                                                            ? "bg-blue-500 text-white" // Highlight current question
                                                            : hasAnswer
                                                                ? "bg-green-500 text-white" // Mark answered questions
                                                                : "bg-gray-200"
                                                            }`}
                                                        onClick={() => handleJumpToQuestion(subjectKeys[currentSubjectIndex], index)}
                                                    >
                                                        {index + 1}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>
                                )}
                            </div>


                        </>
                    )}
                </div>
            </div>

            {/* Dialog Box for Submission Confirmation */}
            <Dialog open={showSubmitDialog} onOpenChange={setShowSubmitDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle className="text-lg font-semibold">Submit Exam?</DialogTitle>
                    </DialogHeader>
                    <p>Are you sure you want to submit your exam? You will not be able to change your answers after submission.</p>
                    <p className="mt-2 text-sm">
                        You have answered <span className="font-bold">{totalQuestionsAnswered}</span> out of <span className="font-bold">{totalQuestions}</span> questions.
                    </p>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setShowSubmitDialog(false)}>Cancel</Button>
                        <Button onClick={handleFinalSubmit}>Submit</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Calculator Dialog */}
            <Dialog open={showCalculator} onOpenChange={setShowCalculator}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle className="text-lg font-semibold">Calculator</DialogTitle>
                    </DialogHeader>

                    <input
                        type="text"
                        value={calcInput}
                        readOnly
                        className="w-full p-2 text-lg border border-gray-300 rounded-md"
                    />

                    <div className="grid grid-cols-4 gap-2 mt-4">
                        {["7", "8", "9", "÷", "4", "5", "6", "×", "1", "2", "3", "-", "0", ".", "=", "+"].map((btn) => (
                            <Button
                                key={btn}
                                onClick={() => handleCalculatorInput(btn)}
                                className="p-4 text-lg bg-gray-400 hover:bg-gray-500"
                            >
                                {btn}
                            </Button>
                        ))}
                    </div>

                    <DialogFooter>
                        <Button variant="outline" onClick={() => setCalcInput("")}>Clear</Button>
                        <Button onClick={() => setShowCalculator(false)}>Close</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {modal && <SubmitExamModal onClose={onClose} modal={modal} />}
        </div>
    );
};

export default ExamPage;