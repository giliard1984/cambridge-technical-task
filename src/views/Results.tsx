import React, { useContext, useCallback, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Row, Col, Typography, Space, Divider } from 'antd';

import { ActivitiesContext } from '../contexts/ActivitiesContext';
import { IActivity, IActivityResult, IQuestions, IQuestion } from '../helpers/types';

const { Title, Text } = Typography;

const Results: React.FC = () => {
  const { activities, results, computeResults } = useContext(ActivitiesContext);
  let { state } = useLocation();

  useEffect(() => {
    if (activities) {
      computeResults(activities); 
    }
  }, [activities]);

  // Abstract ResultsComponent
  const ResultsComponent = useCallback(() => {
    // Returns a list of components, based on the computation above
    let components: any = [];

    if (results.length > 0) {
      // In case an order id is passed down to the state, we should filter it accordingly
      let data = activities?.activities;
      if (state?.id && state.id >= 0) {
        data = activities?.activities.filter((a: IActivity) => a.order === state.id);
      }

      data.forEach((a: IActivity) => {
        const isRound = a.questions.every((q: IQuestions) => q.hasOwnProperty('round_title'));

        // Adds activity component
        components.push(
          <React.Fragment>
            <Col key={`activity_order_${a.order}`} xs={24} sm={24} md={20} lg={16} xl={16}><Title level={5}>{a.activity_name}</Title></Col>
            <Row wrap align="middle" justify="center" className='fullWidth' style={{ marginBottom: '10px'}}>
              {
                !isNaN(results?.filter((x: IActivityResult) => x.activity === a.activity_name)[0]?.totalAnswered / results?.filter((x: any) => x.activity === a.activity_name)[0]?.totalQuestions) &&
                  <React.Fragment>
                    <Col key={`activity_order_${a.order}_stats_completion`} xs={24} sm={12} md={20} lg={16} xl={16}>
                      <Space>
                        <Text>
                          {(results?.filter((x: any) => x.activity === a.activity_name)[0]?.totalAnswered / results?.filter((x: any) => x.activity === a.activity_name)[0]?.totalQuestions) * 100 + '% completed'}
                        </Text>
                        <Divider type="vertical" />
                        <Text>
                          {'Score: ' + (results?.filter((x: any) => x.activity === a.activity_name)[0]?.score) + '%'}
                        </Text>
                      </Space>
                    </Col>
                  </React.Fragment>
              }
            </Row>
          </React.Fragment>
        );

        if (isRound) {
          a.questions.forEach((r: IQuestions) => {
            components.push(
              <Col key={`activity_order_${a.order}_round_order_${r.order}`} xs={24} sm={24} md={20} lg={16} xl={16}style={{ marginTop: '20px', marginBottom: '10px' }}>{r.round_title}</Col>
            );

            r.questions?.forEach((q: IQuestion, index: number) => {
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
          a.questions.forEach((q: IQuestions, index: number) => {
            components.push(
              <Col key={`activity_${a.order}_question_${q.order}`} xs={24} sm={24} md={20} lg={16} xl={16}>
                <Row>
                  <Col span={16} style={{ width: '100%', height: '60px', backgroundColor: '#f2f2f2', padding: '20px 0px 20px 20px', textAlign: 'left', verticalAlign: 'middle'}}>
                    <div>
                      {`Q${index + 1}`}
                    </div>
                  </Col>
                  <Col span={8} style={{ width: '100%', height: '60px', backgroundColor: '#f2f2f2', padding: '20px 20px 20px 0px', textAlign: 'right', verticalAlign: 'middle'}}>
                    <div style={{ color: q.user_answers && q.user_answers.length > 0 && q.user_answers.at(-1) === q.is_correct ? 'green' : q.user_answers && q.user_answers.length === 0 ? 'grey' : 'red' }}>
                      {q.user_answers && q.user_answers.length > 0 && q.user_answers.at(-1) === q.is_correct ? 'Correct' : q.user_answers && q.user_answers.length === 0 ? 'Pending' : 'Incorrect'}
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

export default Results;