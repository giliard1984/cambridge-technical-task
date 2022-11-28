import React, { useState, useContext, useEffect, useCallback } from 'react';
import { useLocation, useParams, useNavigate } from 'react-router-dom';
import { Row, Col, Typography, Button } from 'antd';

import { ActivitiesContext } from '../contexts/ActivitiesContext';
import { IActivity } from '../helpers/types';

const { Title, Paragraph } = Typography;

const Activity: React.FC = () => {
  let navigate = useNavigate(); 
  const { activities, computeResults } = useContext(ActivitiesContext);
  let { activityName } = useParams();
  let { state } = useLocation();
  
  const [activity, setActivity] = useState<IActivity>();

  // Round variables
  const [isRoundFlow, setIsRoundFlow] = useState(false);
  const [round, setRound] = useState(undefined);
  const [nextRound, setNextRound] = useState(0); // It is defined as index in an array of rounds
  const [startedRound, setStartedRound] = useState(false);

  // Questions variables
  const [question, setQuestion] = useState<any>();
  const [nextQuestion, setNextQuestion] = useState(0); // It is defined as index in an array of questions

  useEffect(() => {
    if (state.id && activities) {
      const activity = activities.activities.filter((a: any) => a.order === state.id)[0];

      // Iterate through all questions from the activity, in in case all records present a round_title, we set the flow ad being as round
      // This flag is important to set flow properly
      const isRound = activity.questions.every((q: any) => q.hasOwnProperty('round_title'));
      setIsRoundFlow(isRound);

      if (activity.questions.length > 0) {
        setNextRound(1);
      }
      if (isRound) {
        // It defines its first round title
        setRound(activity.questions[0].round_title);
      } 
      else {
        // In case we are dealing with a sequential flow, then the first question is set
        setQuestion(activity?.questions[nextQuestion]);

        if (nextQuestion < activity.questions.length) {
          setNextQuestion(nextQuestion + 1);
        }
      }

      // The activity we are dealing with is defined in state
      setActivity(activity);
    }
  }, [state.id, activities]);

  const ActivityAndOrRoundName = () => {
    return (
      <Col span={24} style={{ marginTop: '50px' }}>
        <Paragraph>{ (!isRoundFlow || !startedRound) ? activity?.activity_name.toUpperCase() : activity?.activity_name.toUpperCase()  + ' | ' + round }</Paragraph>
      </Col>
    );
  }

  const RoundOrQuestionTitle = () => {
    if (isRoundFlow && !question) {
      return (
        <Col span={24}>
          <Title level={4}>{ round }</Title>
        </Col>
      );
    } else if (isRoundFlow && question) {
      return (
        <Col span={24}>
          <Title level={4}>{ 'Q' + nextQuestion + '.' }</Title>
        </Col>
      );
    } else {
      return (
        <Col span={24}>
          <Title level={4}>{ 'Q' + nextQuestion + '.' }</Title>
        </Col>
      );
    }
  }

  // This functions takes a text into consideration and highligh all sentences in between asterisks/stars(*)
  // TODO: Abstract this function
  const HighlightedText = (value : string) => {
    if (!value) {
      // TODO: Add a loader or skeleton
      return "Processing question...";
    }

    const numberOfOccurences = (value.match(/\*/g) || []).length;
    let newValue:string = '';

    let startOccurrence = 1;
    for (let o = 1; o <= numberOfOccurences; o++) {
      const processedText = value.split("").map((c: string, index: number) => {
        if (c === '*') {
          c = startOccurrence % 2 > 0 ? '<b>' : '</b>';
          startOccurrence++;
        }
        return c;
      });

      newValue = processedText.join("");
    };
    
    return newValue;
  };

  const StartRound = useCallback(() => {
    if (activity) {
      const roundObj = activity?.questions.filter(r => r.round_title === round)[0];

      if (roundObj?.questions) {
        setQuestion(roundObj.questions[nextQuestion]);

        if (nextQuestion < roundObj.questions.length) {
          setNextQuestion(nextQuestion + 1);
        }
      }

      setStartedRound(true);
    }
  }, [activity, round]);

  const AnswerQuestion = useCallback((isCorrect: Boolean) => {
    if (isRoundFlow) {
      // Updates user_answers
      activities.activities.filter((a: IActivity) => a.order === state.id)[0].questions.filter((r: any) => r.round_title === round)[0].questions.filter((q: string, index: number) => index === nextQuestion - 1)[0].user_answers.push(isCorrect)

      setQuestion(activities.activities.filter((a: IActivity) => a.order === state.id)[0].questions.filter((r: any) => r.round_title === round)[0].questions.filter((q: string, index: number) => index === nextQuestion)[0]);

      if (nextQuestion < activities.activities.filter((a: IActivity) => a.order === state.id)[0].questions.filter((r: any) => r.round_title === round)[0].questions.length) {
        setNextQuestion(nextQuestion + 1);
      } else {
        if (nextRound < activities.activities.filter((a: IActivity) => a.order === state.id)[0].questions.length){
          setRound(activities.activities.filter((a: IActivity) => a.order === state.id)[0].questions[nextRound].round_title);
          setNextRound(nextRound + 1);
          setNextQuestion(0);
          setStartedRound(false);
        } else {
          setRound(undefined);
          setNextRound(0);
          setNextQuestion(0);
          setStartedRound(false);
          setActivity(undefined);
          setIsRoundFlow(false);

          computeResults(activities);
          navigate(`/results/${activityName}`, { state: { id: activity?.order }});
        }
      }

    } else {
      // Updates user_answers
      activities.activities.filter((a: IActivity) => a.order === state.id)[0].questions.filter((q: string, index: number) => index === nextQuestion - 1)[0].user_answers.push(isCorrect);

      setQuestion(activities.activities.filter((a: IActivity) => a.order === state.id)[0].questions.filter((q: string, index: number) => index === nextQuestion)[0]);
      
      if (nextQuestion < activities.activities.filter((a: IActivity) => a.order === state.id)[0].questions.length) {
        setNextQuestion(nextQuestion + 1);
      } else {
        setActivity(undefined);
        setIsRoundFlow(false);
        setNextRound(0);
        setStartedRound(false);
        setNextQuestion(0);
        setQuestion(undefined);

        computeResults(activities);
        navigate(`/results/${activityName}`, { state: { id: activity?.order }});
      }
    }  
  }, [isRoundFlow, activities, nextQuestion]);

  // When dealing with rounds, count 2 seconds and start it
  const [counter, setCounter] = useState(0);

  useEffect(() => {
    counter > 0 && setTimeout(() => setCounter(counter - 1), 1000);
  }, [counter]);

  useEffect(() => {
    if (isRoundFlow && !startedRound) {
      setCounter(2);

      const timer = setTimeout(() => {
        StartRound();
      }, 2000);

      return () => {
        clearTimeout(timer);
      }
    }
  }, [isRoundFlow, startedRound]);

  const Question = () => {
    if (isRoundFlow && !startedRound) {
      // eslint-disable-next-line
      return <a>Round starting in {counter} second(s)</a>; // Used eslint command in order to remove anchor-is-valid warning
    }

    return (
      <React.Fragment>
        <Col span={24}>
          {/* TODO: Create a sanitiser to prevent other tags from being inject as dangerouslySetInnerHTML is not safe */}
          <div
            style={{ width: '100%', backgroundColor: '#f2f2f2', padding: '5% 5%', fontSize: '18px'}}
            dangerouslySetInnerHTML={{ __html: HighlightedText(question?.stimulus) }}
          ></div>
        </Col>
        <Col span={10}>
          <Button type="link" size="large" block onClick={() => AnswerQuestion(true)}>Correct</Button>
        </Col>
        <Col span={10}>
          <Button type="link" size="large" block onClick={() => AnswerQuestion(false)}>Incorrect</Button>
        </Col>
        
      </React.Fragment>
    );
  };

  return (
    <div className="App">
      <Row align="middle" justify="center" gutter={[0, 10]}>
        <ActivityAndOrRoundName />
        <RoundOrQuestionTitle />
        <Question />
      </Row>
    </div>
  );
}

export default Activity;