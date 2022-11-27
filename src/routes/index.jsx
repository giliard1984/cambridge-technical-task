import { createBrowserRouter } from "react-router-dom";

// Views
import Main from '../views/Main';
import Activity from '../views/Activity';
import Results from '../views/Results';

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
    ],
  },
  {
    path: "/results",
    element: <AppLayout />,
    children: [
      {
        path: "/results/:activityName",
        element: <Results />,
      }
    ]
  },
]);

export default router;
