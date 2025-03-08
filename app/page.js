"use client"
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Eye, EyeOff, Mail } from 'lucide-react'
import Image from 'next/image'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import axios from 'axios'

const loginSchema = z.object({
  email: z.string().email({ message: 'Invalid email address' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters' })
})

const UserLogin = () => {
  const [togglePassword, setTogglePassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = async (data) => {
    setIsLoading(true)
    try {
      const response = await axios.post('/students/auth/login', data)
      console.log(response.data)
      // Handle success (e.g., store token, redirect, etc.)
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
        <h2 className='font-bold text-xl'>Sign In (CBT USER)</h2>
        <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col mt-4 w-full gap-6'>
          <div className='grid w-full items-center gap-1.5'>
            <Label className='font-semibold text-base' htmlFor='email'>
              Email
            </Label>
            <div className='relative'>
              <span className='absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none'>
                <Mail className='w-4 h-4 text-gray-500' />
              </span>
              <Input
                type='email'
                placeholder='Enter your email'
                className='pl-10 bg-transparent py-6 text-base'
                {...register('email')}
              />
              {errors.email && <p className='text-red-600 text-sm mt-1'>{errors.email.message}</p>}
            </div>
          </div>

          <div className='grid w-full items-center gap-1.5'>
            <Label className='font-semibold text-base' htmlFor='password'>
              Password
            </Label>
            <div className='relative'>
              <span className='absolute inset-y-0 right-3 flex items-center pl-1'>
                {togglePassword ? (
                  <EyeOff className='w-4 h-4 text-gray-500 z-50 cursor-pointer' onClick={() => setTogglePassword(false)} />
                ) : (
                  <Eye className='w-4 h-4 text-gray-500 z-50 cursor-pointer' onClick={() => setTogglePassword(true)} />
                )}
              </span>
              <Input
                type={togglePassword ? 'text' : 'password'}
                placeholder='Enter your reg number'
                className='pl-5 bg-transparent py-6 text-base'
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
    </div>
  )
}

export default UserLogin
