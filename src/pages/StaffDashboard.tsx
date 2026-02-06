import React, { useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Check, Clock, Volume2, GlassWater, CreditCard, User, Brush, AlertCircle } from 'lucide-react';
import { RequestType } from '../types';
import clsx from 'clsx';
import { useNavigate } from 'react-router-dom';

const typeConfig: Record<RequestType, { label: string; color: string; icon: React.ReactNode; ring: string }> = {
    WATER: { label: 'Water', color: 'bg-blue-100 text-blue-800', ring: 'ring-blue-200', icon: <GlassWater size={28} className="text-blue-600" /> },
    BILL: { label: 'Bill', color: 'bg-emerald-100 text-emerald-800', ring: 'ring-emerald-200', icon: <CreditCard size={28} className="text-emerald-600" /> },
    WAITER: { label: 'Waiter', color: 'bg-orange-100 text-orange-800', ring: 'ring-orange-200', icon: <User size={28} className="text-orange-600" /> },
    CLEAN: { label: 'Clean', color: 'bg-indigo-100 text-indigo-800', ring: 'ring-indigo-200', icon: <Brush size={28} className="text-indigo-600" /> },
    MANAGER: { label: 'MANAGER', color: 'bg-red-100 text-red-800 border-2 border-red-200', ring: 'ring-red-200', icon: <AlertCircle size={28} className="text-red-600" /> },
};

export default function StaffDashboard() {
    const { requests, completeRequest, staffAuthenticated, restaurantId } = useApp();
    const activeRequests = requests.filter(r => r.status === 'PENDING').sort((a, b) => b.createdAt - a.createdAt);
    const navigate = useNavigate();

    useEffect(() => {
        if (!staffAuthenticated) {
            navigate('/staff');
        } else if (!restaurantId) {
            navigate('/');
        }
    }, [staffAuthenticated, restaurantId, navigate]);

    // Sound effect for new requests
    useEffect(() => {
        if (activeRequests.length > 0) {
            const playSound = async () => {
                try {
                    const customSound = new Audio('/notification.wav');
                    customSound.volume = 1.0;
                    await customSound.play();
                } catch (e) {
                    const realBeep = "data:audio/wav;base64,UklGRjIAAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YRAAAACQB/8A/wD/AP8A/wD/AP8AAQ==";
                    try {
                        const sound = new Audio(realBeep);
                        sound.volume = 0.5;
                        sound.play();
                    } catch (fallbackErr) { }
                }
            };
            playSound();
        }
    }, [requests.length]);

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <header className="bg-white shadow-sm p-4 sticky top-0 z-10 flex justify-between items-center border-b border-gray-100">
                <h1 className="text-xl font-bold text-gray-800 flex items-center">
                    Live Requests <span className="ml-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full animate-pulse">{activeRequests.length}</span>
                </h1>
                <div className="flex items-center text-gray-400 text-xs font-medium">
                    <Volume2 size={16} className="mr-1" /> Sound ON
                </div>
            </header>

            <main className="flex-1 p-4 grid gap-4 content-start max-w-2xl mx-auto w-full">
                {activeRequests.length === 0 ? (
                    <div className="text-center py-20 text-gray-400 flex flex-col items-center">
                        <div className="bg-gray-100 p-6 rounded-full mb-4">
                            <Check size={48} className="text-gray-300" />
                        </div>
                        <h2 className="text-xl font-bold text-gray-600">All caught up!</h2>
                        <p className="text-sm">No pending requests at the moment.</p>
                    </div>
                ) : (
                    activeRequests.map((req) => {
                        const config = typeConfig[req.type];
                        return (
                            <div
                                key={req.id}
                                className={clsx(
                                    "rounded-2xl shadow-sm p-4 flex items-center justify-between transition-all animate-fade-in-up border",
                                    config.color,
                                    config.ring,
                                    "hover:shadow-md"
                                )}
                            >
                                <div className="flex items-center space-x-4">
                                    <div className="bg-white p-3 rounded-full bg-opacity-60 backdrop-blur-sm shadow-sm">
                                        {config.icon}
                                    </div>
                                    <div>
                                        <div className="flex items-center space-x-2 mb-1">
                                            <span className="text-3xl font-black opacity-90">Table {req.tableId}</span>
                                        </div>
                                        <div className="flex items-center text-sm font-semibold opacity-75">
                                            <span className="uppercase tracking-wider mr-2">{config.label}</span>
                                            <span className="flex items-center text-xs opacity-60 font-normal">
                                                <Clock size={12} className="mr-1" />
                                                {Math.floor((Date.now() - req.createdAt) / 60000)}m ago
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <button
                                    onClick={() => completeRequest(req.id)}
                                    className="bg-white bg-opacity-80 hover:bg-opacity-100 text-gray-400 hover:text-green-600 rounded-full p-4 transition-all active:scale-95 shadow-sm"
                                >
                                    <Check size={32} strokeWidth={3} />
                                </button>
                            </div>
                        );
                    })
                )}
            </main>
        </div>
    );
}
