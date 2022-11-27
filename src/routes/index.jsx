import { createBrowserRouter } from "react-router-dom";

// Views
import Main from '../views/Main';
import Activity from '../views/Activity';
import Results from '../views/Results';
import ActivityResult from '../views/ActivityResult';

// Layouts
import DefaultLayout from "../layouts/Default";
import AppLayout from "../layouts/App";

const router = createBrowserRouter([
  {
    path: "/",
    element: <DefaultLayout />,
    children: [
      {
        path: "/",
        element: <Main />,
      },
    ],
  },
  {
    path: "/activity",
    element: <AppLayout />,
    children: [
      {
        path: ":activityName",
        element: <Activity />,
      },
      {
        path: ":activityName/result",
        element: <ActivityResult />,
      },
    ],
  },
  {
    path: "/results",
    element: <AppLayout />,
    children: [
      {
        path: "/results",
        element: <Results />,
      }
    ]
  },
]);

export default router;
