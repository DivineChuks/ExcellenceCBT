"use client";

import React, { useState } from "react";
import Container from "@/app/components/Container";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import AdminNavBar from "../_components/AdminNavBar";
import AdminSideBar from "../_components/AdminSideBar";

const Settings = () => {
    const [darkMode, setDarkMode] = useState(false);
    const [notifications, setNotifications] = useState(true);

    return (
        <div className="flex md:pl-8 min-h-screen">
            <AdminSideBar />
            <div className="flex flex-col w-full">
                <AdminNavBar />
                <div className="px-8 py-3 md:py-8 w-full flex justify-center items-start">
                    <Container>
                        <h1 className="text-2xl font-bold mb-6">Settings</h1>

                        {/* Profile Settings */}
                        <div className="mb-6 bg-white p-6 rounded-lg shadow-md">
                            <h2 className="text-xl font-semibold mb-4">Profile Settings</h2>
                            <div className="mb-4">
                                <label className="block text-gray-700 mb-2">Name</label>
                                <Input placeholder="Enter your name" className="py-5" />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700 mb-2">Email</label>
                                <Input type="email" placeholder="Enter your email" className="py-5"  />
                            </div>
                            <Button className="bg-blue-500 py-2 font-semibold text-base hover:bg-blue-400">Save Changes</Button>
                        </div>

                        {/* App Preferences */}
                        <div className="mb-6 bg-white p-6 rounded-lg shadow-md">
                            <h2 className="text-xl font-semibold mb-4">App Preferences</h2>
                            <div className="flex items-center justify-between">
                                <span>Dark Mode</span>
                                <Switch checked={darkMode} onCheckedChange={setDarkMode} />
                            </div>
                        </div>

                        {/* Security Settings */}
                        <div className="mb-6 bg-white p-6 rounded-lg shadow-md">
                            <h2 className="text-xl font-semibold mb-4">Security</h2>
                            <Button className="bg-red-500">Change Password</Button>
                        </div>

                        {/* Notifications */}
                        <div className="bg-white p-6 rounded-lg shadow-md">
                            <h2 className="text-xl font-semibold mb-4">Notifications</h2>
                            <div className="flex items-center justify-between">
                                <span>Email Notifications</span>
                                <Switch checked={notifications} onCheckedChange={setNotifications} />
                            </div>
                        </div>
                    </Container>
                </div>
            </div>
        </div>
    );
};

export default Settings;
