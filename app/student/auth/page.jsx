"use client"
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Eye, EyeOff, Mail, Pen } from 'lucide-react'
import Image from 'next/image'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import * as z from 'zod'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import { loginSuccess } from '@/redux/slices/userSlice'
import { useDispatch } from 'react-redux'

const loginSchema = z.object({
  password: z
    .string()
    .min(5, { message: 'Registration number must be at least 5 characters' })
    .max(10, { message: 'Registration number must not exceed 10 characters' })
    .regex(/^[A-Za-z0-9]+$/, { message: 'Invalid registration number format' }),
})

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

const UserLogin = () => {
  const [isLoading, setIsLoading] = useState(false)
  const dispatch = useDispatch()
  const router = useRouter()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      password: "",
    },
  })

  const onSubmit = async (data) => {
    setIsLoading(true)
    try {
      console.log("API URL:", `${API_BASE_URL}/students/auth/login`);
      console.log("data-->", data)
      const response = await axios.post(`${API_BASE_URL}/students/auth/login`, data)
      console.log(response.data)
      dispatch(loginSuccess(response.data));
      toast.success("Login successful!");
      localStorage.setItem("token", response.data.token);
      // Handle success (e.g., store token, redirect, etc.)
      router.push("/student/take-exam")
    } catch (error) {
      console.error(error.response?.data || 'Login failed')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className='flex flex-col justify-center w-full items-center h-screen'>
      <div className='flex mx-auto justify-center'>
        <Image src='/jamb.png' width={100} height={100} alt='logo' />
      </div>

      <div className='mx-auto w-[500px] shadow-md mt-10 p-8 border border-gray-100 rounded-md'>
        <h2 className='font-bold text-xl mb-8'>JAMB Reg No</h2>
        <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col mt-4 w-full gap-6'>
          <div className='grid w-full items-center gap-1.5'>
            {/* <Label className='font-semibold text-base' htmlFor='email'>
              Reg No
            </Label> */}
            <div className='relative'>
              <span className='absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none'>
                <Pen className='w-4 h-4 text-gray-500' />
              </span>
              <Input
                type='text'
                placeholder='Enter Your Reg No'
                className='pl-10 bg-transparent py-6 text-base'
                {...register('password')}
              />
              {errors.password && <p className='text-red-600 text-sm mt-1'>{errors.password.message}</p>}
            </div>
          </div>

          <Button
            type='submit'
            disabled={isLoading}
            className='bg-blue-500 py-6 flex items-center font-semibold gap-3 hover:bg-opacity-70 text-base'
          >
            {isLoading && <Image src='/loader.gif' alt='loader' width={20} height={20} />}
            Login
          </Button>
        </form>
      </div>
      <ToastContainer />
    </div>
  )
}

export default UserLogin
