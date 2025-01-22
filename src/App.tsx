import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { DashboardLayout } from "./components/layouts/DashboardLayout";
import { AuthLayout } from "./components/layouts/AuthLayout";
import Auth from "./pages/Auth";
import Transactions from "./pages/Transactions";
import Categories from "./pages/Categories";
import TransactionImport from "./pages/TransactionImport";
import Analytics from "./pages/Analytics";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Routes>
          <Route path="/auth" element={
            <AuthLayout>
              <Auth />
            </AuthLayout>
          } />
          <Route path="/" element={
            <DashboardLayout>
              <Transactions />
            </DashboardLayout>
          } />
          <Route path="/transactions" element={
            <DashboardLayout>
              <Transactions />
            </DashboardLayout>
          } />
          <Route path="/categories" element={
            <DashboardLayout>
              <Categories />
            </DashboardLayout>
          } />
          <Route path="/import" element={
            <DashboardLayout>
              <TransactionImport />
            </DashboardLayout>
          } />
          <Route path="/analytics" element={
            <DashboardLayout>
              <Analytics />
            </DashboardLayout>
          } />
        </Routes>
      </Router>
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;