import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
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
import CreateBookPage from "./CeateBook";
import PaymentRoute from "../components/route/PaymentRoute";
import NotFound from "./NotFound";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      // Never retry auth failures: the interceptor already logged the user out.
      retry: (failureCount, error: any) => {
        const status = error?.response?.status;
        if (status === 401 || status === 403 || status === 404) return false;
        return failureCount < 2;
      },
    },
  },
});

// Layout for protected routes
const Layout = () => (
  <ProtectedRoute>
    <div className="bg-[#DDD1BB] min-h-screen p-2 relative font-romie">
      <ModalProvider />
      <Outlet />
    </div>
  </ProtectedRoute>
);

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
  // Catch-all: an unknown URL used to render a blank page.
  { path: "*", element: <NotFound /> },
]);

const App: React.FC = () => (
  <QueryClientProvider client={queryClient}>
    {/* Mounted once at the root so toasts also appear on the auth pages. */}
    <ToasterProvider />
    <RouterProvider router={router} />
  </QueryClientProvider>
);

export default App;
