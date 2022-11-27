import React, { createContext, useEffect, useState, useCallback, useMemo } from "react";
import { IActivities, IActivity, ActivitiesContextType } from "../helpers/types";
// import axios from 'axios';

const ActivitiesContext = createContext<any>(undefined);

function ActivitiesProvider ({ children }: any) {
  const [activities, setActivities] = useState<IActivities>();
  const [results, setResults] = useState<any>([]);

  // The purpose of this function is to simulate an initial call to the endpoint
  const initializeActivities = () => {
    // TODO: S3 is rejecting requests from this App on port 3000. It would be necessary validating the session and requesting access to s3.
    // axios.get('https://s3.eu-west-2.amazonaws.com/interview.mock.data/payload.json')
    //   .then(res => {
    //     const data = res.data;
    //     setActivities(data);
    //   })

    // I've downloaded the sample and added it to the data folder to be used here
    var jsonData = require("../assets/data/payload.json");
    setActivities(jsonData);
  }

  const answerQuestion:ActivitiesContextType["answerQuestion"] = (activity_id, round = null, question_id, answer ) => {
    console.log(activity_id, round, question_id, answer);
  }

  const computeResults = useCallback((data: any) => {
    let computedResults:any = [];

    if (data) {
      data.activities.forEach((a: IActivity) => {
        const isRound = a.questions.every((q: any) => q.hasOwnProperty('round_title')); // identifies if activity is round oriented
        let obj: any = { activity: a.activity_name, completion: 0, totalQuestions: 0, totalAnswered: 0, correctAnswers: 0, rounds: [] };

        if (isRound) {
          // Iterate though rounds
          a.questions.forEach(r => {
            let roundObj: any = { round: r.round_title, completion: 0, totalQuestions: 0, totalAnswered: 0, correctAnswers: 0, correctOnes: [] };
            roundObj.totalQuestions = r.questions?.length || 0;

            // Checks all questions were answered
            roundObj.totalAnswered = (r.questions || []).reduce(function (previousValue, currentValue) {
              if (currentValue.user_answers.length > 0) {
                previousValue++;
              }

              return previousValue;
            }, 0);

            // Computes all correct answers
            roundObj.correctAnswers = (r.questions || []).reduce(function (previousValue, currentValue, index) {
              if (currentValue.user_answers.length > 0 &&
                currentValue.user_answers[currentValue.user_answers.length - 1] === currentValue.is_correct) {
                roundObj.correctOnes.push(index);
                previousValue++;
              }

              return previousValue;
            }, 0);

            roundObj.completion = roundObj.totalAnswered  / roundObj.totalQuestions;

            obj.rounds.push(roundObj);

            // Stats at an acitvivity level
            // Checks total of questions within the actitivy
            obj.totalQuestions = obj.rounds.reduce(function (previousValue: any, currentValue: { totalQuestions: any; }) {
              previousValue = previousValue + currentValue.totalQuestions;

              return previousValue;
            }, 0);

            // Checks all questions were answered
            obj.totalAnswered = obj.rounds.reduce(function (previousValue: any, currentValue: { totalAnswered: any }) {
              previousValue = previousValue + currentValue.totalAnswered;

              return previousValue;
            }, 0);

            // Computes all correct answers
            obj.correctAnswers = obj.rounds.reduce(function (previousValue: any, currentValue: { correctAnswers: any }) {
              previousValue = previousValue + currentValue.correctAnswers;

              return previousValue;
            }, 0);
          });

        } else {
          obj.totalQuestions = a.questions.length;

          // Checks all questions were answered
          obj.totalAnswered = a.questions.reduce(function (previousValue, currentValue) {
            if (currentValue.user_answers && currentValue.user_answers?.length > 0) {
              previousValue++;
            }

            return previousValue;
          }, 0);

          // Computes all correct answers
          obj.correctAnswers = a.questions.reduce(function (previousValue, currentValue) {
            if (currentValue.user_answers && currentValue.user_answers?.length > 0 && currentValue.user_answers.at(-1) === currentValue.is_correct) {
              previousValue++;
            }

            return previousValue;
          }, 0);
        }

        obj.completion = ((obj.totalAnswered  / obj.totalQuestions) * 100).toFixed(0);

        computedResults.push(obj);
      });

      setResults(computedResults);
    }
  }, []);

  // Makes a call to the function when mounted (componentDidMount)
  useEffect(() => {
    initializeActivities();
  }, []);

  return (
    <ActivitiesContext.Provider value={{
      activities,
      answerQuestion,
      results,
      computeResults
    }}>
        {children}
    </ActivitiesContext.Provider>
  );
}

export { ActivitiesProvider, ActivitiesContext };