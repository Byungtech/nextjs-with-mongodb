import { useRouter } from 'next/router';
import { GetServerSideProps } from 'next';
import client from '../../../lib/mongodb';
import { ObjectId } from 'mongodb';

interface ServiceDetailInfo {
    _id: string;
    name: string;
    consumedFilmAmount: number;
    dueDate: string;
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
}

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

interface OrderDetailProps {
    order: OrderInfo;
    zizeom: ZizeomInfo;
    account: AccountInfo;
}

const OrderDetail = ({ order, zizeom, account }: OrderDetailProps) => {
    const router = useRouter();

    return (
        <div className="max-w-4xl mx-auto p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-semibold text-gray-800">주문 상세 정보</h1>
                <button
                    onClick={() => router.back()}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800 focus:outline-none"
                >
                    ← 뒤로 가기
                </button>
            </div>

            <div className="bg-white shadow-md rounded-lg overflow-hidden">
                <div className="p-6 space-y-6">
                    <div className="grid grid-cols-2 gap-6">
                        <div>
                            <h2 className="text-lg font-medium text-gray-800 mb-4">기본 정보</h2>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-600">서비스 품목</label>
                                    <p className="mt-1 text-gray-900">{order.serviceTarget}</p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-600">시공 일자</label>
                                    <p className="mt-1 text-gray-900">{order.serviceDate}</p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-600">시공 금액</label>
                                    <p className="mt-1 text-gray-900">{Number(order.servicePrice).toLocaleString()}원</p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-600">차량 번호</label>
                                    <p className="mt-1 text-gray-900">{order.carNumber}</p>
                                </div>
                            </div>
                        </div>

                        <div>
                            <h2 className="text-lg font-medium text-gray-800 mb-4">관련 정보</h2>
                            <div className="space-y-4">
                                {!!zizeom && (<div>
                                    <label className="block text-sm font-medium text-gray-600">지점</label>
                                    <p className="mt-1 text-gray-900">{zizeom.name}</p>
                                    <p className="mt-1 text-sm text-gray-500">{zizeom.address}</p>
                                </div>)}
                                {!!account && <div>
                                    <label className="block text-sm font-medium text-gray-600">계정</label>
                                    <p className="mt-1 text-gray-900">{account.name}</p>
                                    <p className="mt-1 text-sm text-gray-500">{account.accountName}</p>
                                </div>}
                            </div>
                        </div>
                    </div>

                    <div className="border-t border-gray-200 pt-6">
                        <h2 className="text-lg font-medium text-gray-800 mb-4">시공 상세 정보</h2>
                        <div className="space-y-4">
                            {order.serviceDetails && order.serviceDetails.map((detail, index) => (
                                <div
                                    key={detail._id}
                                    className="p-4 bg-gray-50 rounded-lg"
                                >
                                    <div className="grid grid-cols-3 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-600">시공 부위</label>
                                            <p className="mt-1 text-gray-900">{detail.name}</p>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-600">소모 필름량</label>
                                            <p className="mt-1 text-gray-900">{detail.consumedFilmAmount}</p>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-600">보증 기간</label>
                                            <p className="mt-1 text-gray-900">{detail.dueDate}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
    try {
        const { id } = context.query;
        if (!id || typeof id !== 'string') {
            return {
                notFound: true
            };
        }

        await client.connect();
        const db = client.db("main");

        const order = await db.collection("orders").findOne({ _id: new ObjectId(id) });
        if (!order) {
            return {
                notFound: true
            };
        }

        const [zizeom, account] = await Promise.all([
            db.collection("zizeoms").findOne({ _id: new ObjectId(order.zizeomId) }),
            db.collection("accounts").findOne({ _id: new ObjectId(order.accountId) })
        ]);

        return {
            props: {
                order: JSON.parse(JSON.stringify(order)),
                zizeom: JSON.parse(JSON.stringify(zizeom)),
                account: JSON.parse(JSON.stringify(account))
            }
        };
    } catch (error) {
        console.error('Error:', error);
        return {
            notFound: true
        };
    }
};

export default OrderDetail;
