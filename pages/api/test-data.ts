import { NextApiRequest, NextApiResponse } from 'next';
import client from '../../lib/mongodb';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    try {
        const db = client.db("main");

        // 테스트 지점 데이터
        const zizeoms = [
            {
                name: "강남지점",
                address: "서울시 강남구 테헤란로 123",
                phone: "02-1234-5678",
                ownFilmAmount: 1000,
                consumedFilmAmount: 0,
                accountId: "1"
            },
            {
                name: "송파지점",
                address: "서울시 송파구 올림픽로 456",
                phone: "02-2345-6789",
                ownFilmAmount: 800,
                consumedFilmAmount: 0,
                accountId: "2"
            },
            {
                name: "분당지점",
                address: "경기도 성남시 분당구 판교로 789",
                phone: "031-123-4567",
                ownFilmAmount: 1200,
                consumedFilmAmount: 0,
                accountId: "3"
            }
        ];

        // 테스트 계정 데이터
        const accounts = [
            // 관리자 계정
            {
                accountName: "admin",
                accountType: "admin",
                name: "관리자",
                email: "admin@example.com",
                phone: "010-0000-0000",
                address: "서울시 강남구",
                carName: "",
                carNumber: "",
                carDaeNumber: ""
            },
            // 판매자 계정
            {
                accountName: "seller1",
                accountType: "seller",
                name: "판매자1",
                email: "seller1@example.com",
                phone: "010-1111-1111",
                address: "서울시 강남구",
                carName: "",
                carNumber: "",
                carDaeNumber: ""
            },
            {
                accountName: "seller2",
                accountType: "seller",
                name: "판매자2",
                email: "seller2@example.com",
                phone: "010-2222-2222",
                address: "서울시 송파구",
                carName: "",
                carNumber: "",
                carDaeNumber: ""
            },
            {
                accountName: "seller3",
                accountType: "seller",
                name: "판매자3",
                email: "seller3@example.com",
                phone: "010-3333-3333",
                address: "경기도 성남시",
                carName: "",
                carNumber: "",
                carDaeNumber: ""
            },
            {
                accountName: "seller4",
                accountType: "seller",
                name: "판매자4",
                email: "seller4@example.com",
                phone: "010-4444-4444",
                address: "서울시 강남구",
                carName: "",
                carNumber: "",
                carDaeNumber: ""
            },
            {
                accountName: "seller5",
                accountType: "seller",
                name: "판매자5",
                email: "seller5@example.com",
                phone: "010-5555-5555",
                address: "서울시 송파구",
                carName: "",
                carNumber: "",
                carDaeNumber: ""
            },
            {
                accountName: "seller6",
                accountType: "seller",
                name: "판매자6",
                email: "seller6@example.com",
                phone: "010-6666-6666",
                address: "경기도 성남시",
                carName: "",
                carNumber: "",
                carDaeNumber: ""
            },
            // 구매자 계정
            {
                accountName: "user1",
                accountType: "buyer",
                name: "홍길동",
                email: "user1@example.com",
                phone: "010-1234-5678",
                address: "서울시 강남구",
                carName: "현대 아반떼",
                carNumber: "12가 3456",
                carDaeNumber: "KMHXX00XXXX000000"
            },
            {
                accountName: "user2",
                accountType: "buyer",
                name: "김철수",
                email: "user2@example.com",
                phone: "010-2345-6789",
                address: "서울시 송파구",
                carName: "기아 K5",
                carNumber: "34나 5678",
                carDaeNumber: "KNAXX00XXXX000000"
            },
            {
                accountName: "user3",
                accountType: "buyer",
                name: "이영희",
                email: "user3@example.com",
                phone: "010-3456-7890",
                address: "경기도 성남시",
                carName: "쌍용 티볼리",
                carNumber: "56다 7890",
                carDaeNumber: "KNAXX00XXXX000001"
            }
        ];

        // 기존 데이터 삭제
        await db.collection("zizeoms").deleteMany({});
        await db.collection("accounts").deleteMany({});

        // 새 데이터 추가
        const zizeomResult = await db.collection("zizeoms").insertMany(zizeoms);
        const accountResult = await db.collection("accounts").insertMany(accounts);

        res.status(200).json({
            message: "Test data added successfully",
            zizeoms: zizeomResult,
            accounts: accountResult
        });
    } catch (error) {
        console.error('Error adding test data:', error);
        res.status(500).json({ message: 'Error adding test data' });
    }
} 