import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock3, BookOpen, AlertTriangle, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";

const ExamStart = ({ onStart, examData }) => {
    const [hovered, setHovered] = useState(false);
    const [countDown, setCountDown] = useState(3);
    const [isStarting, setIsStarting] = useState(false);

    useEffect(() => {
        if (isStarting && countDown > 0) {
            const timer = setTimeout(() => setCountDown(countDown - 1), 1000);
            return () => clearTimeout(timer);
        } else if (isStarting && countDown === 0) {
            onStart();
        }
    }, [isStarting, countDown, onStart]);

    const formatDuration = (minutes) => {
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        return hours > 0 ? `${hours} hour${hours > 1 ? 's' : ''} ${mins > 0 ? `${mins} min` : ''}` : `${mins} minutes`;
    };

    const handleStartClick = () => {
        setIsStarting(true);
    };

    return (
        <div className="flex items-center justify-center h-[calc(100vh-8rem)]">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-3xl"
            >
                <Card className="shadow-xl overflow-hidden rounded-2xl border-0">
                    <div className="bg-gradient-to-r from-blue-600 to-indigo-700 h-16"></div>
                    <CardHeader className="pb-2 pt-6">
                        <CardTitle className="text-3xl font-bold text-center">
                            {examData?.title || "Ready to Begin Your Exam"}
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-col items-center gap-8 p-4">
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-6 w-full">
                                <div className="bg-blue-50 p-4 rounded-xl flex flex-col items-center justify-center gap-2">
                                    <Clock3 className="w-8 h-8 text-blue-600" />
                                    <div className="text-center">
                                        <p className="text-gray-500 text-sm">Duration</p>
                                        <p className="font-semibold">
                                            {examData ? formatDuration(examData.duration / 60) : "Loading..."}
                                        </p>
                                    </div>
                                </div>
                                <div className="bg-indigo-50 p-4 rounded-xl flex flex-col items-center justify-center gap-2">
                                    <BookOpen className="w-8 h-8 text-indigo-600" />
                                    <div className="text-center">
                                        <p className="text-gray-500 text-sm">Subjects</p>
                                        <p className="font-semibold">{examData?.subjects?.length || "Multiple"}</p>
                                    </div>
                                </div>
                                <div className="bg-green-50 p-4 rounded-xl flex flex-col items-center justify-center gap-2 col-span-2 md:col-span-1">
                                    <CheckCircle className="w-8 h-8 text-green-600" />
                                    <div className="text-center">
                                        <p className="text-gray-500 text-sm">Questions</p>
                                        <p className="font-semibold">{examData?.question?.length || "Multiple"}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-amber-50 p-4 rounded-xl w-full">
                                <div className="flex gap-3 items-center mb-2">
                                    <AlertTriangle className="w-5 h-5 text-amber-600" />
                                    <h3 className="font-medium text-amber-800">Important Instructions</h3>
                                </div>
                                <ul className="text-sm text-gray-600 space-y-1 pl-6 list-disc">
                                    <li>Once started, the timer cannot be paused</li>
                                    <li>Answer all questions before submitting</li>
                                    <li>Use the question navigator to move between questions</li>
                                    <li>Click "Submit Exam" when you're finished</li>
                                </ul>
                            </div>

                            {isStarting ? (
                                <div className="text-center p-4">
                                    <div className="text-5xl font-bold text-blue-600 mb-2">{countDown}</div>
                                    <p className="text-gray-600">Exam starting...</p>
                                </div>
                            ) : (
                                <motion.button
                                    whileHover={{ scale: 1.03 }}
                                    whileTap={{ scale: 0.98 }}
                                    onMouseEnter={() => setHovered(true)}
                                    onMouseLeave={() => setHovered(false)}
                                    onClick={handleStartClick}
                                    className={`w-2/3 py-3 mt-2 text-white rounded-xl px-8 text-lg font-medium transition-all ${
                                        hovered ? "bg-blue-700 shadow-lg" : "bg-blue-600 shadow-md"
                                    }`}
                                >
                                    Begin Exam
                                </motion.button>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </motion.div>
        </div>
    );
};

export default ExamStart;