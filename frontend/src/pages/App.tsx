import { createBrowserRouter, Outlet, RouterProvider } from "react-router-dom";
import Register from "./Register";
import Login from "./Login";
import Messages from "./Messages";
import Message from "./Message";
import Profile from "./Profile";
import SignLayout from "../components/auth/SignLayout";
import ToasterProvider from "../components/ToasterProvider";
import Book from "./Book";
import Welcome from "./Welcome";
import Tree from "./Tree";
import ModalProvider from "../components/modals/ModalProvider";
import Questionnaire from "./Questionnaire";
import ComingSoon from "./ComingSoon";
import Discover from "./Discover";
import Chapter from "./Chapter";
import ProtectedRoute from "./ProtectedRoute";
import Main from "./Main";

const App = () => {
  const Layout = () => {
    return (
      <ProtectedRoute>
        <div className="bg-[#DDD1BB] min-h-screen p-2 relative font-romie">
          <ToasterProvider />
          <ModalProvider />
          <Outlet />
        </div>
      </ProtectedRoute>
    );
  };
  const router = createBrowserRouter([
    {
      element: <Layout />,
      children: [
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
          element: <Discover />,
        },
        {
          path: "/chapters/:id",
          element: <Chapter />,
        },
      ],
    },
    {
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
    {
      path: "/",
      element: <Main />,
    },
  ]);
  return <RouterProvider router={router} />;
};

export default App;
