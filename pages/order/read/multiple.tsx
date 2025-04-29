import client from "../../../lib/mongodb";
import { GetServerSideProps } from 'next';
import { ObjectId } from 'mongodb';
import styled from 'styled-components';



// 계정 정보
interface AccountInfo {
    _id: string;
    accountName: string; // 계정이름
    accountType: 'buyer' | 'seller' | 'admin';
    name: string;
    email: string;
    password: string;
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
    accountInfos: AccountInfo[];
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
interface OrderInfoSummary {
    _id: string;
    serviceTarget: string; // 서비스 품목
    serviceDate: string; // 서비스 시공 일자
    servicePrice: string; // 서비스 시공 금액
    zizeomId: string;
    accountId: string;
    carNumber: string;
    serviceDetailIds: string[];
}

interface OrdersProps {
    orders: OrderInfoSummary[];
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

const OrderList = styled.ul`
    list-style: none;
    padding: 0;
`;

const OrderItem = styled.li`
    margin-bottom: 20px;
    padding: 15px;
    background-color: #fff;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    transition: all 0.3s ease;
    cursor: pointer;

    &:hover {
        transform: translateY(-5px);
        box-shadow: 0 4px 8px rgba(0,0,0,0.2);
    }
`;

const OrderTitle = styled.h3`
    font-size: 18px;
    color: #444;
    margin-bottom: 10px;
`;

const InfoList = styled.ul`
    list-style: none;
    padding: 0;
    margin: 0;
`;

const InfoItem = styled.li`
    padding: 8px 0;
    border-bottom: 1px solid #eee;
    display: flex;
    justify-content: space-between;
    transition: background-color 0.2s ease;

    &:last-child {
        border-bottom: none;
    }
`;

const Label = styled.span`
    color: #666;
`;

const Value = styled.span`
    font-weight: bold;
`;

const OrderListComponent = ({ orders }: OrdersProps) => {
    return (
        <Container>
            <Title>주문 목록</Title>
            <OrderList>
                {orders.map((order) => (
                    <OrderItem key={order._id}>
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
                        </InfoList>
                    </OrderItem>
                ))}
            </OrderList>
        </Container>
    );
};

export default OrderListComponent;

export const getServerSideProps: GetServerSideProps = async (context) => {
    try {
        const { id, carNumber } = context.query;
        const db = client.db("main");

        // 쿼리 조건 생성
        const query: any = {};

        // id 파라미터 처리
        if (id) {
            try {
                if (typeof id !== 'string') {
                    throw new Error('Invalid ID format');
                }
                query._id = new ObjectId(id);
            } catch (error) {
                console.error('Invalid ObjectId:', error);
                return {
                    notFound: true
                };
            }
        }

        // carNumber 파라미터 처리
        if (carNumber) {
            if (typeof carNumber !== 'string') {
                return {
                    notFound: true
                };
            }
            query.carNumber = carNumber;
        }

        // 쿼리 조건이 없는 경우 처리
        if (Object.keys(query).length === 0) {
            return {
                notFound: true
            };
        }

        const orders = await db
            .collection("orders")
            .find(query)
            .toArray();

        if (!orders.length) {
            return {
                notFound: true
            };
        }

        return {
            props: { orders: JSON.parse(JSON.stringify(orders)) },
        };
    } catch (e) {
        console.error(e);
        return {
            notFound: true
        };
    }
};
