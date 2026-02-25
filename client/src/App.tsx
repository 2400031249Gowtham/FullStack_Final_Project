import { Switch, Route, Redirect } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useCurrentUser } from "./hooks/use-auth";

// Pages & Layout
import NotFound from "@/pages/not-found";
import AuthPage from "@/pages/auth-page";
import AdminDashboard from "@/pages/admin-dashboard";
import StudentDashboard from "@/pages/student-dashboard";
import { Layout } from "@/components/layout";

// Protected Route Wrapper
function ProtectedRoute({ component: Component, allowedRole }: { component: any, allowedRole?: string }) {
  const { data: user, isLoading } = useCurrentUser();

  if (isLoading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  if (!user) return <Redirect to="/login" />;
  if (allowedRole && user.role !== allowedRole) {
    // Redirect to their respective dashboard if wrong role
    return <Redirect to={user.role === 'admin' ? '/admin' : '/student'} />;
  }

  return <Component />;
}

function Router() {
  const { data: user, isLoading } = useCurrentUser();

  if (isLoading) return null; // Wait for initial auth check

  return (
    <Switch>
      {/* Root redirect */}
      <Route path="/">
        {user 
          ? <Redirect to={user.role === 'admin' ? '/admin' : '/student'} /> 
          : <Redirect to="/login" />}
      </Route>

      <Route path="/login">
        {user 
          ? <Redirect to={user.role === 'admin' ? '/admin' : '/student'} /> 
          : <AuthPage />}
      </Route>

      <Route path="/admin">
        <ProtectedRoute component={AdminDashboard} allowedRole="admin" />
      </Route>
      
      <Route path="/student">
        <ProtectedRoute component={StudentDashboard} allowedRole="student" />
      </Route>

      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Layout>
          <Router />
        </Layout>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
