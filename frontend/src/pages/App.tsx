import React from 'react'
import { createBrowserRouter, Outlet, RouterProvider } from 'react-router-dom';
import Register from './Register';
import Login from './Login';
import Home from './Home';
import Messages from './Messages';
import Message from './Message';
import Profile from './Profile';
import SignLayout from '../components/auth/SignLayout';
import Book from './Book';
import Example from './Novel';
import Novel from './Novel';

const App = () => {
const Layout = () => {
    return (
      <div className="bg-[#DDD1BB] min-h-screen p-2 relative">
        <Outlet />
      </div>
    );
  };
      const router = createBrowserRouter([
        {
          path: "/",
          element: <Layout />,
          children: [
            {
              path: "/",
              element: <Home />,
            },
            {
              path: "/messages",
              element: <Messages />,
            },
            {
              path: "/messages/:id",
              element: <Message />,
            },
            {
              path: "/profile",
              element: <Profile />,
            },
            {
              path: "/books/:id",
              element: <Book />,
            },
            {
              path: "/novel",
              element: <Novel />,
            },
          ],
        },
        {
          path: "/",
          element: <SignLayout />,
          children: [
            {
              path: "/register",
              element: <Register />,
            },
            {
              path: "/login",
              element: <Login />,
            },
          ],
        },
      ]);
  return <RouterProvider router={router} />;
}

export default App