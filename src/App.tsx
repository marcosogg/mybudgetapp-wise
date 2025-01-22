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
          <Route element={<AuthLayout />}>
            <Route path="/auth" element={<Auth />} />
          </Route>
          <Route element={<DashboardLayout />}>
            <Route path="/" element={<Transactions />} />
            <Route path="/transactions" element={<Transactions />} />
            <Route path="/categories" element={<Categories />} />
            <Route path="/import" element={<TransactionImport />} />
            <Route path="/analytics" element={<Analytics />} />
          </Route>
        </Routes>
      </Router>
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;