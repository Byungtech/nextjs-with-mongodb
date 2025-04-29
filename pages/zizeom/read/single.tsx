import { GetServerSideProps } from 'next';
import styled from 'styled-components';

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

interface SingleZizeomProps {
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

const ZizeomInfo = styled.div`
    background-color: #fff;
    border-radius: 8px;
    padding: 20px;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
`;

const InfoItem = styled.div`
    margin-bottom: 15px;
    display: flex;
    justify-content: space-between;
    padding: 10px 0;
    border-bottom: 1px solid #eee;

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

const SingleZizeomPage = ({ zizeom }: SingleZizeomProps) => {
    return (
        <Container>
            <Title>지점 상세 정보</Title>
            <ZizeomInfo>
                <InfoItem>
                    <Label>지점명:</Label>
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
                    <Label>보유 필름 수량:</Label>
                    <Value>{zizeom.ownFilmAmount}</Value>
                </InfoItem>
                <InfoItem>
                    <Label>소비된 필름 수량:</Label>
                    <Value>{zizeom.consumedFilmAmount}</Value>
                </InfoItem>
            </ZizeomInfo>
        </Container>
    );
};

export default SingleZizeomPage;

export const getServerSideProps: GetServerSideProps = async (context) => {
    const { id } = context.query;
    
    try {
        const db = (await import('../../../lib/mongodb')).default.db("main");
        const zizeom = await db
            .collection("zizeoms")
            .findOne({ _id: id });

        if (!zizeom) {
            return {
                notFound: true
            };
        }

        return {
            props: {
                zizeom: JSON.parse(JSON.stringify(zizeom))
            }
        };
    } catch (e) {
        console.error(e);
        return {
            notFound: true
        };
    }
};