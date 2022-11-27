import React, { createContext, useEffect, useState, useCallback } from "react";
import { IActivities, IActivity, IQuestions, IActivityResult, IRoundResult } from "../helpers/types";
// import axios from 'axios'; // I am keeping it in here for demo purposes on how to use axios

const ActivitiesContext = createContext<any>(undefined);

function ActivitiesProvider ({ children }: any) {
  const [activities, setActivities] = useState<IActivities>();
  const [results, setResults] = useState<IActivityResult[]>([]);

  // The purpose of this function is to simulate an initial call to the endpoint
  const initializeActivities = () => {
    // TODO: S3 is rejecting requests from this App on port 3000. It would be necessary validating the session and requesting access to s3.
    // Perhaps a different port is allowed?
    // Kept for demo purposes
    // axios.get('https://s3.eu-west-2.amazonaws.com/interview.mock.data/payload.json')
    //   .then(res => {
    //     const data = res.data;
    //     setActivities(data);
    //   })

    // I've downloaded the sample and added it to the data folder to be used here
    var jsonData = require("../assets/data/payload.json");
    setActivities(jsonData);
  }

  // This function computes results accordingly when called.It takes the flow into consideration
  const computeResults = useCallback((data: IActivities) => {
    let computedResults:IActivityResult[] = [];

    if (data) {
      data.activities.forEach((a: IActivity) => {
        const isRound = a.questions.every((q: IQuestions) => q.hasOwnProperty('round_title')); // identifies if activity is round oriented
        let obj: IActivityResult = { activity: a.activity_name, completion: 0, score: 0, totalQuestions: 0, totalAnswered: 0, correctAnswers: 0, rounds: [] };

        if (isRound) {
          // Iterate though rounds
          a.questions.forEach((r: IQuestions) => {
            let roundObj: IRoundResult = { round: r.round_title || 'Unknown', completion: 0, score: 0, totalQuestions: 0, totalAnswered: 0, correctAnswers: 0, correctOnes: [] };
            roundObj.totalQuestions = r.questions?.length || 0;

            // Checks all questions were answered
            roundObj.totalAnswered = (r.questions || []).reduce(function (previousValue, currentValue) {
              if (currentValue.user_answers.length > 0) {
                previousValue++;
              }

              return previousValue;
            }, 0);

            // Computes all correct answers
            roundObj.correctAnswers = (r.questions || []).reduce(function (previousValue, currentValue, currentIndex) {
              if (currentValue.user_answers.length > 0 &&
                currentValue.user_answers[currentValue.user_answers.length - 1] === currentValue.is_correct) {
                roundObj.correctOnes.push(currentIndex);
                previousValue++;
              }

              return previousValue;
            }, 0);

            // I am checking the denominator here, as we don't want to see isNaN error when it is zero (It's not the case, as we always have questions assigned to an activity)
            roundObj.completion = roundObj.totalQuestions > 0 ? Number(((roundObj.totalAnswered  / roundObj.totalQuestions) * 100).toFixed(0)) : 0;
            roundObj.score = roundObj.totalQuestions > 0 ? Number(((roundObj.correctAnswers / roundObj.totalQuestions) * 100).toFixed(0)) : 0;

            obj.rounds.push(roundObj);

            // Stats at an acitvivity level
            // Checks total of questions within the actitivy
            obj.totalQuestions = obj.rounds.reduce(function (previousValue: number, currentValue: { totalQuestions: number; }) {
              previousValue = previousValue + currentValue.totalQuestions;

              return previousValue;
            }, 0);

            // Checks all questions were answered
            obj.totalAnswered = obj.rounds.reduce(function (previousValue: number, currentValue: { totalAnswered: number }) {
              previousValue = previousValue + currentValue.totalAnswered;

              return previousValue;
            }, 0);

            // Computes all correct answers
            obj.correctAnswers = obj.rounds.reduce(function (previousValue: number, currentValue: { correctAnswers: number }) {
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

        // I am checking the denominator here, as we don't want to see isNaN error when it is zero (It's not the case, as we always have questions assigned to an activity)
        obj.completion = obj.totalQuestions > 0 ? Number(((obj.totalAnswered / obj.totalQuestions) * 100).toFixed(0)) : 0;
        obj.score = obj.totalQuestions > 0 ? Number(((obj.correctAnswers / obj.totalQuestions) * 100).toFixed(0)) : 0;

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
      results,
      computeResults
    }}>
        {children}
    </ActivitiesContext.Provider>
  );
}

export { ActivitiesProvider, ActivitiesContext };