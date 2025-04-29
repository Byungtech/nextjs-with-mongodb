import { NextApiRequest, NextApiResponse } from 'next';
import client from '../../../lib/mongodb';

interface AccountInfo {
    accountName: string;
    accountType: 'buyer' | 'seller' | 'admin';
    name: string;
    email: string;
    password: string;
    phone: string;
    address: string;
    carName: string;
    carNumber: string;
    carDaeNumber: string;
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    try {
        const db = client.db("main");
        const accountData: AccountInfo = req.body;

        // 필수 필드 검증
        const requiredFields = ['accountName', 'accountType', 'name', 'email', 'password', 'phone', 'address'];
        for (const field of requiredFields) {
            if (!accountData[field as keyof AccountInfo]) {
                return res.status(400).json({ message: `${field} is required` });
            }
        }

        // 이메일 중복 검사
        const existingAccount = await db.collection('accounts').findOne({
            email: accountData.email
        });

        if (existingAccount) {
            return res.status(400).json({ message: 'Email already exists' });
        }

        // 계정 정보 저장
        const accountCollection = db.collection('accounts');
        const account = {
            ...accountData,
            createdAt: new Date(),
            updatedAt: new Date()
        };

        const result = await accountCollection.insertOne(account);

        res.status(201).json({
            message: 'Account created successfully',
            accountId: result.insertedId
        });
    } catch (error) {
        console.error('Error creating account:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
} 