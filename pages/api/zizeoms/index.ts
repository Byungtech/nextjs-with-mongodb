import { NextApiRequest, NextApiResponse } from 'next';
import client from '../../../lib/mongodb';
import { ObjectId } from 'mongodb';

interface ZizeomInfo {
    name: string;
    address: string;
    phone: string;
    ownFilmAmount: number;
    consumedFilmAmount: number;
    accountId: string;
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
        const zizeomData: ZizeomInfo = req.body;

        // 필수 필드 검증
        const requiredFields = ['name', 'address', 'phone', 'ownFilmAmount', 'consumedFilmAmount', 'accountId'];
        for (const field of requiredFields) {
            if (!zizeomData[field as keyof ZizeomInfo]) {
                return res.status(400).json({ message: `${field} is required` });
            }
        }

        // accountId가 유효한지 확인
        const account = await db.collection('accounts').findOne({
            _id: new ObjectId(zizeomData.accountId)
        });

        if (!account) {
            return res.status(400).json({ message: 'Invalid account ID' });
        }

        // 지점 정보 저장
        const zizeomCollection = db.collection('zizeoms');
        const zizeom = {
            ...zizeomData,
            createdAt: new Date(),
            updatedAt: new Date()
        };

        const result = await zizeomCollection.insertOne(zizeom);

        res.status(201).json({
            message: 'Zizeom created successfully',
            zizeomId: result.insertedId
        });
    } catch (error) {
        console.error('Error creating zizeom:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
} 