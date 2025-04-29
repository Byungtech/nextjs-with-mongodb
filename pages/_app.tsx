import type { AppProps } from 'next/app';
import { createGlobalStyle } from 'styled-components';
import Layout from '../components/Layout';

const GlobalStyle = createGlobalStyle`
  :root {
    --max-width: 800px;
    --border-radius: 8px;
    --font-mono: ui-monospace, Menlo, Monaco, 'Cascadia Mono', 'Segoe UI Mono',
      'Roboto Mono', 'Oxygen Mono', 'Ubuntu Monospace', 'Source Code Pro',
      'Fira Mono', 'Droid Sans Mono', 'Courier New', monospace;
  }

  * {
    box-sizing: border-box;
    padding: 0;
    margin: 0;
  }

  html,
  body {
    max-width: 100vw;
    overflow-x: hidden;
    font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto,
      Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue,
      sans-serif;
  }

  /* 모바일 환경을 위한 기본 스타일 */
  @media (max-width: 768px) {
    :root {
      --max-width: 100%;
      padding: 0 1rem;
    }
  }

  /* 태블릿 환경을 위한 스타일 */
  @media (min-width: 769px) and (max-width: 1024px) {
    :root {
      --max-width: 90%;
    }
  }

  /* 데스크톱 환경을 위한 스타일 */
  @media (min-width: 1025px) {
    :root {
      --max-width: 800px;
    }
  }
`;

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <GlobalStyle />
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </>
  );
} 