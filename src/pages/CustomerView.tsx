import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { RequestType } from '../types';
import { GlassWater, CreditCard, User, Brush, AlertCircle, CheckCircle, Clock } from 'lucide-react';
import clsx from 'clsx';


export default function CustomerView() {
    const { restaurantId, tableId } = useParams<{ restaurantId: string; tableId: string }>();
    const { addRequest, requests, setRestaurantId } = useApp();
    const [isMenuOpen, setIsMenuOpen] = React.useState(false);
    const [menuImage, setMenuImage] = React.useState<string | null>(null);
    const [restaurant, setRestaurant] = React.useState<any>(null);

    // Sync restaurant ID to context
    useEffect(() => {
        if (restaurantId) {
            setRestaurantId(restaurantId);
        }
        // Fetch restaurant details
        if (restaurantId) {
            fetch(`/api/restaurants/${restaurantId}`)
                .then(res => res.json())
                .then(data => {
                    setRestaurant(data);
                    setMenuImage(data.menuImage || null);
                })
                .catch(err => console.error('Failed to fetch restaurant:', err));
        }
    }, [restaurantId, setRestaurantId]);

    // Default to table 1 if not specified (should be caught by router but good for safety)
    const currentTable = tableId || '1';

    // Get requests for this table
    const myRequests = requests.filter(r => r.tableId === currentTable && r.restaurantId === restaurantId);
    const activeRequests = myRequests.filter(r => r.status === 'PENDING');
    const completedRequests = myRequests.filter(r => r.status === 'COMPLETED');

    const handleRequest = (type: RequestType) => {
        if (currentTable) {
            addRequest(currentTable, type);
        }
    };

    const handleReadyToOrder = () => {
        setIsMenuOpen(false);
        handleRequest('WAITER');
    };

    const buttons: { type: RequestType; label: string; icon: React.ReactNode; color: string }[] = [
        { type: 'WATER', label: 'Water', icon: <GlassWater size={32} />, color: 'bg-blue-100 text-blue-700 active:bg-blue-200' },
        { type: 'BILL', label: 'Bill', icon: <CreditCard size={32} />, color: 'bg-emerald-100 text-emerald-700 active:bg-emerald-200' },
        { type: 'WAITER', label: 'Call Waiter', icon: <User size={32} />, color: 'bg-orange-100 text-orange-700 active:bg-orange-200' },
        { type: 'CLEAN', label: 'Clean', icon: <Brush size={32} />, color: 'bg-indigo-100 text-indigo-700 active:bg-indigo-200' },
    ];

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center p-6 relative">
            <header className="mb-6 mt-4 text-center w-full max-w-sm">
                {restaurant?.logo ? (
                    <img src={restaurant.logo} alt={restaurant.name} className="h-16 w-auto mx-auto mb-3 object-contain" />
                ) : (
                    <h1 className="text-3xl font-bold text-gray-900 mb-1">TablePing</h1>
                )}

                {restaurant?.name && <h2 className="text-xl font-bold text-gray-800">{restaurant.name}</h2>}
                <p className="text-lg text-gray-500 font-medium mb-4">Table {currentTable}</p>

                {/* Social Links */}
                <div className="flex justify-center space-x-4 mb-6">
                    {restaurant?.instagramUrl && (
                        <a href={restaurant.instagramUrl} target="_blank" rel="noopener noreferrer" className="text-pink-600 bg-pink-50 p-2 rounded-full hover:bg-pink-100 transition-colors">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
                        </a>
                    )}
                    {restaurant?.googleMapsUrl && (
                        <a href={restaurant.googleMapsUrl} target="_blank" rel="noopener noreferrer" className="text-green-600 bg-green-50 p-2 rounded-full hover:bg-green-100 transition-colors">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="3 11 22 2 13 21 11 13 3 11"></polygon></svg>
                        </a>
                    )}
                    {restaurant?.websiteUrl && (
                        <a href={restaurant.websiteUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 bg-blue-50 p-2 rounded-full hover:bg-blue-100 transition-colors">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>
                        </a>
                    )}
                </div>

                <button
                    onClick={() => setIsMenuOpen(true)}
                    className="w-full bg-black text-white px-8 py-3 rounded-full font-bold shadow-lg hover:bg-gray-800 transition-transform active:scale-95 flex items-center justify-center mx-auto"
                >
                    Order Food
                </button>
            </header>

            {/* Menu Modal */}
            {isMenuOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-80 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] flex flex-col shadow-2xl animate-fade-in-up overflow-hidden">
                        <div className="p-4 border-b flex justify-between items-center bg-gray-50 rounded-t-2xl z-10 relative shadow-sm">
                            <h2 className="text-xl font-bold text-gray-800">Menu</h2>
                            <button
                                onClick={() => setIsMenuOpen(false)}
                                className="text-gray-500 hover:text-gray-700 bg-gray-200 p-2 rounded-full"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto bg-gray-100 relative">
                            {menuImage ? (
                                <img src={menuImage} alt="Restaurant Menu" className="w-full h-auto block" />
                            ) : (
                                <div className="flex flex-col items-center justify-center h-64 text-gray-400">
                                    <p>No menu available.</p>
                                </div>
                            )}
                        </div>

                        <div className="p-4 bg-white border-t border-gray-100 z-10 relative">
                            <button
                                onClick={handleReadyToOrder}
                                className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-4 rounded-xl text-lg shadow-lg active:scale-95 transition-all flex items-center justify-center"
                            >
                                Ready to Order
                            </button>
                            <p className="text-center text-xs text-gray-400 mt-2">A waiter will come to take your order.</p>
                        </div>
                    </div>
                </div>
            )}

            {/* Active Status Banner */}
            {activeRequests.length > 0 && (
                <div className="w-full max-w-sm mb-6 space-y-2">
                    {activeRequests.map(req => (
                        <div key={req.id} className="bg-yellow-50 border border-yellow-200 p-4 rounded-xl flex items-center justify-between animate-fade-in-up">
                            <div className="flex items-center">
                                <Clock size={20} className="text-yellow-600 mr-3 animate-pulse" />
                                <div>
                                    <p className="font-bold text-gray-900">{req.type}</p>
                                    <p className="text-xs text-yellow-700">Request Sent...</p>
                                </div>
                            </div>
                            <span className="text-xs font-bold uppercase tracking-wider text-yellow-800 bg-yellow-200 px-2 py-1 rounded">Pending</span>
                        </div>
                    ))}
                </div>
            )}

            {/* Completed Status Banner (Ephemeral) */}
            {completedRequests.slice(0, 1).map(req => (
                <div key={req.id} className="w-full max-w-sm mb-6 bg-green-50 border border-green-200 p-4 rounded-xl flex items-center justify-between animate-fade-in">
                    <div className="flex items-center">
                        <CheckCircle size={20} className="text-green-600 mr-3" />
                        <div>
                            <p className="font-bold text-gray-900">{req.type} Completed</p>
                            <p className="text-xs text-green-700">Staff marked as done</p>
                        </div>
                    </div>
                </div>
            ))}


            <div className="grid grid-cols-2 gap-4 w-full max-w-sm">
                {buttons.map((btn) => (
                    <button
                        key={btn.type}
                        onClick={() => handleRequest(btn.type)}
                        className={clsx(
                            "flex flex-col items-center justify-center p-6 rounded-2xl shadow-sm transition-all btn-bounce h-32",
                            btn.color
                        )}
                    >
                        <div className="mb-3">{btn.icon}</div>
                        <span className="font-bold text-lg">{btn.label}</span>
                    </button>
                ))}
            </div>

            <div className="mt-8 w-full max-w-sm">
                <button
                    onClick={() => handleRequest('MANAGER')}
                    className="w-full bg-red-50 text-red-600 py-4 rounded-xl flex items-center justify-center font-semibold text-lg active:bg-red-100 transition-colors shadow-sm border-2 border-transparent active:border-red-100"
                >
                    <AlertCircle className="mr-2" size={24} />
                    Call Manager
                </button>
            </div>

            <p className="mt-auto pt-8 mb-4 text-xs text-center text-gray-400">
                Tap a button to request service. <br /> You can make multiple requests.
            </p>
        </div>
    );
}
