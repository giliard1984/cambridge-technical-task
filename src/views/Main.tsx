import React, { useContext } from 'react';
import { Row, Col } from 'antd';

import ListActivities from '../components/ListActivities';
import { ActivitiesContext } from '../contexts/ActivitiesContext'
import { ActivitiesContextType } from '../helpers/types';

const Main: React.FC = () => {
  const { activities } = useContext(ActivitiesContext) as ActivitiesContextType;

  return (
    <React.Fragment>
      <Row align="middle" justify="center" gutter={[0, 0]}>
        <Col xs={24} sm={24} md={20} lg={16} xl={16}>
          <ListActivities data={activities}/>
        </Col>
      </Row>
    </React.Fragment>
  );
};

export default Main;