import React from 'react';
import { Row, Col, Typography } from 'antd';
import logo from '../cambridge-logo.png';

const { Text } = Typography;

interface Props {
  compact?: Boolean;
}

const LogoHeader: React.FC<Props>  = (props) => {
  return (
    <Row align="middle" justify="center">
      <Col span={24}>
          <img src={logo} className={!props.compact ? "App-logo" : "App-logo-compact"} alt="logo" />
        </Col>
        {!props.compact &&
          <Col span={24}>
            <Text type="secondary">Certificate in Advanced English (CAE)</Text>
          </Col>
        }
    </Row>
  )
}

export default LogoHeader;