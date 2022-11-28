import React, { useContext, useCallback } from 'react';
import { useNavigate } from "react-router-dom";
import { List, Typography, Button } from 'antd';
import { IActivities } from '../helpers/types';

import { ActivitiesContext } from '../contexts/ActivitiesContext';

const { Title } = Typography;

interface Props {
  data: IActivities
}

// This component is responsible for presenting the list of activities on the screen,
// for users to pick one from the list and start answering related questions
const ListGeneric: React.FC<Props> = (props) => {
  let navigate = useNavigate();
  const { results } = useContext(ActivitiesContext);

  const ListComponent = useCallback(() => {
    return (
      <List
        size="large"
        header={<Title level={4}>{props?.data?.name}</Title>}
        footer={<Button
          style={{ marginTop: '0px !important' /*I could've abstracted it to a class, but I am keeping it in here for demo purposes*/ }}
          type="link"
          onClick={() => navigate('/results/all', { state: { id: -1 }})}>Results</Button> /* It is the results button, rendered on the main page, that presents results for all acitivites */
        }
        bordered={false}
        dataSource={props?.data?.activities}
        renderItem={
          (item) =>
            <List.Item
              // Used eslint command in order to remove anchor-is-valid warning
              // eslint-disable-next-line
              actions={[<a key="list-loadmore-edit">
                {
                results.length === 0 ?
                  '0% completed' :
                  `${results.filter((a: any) => a.activity === item.activity_name)[0].completion}% completed`
                }</a>
              ]}
              onClick={() => navigate(`/activity/${item?.activity_name.replaceAll(" ", "-").toLowerCase()}`, { state: { id: item?.order }})}
            >
              {item?.activity_name}
            </List.Item>
        }
      />
    );
  }, [props?.data?.activities, results, navigate, props?.data?.name]);

  return (
    <React.Fragment>
      <ListComponent />
    </React.Fragment>
  )
};

export default ListGeneric;