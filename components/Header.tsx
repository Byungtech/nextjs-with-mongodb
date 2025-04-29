import styled from 'styled-components';
import Link from 'next/link';
import Logo from './Logo';
import { useRouter } from 'next/router';

const HeaderContainer = styled.header`
    background-color: #fff;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    position: sticky;
    top: 0;
    z-index: 1000;
`;

const HeaderContent = styled.div`
    max-width: var(--max-width);
    margin: 0 auto;
    padding: 1rem;
    display: flex;
    align-items: center;
    gap: 1rem;

    @media (max-width: 768px) {
        padding: 0.8rem;
    }
`;

const BackButton = styled.button`
    background: none;
    border: none;
    cursor: pointer;
    padding: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #666;
    transition: color 0.3s ease;

    &:hover {
        color: #333;
    }

    svg {
        width: 24px;
        height: 24px;
    }
`;

const Header = () => {
    const router = useRouter();

    const handleBackClick = () => {
        router.back();
    };

    return (
        <HeaderContainer role="banner">
            <HeaderContent>
                <BackButton onClick={handleBackClick} aria-label="뒤로 가기">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M19 12H5M12 19l-7-7 7-7"/>
                    </svg>
                </BackButton>
                <Link href="/">
                    <Logo />
                </Link>
            </HeaderContent>
        </HeaderContainer>
    );
};

export default Header; 