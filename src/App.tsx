import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useRoutes } from "react-router-dom";
import { MonthProvider } from "@/contexts/MonthContext";
import { routes } from "@/config/routes";

const queryClient = new QueryClient();

const AppRoutes = () => {
  return useRoutes(routes);
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <MonthProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </MonthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;