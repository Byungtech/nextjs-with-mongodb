import { useState } from 'react';
import styled from 'styled-components';
import { useRouter } from 'next/router';
import { GetServerSideProps } from 'next';
import client from '../../lib/mongodb';

interface ZizeomInfo {
    _id: string;
    name: string;
    address: string;
}

interface AccountInfo {
    _id: string;
    name: string;
    accountName: string;
    accountType: string;
}

interface ServiceDetailInfo {
    _id: string;
    name: string; // 시공 부위
    consumedFilmAmount: number; // 필름 얼마나 썼는지
    dueDate: string; // 보증 기간
    zizeomId: string;
    orderId: string;
}

// 주문 상세 (보증서)
interface OrderInfo {
    _id: string;
    serviceTarget: string; // 서비스 품목
    serviceDate: string; // 서비스 시공 일자
    servicePrice: string; // 서비스 시공 금액
    zizeomId: string;
    accountId: string;
    carNumber: string;
    serviceDetailIds: string[];
    serviceDetails: ServiceDetailInfo[];
}

interface CreateOrderProps {
    zizeoms: ZizeomInfo[];
    accounts: AccountInfo[];
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

const Select = styled.select`
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 16px;
    background-color: white;
    
    &:focus {
        outline: none;
        border-color: #007bff;
    }
`;

const ServiceDetailsContainer = styled.div`
    border: 1px solid #ddd;
    padding: 20px;
    border-radius: 4px;
    margin-top: 20px;
`;

const ServiceDetailItem = styled.div`
    display: flex;
    gap: 10px;
    margin-bottom: 10px;
    padding: 10px;
    border: 1px solid #eee;
    border-radius: 4px;
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

const AddButton = styled(Button)`
    background-color: #28a745;
    margin-top: 10px;

