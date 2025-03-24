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
import { Clock, FileText, CheckCircle } from "lucide-react";

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
  subjects: z
    .array(z.string())
    .min(1, "Please select at least one subject"),
  status: z.boolean(),
});

const CreateExam = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [subjects, setSubjects] = useState([]);
  const token = localStorage.getItem("token");

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
        const response = await axios.get(
          `${API_BASE_URL}/admin/subject/getSubjects`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        setSubjects(response.data);
      } catch (error) {
        console.error("Error fetching subjects:", error);
      }
    };
    fetchSubjects();
  }, [token]);

  return (
    <div className="flex md:pl-8 min-h-screen bg-gray-50">
      <AdminSideBar />
      <div className="flex flex-col w-full">
        <AdminNavBar />
        <div className="px-6 py-6 md:px-10 pb-3 mt-6 md:pb-8 w-full flex justify-center items-start">
          <Container>
            <div className="max-w-3xl mx-auto w-full">
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-gray-800">
                    Create New Exam
                  </h1>
                  <p className="text-gray-500 mt-1">
                    Configure the exam details and select subjects
                  </p>
                </div>
                <Button
                  onClick={() => router.push("/admin/exams/view")}
                  variant="outline"
                  className="text-blue-600 border-blue-200 hover:bg-blue-50"
                >
                  Cancel
                </Button>
              </div>

              <Card className="shadow-md border-0 overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-5">
                  <CardTitle className="text-xl text-white flex items-center gap-2">
                    <FileText size={20} />
                    <span>Exam Information</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    {/* Exam Title */}
                    <div className="bg-white rounded-lg">
                      <label className="block text-base mb-2 font-medium text-gray-700">
                        Exam Title
                      </label>
                      <Input
                        placeholder="Enter Exam Title"
                        className="border-gray-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 h-12"
                        {...register("title")}
                      />
                      {errors.title && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.title.message}
                        </p>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Duration */}
                      <div className="bg-white rounded-lg">
                        <label className="block text-base mb-2 font-medium text-gray-700 flex items-center gap-2">
                          <Clock size={18} className="text-blue-500" />
                          Duration (in minutes)
                        </label>
                        <Input
                          placeholder="Enter Duration"
                          type="number"
                          className="border-gray-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 h-12"
                          {...register("duration")}
                        />
                        {errors.duration && (
                          <p className="text-red-500 text-sm mt-1">
                            {errors.duration.message}
                          </p>
                        )}
                      </div>

                      {/* Number of Questions */}
                      <div className="bg-white rounded-lg">
                        <label className="block text-base mb-2 font-medium text-gray-700 flex items-center gap-2">
                          <FileText size={18} className="text-blue-500" />
                          Number of Questions
                        </label>
                        <Input
                          placeholder="Enter Number of Questions"
                          type="number"
                          className="border-gray-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 h-12"
                          {...register("numberQuestions")}
                        />
                        {errors.numberQuestions && (
                          <p className="text-red-500 text-sm mt-1">
                            {errors.numberQuestions.message}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Subject Selection */}
                    {subjects.length > 0 && (
                      <div className="bg-white rounded-lg pt-4">
                        <label className="block text-gray-700 text-base mb-3 font-medium">
                          Select Subjects
                        </label>
                        <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                            {subjects.map((sub) => (
                              <label
                                key={sub._id}
                                className="flex items-center space-x-2 bg-white p-3 rounded-md border border-gray-200 hover:border-blue-400 cursor-pointer transition-all duration-200"
                              >
                                <input
                                  type="checkbox"
                                  className="rounded text-blue-500 focus:ring-blue-500"
                                  value={sub._id}
                                  onChange={(e) => {
                                    const checked = e.target.checked;
                                    const currentSubjects = watch("subjects") || [];

                                    setValue(
                                      "subjects",
                                      checked
                                        ? [...currentSubjects, sub._id]
                                        : currentSubjects.filter(
                                            (id) => id !== sub._id
                                          )
                                    );
                                  }}
                                />
                                <span className="text-gray-700">{sub.title}</span>
                              </label>
                            ))}
                          </div>
                        </div>
                        {errors.subjects && (
                          <p className="text-red-500 text-sm mt-2">
                            {errors.subjects.message}
                          </p>
                        )}
                      </div>
                    )}

                    {/* Status Toggle */}
                    <div className="flex items-center bg-white p-4 rounded-lg border border-gray-100 mt-4">
                      <div className="flex-grow">
                        <h3 className="font-medium">Exam Status</h3>
                        <p className="text-sm text-gray-500">
                          {watch("status")
                            ? "Exam is active and visible to students"
                            : "Exam is inactive and hidden from students"}
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className={`text-sm ${watch("status") ? "text-green-600" : "text-gray-500"}`}>
                          {watch("status") ? "Active" : "Inactive"}
                        </span>
                        <Switch
                          checked={watch("status")}
                          onCheckedChange={(checked) => setValue("status", checked)}
                          className={`${watch("status") ? "bg-green-500" : "bg-gray-300"}`}
                        />
                      </div>
                    </div>

                    {/* Submit Button */}
                    <div className="pt-4">
                      <Button
                        type="submit"
                        disabled={loading}
                        className={`w-full py-6 bg-gradient-to-r ${
                          loading
                            ? "from-gray-400 to-gray-500"
                            : "from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
                        } text-white font-semibold text-base flex items-center justify-center gap-2 rounded-lg shadow-md transition-all duration-200`}
                      >
                        {loading ? (
                          <>
                            <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            Creating Exam...
                          </>
                        ) : (
                          <>
                            <CheckCircle size={20} />
                            Create Exam
                          </>
                        )}
                      </Button>
                    </div>
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