import { useState } from 'react';
import styled from 'styled-components';
import { useRouter } from 'next/router';

interface ZizeomInfo {
    name: string;
    address: string;
    phone: string;
    ownFilmAmount: number;
    consumedFilmAmount: number;
    accountId: string;
}

const Container = styled.div`
    max-width: 800px;
    margin: 0 auto;
    padding: 20px;
`;

const Title = styled.h1`
    font-size: 24px;
    color: #333;
    margin-bottom: 20px;
    border-bottom: 2px solid #eee;
    padding-bottom: 10px;
`;

const Form = styled.form`
    display: flex;
    flex-direction: column;
    gap: 20px;
`;

const FormGroup = styled.div`
    display: flex;
    flex-direction: column;
    gap: 8px;
`;

const Label = styled.label`
    font-size: 16px;
    color: #444;
    font-weight: 500;
`;

const Input = styled.input`
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 16px;
    
    &:focus {
        outline: none;
        border-color: #007bff;
    }
`;

const Button = styled.button`
    padding: 12px 24px;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 4px;
    font-size: 16px;
    cursor: pointer;
    transition: background-color 0.2s;

    &:hover {
        background-color: #0056b3;
    }
`;

const ZizeomForm = () => {
    const router = useRouter();
    const [zizeomInfo, setZizeomInfo] = useState<ZizeomInfo>({
        name: '',
        address: '',
        phone: '',
        ownFilmAmount: 0,
        consumedFilmAmount: 0,
        accountId: ''
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setZizeomInfo(prev => ({
            ...prev,
            [name]: name === 'ownFilmAmount' || name === 'consumedFilmAmount' 
                ? Number(value) 
                : value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await fetch('/api/zizeoms', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(zizeomInfo),
            });

            if (response.ok) {
                router.push('/zizeom/read/multiple');
            } else {
                console.error('지점 생성 실패');
            }
        } catch (error) {
            console.error('에러 발생:', error);
        }
    };

    return (
        <Container>
            <Title>새 지점 생성</Title>
            <Form onSubmit={handleSubmit}>
                <FormGroup>
                    <Label>지점 이름</Label>
                    <Input
                        type="text"
                        name="name"
                        value={zizeomInfo.name}
                        onChange={handleChange}
                        required
                    />
                </FormGroup>

                <FormGroup>
                    <Label>주소</Label>
                    <Input
                        type="text"
                        name="address"
                        value={zizeomInfo.address}
                        onChange={handleChange}
                        required
                    />
                </FormGroup>

                <FormGroup>
                    <Label>전화번호</Label>
                    <Input
                        type="tel"
                        name="phone"
                        value={zizeomInfo.phone}
                        onChange={handleChange}
                        required
                    />
                </FormGroup>

                <FormGroup>
                    <Label>보유 필름량</Label>
                    <Input
                        type="number"
                        name="ownFilmAmount"
                        value={zizeomInfo.ownFilmAmount}
                        onChange={handleChange}
                        required
                    />
                </FormGroup>

                <FormGroup>
                    <Label>사용 필름량</Label>
                    <Input
                        type="number"
                        name="consumedFilmAmount"
                        value={zizeomInfo.consumedFilmAmount}
                        onChange={handleChange}
                        required
                    />
                </FormGroup>

                <FormGroup>
                    <Label>대표자 ID</Label>
                    <Input
                        type="text"
                        name="accountId"
                        value={zizeomInfo.accountId}
                        onChange={handleChange}
                        required
                    />
                </FormGroup>

                <Button type="submit">지점 생성</Button>
            </Form>
        </Container>
    );
};

export default ZizeomForm;