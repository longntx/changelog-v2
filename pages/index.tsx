import Convert from '@/components/convert';
import { NextPageWithLayout } from '@/pages/_app';
import { ReactElement } from 'react';
import Layout from '@/components/layouts/base';

const Home: NextPageWithLayout = () => {
  return (
    <>
      <Convert />
    </>
  );
};

Home.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default Home;
