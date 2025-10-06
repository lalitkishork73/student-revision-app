import React, { lazy, Suspense } from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import Loading from '../components/common/Loading';

// const Login = lazy(() => import('@/pages/Login'));
const Dashboard = lazy(() => import('../App'));
const NotFound = lazy(() => import('../pages/NotFound'));

const router = createBrowserRouter([
    {
        path: '/',
        element: <Dashboard />,
        // element: <Navigate to="/dashboard" />,
    },
    // {
    //     path: '/login',
    //     element: (
    //         <Suspense fallback={<Loading />}>
    //             <Login />
    //         </Suspense>
    //     ),
    // },
    // {
    //     path: '/dashboard',
    //     element: (
    //         <ProtectedRoute>
    //             <Suspense fallback={<Loading />}>
    //                 <Dashboard />
    //             </Suspense>
    //         </ProtectedRoute>
    //     ),
    //     // children: [
    //     //     {
    //     //         path: '',
    //     //         element: <DashboardHome />,
    //     //     },
    //     //     {
    //     //         path: 'settings',
    //     //         element: <DashboardSettings />,
    //     //     },
    //     // ],
    // },
    {
        path: '*',
        element: (
            <Suspense fallback={<Loading />}>
                <NotFound />
            </Suspense>
        ),
    },
]);

export default router;
