import styled from 'styled-components';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useAuth } from '../contexts/AuthContext';
import Logo from './Logo';

const HeaderContainer = styled.header`
    background-color: #fff;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    padding: 1rem;
    position: sticky;
    top: 0;
    z-index: 1000;
`;

const HeaderContent = styled.div`
    max-width: var(--max-width);
    margin: 0 auto;
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 1rem;
`;

const TitleContainer = styled.div`
    display: flex;
    align-items: center;
    gap: 1rem;
`;

const LogoWrapper = styled.div`
    display: flex;
    align-items: center;
`;

const BackButton = styled.button`
    background: none;
    border: none;
    cursor: pointer;
    padding: 0.5rem;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #666;
    transition: color 0.2s;

    &:hover {
        color: #333;
    }

    svg {
        width: 24px;
        height: 24px;
    }
`;

const UserSection = styled.div`
    display: flex;
    align-items: center;
    gap: 1rem;
`;

const UserInfo = styled.span`
    color: #666;
    font-size: 0.9rem;
`;

const LogoutButton = styled.button`
    background: none;
    border: 1px solid #dc3545;
    color: #dc3545;
    padding: 0.5rem 1rem;
    border-radius: 4px;
    cursor: pointer;
    font-size: 0.9rem;
    transition: all 0.2s;

    &:hover {
        background-color: #dc3545;
        color: white;
    }
`;

export default function Header() {
    const router = useRouter();
    const { user, logout } = useAuth();

    const handleBackClick = () => {
        router.back();
    };

    const handleLogout = () => {
        logout();
        router.push('/login');
    };

    return (
        <HeaderContainer>
            <HeaderContent>
                <TitleContainer>
                    <BackButton onClick={handleBackClick} aria-label="뒤로 가기">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M19 12H5M12 19l-7-7 7-7"/>
                        </svg>
                    </BackButton>
                    <Link href="/" passHref>
                        <LogoWrapper>
                            <Logo />
                        </LogoWrapper>
                    </Link>
                </TitleContainer>
                {user && (
                    <UserSection>
                        <UserInfo>{user.name} ({user.accountType})</UserInfo>
                        <LogoutButton onClick={handleLogout}>
                            로그아웃
                        </LogoutButton>
                    </UserSection>
                )}
            </HeaderContent>
        </HeaderContainer>
    );
} 