import React, { useContext, useCallback } from 'react';
import { useNavigate } from "react-router-dom";
import { List, Typography, Button } from 'antd';
import { IActivities } from '../helpers/types';

import { ActivitiesContext } from '../contexts/ActivitiesContext';

const { Title } = Typography;

interface Props {
  data: IActivities
}

const ListGeneric: React.FC<Props> = (props) => {
  let navigate = useNavigate();
  const { results } = useContext(ActivitiesContext);

  const ListComponent = useCallback(() => {
    return (
      <List
        size="large"
        header={<Title level={4}>{props?.data?.name}</Title>}
        footer={<Button style={{ marginTop: '0px !important'}} type="link" onClick={() => navigate('/results')}>Results</Button>}
        bordered={false}
        dataSource={props?.data?.activities}
        renderItem={
          (item) =>
            <List.Item
              actions={[<a key="list-loadmore-edit">{results.length === 0 ? '0% completed' : `${results.filter((a: any) => a.activity === item.activity_name)[0].completion}% completed`}</a>]}
              onClick={() => navigate(`/activity/${item?.activity_name.replaceAll(" ", "-").toLowerCase()}`, { state: { id: item?.order }})}
            >
              {item?.activity_name}
            </List.Item>
        }
      />
    );
  }, [props?.data?.activities, results]);

  return (
    <React.Fragment>
      <ListComponent />
    </React.Fragment>
  )
};

export default ListGeneric;