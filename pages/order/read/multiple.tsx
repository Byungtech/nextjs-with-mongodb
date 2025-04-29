import client from "../../../lib/mongodb";
import { GetServerSideProps } from 'next';
import styled from 'styled-components';
import { useRouter } from 'next/router';
import { ObjectId } from 'mongodb';

// 계정 정보
interface AccountInfo {
    _id: string;
    accountName: string; // 계정이름
    accountType: 'buyer' | 'seller' | 'admin';
    name: string;
    email: string;
    phone: string;
    address: string;
    carName: string;
    carNumber: string;
    carDaeNumber: string; // 차대 번호
}

// 지점 정보
interface ZizeomInfo {
    _id: string;
    name: string; // 지점 이름
    address: string; // 지점 주소
    phone: string; // 지점 번호
    ownFilmAmount: number; // 필름 얼마나 가지고 있는지
    consumedFilmAmount: number; // todo: 보증서에 얼마만큼 썼는지의 총합
    accountId: string; // 대표자 이름
}

interface ServiceDetailInfo {
    _id: string;
    name: string; // 시공 부위
    consumedFilmAmount: number; // 필름 얼마나 썼는지
    dueDate: string; // 보증 기간
    zizeomId: string;
    orderId: string;
}

interface OrderInfo {
    _id: string;
    serviceTarget: string;
    serviceDate: string;
    servicePrice: string;
    zizeomId: string;
    accountId: string;
    carNumber: string;
    serviceDetailIds: string[];
    serviceDetails: ServiceDetailInfo[];
    zizeomInfo: ZizeomInfo;
    accountInfo: AccountInfo;
}

interface OrdersProps {
    orders: OrderInfo[];
}

const Container = styled.div`
    max-width: var(--max-width);
    margin: 0 auto;
    padding: 20px;
    width: 100%;

    @media (max-width: 768px) {
        padding: 10px;
    }
`;

const Title = styled.h1`
    font-size: 24px;
    color: #333;
    margin-bottom: 20px;
    border-bottom: 2px solid #eee;
    padding-bottom: 10px;

    @media (max-width: 768px) {
        font-size: 20px;
        margin-bottom: 15px;
    }
`;

const HeaderContainer = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
`;

const CreateButton = styled.button`
    background-color: #4CAF50;
    color: white;
    padding: 10px 20px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 16px;
    transition: background-color 0.3s ease;

    &:hover {
        background-color: #45a049;
    }

    @media (max-width: 768px) {
        padding: 8px 16px;
        font-size: 14px;
    }
`;

const OrderList = styled.ul`
    list-style: none;
    padding: 0;
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 20px;

    @media (max-width: 768px) {
        grid-template-columns: 1fr;
        gap: 15px;
    }
`;

const OrderItem = styled.li`
    padding: 15px;
    background-color: #fff;
    border-radius: var(--border-radius);
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    transition: all 0.3s ease;
    cursor: pointer;
    height: 100%;
    display: flex;
    flex-direction: column;

    &:hover {
        transform: translateY(-5px);
        box-shadow: 0 4px 8px rgba(0,0,0,0.2);
    }

    @media (max-width: 768px) {
        padding: 12px;
    }
`;

const OrderTitle = styled.h3`
    font-size: 18px;
    color: #444;
    margin-bottom: 10px;
    display: flex;
    justify-content: space-between;
    align-items: center;

    @media (max-width: 768px) {
        font-size: 16px;
        margin-bottom: 8px;
    }
`;

const InfoList = styled.ul`
    list-style: none;
    padding: 0;
    margin: 0;
    flex: 1;
`;

const InfoItem = styled.li`
    padding: 8px 0;
    border-bottom: 1px solid #eee;
    display: flex;
    justify-content: space-between;
    align-items: center;
    transition: background-color 0.2s ease;
    font-size: 14px;

    &:last-child {
        border-bottom: none;
    }

    @media (max-width: 768px) {
        padding: 6px 0;
        font-size: 13px;
    }
`;

const Label = styled.span`
    color: #666;
    margin-right: 10px;
`;

const Value = styled.span`
    font-weight: bold;
    text-align: right;
    word-break: break-word;
    max-width: 60%;

    @media (max-width: 768px) {
        max-width: 50%;
    }
`;

const OrderListComponent = ({ orders }: OrdersProps) => {
    const router = useRouter();

    const handleOrderClick = (orderId: string) => {
        router.push(`/order/read/single?id=${orderId}`);
    };

    const handleCreateClick = () => {
        router.push('/order/create');
    };

    return (
        <Container>
            <HeaderContainer>
                <Title>주문 목록</Title>
                <CreateButton onClick={handleCreateClick}>
                    주문(보증서) 생성
                </CreateButton>
            </HeaderContainer>
            <OrderList>
                {orders.map((order) => (
                    <OrderItem 
                        key={order._id} 
                        onClick={() => handleOrderClick(order._id)}
                    >
                        <OrderTitle>주문 정보</OrderTitle>
                        <InfoList>
                            <InfoItem>
                                <Label>서비스 품목:</Label>
                                <Value>{order.serviceTarget}</Value>
                            </InfoItem>
                            <InfoItem>
                                <Label>시공 일자:</Label>
                                <Value>{order.serviceDate}</Value>
                            </InfoItem>
                            <InfoItem>
                                <Label>시공 금액:</Label>
                                <Value>{order.servicePrice}</Value>
                            </InfoItem>
                            <InfoItem>
                                <Label>차량 번호:</Label>
                                <Value>{order.carNumber}</Value>
                            </InfoItem>
                            <InfoItem>
                                <Label>지점:</Label>
                                <Value>{order.zizeomInfo?.name}</Value>
                            </InfoItem>
                            <InfoItem>
                                <Label>고객:</Label>
                                <Value>{order.accountInfo?.name}</Value>
                            </InfoItem>
                        </InfoList>
                    </OrderItem>
                ))}
            </OrderList>
        </Container>
    );
};

export default OrderListComponent;

export const getServerSideProps: GetServerSideProps = async () => {
    try {
        const db = client.db("main");
        const orders = await db
            .collection("orders")
            .aggregate([
                {
                    $lookup: {
                        from: "zizeoms",
                        localField: "zizeomId",
                        foreignField: "_id",
                        as: "zizeomInfo"
                    }
                },
                {
                    $lookup: {
                        from: "accounts",
                        localField: "accountId",
                        foreignField: "_id",
                        as: "accountInfo"
                    }
                },
                {
                    $addFields: {
                        zizeomInfo: { $arrayElemAt: ["$zizeomInfo", 0] },
                        accountInfo: { $arrayElemAt: ["$accountInfo", 0] }
                    }
                }
            ])
            .toArray();

        return {
            props: { 
                orders: JSON.parse(JSON.stringify(orders))
            },
        };
    } catch (e) {
        console.error(e);
        return { props: { orders: [] } };
    }
};
