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
        // 로그인 페이지와 주문 상세 페이지는 제외
        // 주문 읽기와 생성 페이지는 로그인 필요
        if (!isAuthenticated && 
            !router.pathname.startsWith('/login') && 
            !(router.pathname.startsWith('/order/') && !router.pathname.startsWith('/order/read') && !router.pathname.startsWith('/order/create'))) {
            router.push('/login');
        } else {
            setIsLoading(false);
        }
    }, [isAuthenticated, router]);

    // 로딩 중이거나 로그인하지 않은 상태에서는 아무것도 렌더링하지 않음
    if (isLoading || (!isAuthenticated && 
        !router.pathname.startsWith('/login') && 
        !(router.pathname.startsWith('/order/') && !router.pathname.startsWith('/order/read') && !router.pathname.startsWith('/order/create')))) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
        );
    }

    return <>{children}</>;
} 