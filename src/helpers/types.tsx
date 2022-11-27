// This represents the expected activities object, that should be stored when app is initialised
export interface IActivities {
  name: string,
  heading: string,
  activities: IActivity[]
};

export interface IActivity {
  activity_name: string,
  order: number,
  questions: IQuestions[]
}

export interface IQuestions {
  // Sequential flow
  is_correct?: boolean,
  stimulus?: string,
  order: number,
  user_answers?: Boolean[],
  feedback?: string
  // Round flow
  round_title?: string,
  questions?: IQuestion[]
}

export interface IQuestion {
  is_correct: boolean,
  stimulus: string,
  order: number,
  user_answers: Boolean[],
  feedback: string
}

export interface IActivityResult {
  activity: string,
  completion: number,
  score: number,
  totalQuestions: number,
  totalAnswered: number,
  correctAnswers: number,
  rounds: IRoundResult[]
}

export interface IRoundResult {
  round: string,
  completion: number,
  score: number,
  totalQuestions: number,
  totalAnswered: number,
  correctAnswers: number,
  correctOnes: number[]
}

export type ActivitiesContextType = {
  activities: IActivities;
};