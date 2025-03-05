"use client";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Eye, EyeOff, Mail } from 'lucide-react';
import Image from 'next/image';
import React, { useState } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { loginSuccess } from '@/redux/slices/adminSlice';
import { useDispatch } from 'react-redux';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

// Validation Schema
const loginSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
});

const AdminLogin = () => {
  const [toggleIcon, setToggleIcon] = useState(false);
  const dispatch = useDispatch()
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  // React Hook Form
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // Toggle Password Visibility
  const handleToggle = () => {
    setToggleIcon((prev) => !prev);
  };

  // Handle Form Submit
  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      const response = await axios.post(
        `${API_BASE_URL}/admin/auth/login`,
        data
      );
      console.log("res--->", response.data)
      if (response.status === 200) {
        dispatch(loginSuccess(response.data));
        toast.success("Login successful!");
        localStorage.setItem("token", response.data.token);
        router.push("/admin/dashboard");
      } else {
        toast.error("Invalid credentials. Please try again.");
      }
    } catch (error) {
      console.error("Error logging in:", error);
      toast.error(
        error?.response?.data?.message ||
        "An error occurred. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <div className="flex flex-col justify-center w-full items-center h-screen">
      <div className="flex mx-auto justify-center">
        <Image src="/jamb.png" width={100} height={100} alt="logo" />
      </div>

      <div className="mx-auto w-[500px] shadow-md mt-10 p-8 border border-gray-100 rounded-md">
        <h2 className="font-bold text-xl">Sign In (ADMIN)</h2>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col mt-4 w-full gap-6"
        >
          {/* Email Field */}
          <div className="grid w-full items-center gap-1.5">
            <Label className="font-semibold text-base" htmlFor="email">
              Email
            </Label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Mail className="w-4 h-4 text-gray-500" />
              </span>
              <Input
                type="email"
                placeholder="Enter your Email"
                className="pl-10 bg-transparent py-6 text-base"
                {...register("email")}
                style={{ boxShadow: "none" }}
              />
              {errors.email && (
                <p className="text-red-600 text-sm mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>
          </div>

          {/* Password Field */}
          <div className="grid w-full items-center gap-1.5">
            <label className="font-semibold text-base" htmlFor="password">
              Password
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 right-0 flex items-center pr-3">
                {toggleIcon ? (
                  <Eye
                    className="w-4 h-4 text-gray-500 cursor-pointer"
                    onClick={handleToggle}
                  />
                ) : (
                  <EyeOff
                    className="w-4 h-4 text-gray-500 cursor-pointer"
                    onClick={handleToggle}
                  />
                )}
              </span>
              <Input
                type={toggleIcon ? "text" : "password"}
                placeholder="Enter password"
                className="pl-4 text-base py-6"
                style={{ boxShadow: "none" }}
                {...register("password")}
              />
              {errors.password && (
                <p className="text-red-600 text-sm mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={isLoading}
            className="bg-blue-500 py-6 hidden md:flex items-center font-semibold gap-3 hover:bg-main hover:bg-opacity-70 text-base"
          >
            {isLoading ? <Image
              src="/loader.gif"
              className="text-white"
              alt="loader"
              width={20}
              height={20}
            /> : "Login"}
          </Button>

          {/* Mobile Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-[calc(100%-30px)] flex gap-3 md:hidden mx-4 fixed bg-main hover:bg-main hover:bg-opacity-80 bottom-6 left-0"
          >
            {isLoading ? <Image
              src="/loader.gif"
              className="text-white"
              alt="loader"
              width={20}
              height={20}
            /> : "Sign In"}
          </button>
        </form>
      </div>
      <ToastContainer />
    </div>
  );
};

export default AdminLogin;
