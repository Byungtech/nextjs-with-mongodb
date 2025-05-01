import { useRouter } from 'next/router';
import { GetServerSideProps } from 'next';
import client from '../../../lib/mongodb';

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

interface ZizeomDetailProps {
    zizeom: ZizeomInfo;
    account: AccountInfo;
}

const ZizeomDetail = ({ zizeom, account }: ZizeomDetailProps) => {
    const router = useRouter();

    return (
        <div className="max-w-4xl mx-auto p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-semibold text-gray-800">지점 상세 정보</h1>
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
                                    <label className="block text-sm font-medium text-gray-600">지점명</label>
                                    <p className="mt-1 text-gray-900">{zizeom.name}</p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-600">주소</label>
                                    <p className="mt-1 text-gray-900">{zizeom.address}</p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-600">연락처</label>
                                    <p className="mt-1 text-gray-900">{zizeom.phone}</p>
                                </div>
                            </div>
                        </div>

                        <div>
                            <h2 className="text-lg font-medium text-gray-800 mb-4">필름 정보</h2>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-600">보유 필름량</label>
                                    <p className="mt-1 text-gray-900">{zizeom.ownFilmAmount}</p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-600">소모 필름량</label>
                                    <p className="mt-1 text-gray-900">{zizeom.consumedFilmAmount}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="border-t border-gray-200 pt-6">
                        <h2 className="text-lg font-medium text-gray-800 mb-4">대표자 정보</h2>
                        <div className="grid grid-cols-2 gap-6">
                            <div>
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
                                        <label className="block text-sm font-medium text-gray-600">이메일</label>
                                        <p className="mt-1 text-gray-900">{account.email}</p>
                                    </div>
                                </div>
                            </div>
                            <div>
                                <div className="space-y-4">
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
                    </div>
                </div>
            </div>
        </div>
    );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
    try {
        const { id } = context.query;
        if (!id) {
            return {
                notFound: true
            };
        }

        await client.connect();
        const db = client.db("main");

        const zizeom = await db.collection("zizeoms").findOne({ _id: id });
        if (!zizeom) {
            return {
                notFound: true
            };
        }

        const account = await db.collection("accounts").findOne({ _id: zizeom.accountId });

        return {
            props: {
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

export default ZizeomDetail;