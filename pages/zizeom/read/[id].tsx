import client from "../../../lib/mongodb";
import { GetServerSideProps } from 'next';
import { ObjectId } from 'mongodb';
import styled from 'styled-components';

interface AccountInfo {
    _id: string;
    accountName: string;
    accountType: 'buyer' | 'seller' | 'admin';
    name: string;
    email: string;
    phone: string;
    address: string;
    carName: string;
    carNumber: string;
    carDaeNumber: string;
}

interface ZizeomInfo {
    _id: string;
    name: string;
    address: string;
    phone: string;
    ownFilmAmount: number;
    consumedFilmAmount: number;
    accountId: string;
    accountInfo: AccountInfo;
}

interface ZizeomProps {
    zizeom: ZizeomInfo;
}

const Container = styled.div`
    max-width: 800px;
    margin: 0 auto;
    padding: 20px;
`;

const Title = styled.h1`
    font-size: 24px;
    color: #333;
    margin-bottom: 20px;
    border-bottom: 2px solid #eee;
    padding-bottom: 10px;
`;

const InfoSection = styled.div`
    background-color: #fff;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    padding: 20px;
    margin-bottom: 20px;
`;

const SectionTitle = styled.h2`
    font-size: 20px;
    color: #444;
    margin-bottom: 15px;
`;

const InfoList = styled.ul`
    list-style: none;
    padding: 0;
    margin: 0;
`;

const InfoItem = styled.li`
    padding: 8px 0;
    border-bottom: 1px solid #eee;
    display: flex;
    justify-content: space-between;
    transition: background-color 0.2s ease;

    &:last-child {
        border-bottom: none;
    }
`;

const Label = styled.span`
    color: #666;
`;

const Value = styled.span`
    font-weight: bold;
`;

const ZizeomDetail = ({ zizeom }: ZizeomProps) => {
    return (
        <Container>
            <Title>지점 상세 정보</Title>
            
            <InfoSection>
                <SectionTitle>기본 정보</SectionTitle>
                <InfoList>
                    <InfoItem>
                        <Label>지점 이름:</Label>
                        <Value>{zizeom.name}</Value>
                    </InfoItem>
                    <InfoItem>
                        <Label>주소:</Label>
                        <Value>{zizeom.address}</Value>
                    </InfoItem>
                    <InfoItem>
                        <Label>전화번호:</Label>
                        <Value>{zizeom.phone}</Value>
                    </InfoItem>
                    <InfoItem>
                        <Label>보유 필름량:</Label>
                        <Value>{zizeom.ownFilmAmount}</Value>
                    </InfoItem>
                    <InfoItem>
                        <Label>사용 필름량:</Label>
                        <Value>{zizeom.consumedFilmAmount}</Value>
                    </InfoItem>
                </InfoList>
            </InfoSection>

            <InfoSection>
                <SectionTitle>대표자 정보</SectionTitle>
                <InfoList>
                    <InfoItem>
                        <Label>이름:</Label>
                        <Value>{zizeom.accountInfo.name}</Value>
                    </InfoItem>
                    <InfoItem>
                        <Label>이메일:</Label>
                        <Value>{zizeom.accountInfo.email}</Value>
                    </InfoItem>
                    <InfoItem>
                        <Label>전화번호:</Label>
                        <Value>{zizeom.accountInfo.phone}</Value>
                    </InfoItem>
                    <InfoItem>
                        <Label>주소:</Label>
                        <Value>{zizeom.accountInfo.address}</Value>
                    </InfoItem>
                </InfoList>
            </InfoSection>
        </Container>
    );
};

export default ZizeomDetail;

export const getServerSideProps: GetServerSideProps = async (context) => {
    try {
        const { id } = context.params as { id: string };
        const db = client.db("main");

        const zizeom = await db
            .collection("zizeoms")
            .aggregate([
                {
                    $match: {
                        _id: new ObjectId(id)
                    }
                },
                {
                    $lookup: {
                        from: "accounts",
                        localField: "accountId",
                        foreignField: "_id",
                        as: "accountInfo"
                    }
                },
                {
                    $addFields: {
                        accountInfo: { $arrayElemAt: ["$accountInfo", 0] }
                    }
                }
            ])
            .toArray();

        if (!zizeom.length) {
            return {
                notFound: true
            };
        }

        return {
            props: { zizeom: JSON.parse(JSON.stringify(zizeom[0])) },
        };
    } catch (e) {
        console.error(e);
        return { notFound: true };
    }
}; 