import { useState } from 'react';
import { useRouter } from 'next/router';
import { GetServerSideProps } from 'next';
import client from '../../lib/mongodb';

interface AccountInfo {
    _id: string;
    name: string;
    accountName: string;
    accountType: string;
}

interface CreateZizeomProps {
    accounts: AccountInfo[];
}

const CreateZizeom = ({ accounts }: CreateZizeomProps) => {
    const router = useRouter();
    const [formData, setFormData] = useState({
        name: '',
        address: '',
        phone: '',
        ownFilmAmount: 0,
        consumedFilmAmount: 0,
        accountId: ''
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await fetch('/api/zizeom/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                router.push('/zizeom/read/multiple');
            } else {
                console.error('Failed to create zizeom');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'ownFilmAmount' || name === 'consumedFilmAmount' ? Number(value) : value
        }));
    };

    return (
        <div className="max-w-4xl mx-auto p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-semibold text-gray-800">새 지점 생성</h1>
                <button
                    onClick={() => router.back()}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800 focus:outline-none"
                >
                    ← 뒤로 가기
                </button>
            </div>

            <div className="bg-white shadow-md rounded-lg overflow-hidden">
                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    <div className="grid grid-cols-2 gap-6">
                        <div>
                            <h2 className="text-lg font-medium text-gray-800 mb-4">기본 정보</h2>
                            <div className="space-y-4">
                                <div>
                                    <label htmlFor="name" className="block text-sm font-medium text-gray-600">
                                        지점명
                                    </label>
                                    <input
                                        type="text"
                                        id="name"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        required
                                        className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="address" className="block text-sm font-medium text-gray-600">
                                        주소
                                    </label>
                                    <input
                                        type="text"
                                        id="address"
                                        name="address"
                                        value={formData.address}
                                        onChange={handleChange}
                                        required
                                        className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="phone" className="block text-sm font-medium text-gray-600">
                                        연락처
                                    </label>
                                    <input
                                        type="tel"
                                        id="phone"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        required
                                        className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                                    />
                                </div>
                            </div>
                        </div>

                        <div>
                            <h2 className="text-lg font-medium text-gray-800 mb-4">추가 정보</h2>
                            <div className="space-y-4">
                                <div>
                                    <label htmlFor="ownFilmAmount" className="block text-sm font-medium text-gray-600">
                                        보유 필름량
                                    </label>
                                    <input
                                        type="number"
                                        id="ownFilmAmount"
                                        name="ownFilmAmount"
                                        value={formData.ownFilmAmount}
                                        onChange={handleChange}
                                        required
                                        min="0"
                                        className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="consumedFilmAmount" className="block text-sm font-medium text-gray-600">
                                        소모 필름량
                                    </label>
                                    <input
                                        type="number"
                                        id="consumedFilmAmount"
                                        name="consumedFilmAmount"
                                        value={formData.consumedFilmAmount}
                                        onChange={handleChange}
                                        required
                                        min="0"
                                        className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="accountId" className="block text-sm font-medium text-gray-600">
                                        대표자
                                    </label>
                                    <select
                                        id="accountId"
                                        name="accountId"
                                        value={formData.accountId}
                                        onChange={handleChange}
                                        required
                                        className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                                    >
                                        <option value="">대표자 선택</option>
                                        {accounts.map(account => (
                                            <option key={account._id} value={account._id}>
                                                {account.name} ({account.accountName})
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
                        <button
                            type="button"
                            onClick={() => router.back()}
                            className="px-4 py-2 text-gray-600 hover:text-gray-800 focus:outline-none"
                        >
                            취소
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-primary text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                        >
                            생성
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export const getServerSideProps: GetServerSideProps = async () => {
    try {
        await client.connect();
        const db = client.db("main");
        const accounts = await db.collection("accounts").find({}).toArray();

        return {
            props: {
                accounts: JSON.parse(JSON.stringify(accounts))
            }
        };
    } catch (error) {
        console.error('Error:', error);
        return {
            props: {
                accounts: []
            }
        };
    }
};

export default CreateZizeom;