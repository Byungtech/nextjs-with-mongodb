import { useRouter } from 'next/router';
import { useAuth } from '../contexts/AuthContext';
import Logo from './Logo';

export default function Header() {
    const router = useRouter();
    const { user, logout } = useAuth();

    const handleBack = () => {
        router.back();
    };

    return (
        <header className="fixed top-0 left-0 right-0 h-16 bg-white border-b border-gray-200 z-50">
            <div className="max-w-7xl mx-auto px-4 h-full flex items-center justify-between">
                <div className="flex items-center space-x-4">
                    {router.pathname !== '/' && (
                        <button
                            onClick={handleBack}
                            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                        >
                            <svg
                                className="w-6 h-6 text-gray-600"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M15 19l-7-7 7-7"
                                />
                            </svg>
                        </button>
                    )}
                    <div className="w-32">
                        <Logo />
                    </div>
                </div>
                {user && (
                    <div className="flex items-center space-x-4">
                        <span className="text-sm text-gray-600">
                            {user.name} ({user.accountType})
                        </span>
                        <button
                            onClick={logout}
                            className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 transition-colors"
                        >
                            로그아웃
                        </button>
                    </div>
                )}
            </div>
        </header>
    );
} 