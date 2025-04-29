import client from "../../../lib/mongodb";
import { GetServerSideProps } from 'next';
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

interface OrderItemProps {
    orderInfo: OrderInfo;
}

const OrderItem = ({ orderInfo }: OrderItemProps) => {
    return (
        <div>
            <h1>보증서(사실은 주문서)</h1>
            <p>
                <small>정보들</small>
            </p>
            <ul>
                <li>
                    <h2>서비스 내용</h2>
                    <h3>시공 품목</h3>
                    <p>{orderInfo.serviceTarget}</p>
                    <h3>시공 일자</h3>
                    <p>{orderInfo.serviceDate}</p>
                    <h3>시공 금액</h3>
                    <p>{orderInfo.servicePrice}</p>
                </li>
            </ul>
        </div>
    );
};

export default OrderItem;

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
            .aggregate([
                {
                    $match: query
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
                        from: "zizeoms",
                        localField: "zizeomId",
                        foreignField: "_id",
                        as: "zizeomInfo"
                    }
                },
                {
                    $addFields: {
                        accountInfo: { $arrayElemAt: ["$accountInfo", 0] },
                        zizeomInfo: { $arrayElemAt: ["$zizeomInfo", 0] }
                    }
                }
            ])
            .toArray();

        if (!orders.length) {
            return {
                notFound: true
            };
        }

        return {
            props: { orderInfo: JSON.parse(JSON.stringify(orders))[0] },
        };
    } catch (e) {
        console.error(e);
        return {
            notFound: true
        };
    }
};
