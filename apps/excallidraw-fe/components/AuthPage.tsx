"use client"

import { useEffect, useState } from "react";
import axios from "axios";
import { HTTP_BACKEND } from "@/config";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export function AuthPage({ isSignin }: { isSignin: boolean; }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const router = useRouter();

    const handleAuth = async () => {
        try {
            const endpoint = isSignin ? "signin" : "signup";
            const response = await axios.post(`${HTTP_BACKEND}/${endpoint}`, {
                email,
                password
            });
            localStorage.setItem("token", response.data.token);
            router.push("/Dashboard"); // Redirect to home page on success
            toast.success(`Successfully ${isSignin ? "signed in" : "signed up"}`);
        } catch (e) {
            console.error("Authentication failed", e);
            toast.error("Authentication failed. Please check your credentials.");
        }
    };

    return (
        <div className="w-screen h-screen flex justify-center items-center bg-gray-900 dark:bg-gray-900">
            <div className="p-8 bg-gray-800 dark:bg-gray-800 rounded-lg shadow-xl w-80">
                <h1 className="text-2xl font-bold text-center mb-6 text-white dark:text-white">
                    {isSignin ? "Sign In" : "Sign Up"}
                </h1>
                <div className="space-y-4">
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full p-3 border border-gray-600 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-700 dark:bg-gray-700 text-white dark:text-white placeholder-gray-400 dark:placeholder-gray-400"
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full p-3 border border-gray-600 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-700 dark:bg-gray-700 text-white dark:text-white placeholder-gray-400 dark:placeholder-gray-400"
                    />
                </div>
                <button
                    onClick={handleAuth}
                    className="w-full mt-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition-colors"
                >
                    {isSignin ? "Sign In" : "Sign Up"}
                </button>
                <div className="mt-4 text-center text-gray-400 dark:text-gray-400">
                    {isSignin ? (
                        <span>
                            Don't have an account?{" "}
                            <a href="/signup" className="text-blue-500 hover:underline dark:text-blue-400">
                                Sign up
                            </a>
                        </span>
                    ) : (
                        <span>
                            Already have an account?{" "}
                            <a href="/signin" className="text-blue-500 hover:underline dark:text-blue-400">
                                Sign in
                            </a>
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
}