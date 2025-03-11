import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock3 } from "lucide-react";
import { motion } from "framer-motion";

const ExamStart = ({ onStart }) => {
    const [hovered, setHovered] = useState(false);

    return (
        <div className="flex items-center justify-center h-[calc(100vh-8rem)]">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <Card className="shadow-lg w-[550px] flex flex-col justify-center items-center h-[350px] py-10 p-6 bg-white text-center rounded-2xl">
                    <CardHeader>
                        <CardTitle className="text-3xl font-bold">Ready to Begin?</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-col items-center gap-4">
                            <p className="text-gray-600 flex items-center gap-2">
                                <Clock3 className="w-5 h-5 text-blue-600" /> Duration: <span className="font-medium">2 hours</span>
                            </p>
                            <motion.div
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onMouseEnter={() => setHovered(true)}
                                onMouseLeave={() => setHovered(false)}
                            >
                                <button
                                    className={`w-full py-2 mt-2 text-white rounded-md px-6 text-lg transition-all ${hovered ? "bg-blue-700" : "bg-blue-600"}`}
                                    onClick={onStart}
                                >
                                    Begin Exam
                                </button>
                            </motion.div>
                        </div>
                    </CardContent>
                </Card>
            </motion.div>
        </div>
    );
};

export default ExamStart;
