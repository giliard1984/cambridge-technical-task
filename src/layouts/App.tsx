import React from 'react';
import { clsx } from 'clsx';
import { Outlet } from 'react-router-dom';
import LogoHeader from '../components/LogoHeader';
import GoHomeFloatButton from '../components/GoHomeFloatButton';
import { Layout, Row, Col } from 'antd';

const { Header, Content } = Layout;

const AppLayout = () => (
  <Layout className={clsx(["App"])}>
    <Header className="App-header">
      <Row align="middle" justify="start" gutter={[0, 0]}>
        <Col xs={24}>
          <LogoHeader compact />
        </Col>
      </Row>
    </Header>
  
    <Layout className='fullWidth'>
        <Content>
          <Outlet />
        </Content>
      </Layout>

      <GoHomeFloatButton />
  </Layout>
);

export default AppLayout;