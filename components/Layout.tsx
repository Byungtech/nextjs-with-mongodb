import { useRouter } from 'next/router';
import styled from 'styled-components';
import Header from './Header';

const LayoutContainer = styled.div`
    min-height: 100vh;
    display: flex;
    flex-direction: column;
`;

const Main = styled.main`
    flex: 1;
    padding: 1rem;
`;

interface LayoutProps {
    children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
    const router = useRouter();
    const isLoginPage = router.pathname === '/login';

    return (
        <LayoutContainer>
            {!isLoginPage && <Header />}
            <Main>{children}</Main>
        </LayoutContainer>
    );
} 