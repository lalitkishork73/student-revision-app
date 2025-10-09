import React, { lazy, Suspense } from "react";
import { createBrowserRouter } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import Loading from "@/components/common/Loading";
import Home from "@/pages/Home"

const Dashboard = lazy(() => import("../pages/Dashboard"));
const PDFDetail = lazy(() => import("../pages/PDFDetail"));
const NotFound = lazy(() => import("../pages/NotFound"));
const Signup = lazy(() => import("../pages/Signup"));
const Login = lazy(() => import("../pages/Login"));

import Layout from "@/App";

const router = createBrowserRouter([
    { path: "/", element: <Home /> },
    { path: "/signup", element: <Suspense fallback={<Loading />}><Signup /></Suspense> },
    { path: "/login", element: <Suspense fallback={<Loading />}><Login /></Suspense> },
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
            { path: "/pdf", element: <PDFDetail /> },
        ],
    },
    { path: "*", element: <Suspense fallback={<Loading />}><NotFound /></Suspense> },
]);


export default router;
