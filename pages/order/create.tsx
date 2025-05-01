import { useState } from 'react';
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
        <div className="max-w-3xl mx-auto p-6">
            <h1 className="text-2xl font-semibold text-gray-800 mb-6 pb-4 border-b border-gray-200">
                새 주문 생성
            </h1>
            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            서비스 품목
                        </label>
                        <input
                            type="text"
                            name="serviceTarget"
                            value={orderInfo.serviceTarget}
                            onChange={handleOrderChange}
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            시공 일자
                        </label>
                        <input
                            type="date"
                            name="serviceDate"
                            value={orderInfo.serviceDate}
                            onChange={handleOrderChange}
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            시공 금액
                        </label>
                        <input
                            type="text"
                            name="servicePrice"
                            value={orderInfo.servicePrice}
                            onChange={handleOrderChange}
                            required
                            placeholder="숫자만 입력하세요"
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            지점
                        </label>
                        <select
                            name="zizeomId"
                            value={orderInfo.zizeomId}
                            onChange={handleOrderChange}
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                        >
                            <option value="">지점을 선택하세요</option>
                            {zizeoms.map(zizeom => (
                                <option key={zizeom._id} value={zizeom._id}>
                                    {zizeom.name} ({zizeom.address})
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            계정
                        </label>
                        <select
                            name="accountId"
                            value={orderInfo.accountId}
                            onChange={handleOrderChange}
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                        >
                            <option value="">계정을 선택하세요</option>
                            {sellerAccounts.map(account => (
                                <option key={account._id} value={account._id}>
                                    {account.name} ({account.accountName})
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            차량 번호
                        </label>
                        <input
                            type="text"
                            name="carNumber"
                            value={orderInfo.carNumber}
                            onChange={handleOrderChange}
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                        />
                    </div>
                </div>

                <div className="border border-gray-200 rounded-lg p-6 mt-8">
                    <h2 className="text-lg font-medium text-gray-800 mb-4">시공 상세 정보</h2>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                시공 부위
                            </label>
                            <input
                                type="text"
                                name="name"
                                value={serviceDetail.name}
                                onChange={handleServiceDetailChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                소모 필름량
                            </label>
                            <input
                                type="number"
                                name="consumedFilmAmount"
                                value={serviceDetail.consumedFilmAmount}
                                onChange={handleServiceDetailChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                보증 기간
                            </label>
                            <input
                                type="date"
                                name="dueDate"
                                value={serviceDetail.dueDate}
                                onChange={handleServiceDetailChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                            />
                        </div>

                        <button
                            type="button"
                            onClick={addServiceDetail}
                            className="w-full px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                        >
                            시공 상세 정보 추가
                        </button>
                    </div>

                    {orderInfo.serviceDetails && orderInfo.serviceDetails.length > 0 && (
                        <div className="mt-6 space-y-4">
                            {orderInfo.serviceDetails.map((detail, index) => (
                                <div
                                    key={index}
                                    className="p-4 border border-gray-200 rounded-md bg-gray-50"
                                >
                                    <p className="font-medium">시공 부위: {detail.name}</p>
                                    <p>소모 필름량: {detail.consumedFilmAmount}</p>
                                    <p>보증 기간: {detail.dueDate}</p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <button
                    type="submit"
                    className="w-full px-4 py-2 bg-primary text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                >
                    주문 생성
                </button>
            </form>
        </div>
    );
};

export const getServerSideProps: GetServerSideProps = async () => {
    try {
        await client.connect();
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
    } catch (error) {
        console.error('Error:', error);
        return {
            props: {
                zizeoms: [],
                accounts: []
            }
        };
    }
};

export default OrderForm;