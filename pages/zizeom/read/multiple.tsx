import client from "../../../lib/mongodb";
import { GetServerSideProps } from 'next';
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
    name: string; // 지점 이름
    address: string; // 지점 주소
    phone: string; // 지점 번호
    ownFilmAmount: number; // 필름 얼마나 가지고 있는지
    consumedFilmAmount: number; // todo: 보증서에 얼마만큼 썼는지의 총합
    accountId: string; // 대표자 이름
    accountInfos: AccountInfo[];
}

interface ZizeomsProps {
    zizeoms: ZizeomInfo[];
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

const ZizeomList = styled.ul`
    list-style: none;
    padding: 0;
`;

const ZizeomItem = styled.li`
    margin-bottom: 20px;
    padding: 15px;
    background-color: #fff;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    transition: all 0.3s ease;
    cursor: pointer;

    &:hover {
        transform: translateY(-5px);
        box-shadow: 0 4px 8px rgba(0,0,0,0.2);
    }
`;

const ZizeomTitle = styled.h3`
    font-size: 18px;
    color: #444;
    margin-bottom: 10px;
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

const ZizeomListComponent = ({ zizeoms }: ZizeomsProps) => {
    return (
        <Container>
            <Title>지점 목록</Title>
            <ZizeomList>
                {zizeoms.map((zizeom) => (
                    <ZizeomItem key={zizeom._id}>
                        <ZizeomTitle>지점 정보</ZizeomTitle>
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
                    </ZizeomItem>
                ))}
            </ZizeomList>
        </Container>
    );
};

export default ZizeomListComponent;

export const getServerSideProps: GetServerSideProps = async () => {
    try {
        const db = client.db("main");
        const zizeoms = await db
            .collection("zizeoms")
            .find({})
            .toArray();

        return {
            props: { zizeoms: JSON.parse(JSON.stringify(zizeoms)) },
        };
    } catch (e) {
        console.error(e);
        return { props: { zizeoms: [] } };
    }
};