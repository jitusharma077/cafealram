import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Trash2, Plus, Save } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function MenuManager() {
    const { restaurantId } = useParams<{ restaurantId: string }>();
    const navigate = useNavigate();
    const { adminAuthenticated } = useApp();
    const [restaurant, setRestaurant] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    // Form State
    const [menuImage, setMenuImage] = useState<string | null>(null);
    const [logo, setLogo] = useState<string | null>(null);
    const [instagramUrl, setInstagramUrl] = useState('');
    const [googleMapsUrl, setGoogleMapsUrl] = useState('');
    const [websiteUrl, setWebsiteUrl] = useState('');

    useEffect(() => {
        if (!adminAuthenticated) {
            navigate('/admin/login');
            return;
        }

        fetch(`/api/restaurants/${restaurantId}`)
            .then(res => res.json())
            .then(data => {
                setRestaurant(data);
                setMenuImage(data.menuImage || null);
                setLogo(data.logo || null);
                setInstagramUrl(data.instagramUrl || '');
                setGoogleMapsUrl(data.googleMapsUrl || '');
                setWebsiteUrl(data.websiteUrl || '');
                setLoading(false);
            })
            .catch(err => console.error('Failed to fetch restaurant:', err));
    }, [restaurantId, adminAuthenticated, navigate]);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>, setter: (val: string) => void) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setter(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSave = async () => {
        try {
            const res = await fetch(`/api/restaurants/${restaurantId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    menuImage,
                    logo,
                    instagramUrl,
                    googleMapsUrl,
                    websiteUrl
                })
            });

            if (res.ok) {
                alert('Restaurant settings saved!');
            } else {
                alert('Failed to save settings.');
            }
        } catch (error) {
            console.error('Save failed:', error);
        }
    };

    if (loading) return <div className="p-10 text-center">Loading...</div>;

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <header className="max-w-4xl mx-auto mb-8 flex items-center justify-between">
                <div className="flex items-center">
                    <button onClick={() => navigate('/admin')} className="mr-4 p-2 bg-white rounded-full shadow hover:bg-gray-100">
                        <ArrowLeft size={20} />
                    </button>
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Manage Restaurant</h1>
                        <p className="text-gray-500">{restaurant?.name}</p>
                    </div>
                </div>
                <button
                    onClick={handleSave}
                    className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-bold flex items-center shadow-lg transition-transform active:scale-95"
                >
                    <Save size={20} className="mr-2" />
                    Save Changes
                </button>
            </header>

            <main className="max-w-4xl mx-auto space-y-8">

                {/* Branding Section */}
                <section className="bg-white p-6 rounded-xl shadow-md">
                    <h2 className="text-xl font-bold text-gray-800 mb-6 border-b pb-2">Branding & Links</h2>
                    <div className="grid md:grid-cols-2 gap-8">
                        {/* Logo Upload */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Restaurant Logo</label>
                            <div className="flex items-center space-x-4">
                                <div className="w-24 h-24 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden border border-gray-200">
                                    {logo ? (
                                        <img src={logo} alt="Logo" className="w-full h-full object-cover" />
                                    ) : (
                                        <span className="text-xs text-gray-400">No Logo</span>
                                    )}
                                </div>
                                <div className="space-y-2">
                                    <label className="cursor-pointer bg-blue-50 text-blue-600 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-100 transition-colors block text-center">
                                        Upload Logo
                                        <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageChange(e, setLogo)} />
                                    </label>
                                    {logo && (
                                        <button onClick={() => setLogo(null)} className="text-red-500 text-sm hover:underline block w-full text-center">
                                            Remove
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Social Links */}
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Instagram URL</label>
                                <input
                                    type="text"
                                    className="w-full border-gray-300 border rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                    placeholder="https://instagram.com/..."
                                    value={instagramUrl}
                                    onChange={(e) => setInstagramUrl(e.target.value)}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Google Maps URL</label>
                                <input
                                    type="text"
                                    className="w-full border-gray-300 border rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                    placeholder="https://maps.google.com/..."
                                    value={googleMapsUrl}
                                    onChange={(e) => setGoogleMapsUrl(e.target.value)}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Website URL</label>
                                <input
                                    type="text"
                                    className="w-full border-gray-300 border rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                    placeholder="https://..."
                                    value={websiteUrl}
                                    onChange={(e) => setWebsiteUrl(e.target.value)}
                                />
                            </div>
                        </div>
                    </div>
                </section>

                {/* Menu Image Section */}
                <section className="bg-white p-8 rounded-xl shadow-md text-center">
                    <h2 className="text-xl font-bold text-gray-800 mb-6 border-b pb-2 text-left">Menu Image</h2>

                    {menuImage ? (
                        <div className="relative inline-block border-2 border-gray-200 rounded-lg overflow-hidden">
                            <img src={menuImage} alt="Menu" className="max-w-full max-h-[600px] object-contain" />
                            <button
                                onClick={() => setMenuImage(null)}
                                className="absolute top-2 right-2 bg-red-600 text-white p-2 rounded-full shadow hover:bg-red-700"
                            >
                                <Trash2 size={20} />
                            </button>
                        </div>
                    ) : (
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 flex flex-col items-center justify-center text-gray-500">
                            <div className="mb-4 bg-gray-100 p-4 rounded-full">
                                <Plus size={40} className="text-gray-400" />
                            </div>
                            <p className="text-lg font-medium mb-2">No menu image updated</p>
                            <label className="cursor-pointer bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg transition-colors">
                                Upload Menu
                                <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageChange(e, setMenuImage)} />
                            </label>
                        </div>
                    )}
                </section>
            </main>
        </div>
    );
}