    &:hover {
        background-color: #218838;
    }
`;

const OrderForm = ({ zizeoms, accounts }: CreateOrderProps) => {
    const router = useRouter();
    const [orderInfo, setOrderInfo] = useState<Partial<OrderInfo>>({
        serviceTarget: '',
        serviceDate: '',
        servicePrice: '',
        zizeomId: '',
        accountId: '',
        carNumber: '',
        serviceDetails: []
    });

    const [serviceDetail, setServiceDetail] = useState<Partial<ServiceDetailInfo>>({
        name: '',
        consumedFilmAmount: 0,
        dueDate: '',
        zizeomId: ''
    });

    // 판매자 계정만 필터링
    const sellerAccounts = accounts.filter(account => account.accountType === 'seller');

    const handleOrderChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        
        if (name === 'servicePrice') {
            const numericValue = value.replace(/[^0-9]/g, '');
            const formattedValue = numericValue ? Number(numericValue).toLocaleString() : '';
            setOrderInfo(prev => ({
                ...prev,
                [name]: formattedValue
            }));
        } else {
            setOrderInfo(prev => ({
                ...prev,
                [name]: value
            }));
        }
    };

    const handleServiceDetailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setServiceDetail(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const addServiceDetail = () => {
        if (serviceDetail.name && serviceDetail.consumedFilmAmount && serviceDetail.dueDate) {
            setOrderInfo(prev => ({
                ...prev,
                serviceDetails: [...(prev.serviceDetails || []), serviceDetail as ServiceDetailInfo]
            }));
            setServiceDetail({
                name: '',
                consumedFilmAmount: 0,
                dueDate: '',
                zizeomId: ''
            });
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const orderData = {
                ...orderInfo,
                servicePrice: orderInfo.servicePrice?.replace(/,/g, '')
            };

            const response = await fetch('/api/orders', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(orderData),
            });

            if (response.ok) {
                router.push('/order/read/multiple');
            } else {
                console.error('주문 생성 실패');
            }
        } catch (error) {
            console.error('에러 발생:', error);
        }
    };

    return (
        <Container>
            <Title>새 주문 생성</Title>
            <Form onSubmit={handleSubmit}>
                <FormGroup>
                    <Label>서비스 품목</Label>
                    <Input
                        type="text"
                        name="serviceTarget"
                        value={orderInfo.serviceTarget}
                        onChange={handleOrderChange}
                        required
                    />
                </FormGroup>

                <FormGroup>
                    <Label>시공 일자</Label>
                    <Input
                        type="date"
                        name="serviceDate"
                        value={orderInfo.serviceDate}
                        onChange={handleOrderChange}
                        required
                    />
                </FormGroup>

                <FormGroup>
                    <Label>시공 금액</Label>
                    <Input
                        type="text"
                        name="servicePrice"
                        value={orderInfo.servicePrice}
                        onChange={handleOrderChange}
                        required
                        placeholder="숫자만 입력하세요"
                    />
                </FormGroup>

                <FormGroup>
                    <Label>지점</Label>
                    <Select
                        name="zizeomId"
                        value={orderInfo.zizeomId}
                        onChange={handleOrderChange}
                        required
                    >
                        <option value="">지점을 선택하세요</option>
                        {zizeoms.map((zizeom) => (
                            <option key={zizeom._id} value={zizeom._id}>
                                {zizeom.name} - {zizeom.address}
                            </option>
                        ))}
                    </Select>
                </FormGroup>

                <FormGroup>
                    <Label>계정</Label>
                    <Select
                        name="accountId"
                        value={orderInfo.accountId}
                        onChange={handleOrderChange}
                        required
                    >
                        <option value="">계정을 선택하세요</option>
                        {sellerAccounts.map((account) => (
                            <option key={account._id} value={account._id}>
                                {account.name} ({account.accountName})
                            </option>
                        ))}
                    </Select>
                </FormGroup>

                <FormGroup>
                    <Label>차량 번호</Label>
                    <Input
                        type="text"
                        name="carNumber"
                        value={orderInfo.carNumber}
                        onChange={handleOrderChange}
                        required
                    />
                </FormGroup>

                <ServiceDetailsContainer>
                    <h3>서비스 상세 정보</h3>
                    <FormGroup>
                        <Label>시공 부위</Label>
                        <Input
                            type="text"
                            name="name"
                            value={serviceDetail.name}
                            onChange={handleServiceDetailChange}
                        />
                    </FormGroup>

                    <FormGroup>
                        <Label>필름 사용량</Label>
                        <Input
                            type="number"
                            name="consumedFilmAmount"
                            value={serviceDetail.consumedFilmAmount}
                            onChange={handleServiceDetailChange}
                        />
                    </FormGroup>

                    <FormGroup>
                        <Label>보증 기간</Label>
                        <Input
                            type="date"
                            name="dueDate"
                            value={serviceDetail.dueDate}
                            onChange={handleServiceDetailChange}
                        />
                    </FormGroup>

                    <AddButton type="button" onClick={addServiceDetail}>
                        서비스 상세 추가
                    </AddButton>

                    {orderInfo.serviceDetails?.map((detail, index) => (
                        <ServiceDetailItem key={index}>
                            <div>
                                <strong>시공 부위:</strong> {detail.name}
                            </div>
                            <div>
                                <strong>필름 사용량:</strong> {detail.consumedFilmAmount}
                            </div>
                            <div>
                                <strong>보증 기간:</strong> {detail.dueDate}
                            </div>
                        </ServiceDetailItem>
                    ))}
                </ServiceDetailsContainer>

                <Button type="submit">주문 생성</Button>
            </Form>
        </Container>
    );
};

export default OrderForm;

export const getServerSideProps: GetServerSideProps = async () => {
    try {
        const db = client.db("main");
        
        const [zizeoms, accounts] = await Promise.all([
            db.collection("zizeoms").find({}).toArray(),
            db.collection("accounts").find({}).toArray()
        ]);

        return {
            props: {
                zizeoms: JSON.parse(JSON.stringify(zizeoms)),
                accounts: JSON.parse(JSON.stringify(accounts))
            }
        };
    } catch (e) {
        console.error(e);
        return {
            props: {
                zizeoms: [],
                accounts: []
            }
        };
    }
};