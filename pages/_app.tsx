import type { AppProps } from 'next/app';
import { AuthProvider } from '../contexts/AuthContext';
import Guard from '../components/Guard';
import Header from '../components/Header';
import '../styles/global.css';

export default function App({ Component, pageProps }: AppProps) {
    return (
        <AuthProvider>
            <Guard>
                <div className="min-h-screen bg-gray-50">
                    <Header />
                    <main className="pt-16">
                        <Component {...pageProps} />
                    </main>
                </div>
            </Guard>
        </AuthProvider>
    );
} 