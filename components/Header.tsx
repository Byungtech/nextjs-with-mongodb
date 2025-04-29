import styled from 'styled-components';
import Link from 'next/link';
import Logo from './Logo';

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

    @media (max-width: 768px) {
        padding: 0.8rem;
    }
`;

const Header = () => {
    return (
        <HeaderContainer role="banner">
            <HeaderContent>
                <Link href="/">
                    <Logo />
                </Link>
            </HeaderContent>
        </HeaderContainer>
    );
};

export default Header; 