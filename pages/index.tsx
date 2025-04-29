import Head from "next/head";
import client from "../lib/mongodb";
import type { InferGetServerSidePropsType, GetServerSideProps } from "next";
import styled from 'styled-components';

type ConnectionStatus = {
  isConnected: boolean;
};

const Container = styled.div`
  min-height: 100vh;
  padding: 0 0.5rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const Main = styled.main`
  padding: 5rem 0;
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const Title = styled.h1`
  margin: 0;
  line-height: 1.15;
  font-size: 4rem;
  text-align: center;
  color: #0070f3;
`;

const Subtitle = styled.h2`
  font-size: 2rem;
  text-align: center;
  margin: 1rem 0;
`;

const Grid = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  max-width: 800px;
  margin-top: 3rem;
`;

const Card = styled.a`
  margin: 1rem;
  flex-basis: 45%;
  padding: 1.5rem;
  text-align: left;
  color: inherit;
  text-decoration: none;
  border: 1px solid #eaeaea;
  border-radius: 10px;
  transition: all 0.3s ease;

  &:hover {
    color: #0070f3;
    border-color: #0070f3;
    transform: translateY(-5px);
    box-shadow: 0 4px 8px rgba(0,0,0,0.1);
  }
`;

const CardTitle = styled.h3`
  margin: 0 0 1rem 0;
  font-size: 1.5rem;
`;

const CardDescription = styled.p`
  margin: 0;
  font-size: 1.25rem;
  line-height: 1.5;
`;

const Footer = styled.footer`
  width: 100%;
  height: 100px;
  border-top: 1px solid #eaeaea;
  display: flex;
  justify-content: center;
  align-items: center;
`;

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
    <Container>
      <Head>
        <title>필름 시공 관리 시스템</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Main>
        <Title>필름 시공 관리 시스템</Title>

        {isConnected ? (
          <Subtitle>현재 MongoDB에 연결되었습니다.</Subtitle>
        ) : (
          <Subtitle>
            MongoDB 연결에 실패했습니다. <code>README.md</code>를 확인해주세요.
          </Subtitle>
        )}

        <Grid>
          <Card href="/order/read/multiple">
            <CardTitle>주문 관리</CardTitle>
            <CardDescription>
              주문 목록 조회, 상세 정보 확인, 새로운 주문 생성
            </CardDescription>
          </Card>

          <Card href="/zizeom/read/multiple">
            <CardTitle>지점 관리</CardTitle>
            <CardDescription>
              지점 목록 조회, 상세 정보 확인, 새로운 지점 생성
            </CardDescription>
          </Card>

          <Card href="/account/read/multiple">
            <CardTitle>계정 관리</CardTitle>
            <CardDescription>
              계정 목록 조회, 상세 정보 확인, 새로운 계정 생성
            </CardDescription>
          </Card>

          <Card href="/inventory">
            <CardTitle>재고 관리</CardTitle>
            <CardDescription>
              필름 재고 현황 조회 및 관리
            </CardDescription>
          </Card>
        </Grid>
      </Main>

      <Footer>
        <a
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by{" "}
          <img src="/vercel.svg" alt="Vercel Logo" style={{ height: '1em', marginLeft: '0.5rem' }} />
        </a>
      </Footer>

      <style jsx>{`
        .container {
          min-height: 100vh;
          padding: 0 0.5rem;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
        }

        main {
          padding: 5rem 0;
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
        }

        footer {
          width: 100%;
          height: 100px;
          border-top: 1px solid #eaeaea;
          display: flex;
          justify-content: center;
          align-items: center;
        }

        footer img {
          margin-left: 0.5rem;
        }

        footer a {
          display: flex;
          justify-content: center;
          align-items: center;
        }

        a {
          color: inherit;
          text-decoration: none;
        }

        .title a {
          color: #0070f3;
          text-decoration: none;
        }

        .title a:hover,
        .title a:focus,
        .title a:active {
          text-decoration: underline;
        }

        .title {
          margin: 0;
          line-height: 1.15;
          font-size: 4rem;
        }

        .title,
        .description {
          text-align: center;
        }

        .subtitle {
          font-size: 2rem;
        }

        .description {
          line-height: 1.5;
          font-size: 1.5rem;
        }

        code {
          background: #fafafa;
          border-radius: 5px;
          padding: 0.75rem;
          font-size: 1.1rem;
          font-family: Menlo, Monaco, Lucida Console, Liberation Mono,
            DejaVu Sans Mono, Bitstream Vera Sans Mono, Courier New, monospace;
        }

        .grid {
          display: flex;
          align-items: center;
          justify-content: center;
          flex-wrap: wrap;

          max-width: 800px;
          margin-top: 3rem;
        }

        .card {
          margin: 1rem;
          flex-basis: 45%;
          padding: 1.5rem;
          text-align: left;
          color: inherit;
          text-decoration: none;
          border: 1px solid #eaeaea;
          border-radius: 10px;
          transition: color 0.15s ease, border-color 0.15s ease;
        }

        .card:hover,
        .card:focus,
        .card:active {
          color: #0070f3;
          border-color: #0070f3;
        }

        .card h3 {
          margin: 0 0 1rem 0;
          font-size: 1.5rem;
        }

        .card p {
          margin: 0;
          font-size: 1.25rem;
          line-height: 1.5;
        }

        .logo {
          height: 1em;
        }

        @media (max-width: 600px) {
          .grid {
            width: 100%;
            flex-direction: column;
          }
        }
      `}</style>

      <style jsx global>{`
        html,
        body {
          padding: 0;
          margin: 0;
          font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto,
            Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue,
            sans-serif;
        }

        * {
          box-sizing: border-box;
        }
      `}</style>
    </Container>
  );
}
