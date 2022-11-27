import React from 'react';
import ReactDOM from 'react-dom/client';
import { ConfigProvider } from 'antd';
import reportWebVitals from './reportWebVitals';
import { RouterProvider } from "react-router-dom";
import { ActivitiesProvider } from './contexts/ActivitiesContext'

import './assets/styles/index.css';
import router from './routes';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <ConfigProvider
      theme={{
        token: {
          // colorPrimary: '#00b96b',
        },
      }}
    >
      <ActivitiesProvider>
        <RouterProvider router={router} />
      </ActivitiesProvider>
    </ConfigProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
