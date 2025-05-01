import { useRouter } from 'next/router';
import { GetServerSideProps } from 'next';
import client from '../../../lib/mongodb';
import { ObjectId } from 'mongodb';

interface AccountInfo {
    _id: string;
    name: string;
    accountName: string;
    accountType: string;
    email: string;
    phone: string;
    address: string;
    carName?: string;
    carNumber?: string;
    carDaeNumber?: string;
}

interface AccountDetailProps {
    account: AccountInfo;
}

const AccountDetail = ({ account }: AccountDetailProps) => {
    const router = useRouter();

    return (
        <div className="max-w-4xl mx-auto p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-semibold text-gray-800">계정 상세 정보</h1>
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
                                    <label className="block text-sm font-medium text-gray-600">이름</label>
                                    <p className="mt-1 text-gray-900">{account.name}</p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-600">계정명</label>
                                    <p className="mt-1 text-gray-900">{account.accountName}</p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-600">계정 유형</label>
                                    <p className="mt-1 text-gray-900">{account.accountType}</p>
                                </div>
                            </div>
                        </div>

                        <div>
                            <h2 className="text-lg font-medium text-gray-800 mb-4">연락처 정보</h2>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-600">이메일</label>
                                    <p className="mt-1 text-gray-900">{account.email}</p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-600">연락처</label>
                                    <p className="mt-1 text-gray-900">{account.phone}</p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-600">주소</label>
                                    <p className="mt-1 text-gray-900">{account.address}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {account.carNumber && (
                        <div className="border-t border-gray-200 pt-6">
                            <h2 className="text-lg font-medium text-gray-800 mb-4">차량 정보</h2>
                            <div className="grid grid-cols-2 gap-6">
                                <div>
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-600">차량명</label>
                                            <p className="mt-1 text-gray-900">{account.carName}</p>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-600">차량 번호</label>
                                            <p className="mt-1 text-gray-900">{account.carNumber}</p>
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-600">차대 번호</label>
                                            <p className="mt-1 text-gray-900">{account.carDaeNumber}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
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

        const account = await db.collection("accounts").findOne({ _id: new ObjectId(id) });
        if (!account) {
            return {
                notFound: true
            };
        }

        return {
            props: {
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

export default AccountDetail; 