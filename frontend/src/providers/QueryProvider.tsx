import React, { ReactNode } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// Initialize the Query Client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1, // Retry failed queries once
      refetchOnWindowFocus: false, // Disable refetching on window focus
      staleTime: 1000 * 60 * 5, // Data remains fresh for 5 minutes
    },
  },
});

interface QueryProviderProps {
  children: ReactNode;
}

// QueryProvider Component
const QueryProvider: React.FC<QueryProviderProps> = ({ children }) => {
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

export default QueryProvider;
