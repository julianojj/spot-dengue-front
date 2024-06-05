import React from 'react';
import ReactDOM from 'react-dom/client';
import 'react-toastify/dist/ReactToastify.css';
import './index.css';


import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import { Home } from './components/home/index.jsx';

import { ToastContainer } from 'react-toastify';
import { Report } from './components/report/index.jsx';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Home />
  },
  {
    path: '/report',
    element: <Report />
  }
])

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
    <ToastContainer />
  </React.StrictMode>,
)
