// This represents the expected activities object, that should be stored when app is initialised
export interface IActivities {
  name: string,
  heading: string,
  activities: IActivity[]
};

export interface IActivity {
  activity_name: string,
  order: number,
  questions: {
    // Sequential flow
    is_correct?: boolean,
    stimulus?: string,
    order: number,
    user_answers?: Boolean[],
    feedback?: string
    // Round flow
    round_title?: string,
    questions?: {
      is_correct: boolean,
      stimulus: string,
      order: number,
      user_answers: Boolean[],
      feedback: string
    }[]
  }[]
}

export type ActivitiesContextType = {
  activities: IActivities;
  answerQuestion: (
    activity_id: number,
    round: number | null,
    question_id: number,
    answer: boolean
  ) => void;
};