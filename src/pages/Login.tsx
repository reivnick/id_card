import React, { useState } from "react";
import { useAuth } from "../features/auth/AuthContext";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const { login, loading } = useAuth();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        const success = await login(email, password);
        if (!success) {
            setError("Invalid email or password");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-sky-100 to-white">
            <div className="bg-white backdrop-blur-xl border border-white/40 shadow-lg rounded-3xl w-full max-w-md p-8">
                <div className="flex flex-col items-center mb-6">
                    <img
                        src="/insan_medika.png"
                        alt="Logo"
                        className="w-20 h-20 mb-3 object-contain"
                    />
                    <h2 className="text-2xl font-semibold text-gray-800">Sign in</h2>
                    <p className="text-gray-500 text-sm mt-1">
                        Enter your email and password
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                            {error}
                        </div>
                    )}

                    <div>
                        <label className="block text-sm text-gray-700 mb-1">Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-sky-400 outline-none"
                            placeholder="Enter your email"
                            required
                            disabled={loading}
                        />
                    </div>

                    <div>
                        <label className="block text-sm text-gray-700 mb-1">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-sky-400 outline-none"
                            placeholder="Enter your password"
                            required
                            disabled={loading}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-[#008EDF] hover:bg-sky-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white py-2.5 rounded-lg font-semibold transition-all"
                    >
                        {loading ? "Signing In..." : "Sign In"}
                    </button>
                </form>
            </div>
        </div>
    );
}
