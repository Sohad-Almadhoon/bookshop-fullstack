import { createBrowserRouter, Outlet, RouterProvider } from 'react-router-dom';
import Register from './Register';
import Login from './Login';
import Home from './Home';
import Messages from './Messages';
import Message from './Message';
import Profile from './Profile';
import SignLayout from '../components/auth/SignLayout';
import Book from './Book';
import Novel from './Novel';
import Welcome from './Welcome';
import Tree from './Tree';
import NovelDetails from './NovelDetails';
import ModalProvider from './ModalProvider';
import Questionnaire from './Questionnaire';
import ComingSoon from './ComingSoon';

const App = () => {
const Layout = () => {
    return (
      <div className="bg-[#DDD1BB] min-h-screen p-2 relative font-romie">
        <ModalProvider/>
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
            {
              path: "/welcome",
              element: <Welcome />,
            },
            {
              path: "/tree",
              element: <Tree />,
            },
            {
              path: "/coming-soon",
              element: <ComingSoon />,
            },
            {
              path: "/discover",
              element: <NovelDetails />,
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
            {
              path: "/questionnaire",
              element: <Questionnaire />,
            },
          ],
        },
      ]);
  return <RouterProvider router={router} />;
}

export default App