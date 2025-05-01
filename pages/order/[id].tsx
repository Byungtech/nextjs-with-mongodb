import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import client from '../../lib/mongodb';
import { ObjectId } from 'mongodb';

interface ServiceDetail {
    serviceType: string;
    quantity: number;
    price: number;
}

interface OrderInfo {
    _id: string;
    zizeomId: string;
    accountId: string;
    orderDate: string;
    totalAmount: number;
    status: string;
    serviceDetails: ServiceDetail[];
    zizeom: {
        name: string;
        address: string;
        phone: string;
    };
    account: {
        name: string;
        accountName: string;
        phone: string;
        email: string;
    };
}

interface OrderDetailProps {
    order: OrderInfo;
}

const OrderDetail = ({ order }: OrderDetailProps) => {
    const router = useRouter();

    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="bg-white shadow-md rounded-lg overflow-hidden">
                    <div className="p-6">
                        <div className="flex justify-between items-center mb-6">
                            <h1 className="text-2xl font-semibold text-gray-800">주문 상세 정보</h1>
                            <button
                                onClick={() => router.back()}
                                className="px-4 py-2 text-gray-600 hover:text-gray-800 focus:outline-none"
                            >
                                ← 뒤로 가기
                            </button>
                        </div>

                        <div className="grid grid-cols-2 gap-6">
                            <div>
                                <h2 className="text-lg font-medium text-gray-800 mb-4">기본 정보</h2>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-600">주문 번호</label>
                                        <p className="mt-1 text-gray-900">{order._id}</p>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-600">주문일</label>
                                        <p className="mt-1 text-gray-900">
                                            {new Date(order.orderDate).toLocaleDateString('ko-KR')}
                                        </p>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-600">총 금액</label>
                                        <p className="mt-1 text-gray-900">
                                            {order.totalAmount?.toLocaleString('ko-KR')}원
                                        </p>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-600">상태</label>
                                        <p className="mt-1 text-gray-900">{order.status}</p>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <h2 className="text-lg font-medium text-gray-800 mb-4">지점 정보</h2>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-600">지점명</label>
                                        <p className="mt-1 text-gray-900">{order.zizeom.name}</p>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-600">주소</label>
                                        <p className="mt-1 text-gray-900">{order.zizeom.address}</p>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-600">연락처</label>
                                        <p className="mt-1 text-gray-900">{order.zizeom.phone}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="mt-8 border-t border-gray-200 pt-6">
                            <h2 className="text-lg font-medium text-gray-800 mb-4">서비스 상세</h2>
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                서비스 유형
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                수량
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                가격
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {order.serviceDetails && order.serviceDetails.map((detail, index) => (
                                            <tr key={index}>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                    {detail.serviceType}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                    {detail.quantity}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                    {detail.price.toLocaleString('ko-KR')}원
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        <div className="mt-8 border-t border-gray-200 pt-6">
                            <h2 className="text-lg font-medium text-gray-800 mb-4">계정 정보</h2>
                            <div className="grid grid-cols-2 gap-6">
                                <div>
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-600">이름</label>
                                            <p className="mt-1 text-gray-900">{order.account.name}</p>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-600">계정명</label>
                                            <p className="mt-1 text-gray-900">{order.account.accountName}</p>
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-600">연락처</label>
                                            <p className="mt-1 text-gray-900">{order.account.phone}</p>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-600">이메일</label>
                                            <p className="mt-1 text-gray-900">{order.account.email}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
    try {
        const id = context.params?.id as string;
        if (!id) {
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

        // 지점 정보 조회
        const zizeom = await db.collection("zizeoms").findOne({ _id: new ObjectId(order.zizeomId) });
        // 계정 정보 조회
        const account = await db.collection("accounts").findOne({ _id: new ObjectId(order.accountId) });

        return {
            props: {
                order: {
                    ...JSON.parse(JSON.stringify(order)),
                    zizeom: {
                        name: zizeom?.name || '',
                        address: zizeom?.address || '',
                        phone: zizeom?.phone || ''
                    },
                    account: {
                        name: account?.name || '',
                        accountName: account?.accountName || '',
                        phone: account?.phone || '',
                        email: account?.email || ''
                    }
                }
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