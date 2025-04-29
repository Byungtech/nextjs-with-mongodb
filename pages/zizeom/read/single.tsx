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