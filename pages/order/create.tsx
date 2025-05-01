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
    phone: string;
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
    price: number;
    serviceDetailIds: string[];
    serviceDetails: ServiceDetailInfo[];
}

interface CreateOrderProps {
    zizeoms: ZizeomInfo[];
    accounts: AccountInfo[];
}

interface FormData {
    zizeomId: string;
    accountId: string;
    orderDate: string;
    totalAmount: number;
    status: string;
    serviceTarget: string;
    serviceDate: string;
    servicePrice: string;
    carNumber: string;
    serviceDetails: {
        name: string;
        consumedFilmAmount: number;
        dueDate: string;
    }[];
}

const OrderForm = ({ zizeoms, accounts }: CreateOrderProps) => {
    const router = useRouter();
    const [formData, setFormData] = useState<FormData>({
        zizeomId: '',
        accountId: '',
        orderDate: new Date().toISOString().split('T')[0],
        totalAmount: 0,
        status: 'pending',
        serviceTarget: '',
        serviceDate: '',
        servicePrice: '',
        carNumber: '',
        serviceDetails: [
            { name: '', consumedFilmAmount: 1, dueDate: '' },
            { name: '', consumedFilmAmount: 1, dueDate: '' }
        ]
    });

    // 구매자 계정만 필터링
    const buyerAccounts = accounts.filter(account => account.accountType === 'buyer');

    const handleOrderChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        
        if (name === 'servicePrice') {
            const numericValue = value.replace(/[^0-9]/g, '');
            const formattedValue = numericValue ? Number(numericValue).toLocaleString() : '';
            setFormData(prev => ({
                ...prev,
                [name]: formattedValue
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: value
            }));
        }
    };

    const handleServiceDetailChange = (index: number, field: string, value: string | number) => {
        setFormData(prev => ({
            ...prev,
            serviceDetails: prev.serviceDetails.map((detail, i) =>
                i === index ? { ...detail, [field]: value } : detail
            )
        }));
    };

    const removeServiceDetail = (index: number) => {
        setFormData(prev => ({
            ...prev,
            serviceDetails: prev.serviceDetails.filter((_, i) => i !== index)
        }));
    };

    const addServiceDetail = () => {
        setFormData(prev => ({
            ...prev,
            serviceDetails: [...prev.serviceDetails, { name: '', consumedFilmAmount: 1, dueDate: '' }]
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // 시공 상세정보 유효성 검사
        const hasEmptyDetails = formData.serviceDetails.some(detail => 
            !detail.name || !detail.consumedFilmAmount || !detail.dueDate
        );

        if (hasEmptyDetails) {
            alert('모든 시공 상세정보를 입력해주세요.');
            return;
        }

        try {
            const orderData = {
                ...formData,
                servicePrice: formData.servicePrice?.replace(/,/g, '')
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
        <div className="max-w-4xl mx-auto p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-semibold text-gray-800">주문 생성</h1>
                <button
                    onClick={() => router.back()}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800 focus:outline-none"
                >
                    ← 뒤로 가기
                </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            서비스 품목
                        </label>
                        <input
                            type="text"
                            name="serviceTarget"
                            value={formData.serviceTarget}
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
                            value={formData.serviceDate}
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
                            value={formData.servicePrice}
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
                            value={formData.zizeomId}
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
                            구매자 이름
                        </label>
                        <select
                            name="accountId"
                            value={formData.accountId}
                            onChange={handleOrderChange}
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                        >
                            <option value="">구매자를 선택하세요</option>
                            {buyerAccounts.map(account => (
                                <option key={account._id} value={account._id}>
                                    {account.name} ({account.phone})
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
                            value={formData.carNumber}
                            onChange={handleOrderChange}
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                        />
                    </div>
                </div>

                <div>
                    <h2 className="text-lg font-medium text-gray-800 mb-4">시공 상세 정보</h2>
                    <div className="space-y-4">
                        {formData.serviceDetails.map((detail, index) => (
                            <div key={index} className="relative group">
                                <div className="grid grid-cols-3 gap-4 p-4 bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-600 mb-1">시공 유형</label>
                                        <input
                                            type="text"
                                            name={`name-${index}`}
                                            value={detail.name}
                                            onChange={(e) => handleServiceDetailChange(index, 'name', e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors duration-200"
                                            placeholder="시공 유형을 입력하세요"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-600 mb-1">소모 필름량</label>
                                        <input
                                            type="number"
                                            name={`consumedFilmAmount-${index}`}
                                            value={detail.consumedFilmAmount}
                                            onChange={(e) => handleServiceDetailChange(index, 'consumedFilmAmount', parseInt(e.target.value))}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors duration-200"
                                            min="1"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-600 mb-1">보증 만료 기간</label>
                                        <input
                                            type="date"
                                            name={`dueDate-${index}`}
                                            value={detail.dueDate}
                                            onChange={(e) => handleServiceDetailChange(index, 'dueDate', e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors duration-200"
                                            required
                                        />
                                    </div>
                                    {formData.serviceDetails.length > 1 && (
                                        <button
                                            type="button"
                                            onClick={() => removeServiceDetail(index)}
                                            className="absolute -right-2 -top-2 p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors duration-200"
                                            title="삭제"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                            </svg>
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="mt-4">
                        <button
                            type="button"
                            onClick={addServiceDetail}
                            className="inline-flex items-center px-4 py-2 bg-white border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-colors duration-200"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                            </svg>
                            시공 상세 정보 추가
                        </button>
                    </div>
                </div>

                <div className="flex justify-end">
                    <button
                        type="submit"
                        className="px-4 py-2 bg-primary text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                    >
                        주문 생성
                    </button>
                </div>
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