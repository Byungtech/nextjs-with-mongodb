import { useState } from 'react';
import { useRouter } from 'next/router';
import { GetServerSideProps } from 'next';
import client from '../../../lib/mongodb';

interface ZizeomInfo {
    _id: string;
    name: string;
    address: string;
    phone: string;
    ownFilmAmount: number;
    consumedFilmAmount: number;
    accountId: string;
}

interface AccountInfo {
    _id: string;
    name: string;
    accountName: string;
    accountType: string;
}

interface ZizeomListProps {
    zizeoms: ZizeomInfo[];
    accounts: AccountInfo[];
}

const ZizeomList = ({ zizeoms, accounts }: ZizeomListProps) => {
    const router = useRouter();
    const [searchTerm, setSearchTerm] = useState('');

    const filteredZizeoms = zizeoms.filter(zizeom =>
        zizeom.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        zizeom.address.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getAccountName = (accountId: string) => {
        const account = accounts.find(a => a._id === accountId);
        return account ? account.name : '알 수 없음';
    };

    return (
        <div className="max-w-7xl mx-auto p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-semibold text-gray-800">지점 목록</h1>
                <button
                    onClick={() => router.push('/zizeom/create')}
                    className="px-4 py-2 bg-primary text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                >
                    새 지점 생성
                </button>
            </div>

            <div className="mb-6">
                <input
                    type="text"
                    placeholder="지점명 또는 주소로 검색"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
            </div>

            <div className="bg-white shadow-md rounded-lg overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                지점명
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                주소
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                연락처
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                보유 필름량
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                소모 필름량
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                대표자
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {filteredZizeoms.map((zizeom) => (
                            <tr
                                key={zizeom._id}
                                onClick={() => router.push(`/zizeom/read/${zizeom._id}`)}
                                className="hover:bg-gray-50 cursor-pointer"
                            >
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                    {zizeom.name}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                    {zizeom.address}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                    {zizeom.phone}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                    {zizeom.ownFilmAmount}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                    {zizeom.consumedFilmAmount}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                    {getAccountName(zizeom.accountId)}
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

export default ZizeomList;