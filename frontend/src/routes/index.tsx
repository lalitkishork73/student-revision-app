// src/router.tsx (or wherever you define router)
import { lazy, Suspense } from "react";
import { createBrowserRouter } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import Loading from "@/components/common/Loading";
import Home from "@/pages/Home";
import PDFSection from "@/pages/PDFSection";

const Dashboard = lazy(() => import("../pages/Dashboard"));
const NotFound = lazy(() => import("../pages/NotFound"));
const Signup = lazy(() => import("../pages/Signup"));
const Login = lazy(() => import("../pages/Login"));
const QuizPageLazy = lazy(() => import("@/pages/QuizPage"));
const ChatPageLazy = lazy(() => import("@/pages/ChatPage"));
import Layout from "@/App";

const router = createBrowserRouter([
  { path: "/", element: <Home /> },
  {
    path: "/signup",
    element: (
      <Suspense fallback={<Loading />}>
        <Signup />
      </Suspense>
    ),
  },
  {
    path: "/login",
    element: (
      <Suspense fallback={<Loading />}>
        <Login />
      </Suspense>
    ),
  },

  {
    element: (
      <ProtectedRoute>
        <Suspense fallback={<Loading />}>
          <Layout />
        </Suspense>
      </ProtectedRoute>
    ),
    children: [
      { path: "/dashboard", element: <Dashboard /> },

      // PDF section: nested child routes
      {
        path: "/pdf",
        element: <PDFSection />, // should render grid + <Outlet/>
        children: [
          { index: true, element: <div /> }, // /pdf default (grid)
          { path: ":id", element: <div /> }, // optional pdf detail landing if needed
          {
            path: ":id/quiz",
            element: (
              <Suspense fallback={<Loading />}>
                <QuizPageLazy />
              </Suspense>
            ),
          },
          {
            path: ":id/chat",
            element: (
              <Suspense fallback={<Loading />}>
                <ChatPageLazy />
              </Suspense>
            ),
          },
        ],
      },
    ],
  },

  {
    path: "*",
    element: (
      <Suspense fallback={<Loading />}>
        <NotFound />
      </Suspense>
    ),
  },
]);

// lazy import for pages (you must create ChatPage and QuizPage files)

export default router;
