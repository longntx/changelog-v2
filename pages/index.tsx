import { NextPageWithLayout } from '@/pages/_app';
import { ReactElement } from 'react';
import Layout from '@/components/layouts/base';
import dynamic from 'next/dynamic';

const DConvert = dynamic(() => import('@/components/convert'), { ssr: false });

const Home: NextPageWithLayout = () => {
  return (
    <>
      <DConvert />
    </>
  );
};

Home.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default Home;
