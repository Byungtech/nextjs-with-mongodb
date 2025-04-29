import styled from 'styled-components';
import Link from 'next/link';
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
    justify-content: space-between;
    align-items: center;

    @media (max-width: 768px) {
        padding: 0.8rem;
        flex-direction: column;
        gap: 0.5rem;
    }
`;

const Logo = styled(Link)`
    font-size: 1.5rem;
    font-weight: bold;
    color: #0070f3;
    text-decoration: none;

    &:hover {
        text-decoration: underline;
    }

    @media (max-width: 768px) {
        font-size: 1.2rem;
    }
`;

const Nav = styled.nav`
    display: flex;
    gap: 1.5rem;
    align-items: center;

    @media (max-width: 768px) {
        width: 100%;
        justify-content: space-between;
        gap: 0.5rem;
    }
`;

const NavLink = styled(Link)<{ isActive: boolean }>`
    color: ${props => props.isActive ? '#0070f3' : '#666'};
    text-decoration: none;
    font-weight: ${props => props.isActive ? 'bold' : 'normal'};
    padding: 0.5rem;
    border-radius: var(--border-radius);
    transition: all 0.2s ease;

    &:hover {
        background-color: #f5f5f5;
        color: #0070f3;
    }

    @media (max-width: 768px) {
        font-size: 0.9rem;
        padding: 0.3rem;
    }
`;

const Header = () => {
    const router = useRouter();

    const isActive = (path: string) => {
        return router.pathname.startsWith(path);
    };

    return (
        <HeaderContainer role="banner">
            <HeaderContent>
                <Logo href="/">
                    필름 시공 관리 시스템
                </Logo>
                <Nav>
                    <NavLink href="/order/read/multiple" isActive={isActive('/order')}>
                        주문 관리
                    </NavLink>
                    <NavLink href="/zizeom/read/multiple" isActive={isActive('/zizeom')}>
                        지점 관리
                    </NavLink>
                    <NavLink href="/account/read/multiple" isActive={isActive('/account')}>
                        계정 관리
                    </NavLink>
                    <NavLink href="/inventory" isActive={isActive('/inventory')}>
                        재고 관리
                    </NavLink>
                </Nav>
            </HeaderContent>
        </HeaderContainer>
    );
};

export default Header; 