import { useEffect, useState } from 'react';
import { Restaurant } from '../types';
import { Link, useNavigate } from 'react-router-dom';
import { Utensils, LayoutGrid } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function AdminDashboard() {
    const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
    const { adminAuthenticated } = useApp(); // Assume this is available from context now
    const navigate = useNavigate();

    useEffect(() => {
        if (!adminAuthenticated) {
            navigate('/admin/login');
            return;
        }

        fetch('/api/restaurants')
            .then(res => res.json())
            .then(data => setRestaurants(data))
            .catch(err => console.error('Failed to fetch restaurants:', err));
    }, [adminAuthenticated, navigate]);

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <header className="max-w-4xl mx-auto mb-8 flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
                    <p className="text-gray-500">Manage your restaurant locations</p>
                </div>
                <div className="bg-blue-600 text-white px-4 py-2 rounded-lg font-bold">
                    System Admin
                </div>
            </header>

            <main className="max-w-4xl mx-auto grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {restaurants.map(r => (
                    <div key={r.id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                        <div className="p-6">
                            <div className="flex items-center justify-between mb-4">
                                <div className="bg-blue-100 p-3 rounded-full text-blue-600">
                                    <Utensils size={24} />
                                </div>
                                <span className="text-xs font-bold bg-green-100 text-green-800 px-2 py-1 rounded">Active</span>
                            </div>
                            <h2 className="text-xl font-bold text-gray-900 mb-2">{r.name}</h2>
                            <p className="text-gray-500 mb-6 flex items-center">
                                <LayoutGrid size={16} className="mr-2" />
                                {r.tableCount} Tables
                            </p>

                            <div className="space-y-2">
                                <Link
                                    to={`/r/${r.id}/table/1`}
                                    className="block w-full text-center bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold py-2 rounded-lg transition-colors"
                                    target="_blank"
                                >
                                    Customer View (Table 1)
                                </Link>
                                <Link
                                    to={`/staff?restaurantId=${r.id}`}
                                    className="block w-full text-center bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 rounded-lg transition-colors"
                                >
                                    Staff Dashboard
                                </Link>
                                <Link
                                    to={`/admin/menu/${r.id}`}
                                    className="block w-full text-center border-2 border-gray-200 hover:border-gray-300 text-gray-600 font-bold py-2 rounded-lg transition-colors"
                                >
                                    Manage Menu
                                </Link>
                            </div>
                        </div>
                    </div>
                ))}
            </main>
        </div>
    );
}
