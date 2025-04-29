import { NextApiRequest, NextApiResponse } from 'next';
import client from '../../../lib/mongodb';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method !== 'GET') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    try {
        const db = client.db("main");
        const accounts = await db
            .collection("accounts")
            .find({})
            .toArray();

        res.status(200).json(accounts);
    } catch (error) {
        console.error('Error fetching accounts:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
} 