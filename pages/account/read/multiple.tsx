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

interface AccountsProps {
    accounts: AccountInfo[];
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

const AccountList = styled.ul`
    list-style: none;
    padding: 0;
`;

const AccountItem = styled.li`
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

const AccountTitle = styled.h3`
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

const AccountListComponent = ({ accounts }: AccountsProps) => {
    return (
        <Container>
            <Title>계정 목록</Title>
            <AccountList>
                {accounts.map((account) => (
                    <AccountItem key={account._id}>
                        <AccountTitle>
                            {account.name}
                            <AccountTypeBadge type={account.accountType}>
                                {account.accountType === 'buyer' ? '구매자' : 
                                 account.accountType === 'seller' ? '판매자' : '관리자'}
                            </AccountTypeBadge>
                        </AccountTitle>
                        <InfoList>
                            <InfoItem>
                                <Label>계정명:</Label>
                                <Value>{account.accountName}</Value>
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
                        </InfoList>
                    </AccountItem>
                ))}
            </AccountList>
        </Container>
    );
};

export default AccountListComponent;

export const getServerSideProps: GetServerSideProps = async () => {
    try {
        const db = client.db("main");
        const accounts = await db
            .collection("accounts")
            .find({})
            .toArray();

        return {
            props: { accounts: JSON.parse(JSON.stringify(accounts)) },
        };
    } catch (e) {
        console.error(e);
        return { props: { accounts: [] } };
    }
}; 