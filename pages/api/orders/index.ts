import { NextApiRequest, NextApiResponse } from 'next';
import client from '../../../lib/mongodb';
import { ObjectId } from 'mongodb';

interface ServiceDetailInfo {
    name: string;
    consumedFilmAmount: number;
    dueDate: string;
}

interface OrderInfo {
    serviceTarget: string;
    serviceDate: string;
    servicePrice: string;
    zizeomId: string;
    accountId: string;
    carNumber: string;
    serviceDetails: ServiceDetailInfo[];
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
        const orderData: OrderInfo = req.body;

        // 필수 필드 검증
        const requiredFields = ['serviceTarget', 'serviceDate', 'servicePrice', 'zizeomId', 'accountId', 'carNumber', 'serviceDetails'];
        for (const field of requiredFields) {
            if (!orderData[field as keyof OrderInfo]) {
                return res.status(400).json({ message: `${field} is required` });
            }
        }

        // 시공 상세 정보의 수량 합산 계산
        const totalQuantity = orderData.serviceDetails.reduce((sum, detail) => sum + detail.consumedFilmAmount, 0);

        // 서비스 상세 정보 처리
        let serviceDetailIds: string[] = [];
        if (orderData.serviceDetails && orderData.serviceDetails.length > 0) {
            // 서비스 상세 정보 저장
            const serviceDetailsCollection = db.collection('serviceDetails');
            const serviceDetails = orderData.serviceDetails.map(detail => ({
                name: detail.name,
                consumedFilmAmount: detail.consumedFilmAmount,
                dueDate: detail.dueDate,
                zizeomId: orderData.zizeomId
            }));

            const result = await serviceDetailsCollection.insertMany(serviceDetails);
            serviceDetailIds = Object.values(result.insertedIds).map(id => id.toString());
        }

        // 주문 정보 저장
        const orderCollection = db.collection('orders');
        const order = {
            serviceTarget: orderData.serviceTarget,
            serviceDate: orderData.serviceDate,
            servicePrice: orderData.servicePrice,
            zizeomId: orderData.zizeomId,
            accountId: orderData.accountId,
            carNumber: orderData.carNumber,
            serviceDetailIds,
            createdAt: new Date(),
            updatedAt: new Date()
        };

        const orderResult = await orderCollection.insertOne(order);

        // 서비스 상세 정보의 orderId 업데이트
        if (serviceDetailIds.length > 0) {
            await db.collection('serviceDetails').updateMany(
                { _id: { $in: serviceDetailIds.map(id => new ObjectId(id)) } },
                { $set: { orderId: orderResult.insertedId.toString() } }
            );
        }

        // 해당 지점의 consumedField 증가
        await db.collection('zizeoms').updateOne(
            { _id: new ObjectId(orderData.zizeomId) },
            { $inc: { consumedField: totalQuantity } }
        );

        res.status(201).json({
            message: 'Order created successfully',
            orderId: orderResult.insertedId
        });
    } catch (error) {
        console.error('Error creating order:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
} 