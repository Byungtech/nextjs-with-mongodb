import { useState } from 'react';
import { useRouter } from 'next/router';
import { GetServerSideProps } from 'next';
import client from '../../../lib/mongodb';

interface OrderInfo {
    _id: string;
    serviceTarget: string;
    serviceDate: string;
    servicePrice: string;
    zizeomId: string;
    accountId: string;
    carNumber: string;
    serviceDetailIds: string[];
    serviceDetails: {
        _id: string;
        name: string;
        consumedFilmAmount: number;
        dueDate: string;
    }[];
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

interface OrderListProps {
    orders: OrderInfo[];
    zizeoms: ZizeomInfo[];
    accounts: AccountInfo[];
}

const OrderList = ({ orders, zizeoms, accounts }: OrderListProps) => {
    const router = useRouter();
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedZizeom, setSelectedZizeom] = useState('');
    const [selectedAccount, setSelectedAccount] = useState('');

    const filteredOrders = orders.filter(order => {
        const matchesSearch = 
            order.serviceTarget.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.carNumber.toLowerCase().includes(searchTerm.toLowerCase());
        
        const matchesZizeom = !selectedZizeom || order.zizeomId === selectedZizeom;
        const matchesAccount = !selectedAccount || order.accountId === selectedAccount;

        return matchesSearch && matchesZizeom && matchesAccount;
    });

    const getZizeomName = (zizeomId: string) => {
        const zizeom = zizeoms.find(z => z._id === zizeomId);
        return zizeom ? zizeom.name : '알 수 없음';
    };

    const getAccountName = (accountId: string) => {
        const account = accounts.find(a => a._id === accountId);
        return account ? account.name : '알 수 없음';
    };

    return (
        <div className="max-w-7xl mx-auto p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-semibold text-gray-800">주문 목록</h1>
                <button
                    onClick={() => router.push('/order/create')}
                    className="px-4 py-2 bg-primary text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                >
                    새 주문 생성
                </button>
            </div>

            <div className="mb-6 space-y-4">
                <div className="flex gap-4">
                    <input
                        type="text"
                        placeholder="서비스 품목 또는 차량 번호로 검색"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                    <select
                        value={selectedZizeom}
                        onChange={(e) => setSelectedZizeom(e.target.value)}
                        className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    >
                        <option value="">모든 지점</option>
                        {zizeoms.map(zizeom => (
                            <option key={zizeom._id} value={zizeom._id}>
                                {zizeom.name}
                            </option>
                        ))}
                    </select>
                    <select
                        value={selectedAccount}
                        onChange={(e) => setSelectedAccount(e.target.value)}
                        className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    >
                        <option value="">모든 계정</option>
                        {accounts.map(account => (
                            <option key={account._id} value={account._id}>
                                {account.name}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="bg-white shadow-md rounded-lg overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                서비스 품목
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                시공 일자
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                시공 금액
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                지점
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                계정
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                차량 번호
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {filteredOrders.map((order) => (
                            <tr
                                key={order._id}
                                onClick={() => router.push(`/order/read/single?id=${order._id}`)}
                                className="hover:bg-gray-50 cursor-pointer"
                            >
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                    {order.serviceTarget}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                    {order.serviceDate}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                    {Number(order.servicePrice).toLocaleString()}원
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                    {getZizeomName(order.zizeomId)}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                    {getAccountName(order.accountId)}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                    {order.carNumber}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export const getServerSideProps: GetServerSideProps = async () => {
    try {
        await client.connect();
        const db = client.db("main");

        const [orders, zizeoms, accounts] = await Promise.all([
            db.collection("orders").find({}).toArray(),
            db.collection("zizeoms").find({}).toArray(),
            db.collection("accounts").find({}).toArray()
        ]);

        return {
            props: {
                orders: JSON.parse(JSON.stringify(orders)),
                zizeoms: JSON.parse(JSON.stringify(zizeoms)),
                accounts: JSON.parse(JSON.stringify(accounts))
            }
        };
    } catch (error) {
        console.error('Error:', error);
        return {
            props: {
                orders: [],
                zizeoms: [],
                accounts: []
            }
        };
    }
};

export default OrderList;
