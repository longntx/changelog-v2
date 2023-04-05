import Head from 'next/head';
import { ReactElement } from 'react';

type TLayout = {
  title?: string;
  children: ReactElement;
};

const Layout = ({ title = 'Changelog convert for ER', children }: TLayout) => {
  return (
    <div className="container">
      <Head>
        <title>{title}</title>
        <meta name="description" content={title} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="mx-auto p-4 min-w-[1140px] h-[calc(100dvh-68px)]">
        {children}
      </main>
    </div>
  );
};
export default Layout;
