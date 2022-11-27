import React from 'react';
import { clsx } from 'clsx';
import { Outlet } from 'react-router-dom';
import LogoHeader from '../components/LogoHeader';
import { Layout } from 'antd';

const DefaultLayout = () => (
  <Layout className={clsx(["App", "App-container-centralised"])}>
    <LogoHeader />

    <div className='fullWidth'>
      <Outlet />
    </div>
  </Layout>
);

export default DefaultLayout;