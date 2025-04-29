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
    carName?: string;
    carNumber?: string;
    carDaeNumber?: string;
}

interface SingleAccountProps {
    account: AccountInfo;
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

const AccountInfo = styled.div`
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

const AccountTypeBadge = styled.span<{ type: 'buyer' | 'seller' | 'admin' }>`
    padding: 4px 8px;
    border-radius: 4px;
    font-size: 12px;
    font-weight: bold;
    background-color: ${props => {
        switch (props.type) {
            case 'buyer': return '#e3f2fd';
            case 'seller': return '#e8f5e9';
            case 'admin': return '#fce4ec';
            default: return '#f5f5f5';
        }
    }};
    color: ${props => {
        switch (props.type) {
            case 'buyer': return '#1976d2';
            case 'seller': return '#2e7d32';
            case 'admin': return '#c2185b';
            default: return '#757575';
        }
    }};
`;

const SingleAccountPage = ({ account }: SingleAccountProps) => {
    return (
        <Container>
            <Title>계정 상세 정보</Title>
            <AccountInfo>
                <InfoItem>
                    <Label>이름:</Label>
                    <Value>{account.name}</Value>
                </InfoItem>
                <InfoItem>
                    <Label>계정명:</Label>
                    <Value>{account.accountName}</Value>
                </InfoItem>
                <InfoItem>
                    <Label>계정 유형:</Label>
                    <Value>
                        <AccountTypeBadge type={account.accountType}>
                            {account.accountType === 'buyer' ? '구매자' : 
                             account.accountType === 'seller' ? '판매자' : '관리자'}
                        </AccountTypeBadge>
                    </Value>
                </InfoItem>
                <InfoItem>
                    <Label>이메일:</Label>
                    <Value>{account.email}</Value>
                </InfoItem>
                <InfoItem>
                    <Label>전화번호:</Label>
                    <Value>{account.phone}</Value>
                </InfoItem>
                <InfoItem>
                    <Label>주소:</Label>
                    <Value>{account.address}</Value>
                </InfoItem>
                {account.carNumber && (
                    <InfoItem>
                        <Label>차량 정보:</Label>
                        <Value>{account.carName} ({account.carNumber})</Value>
                    </InfoItem>
                )}
            </AccountInfo>
        </Container>
    );
};

export default SingleAccountPage;

export const getServerSideProps: GetServerSideProps = async (context) => {
    const { id } = context.query;
    
    try {
        const db = (await import('../../../lib/mongodb')).default.db("main");
        const account = await db
            .collection("accounts")
            .findOne({ _id: id });

        if (!account) {
            return {
                notFound: true
            };
        }

        return {
            props: {
                account: JSON.parse(JSON.stringify(account))
            }
        };
    } catch (e) {
        console.error(e);
        return {
            notFound: true
        };
    }
}; 