import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Register from "./Register";
import Login from "./Login";
import Messages from "./Messages";
import Message from "./Message";
import Profile from "./Profile";
import SignLayout from "../components/auth/SignLayout";
import ToasterProvider from "../providers/ToasterProvider";
import Book from "./Book";
import Welcome from "./Welcome";
import Tree from "./Tree";
import ModalProvider from "../providers/ModalProvider";
import Questionnaire from "./Questionnaire";
import ComingSoon from "./ComingSoon";
import Discover from "./Discover";
import ProtectedRoute from "../components/route/ProtectedRoute";
import Chapter from "./Chapter";
import LandingPage from "./LandingPage";
import Success from "./Success";
import PaymentRoute from "../components/route/PaymentRoute";
import CreateBookPage from "./CeateBook";

// Initialize QueryClient
const queryClient = new QueryClient();

const App: React.FC = () => {
  // Layout for protected routes
  const Layout = () => (
    <ProtectedRoute>
      <div className="bg-[#DDD1BB] min-h-screen p-2 relative font-romie">
        <ToasterProvider />
        <ModalProvider />
        <Outlet />
      </div>
    </ProtectedRoute>
  );

  // Define routes
  const router = createBrowserRouter([
    {
      element: <Layout />,
      children: [
        { path: "/messages", element: <Messages /> },
        { path: "/messages/:id", element: <Message /> },
        { path: "/profile", element: <Profile /> },
        { path: "/books/:id", element: <Book /> },
        { path: "/welcome", element: <Welcome /> },
        { path: "/tree", element: <Tree /> },
        { path: "/coming-soon", element: <ComingSoon /> },
        { path: "/discover", element: <Discover /> },
        {
          path: "/chapters/:id",
          element: (
            <PaymentRoute>
              <Chapter />
            </PaymentRoute>
          ),
        },
        { path: "/create-book", element: <CreateBookPage /> },
        { path: "/success", element: <Success /> },
      ],
    },
    {
      element: <SignLayout />,
      children: [
        { path: "/register", element: <Register /> },
        { path: "/login", element: <Login /> },
        { path: "/questionnaire", element: <Questionnaire /> },
      ],
    },
    { path: "/", element: <LandingPage /> },
  ]);

  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  );
};

export default App;
