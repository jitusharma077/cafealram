import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { ShieldAlert } from 'lucide-react';

export default function AdminLogin() {
    const [password, setPassword] = useState('');
    const [error, setError] = useState(false);
    const { loginAdmin } = useApp();
    const navigate = useNavigate();

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        if (loginAdmin(password)) {
            navigate('/admin');
        } else {
            setError(true);
            setTimeout(() => setError(false), 2000);
        }
    };

    return (
        <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center p-6 text-white">
            <div className="mb-8 flex flex-col items-center">
                <div className="bg-red-600 p-4 rounded-full mb-4">
                    <ShieldAlert size={40} className="text-white" />
                </div>
                <h1 className="text-2xl font-bold">Admin Portal</h1>
                <p className="text-gray-400 text-sm mt-2">Restricted Access</p>
            </div>

            <form onSubmit={handleLogin} className="w-full max-w-xs space-y-4">
                <div>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Admin Password"
                        className="w-full text-center text-xl bg-gray-800 border-2 border-gray-700 text-white rounded-xl py-4 px-4 focus:outline-none focus:border-red-500 transition-colors"
                    />
                </div>

                {error && (
                    <div className="text-red-400 text-center text-sm font-medium animate-pulse">
                        Access Denied
                    </div>
                )}

                <button
                    type="submit"
                    className="w-full bg-red-600 hover:bg-red-500 text-white font-bold py-4 rounded-xl transition-all active:scale-95"
                >
                    Unlock
                </button>
            </form>
        </div>
    );
}
