"use client";
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useRouter } from "next/navigation";
import { Clock, CheckCircle, XCircle } from "lucide-react";
import StudentSideBar from "../_components/StudentSideBar";
import StudentNavBar from "../_components/StudentNavBar";

const practiceQuestions = [
  {
    subject: "English",
    text: "Identify the option with a different stress pattern",
    options: ["contribute", "importance", "deposit", "reservoir"],
    answer: "contribute",
    explanation: "'Contribute' has stress on the second syllable, while the others have stress on the first.",
  },
  {
    subject: "English",
    text: "Choose the word that is correctly spelt.",
    options: ["Recieve", "Receive", "Reciept", "Recive"],
    answer: "Receive",
    explanation: "'Receive' follows the 'i before e except after c' rule.",
  },
];

const PracticeSession = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [timerEnabled, setTimerEnabled] = useState(false);
  const [timeLeft, setTimeLeft] = useState(600); // 10 min timer
  const router = useRouter();

  useEffect(() => {
    let timer;
    if (timerEnabled && timeLeft > 0) {
      timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [timerEnabled, timeLeft]);

  const handleOptionClick = (option) => {
    setSelectedOption(option);
    setShowAnswer(true);
  };

  const handleNext = () => {
    if (currentIndex < practiceQuestions.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setSelectedOption(null);
      setShowAnswer(false);
    }
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs < 10 ? `0${secs}` : secs}`;
  };

  return (
    <div className="flex md:pl-8 min-h-screen">
      <StudentSideBar />
      <div className="flex flex-col w-full">
        <StudentNavBar />
        <div className="px-8 py-10 mt-8 w-full flex justify-center items-start">
          <Card className="w-full max-w-3xl p-6 shadow-lg py-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold">Practice Mode: {practiceQuestions[currentIndex].subject}</h2>
              {timerEnabled && (
                <div className="flex items-center text-red-500">
                  <Clock size={18} className="mr-1" /> {formatTime(timeLeft)}
                </div>
              )}
            </div>

            <Progress value={((currentIndex + 1) / practiceQuestions.length) * 100} className="mb-4 " />
            <p className="font-medium mb-4">{practiceQuestions[currentIndex].text}</p>

            <div className="grid gap-3">
              {practiceQuestions[currentIndex].options.map((option, idx) => (
                <Button
                  key={idx}
                  onClick={() => handleOptionClick(option)}
                  variant={
                    showAnswer
                      ? option === practiceQuestions[currentIndex].answer
                        ? "success"
                        : option === selectedOption
                        ? "destructive"
                        : "outline"
                      : "outline"
                  }
                  className="w-full text-left p-3"
                >
                  {option}
                  {showAnswer && option === practiceQuestions[currentIndex].answer && (
                    <CheckCircle className="ml-2 text-green-500" size={18} />
                  )}
                  {showAnswer && option === selectedOption && option !== practiceQuestions[currentIndex].answer && (
                    <XCircle className="ml-2 text-red-500" size={18} />
                  )}
                </Button>
              ))}
            </div>

            {showAnswer && (
              <div className="mt-4 p-3 border border-gray-300 rounded bg-gray-100">
                <p className="text-sm font-medium">Explanation:</p>
                <p className="text-sm">{practiceQuestions[currentIndex].explanation}</p>
              </div>
            )}

            <div className="flex justify-between mt-6">
              <Button disabled={currentIndex === 0} onClick={() => setCurrentIndex(currentIndex - 1)}>
                Previous
              </Button>
              <Button onClick={handleNext} variant="secondary">
                {currentIndex === practiceQuestions.length - 1 ? "Finish" : "Next"}
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PracticeSession;
