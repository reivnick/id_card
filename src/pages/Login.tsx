import React, { useState } from "react";

export default function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log("Username:", username);
        console.log("Password:", password);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-sky-100 to-white">
            <div className="bg-white/60 backdrop-blur-xl border border-white/40 shadow-lg rounded-3xl w-full max-w-md p-8">
                <div className="flex flex-col items-center mb-6">
                    <img
                        src="/academy.png"
                        alt="Logo"
                        className="w-20 h-20 mb-3 object-contain"
                    />
                    <h2 className="text-2xl font-semibold text-gray-800">Sign in</h2>
                    <p className="text-gray-500 text-sm mt-1">
                        Enter your username and password
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="block text-sm text-gray-700 mb-1">Username</label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-sky-400 outline-none"
                            placeholder="Enter your username"
                            required
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
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-[#008EDF] hover:bg-sky-700 text-white py-2.5 rounded-lg font-semibold transition-all"
                    >
                        Sign In
                    </button>
                </form>
            </div>
        </div>
    );
}
