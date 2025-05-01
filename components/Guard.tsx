import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../contexts/AuthContext';

interface GuardProps {
    children: React.ReactNode;
}

export default function Guard({ children }: GuardProps) {
    const router = useRouter();
    const { isAuthenticated } = useAuth();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // 로그인 페이지는 제외
        if (!isAuthenticated && !router.pathname.startsWith('/login')) {
            router.push('/login');
        } else {
            setIsLoading(false);
        }
    }, [isAuthenticated, router]);

    // 로딩 중이거나 로그인하지 않은 상태에서는 아무것도 렌더링하지 않음
    if (isLoading || (!isAuthenticated && !router.pathname.startsWith('/login'))) {
        return null;
    }

    return <>{children}</>;
} 