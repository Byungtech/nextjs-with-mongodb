import Head from "next/head";
import client from "../lib/mongodb";
import type { InferGetServerSidePropsType, GetServerSideProps } from "next";

type ConnectionStatus = {
  isConnected: boolean;
};

export const getServerSideProps: GetServerSideProps<ConnectionStatus> = async () => {
  try {
    await client.connect();
    // `await client.connect()` will use the default database passed in the MONGODB_URI
    // However you can use another database (e.g. myDatabase) by replacing the `await clientPromise` with the following code:
    //
    // `const client = await clientPromise`
    // `const db = client.db("myDatabase")`
    //
    // Then you can execute queries against your database like so:
    // db.find({}) or any of the MongoDB Node Driver commands

    return {
      props: { isConnected: true },
    };
  } catch (e) {
    console.error(e);
    return {
      props: { isConnected: false },
    };
  }
};

export default function Home({
  isConnected,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4">
      <Head>
        <title>필름 시공 관리 시스템</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="flex-1 flex flex-col items-center justify-center py-20">
        <h1 className="text-6xl font-bold text-primary mb-4">
          필름 시공 관리 시스템
        </h1>

        {isConnected ? (
          <h2 className="text-3xl text-center mb-12">
            현재 MongoDB에 연결되었습니다.
          </h2>
        ) : (
          <h2 className="text-3xl text-center mb-12">
            MongoDB 연결에 실패했습니다. <code className="bg-gray-100 px-2 py-1 rounded">README.md</code>를 확인해주세요.
          </h2>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl w-full">
          <a
            href="/order/read/multiple"
            className="p-6 border border-gray-200 rounded-lg hover:border-primary hover:text-primary hover:-translate-y-1 transition-all duration-300 hover:shadow-lg"
          >
            <h3 className="text-2xl font-semibold mb-4">주문 관리</h3>
            <p className="text-lg text-gray-600">
              주문 목록 조회, 상세 정보 확인, 새로운 주문 생성
            </p>
          </a>

          <a
            href="/zizeom/read/multiple"
            className="p-6 border border-gray-200 rounded-lg hover:border-primary hover:text-primary hover:-translate-y-1 transition-all duration-300 hover:shadow-lg"
          >
            <h3 className="text-2xl font-semibold mb-4">지점 관리</h3>
            <p className="text-lg text-gray-600">
              지점 목록 조회, 상세 정보 확인, 새로운 지점 생성
            </p>
          </a>

          <a
            href="/account/read/multiple"
            className="p-6 border border-gray-200 rounded-lg hover:border-primary hover:text-primary hover:-translate-y-1 transition-all duration-300 hover:shadow-lg"
          >
            <h3 className="text-2xl font-semibold mb-4">계정 관리</h3>
            <p className="text-lg text-gray-600">
              계정 목록 조회, 상세 정보 확인, 새로운 계정 생성
            </p>
          </a>

          <a
            href="/inventory"
            className="p-6 border border-gray-200 rounded-lg hover:border-primary hover:text-primary hover:-translate-y-1 transition-all duration-300 hover:shadow-lg"
          >
            <h3 className="text-2xl font-semibold mb-4">재고 관리</h3>
            <p className="text-lg text-gray-600">
              필름 재고 현황 조회 및 관리
            </p>
          </a>
        </div>
      </main>

      <footer className="w-full h-24 border-t border-gray-200 flex items-center justify-center">
        <a
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center"
        >
          Powered by{" "}
          <img src="/vercel.svg" alt="Vercel Logo" className="h-4 ml-2" />
        </a>
      </footer>
    </div>
  );
}
