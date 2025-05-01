import { useState } from 'react';
import styled from 'styled-components';
import { useRouter } from 'next/router';
import { useAuth } from '../contexts/AuthContext';
import Logo from '../components/Logo';

const Container = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    background-color: #f5f5f5;
`;

const LogoWrapper = styled.div`
    margin-bottom: 2rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
`;

const LogoContainer = styled.div`
    transform: scale(1.5);
    transform-origin: center;
`;

const SystemTitle = styled.h1`
    font-size: 1.5rem;
    color: #333;
    font-weight: 500;
    text-align: center;
`;

const LoginForm = styled.form`
    background: white;
    padding: 2rem;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    width: 100%;
    max-width: 400px;
`;

const Title = styled.h1`
    text-align: center;
    color: #333;
    margin-bottom: 2rem;
`;

const Input = styled.input`
    width: 100%;
    padding: 0.75rem;
    margin-bottom: 1rem;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 1rem;

    &:focus {
        outline: none;
        border-color: #007bff;
    }
`;

const Button = styled.button`
    width: 100%;
    padding: 0.75rem;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 4px;
    font-size: 1rem;
    cursor: pointer;
    transition: background-color 0.2s;

    &:hover {
        background-color: #0056b3;
    }
`;

const ErrorMessage = styled.div`
    color: #dc3545;
    margin-bottom: 1rem;
    text-align: center;
`;

export default function Login() {
    const [accountName, setAccountName] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const router = useRouter();
    const { login } = useAuth();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        try {
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ accountName, password }),
            });

            const data = await response.json();

            if (response.ok) {
                login(data.user);
                router.push('/');
            } else {
                setError(data.message || '로그인에 실패했습니다.');
            }
        } catch (err) {
            setError('서버 오류가 발생했습니다.');
        }
    };

    return (
        <Container>
            <LogoWrapper>
                <LogoContainer>
                    <Logo />
                </LogoContainer>
                <SystemTitle>주문 및 지점 관리 시스템</SystemTitle>
            </LogoWrapper>
            <LoginForm onSubmit={handleSubmit}>
                <Title>로그인</Title>
                {error && <ErrorMessage>{error}</ErrorMessage>}
                <Input
                    type="text"
                    placeholder="아이디"
                    value={accountName}
                    onChange={(e) => setAccountName(e.target.value)}
                    required
                />
                <Input
                    type="password"
                    placeholder="비밀번호"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <Button type="submit">로그인</Button>
            </LoginForm>
        </Container>
    );
} 