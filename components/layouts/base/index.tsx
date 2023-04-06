import Head from 'next/head';
import { ReactElement } from 'react';

type TLayout = {
  title?: string;
  children: ReactElement;
};

const Layout = ({ title = 'Changelog convert for ER', children }: TLayout) => {
  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content={title} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="container mx-auto">
        <main className="h-[calc(100dvh-68px)] min-w-[1140px] p-4">
          {children}
        </main>
      </div>
    </>
  );
};
export default Layout;
