import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import client from '../../lib/mongodb';
import { ObjectId } from 'mongodb';

interface ServiceDetail {
    _id: string;
    name: string;
    consumedFilmAmount: number;
    dueDate: string;
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
    zizeom: {
        name: string;
        address: string;
        phone: string;
    } | null;
    account: {
        name: string;
        accountName: string;
        phone: string;
        email: string;
    } | null;
    serviceDetails: {
        name: string;
        consumedFilmAmount: number;
        dueDate: string;
    }[];
}

const OrderDetail = ({ order, zizeom, account, serviceDetails }: OrderDetailProps) => {
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
                                        <p className="mt-1 text-gray-900">{zizeom?.name}</p>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-600">주소</label>
                                        <p className="mt-1 text-gray-900">{zizeom?.address}</p>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-600">연락처</label>
                                        <p className="mt-1 text-gray-900">{zizeom?.phone}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="mt-8 border-t border-gray-200 pt-6">
                            <h2 className="text-lg font-medium text-gray-800 mb-4">시공 상세 정보</h2>
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                시공 유형
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                소모 필름량
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                보증 만료 기간
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {serviceDetails.map((detail, index) => (
                                            <tr key={index}>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                    {detail.name}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                    {detail.consumedFilmAmount}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                    {new Date(detail.dueDate).toLocaleDateString('ko-KR')}
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
                                            <p className="mt-1 text-gray-900">{account?.name}</p>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-600">계정명</label>
                                            <p className="mt-1 text-gray-900">{account?.accountName}</p>
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-600">연락처</label>
                                            <p className="mt-1 text-gray-900">{account?.phone}</p>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-600">이메일</label>
                                            <p className="mt-1 text-gray-900">{account?.email}</p>
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

        console.log('Fetching order with ID:', id);
        const order = await db.collection("orders").findOne({ _id: new ObjectId(id) });
        console.log('Found order:', order);

        if (!order) {
            return {
                notFound: true
            };
        }

        let zizeom = null;
        let account = null;
        let serviceDetails: ServiceDetail[] = [];

        if (order.zizeomId) {
            console.log('Fetching zizeom with ID:', order.zizeomId);
            try {
                zizeom = await db.collection("zizeoms").findOne({ _id: new ObjectId(order.zizeomId) });
            } catch (error) {
                zizeom = await db.collection("zizeoms").findOne({ _id: order.zizeomId });
            }
            console.log('Found zizeom:', zizeom);
        }

        if (order.accountId) {
            console.log('Fetching account with ID:', order.accountId);
            try {
                account = await db.collection("accounts").findOne({ _id: new ObjectId(order.accountId) });
            } catch (error) {
                account = await db.collection("accounts").findOne({ _id: order.accountId });
            }
            console.log('Found account:', account);
        }

        if (order.serviceDetailIds && order.serviceDetailIds.length > 0) {
            console.log('Fetching service details for order ID:', order._id);
            const serviceDetailsResult = await db.collection("serviceDetails")
                .find({ orderId: order._id.toString() })
                .toArray();
            
            serviceDetails = serviceDetailsResult.map(detail => ({
                _id: detail._id.toString(),
                name: detail.name,
                consumedFilmAmount: detail.consumedFilmAmount,
                dueDate: detail.dueDate
            }));
            console.log('Found service details:', serviceDetails);
        }

        return {
            props: {
                order: JSON.parse(JSON.stringify(order)),
                zizeom: zizeom ? JSON.parse(JSON.stringify(zizeom)) : null,
                account: account ? JSON.parse(JSON.stringify(account)) : null,
                serviceDetails: JSON.parse(JSON.stringify(serviceDetails))
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