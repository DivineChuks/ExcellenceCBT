"use client"
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Eye, EyeOff, Mail, Pen } from 'lucide-react'
import Image from 'next/image'
import React, { useState } from 'react'

const UserLogin = () => {
  const [toggleIcon, setToggleIcon] = useState(false)
  const [isLoading,setIsLoading] = useState(false)
  const handleToggle = () => {
    setToggleIcon((prev) => !prev)
  }
  return (
    <div className='flex flex-col justify-center w-full items-center h-screen'>
      <div className='flex mx-auto justify-center'>
        <Image src="/jamb.png" width={100} height={100} alt="logo" />
      </div>

      <div className=' mx-auto w-[500px] shadow-md mt-10 p-8 border border-gray-100 rounded-md'>
        <h2 className='font-bold text-xl'>Sign In (CBT USER)</h2>
        <form
          // onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col mt-4 w-full gap-6"
        >
          <div className="grid w-full items-center gap-1.5">
            <Label className="font-semibold text-base" htmlFor="email">
              Reg Number
            </Label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Pen className="w-4 h-4 text-gray-500" />
              </span>
              <Input
                type="text"
                placeholder="Enter your reg no"
                className="pl-10 bg-transparent py-6 text-base"
                // {...register("email")}
                style={{ boxShadow: "none" }}
              />
              {/* {errors.email && (
                    <p className="text-red-600 text-sm mt-1">
                      {errors.email.message}
                    </p>
                  )} */}
            </div>
          </div>
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
                // {...register("password")}
              />
              {/* {errors.password && (
                <p className="text-red-600 text-sm mt-1">
                  {errors.password.message}
                </p>
              )} */}
            </div>
          </div>
          <Button
            type="submit"
            disabled={isLoading}
            className="bg-blue-500 py-6 hidden md:flex items-center font-semibold gap-3 hover:bg-main hover:bg-opacity-70 text-base"
          >
            {/* {isLoading && (
                  <Image
                    src="/loader.gif"
                    className="text-white"
                    alt="loader"
                    width={20}
                    height={20}
                  />
                )} */}
            Login
          </Button>
          <button
            type="submit"
            disabled={isLoading}
            className="w-[calc(100%-30px)] flex gap-3 md:hidden mx-4 fixed bg-main hover:bg-main hover:bg-opacity-80 bottom-6 left-0"
          >
            {/* {isLoading && (
              <Image
                src="/loader.gif"
                className="text-white"
                alt="loader"
                width={20}
                height={20}
              />
            )} */}
            Sign In 
          </button>
        </form>
      </div>
    </div>
  )
}

export default UserLogin