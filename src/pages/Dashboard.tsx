import { useState } from 'react';
import { useAuth } from '../features/auth/AuthContext';
import IdCard from './IdCard';
import AcademyCertificate from './AcademyCertificate';

export default function Dashboard() {
    const [activeTab, setActiveTab] = useState<'idcard' | 'certificate'>('idcard');
    const { logout } = useAuth();

    const handleLogout = () => {
        logout();
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-sky-100 to-white">
            {/* Header */}
            <div className="bg-white backdrop-blur-sm border-b border-white/40 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center space-x-3">
                            <img
                                src="/insan_medika.png"
                                alt="Logo"
                                className="w-8 h-8 object-contain"
                            />
                            <h1 className="text-xl font-semibold text-gray-800">
                                Insan Medika
                            </h1>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                        >
                            Logout
                        </button>
                    </div>
                </div>
            </div>

            {/* Tab Navigation */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
                <div className="flex space-x-1 bg-white/60 backdrop-blur-sm rounded-xl p-1 shadow-sm">
                    <button
                        onClick={() => setActiveTab('idcard')}
                        className={`flex-1 px-6 py-3 rounded-lg text-sm font-medium transition-all ${activeTab === 'idcard'
                            ? 'bg-[#008EDF] text-white shadow-md'
                            : 'text-gray-600 hover:text-gray-800 hover:bg-white/50'
                            }`}
                    >
                        ID Card
                    </button>
                    <button
                        onClick={() => setActiveTab('certificate')}
                        className={`flex-1 px-6 py-3 rounded-lg text-sm font-medium transition-all ${activeTab === 'certificate'
                            ? 'bg-[#008EDF] text-white shadow-md'
                            : 'text-gray-600 hover:text-gray-800 hover:bg-white/50'
                            }`}
                    >
                        Certificate
                    </button>
                </div>

                {/* Tab Content */}
                <div>
                    {activeTab === 'idcard' && <IdCard />}
                    {activeTab === 'certificate' && <AcademyCertificate />}
                </div>
            </div>
        </div>
    );
}