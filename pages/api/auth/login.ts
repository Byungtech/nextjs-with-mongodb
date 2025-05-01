import { NextApiRequest, NextApiResponse } from 'next';
import client from '../../../lib/mongodb';
import { ObjectId } from 'mongodb';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    try {
        const { accountName, password } = req.body;

        if (!accountName || !password) {
            return res.status(400).json({ message: '아이디와 비밀번호를 입력해주세요.' });
        }

        const db = client.db("main");

        const user = await db.collection('accounts').findOne({
            accountName,
            password // 실제 구현에서는 비밀번호 해싱 필요
        });

        if (!user) {
            return res.status(401).json({ message: '아이디 또는 비밀번호가 일치하지 않습니다.' });
        }

        // 비밀번호를 제외한 사용자 정보 반환
        const { password: _, ...userWithoutPassword } = user;

        res.status(200).json({
            message: '로그인 성공',
            user: userWithoutPassword
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: '서버 오류가 발생했습니다.' });
    }
} 