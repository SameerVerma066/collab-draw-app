"use client"

import { useEffect, useState } from "react";
import axios from "axios";
import { HTTP_BACKEND } from "@/config";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import Link from "next/link";

export function AuthPage({ isSignin }: { isSignin: boolean; }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState(""); // ADD THIS
    const router = useRouter();

  // Inside AuthPage component
const handleAuth = async () => {
    try {
        const endpoint = isSignin ? "signin" : "signup";
        const payload = isSignin
            ? { username: email, password }
            : { username: email, password, name };

        const res = await axios.post(`${HTTP_BACKEND}/${endpoint}`, payload);
        const { token } = res.data;

        if (token) {
            localStorage.setItem("token", token);
            router.push("/Dashboard");
            toast.success("Signed in");
        } else {
            // This should not happen with the current backend code,
            // but is a good practice for robustness.
            toast.error("Authentication failed: No token received.");
        }
    } catch (e: any) {
        // This block catches errors like "User already exists" (411)
        // or "Incorrect email/password" (403) from the backend.
        const errorMessage = e.response?.data?.message || "Authentication failed. Please try again.";
        toast.error(errorMessage);
    }
};

    return (
        <div className="w-screen h-screen flex justify-center items-center bg-gray-900 dark:bg-gray-900">
            <div className="p-8 bg-gray-800 dark:bg-gray-800 rounded-lg shadow-xl w-80">
                <h1 className="text-2xl font-bold text-center mb-6 text-white dark:text-white">
                    {isSignin ? "Sign In" : "Sign Up"}
                </h1>
                <div className="space-y-4">
                    {!isSignin && (
                        <input
                            type="text"
                            placeholder="Name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full p-3 border border-gray-600 dark:border-gray-600 rounded-lg bg-gray-700 dark:bg-gray-700 text-white"
                        />
                    )}
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full p-3 border border-gray-600 dark:border-gray-600 rounded-lg bg-gray-700 dark:bg-gray-700 text-white"
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full p-3 border border-gray-600 dark:border-gray-600 rounded-lg bg-gray-700 dark:bg-gray-700 text-white"
                    />
                </div>
                <button onClick={handleAuth} className="w-full mt-6 py-3 bg-blue-600 text-white font-semibold rounded-lg cursor-pointer">
                    {isSignin ? "Sign In" : "Sign Up"}
                </button>
                <div className="mt-4 text-center text-gray-400 dark:text-gray-400 ">
                    {isSignin ? (
                        <span>Don't have an account? <Link href="/Signup" className="text-blue-500 cursor-pointer">Sign up</Link></span>
                    ) : (
                        <span>Already have an account? <Link href="/Signin" className="text-blue-500 cursor-pointer">Sign in</Link></span>
                    )}
                </div>
            </div>
        </div>
    );
}