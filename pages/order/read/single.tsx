import { GetServerSideProps } from 'next';
import styled from 'styled-components';
import client from "../../../lib/mongodb";
import { ObjectId } from 'mongodb';

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
interface OrderInfo {
    _id: string;
    serviceTarget: string; // 서비스 품목
    serviceDate: string; // 서비스 시공 일자
    servicePrice: string; // 서비스 시공 금액
    zizeomId: string;
    zizeomInfo: ZizeomInfo;
    accountId: string;
    carNumber: string;
    accountInfo: AccountInfo;
    serviceDetailIds: string[];
    serviceDetails: ServiceDetailInfo[];
}

interface SingleOrderProps {
    order: OrderInfo;
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

const OrderInfo = styled.div`
    background-color: #fff;
    border-radius: 8px;
    padding: 20px;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    margin-bottom: 20px;
`;

const InfoItem = styled.div`
    margin-bottom: 15px;
    display: flex;
    justify-content: space-between;
    padding: 10px 0;
    border-bottom: 1px solid #eee;

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

const ServiceDetailsList = styled.div`
    margin-top: 20px;
`;

const ServiceDetailItem = styled.div`
    background-color: #f8f9fa;
    border-radius: 8px;
    padding: 15px;
    margin-bottom: 10px;
`;

const ServiceDetailTitle = styled.h3`
    font-size: 18px;
    color: #444;
    margin-bottom: 10px;
`;

const SingleOrderPage = ({ order }: SingleOrderProps) => {
    return (
        <Container>
            <Title>주문 상세 정보</Title>
            <OrderInfo>
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
            </OrderInfo>

            <ServiceDetailsList>
                <Title>서비스 상세 정보</Title>
                {order.serviceDetails?.map((detail) => (
                    <ServiceDetailItem key={detail._id}>
                        <ServiceDetailTitle>{detail.name}</ServiceDetailTitle>
                        <InfoItem>
                            <Label>소비된 필름 수량:</Label>
                            <Value>{detail.consumedFilmAmount}</Value>
                        </InfoItem>
                        <InfoItem>
                            <Label>보증 기간:</Label>
                            <Value>{detail.dueDate}</Value>
                        </InfoItem>
                    </ServiceDetailItem>
                ))}
            </ServiceDetailsList>
        </Container>
    );
};

export default SingleOrderPage;

export const getServerSideProps: GetServerSideProps = async (context) => {
    const { id } = context.query;
    
    try {
        if (!id || typeof id !== 'string') {
            return {
                notFound: true
            };
        }

        const db = client.db("main");
        const order = await db
            .collection("orders")
            .aggregate([
                {
                    $match: { _id: new ObjectId(id) }
                },
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
                    $lookup: {
                        from: "serviceDetails",
                        let: { orderId: "$_id" },
                        pipeline: [
                            {
                                $match: {
                                    $expr: { $eq: ["$orderId", "$$orderId"] }
                                }
                            }
                        ],
                        as: "serviceDetails"
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

        if (!order[0]) {
            return {
                notFound: true
            };
        }

        return {
            props: {
                order: JSON.parse(JSON.stringify(order[0]))
            }
        };
    } catch (e) {
        console.error(e);
        return {
            notFound: true
        };
    }
};
