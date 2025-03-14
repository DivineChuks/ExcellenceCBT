"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Confetti from "react-confetti";
import { useEffect, useState } from "react";
import { DialogTitle } from "@radix-ui/react-dialog";

export default function SubmitExamModal({ modal, onClose }) {
    const router = useRouter();
    const [showConfetti, setShowConfetti] = useState(false);

    useEffect(() => {
        if (modal) {
            setShowConfetti(true);
            setTimeout(() => setShowConfetti(false), 5000); // Stop confetti after 3s
        }
    }, [modal]);

    const handleClose = () => {
        onClose()
        localStorage.clear()
        router.push("/student/auth")
    }

    return (
        <Dialog open={modal} onOpenChange={onClose}>
            {showConfetti && <Confetti numberOfPieces={500} recycle={false} />}
            <DialogContent className="mx-auto max-w-[90%] md:max-w-[500px] p-6 md:p-8 rounded-xl shadow-lg bg-white">
                <div className="relative bg-white rounded-xl shadow-lg p-6 md:p-8 max-w-[90%] md:max-w-[450px] w-full text-center overflow-hidden">
                    {/* Floating Cards Animation */}
                    <motion.div
                        className="absolute left-5 top-5 bg-yellow-300 text-black px-4 py-2 rounded-lg shadow-lg"
                        initial={{ opacity: 0, y: -50, rotate: -15 }}
                        animate={{ opacity: 1, y: 0, rotate: 0 }}
                        transition={{ duration: 0.6, delay: 0.3, type: "spring" }}
                    >
                        🎉 Congrats!
                    </motion.div>

                    <motion.div
                        className="absolute right-5 top-10 bg-blue-500 text-white px-4 py-2 rounded-lg shadow-lg"
                        initial={{ opacity: 0, y: -50, rotate: 15 }}
                        animate={{ opacity: 1, y: 0, rotate: 0 }}
                        transition={{ duration: 0.6, delay: 0.5, type: "spring" }}
                    >
                        🚀 Success!
                    </motion.div>

                    {/* Main Modal Content */}
                    <div className="flex flex-col items-center">
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ duration: 0.4, type: "spring" }}
                        >
                            <Image
                                src="/success.png"
                                alt="success"
                                width={90}
                                height={90}
                                className="mb-2 animate-bounce"
                            />
                        </motion.div>
                        <DialogTitle
                            className="text-green-600 font-bold text-2xl md:text-3xl mb-2"
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                        >
                            Exam Completed!
                        </DialogTitle>
                        <motion.p
                            className="text-gray-700 font-medium text-lg md:text-xl leading-relaxed"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                        >
                            Your answers has been submitted. Reach out to admin for your result
                        </motion.p>
                    </div>

                    <div className="flex justify-center w-full mt-6">
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ duration: 0.3, delay: 0.3 }}
                        >
                            <Button
                                onClick={handleClose}
                                className="bg-red-500 font-semibold w-full md:w-max py-3 rounded-lg text-lg hover:bg-green-700 transition duration-300">
                                Close
                            </Button>
                        </motion.div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}

