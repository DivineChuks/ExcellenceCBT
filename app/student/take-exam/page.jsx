"use client";
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { LogOut, Clock3, ChevronLeft, ChevronRight, Loader, CheckCircle, Calculator, HelpCircle } from "lucide-react";
import StudentSideBar from "../_components/StudentSideBar";
import StudentNavBar from "../_components/StudentNavBar";
import ExamStart from "./ExamStart";
import { Dialog, DialogContent, DialogHeader, DialogFooter, DialogTitle } from "@/components/ui/dialog";
import SubmitExamModal from "../_components/SubmitExamModal"
import axios from "axios";
import { Skeleton } from "@/components/ui/skeleton";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import katex from 'katex';

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

    const renderKatexExpression = (content) => {
        if (!content || typeof content !== 'string') return '';

        try {
            // Create a temporary div to work with
            const tempEl = document.createElement('div');
            tempEl.innerHTML = content;

            // Process inline math expressions ($...$)
            const processInlineMath = (text) => {
                let result = text;
                const regex = /\$(.*?)\$/g;
                return result.replace(regex, (match, equation) => {
                    try {
                        return katex.renderToString(equation, {
                            displayMode: false,
                            throwOnError: false
                        });
                    } catch (err) {
                        console.error('KaTeX error:', err);
                        return match;
                    }
                });
            };

            // Process block math expressions ($$...$$)
            const processBlockMath = (text) => {
                let result = text;
                const regex = /\$\$(.*?)\$\$/g;
                return result.replace(regex, (match, equation) => {
                    try {
                        return katex.renderToString(equation, {
                            displayMode: true,
                            throwOnError: false
                        });
                    } catch (err) {
                        console.error('KaTeX error:', err);
                        return match;
                    }
                });
            };

            // Apply transformations
            let processedContent = tempEl.innerHTML;
            processedContent = processBlockMath(processedContent);
            processedContent = processInlineMath(processedContent);

            return processedContent;
        } catch (error) {
            console.error('Error rendering KaTeX:', error);
            return content;
        }
    };

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
            setTimeLeft(Number(exam?.duration) * 60);

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
        if (!value) return; // Prevent undefined value usage
        setCalcInput((prev) => prev + value);
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
        <div className="flex min-h-screen bg-slate-50">
            <StudentSideBar />
            <div className="flex flex-col w-full">
                <StudentNavBar />
                <div className="px-8 py-6 max-w-6xl mx-auto w-full">
                    {!started ? (
                        <ExamStart onStart={() => setStarted(true)} examData={examData} />
                    ) : Object.keys(questionsBySubject).length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-64">
                            <div className="text-center p-8 bg-white rounded-lg shadow-sm">
                                <p className="text-lg text-gray-600">No questions available for this exam.</p>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {/* Header with Welcome and Timer */}
                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-white p-5 rounded-lg shadow-sm border border-gray-100">
                                <div>
                                    <h2 className="text-base text-gray-600">Welcome,
                                        <span className="text-xl font-semibold text-indigo-700"> {user?.name}</span>
                                    </h2>
                                    {/* <h1 className="text-2xl font-bold mt-1">{examData?.title}</h1> */}
                                </div>
                                <div className="flex items-center gap-4 mt-3 md:mt-0">
                                    <Button onClick={() => setShowCalculator(true)}
                                        className="bg-white text-indigo-700 border border-indigo-200 hover:bg-indigo-50 flex items-center gap-2 shadow-sm">
                                        <Calculator size={16} /> Calculator
                                    </Button>
                                    <div className="flex items-center gap-2 text-red-600 font-medium bg-red-50 px-4 py-2 rounded-full">
                                        <Clock3 size={18} /> {formatTime(timeLeft)} remaining
                                    </div>
                                </div>
                            </div>

                            {/* Progress Overview */}
                            <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-100">
                                <div className="flex justify-between items-center mb-3">
                                    <h3 className="font-medium text-gray-700">Exam Progress</h3>
                                    <div className="text-sm text-gray-600 font-medium">
                                        {totalQuestionsAnswered} of {totalQuestions} questions answered
                                    </div>
                                </div>
                                <Progress
                                    value={(totalQuestionsAnswered / totalQuestions) * 100}
                                    className="h-2 bg-gray-100 [&>div]:bg-indigo-600"
                                />
                            </div>

                            {/* Subject Navigation */}
                            <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-100">
                                <h3 className="font-medium text-gray-700 mb-3">Subjects</h3>
                                <div className="flex mb-4 overflow-x-auto pb-2 gap-2">
                                    {subjectKeys.map((key, index) => (
                                        <Button
                                            key={key}
                                            variant={currentSubjectIndex === index ? "default" : "outline"}
                                            onClick={() => setCurrentSubjectIndex(index)}
                                            className={`whitespace-nowrap px-4 py-2 rounded-full ${currentSubjectIndex === index
                                                ? "bg-indigo-600 hover:bg-indigo-700"
                                                : "border-gray-200 hover:border-indigo-300 hover:bg-indigo-50"
                                                }`}
                                        >
                                            {questionsBySubject[key].title}
                                        </Button>
                                    ))}
                                </div>
                            </div>

                            {/* Current Subject */}
                            {subjectKeys.length > 0 && (
                                <div className="space-y-5">
                                    <div className="flex justify-between items-center bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                                        <h2 className="text-lg font-bold text-indigo-800">
                                            {questionsBySubject[subjectKeys[currentSubjectIndex]].title}
                                        </h2>
                                        <div className="text-sm font-medium text-gray-600">
                                            Page {currentPage + 1} of {getTotalPagesForSubject(subjectKeys[currentSubjectIndex])}
                                        </div>
                                    </div>

                                    {/* Progress Bar for current subject */}
                                    {/* <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                                        <Progress
                                            value={(currentPage + 1) / getTotalPagesForSubject(subjectKeys[currentSubjectIndex]) * 100}
                                            className="h-2 bg-gray-100 [&>div]:bg-indigo-600"
                                        />
                                    </div> */}

                                    {/* Current Questions */}
                                    {getCurrentQuestions().map((question, idx) => {
                                        const localQuestionIndex = currentPage * questionsPerPage + idx;
                                        const currentSubjectKey = subjectKeys[currentSubjectIndex];
                                        const subjectQuestions = questionsBySubject[currentSubjectKey].questions;

                                        return (
                                            <Card key={question._id} className="p-6 shadow-md border-l-4 border-l-indigo-500 bg-white">
                                                <div className="font-medium text-sm text-indigo-600 mb-3 flex items-center gap-2">
                                                    <HelpCircle size={16} />
                                                    Question {localQuestionIndex + 1} of {subjectQuestions.length}
                                                </div>
                                                <div className="text-lg mb-5 font-medium">
                                                    <span dangerouslySetInnerHTML={{ __html: renderKatexExpression(question.question) }} />
                                                </div>
                                                <div className="space-y-3 mt-4">
                                                    {Object.entries(question.options).map(([key, value]) => (
                                                        <label
                                                            key={`${question._id}-${key}`}
                                                            className={`block cursor-pointer p-3 rounded-md border hover:bg-indigo-50 transition-colors ${answers[question._id] === key
                                                                ? "bg-indigo-50 border-indigo-300"
                                                                : "border-gray-200"
                                                                }`}
                                                        >
                                                            <div className="flex items-center">
                                                                <input
                                                                    type="radio"
                                                                    name={`question-${question._id}`}
                                                                    value={key}
                                                                    checked={answers[question._id] === key}
                                                                    onChange={() => handleOptionSelect(question._id, key)}
                                                                    className="mr-3 h-4 w-4 text-indigo-600 focus:ring-indigo-500"
                                                                />
                                                                <span>{value}</span>
                                                            </div>
                                                        </label>
                                                    ))}
                                                </div>
                                            </Card>
                                        );
                                    })}

                                    {/* Navigation Buttons */}
                                    <div className="flex justify-between items-center pt-6">
                                        <Button
                                            variant="outline"
                                            disabled={currentSubjectIndex === 0 && currentPage === 0}
                                            onClick={handlePreviousPage}
                                            className="border-gray-300 hover:bg-gray-50 py-2 px-4"
                                        >
                                            <ChevronLeft className="mr-2" size={16} /> Previous
                                        </Button>

                                        {isLastPage() ? (
                                            <Button
                                                className="bg-green-600 hover:bg-green-700 py-2 px-6 rounded-md font-semibold flex items-center gap-2 shadow-md"
                                                onClick={() => setShowSubmitDialog(true)}
                                            >
                                                <CheckCircle size={18} /> Submit Exam
                                            </Button>
                                        ) : (
                                            <Button
                                                onClick={handleNextPage}
                                                className="bg-indigo-600 hover:bg-indigo-700 py-2 px-4"
                                            >
                                                Next <ChevronRight className="ml-2" size={16} />
                                            </Button>
                                        )}
                                    </div>

                                    {/* Question Navigator */}
                                    <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-100 mt-8">
                                        <h3 className="font-medium text-gray-700 mb-4">Question Navigator</h3>

                                        <div className="grid grid-cols-5 sm:grid-cols-8 md:grid-cols-12 gap-6">
                                            {questionsBySubject[subjectKeys[currentSubjectIndex]].questions.map((question, index) => {
                                                const hasAnswer = answers[question._id];
                                                const isCurrentQuestion = index === currentPage;

                                                return (
                                                    <button
                                                        key={question._id}
                                                        className={`p-2 border rounded-md h-10 w-10 flex items-center justify-center font-medium transition-colors ${isCurrentQuestion
                                                            ? "bg-indigo-600 text-white border-indigo-700"
                                                            : hasAnswer
                                                                ? "bg-green-500 text-white border-green-600"
                                                                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                                            }`}
                                                        onClick={() => handleJumpToQuestion(subjectKeys[currentSubjectIndex], index)}
                                                    >
                                                        {index + 1}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Dialog Box for Submission Confirmation */}
            <Dialog open={showSubmitDialog} onOpenChange={setShowSubmitDialog}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle className="text-xl font-semibold text-center">Submit Exam</DialogTitle>
                    </DialogHeader>
                    <div className="py-4">
                        <div className="mb-4 text-center">
                            <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-2" />
                            <p className="text-gray-700">Are you sure you want to submit your exam?</p>
                            <p className="text-sm text-gray-500 mt-1">You will not be able to change your answers after submission.</p>
                        </div>

                        <div className="bg-gray-50 p-4 rounded-lg mt-4">
                            <div className="flex justify-between mb-2">
                                <span className="text-gray-600">Questions answered:</span>
                                <span className="font-semibold">
                                    {totalQuestionsAnswered} of {totalQuestions}
                                </span>
                            </div>
                            <Progress
                                value={(totalQuestionsAnswered / totalQuestions) * 100}
                                className="h-2 bg-gray-200"
                                indicatorClassName="bg-green-500"
                            />
                        </div>
                    </div>
                    <DialogFooter className="sm:justify-center gap-4">
                        <Button
                            variant="outline"
                            onClick={() => setShowSubmitDialog(false)}
                            className="border-gray-300"
                        >
                            Continue Exam
                        </Button>
                        <Button
                            onClick={handleFinalSubmit}
                            className="bg-green-600 hover:bg-green-700"
                        >
                            Submit Now
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Calculator Dialog */}
            <Dialog open={showCalculator} onOpenChange={setShowCalculator}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle className="text-xl font-semibold flex items-center gap-2">
                            <Calculator size={20} /> Calculator
                        </DialogTitle>
                    </DialogHeader>

                    <input
                        type="text"
                        value={calcInput}
                        readOnly
                        className="w-full p-3 text-xl border border-gray-200 rounded-md bg-gray-50 text-right font-mono"
                    />

                    <div className="grid grid-cols-4 gap-2 mt-4">
                        {[
                            "7", "8", "9", "÷",
                            "4", "5", "6", "×",
                            "1", "2", "3", "-",
                            "0", ".", "=", "+"
                        ].map((btn) => (
                            <Button
                                key={btn}
                                onClick={() => handleCalculatorInput(btn)}
                                className={`p-4 text-lg ${["÷", "×", "-", "+", "="].includes(btn)
                                    ? "bg-indigo-600 hover:bg-indigo-700 text-white"
                                    : "bg-gray-200 hover:bg-gray-300 text-gray-800"
                                    }`}
                            >
                                {btn}
                            </Button>
                        ))}
                    </div>

                    <DialogFooter className="gap-2">
                        <Button
                            variant="outline"
                            onClick={() => setCalcInput("")}
                            className="border-red-300 text-red-600 hover:bg-red-50"
                        >
                            Clear
                        </Button>
                        <Button
                            onClick={() => setShowCalculator(false)}
                            className="bg-gray-800 hover:bg-gray-900"
                        >
                            Close
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {modal && <SubmitExamModal onClose={onClose} modal={modal} />}
        </div>
    );
};

export default ExamPage;