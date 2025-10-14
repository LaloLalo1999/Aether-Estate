import { enableMapSet } from "immer";
enableMapSet();
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { RouteErrorBoundary } from '@/components/RouteErrorBoundary';
import '@/index.css'
import { AppLayout } from '@/components/AppLayout';
import { HomePage } from '@/pages/HomePage';
import { ClientsPage } from '@/pages/ClientsPage';
import { PropertiesPage } from '@/pages/PropertiesPage';
import { AccountingPage } from '@/pages/AccountingPage';
import { ContractsPage } from '@/pages/ContractsPage';
import { PipelinePage } from "@/pages/PipelinePage";
const queryClient = new QueryClient();
const router = createBrowserRouter([
  {
    element: <AppLayout />,
    errorElement: <RouteErrorBoundary />,
    children: [
      { path: "/", element: <HomePage /> },
      { path: "/clients", element: <ClientsPage /> },
      { path: "/properties", element: <PropertiesPage /> },
      { path: "/accounting", element: <AccountingPage /> },
      { path: "/contracts", element: <ContractsPage /> },
      { path: "/pipeline", element: <PipelinePage /> },
    ]
  },
]);
// Do not touch this code
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>
    </ErrorBoundary>
  </StrictMode>,
)