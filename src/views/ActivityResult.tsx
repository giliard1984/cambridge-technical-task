import React, { useContext, useCallback } from 'react';
import { useLocation, useParams, useNavigate } from 'react-router-dom';
import { Row, Col, Typography } from 'antd';

import { ActivitiesContext } from '../contexts/ActivitiesContext';
import { IActivity } from '../helpers/types';

const { Title } = Typography;

const ActivityResult: React.FC = () => {
  const { activities, results } = useContext(ActivitiesContext);
  let { activityName } = useParams();
  let { state } = useLocation();

  // Abstract ResultsComponent
  const ResultsComponent = useCallback(() => {
    // Returns a list of components, based on the computation above
    let components: any = [];

    if (results.length > 0) {
      activities?.activities.filter((a: IActivity) => a.order === state.id).forEach((a: IActivity) => {
        const isRound = a.questions.every((q: any) => q.hasOwnProperty('round_title'));

        // Adds activity component
        components.push(
          <React.Fragment>
            <Col key={`activity_order_${a.order}`} xs={24} sm={24} md={20} lg={16} xl={16} style={{ marginTop: '20px', marginBottom: '0px' }}>{a.activity_name}</Col>
            {
              !isNaN(results?.filter((x: any) => x.activity === a.activity_name)[0]?.totalAnswered / results?.filter((x: any) => x.activity === a.activity_name)[0]?.totalQuestions) &&
                <Col key={`activity_order_${a.order}_stats`} xs={24} sm={24} md={20} lg={16} xl={16} style={{ marginTop: '0px', marginBottom: '10px' }}>
                  {(results?.filter((x: any) => x.activity === a.activity_name)[0]?.totalAnswered / results?.filter((x: any) => x.activity === a.activity_name)[0]?.totalQuestions) * 100 + '% completed'}
                </Col>
            }
          </React.Fragment>
        );

        if (isRound) {
          a.questions.forEach((r: any, index: number) => {
            components.push(
              <Col key={`activity_order_${a.order}_round_order_${r.order}`} xs={24} sm={24} md={20} lg={16} xl={16}style={{ marginTop: '20px', marginBottom: '10px' }}>{r.round_title}</Col>
            );

            r.questions.forEach((q: any, index: number) => {
              components.push(
                <Col key={`activity_${a.order}_round_order_${r.order}_question_${q.order}`} xs={24} sm={24} md={20} lg={16} xl={16}>
                  <Row>
                    <Col span={16} style={{ width: '100%', height: '60px', backgroundColor: '#f2f2f2', padding: '20px 0px 20px 20px', textAlign: 'left', verticalAlign: 'middle'}}>
                      <div>
                        {`Q${index + 1}`}
                      </div>
                    </Col>
                    <Col span={8} style={{ width: '100%', height: '60px', backgroundColor: '#f2f2f2', padding: '20px 20px 20px 0px', textAlign: 'right', verticalAlign: 'middle'}}>
                      <div style={{ color: q.user_answers.length > 0 && q.user_answers.at(-1) === q.is_correct ? 'green' : q.user_answers.length === 0 ? 'grey' : 'red' }}>
                        {q.user_answers.length > 0 && q.user_answers.at(-1) === q.is_correct ? 'Correct' : q.user_answers.length === 0 ? 'Pending' : 'Incorrect'}
                      </div>
                    </Col>
                  </Row>
                </Col>
              )
            }); 
          });
        } else {
          a.questions.forEach((q: any, index: number) => {
            components.push(
              <Col key={`activity_${a.order}_question_${q.order}`} xs={24} sm={24} md={20} lg={16} xl={16}>
                <Row>
                  <Col span={16} style={{ width: '100%', height: '60px', backgroundColor: '#f2f2f2', padding: '20px 0px 20px 20px', textAlign: 'left', verticalAlign: 'middle'}}>
                    <div>
                      {`Q${index + 1}`}
                    </div>
                  </Col>
                  <Col span={8} style={{ width: '100%', height: '60px', backgroundColor: '#f2f2f2', padding: '20px 20px 20px 0px', textAlign: 'right', verticalAlign: 'middle'}}>
                    <div style={{ color: q.user_answers.length > 0 && q.user_answers.at(-1) === q.is_correct ? 'green' : q.user_answers.length === 0 ? 'grey' : 'red' }}>
                      {q.user_answers.length > 0 && q.user_answers.at(-1) === q.is_correct ? 'Correct' : q.user_answers.length === 0 ? 'Pending' : 'Incorrect'}
                    </div>
                  </Col>
                </Row>
              </Col>
            )
          });
        }
      });
    }

    return components;
  }, [results]);

  return (
    <div className="App">
      <Row align="middle" justify="center" gutter={[0, 2]}>
        <Col xs={24} sm={24} md={20} lg={16} xl={16}>
          <Title level={4}>Results</Title>
        </Col>
        <ResultsComponent />        
      </Row>
    </div>
  );
}

export default ActivityResult;