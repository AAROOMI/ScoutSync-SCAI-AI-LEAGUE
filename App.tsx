import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import Dashboard from "@/pages/Dashboard";
import Analysis from "@/pages/Analysis";
import Players from "@/pages/Players";
import Football from "@/pages/Football";
import Sidebar from "@/components/layout/Sidebar";
import MobileNavigation from "@/components/layout/MobileNavigation";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Dashboard} />
      <Route path="/analysis" component={Analysis} />
      <Route path="/players" component={Players} />
      <Route path="/football" component={Football} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="flex flex-col lg:flex-row min-h-screen bg-[#f8f9ff]">
        <Sidebar />
        <div className="flex-1 lg:ml-64 transition-all duration-300 relative overflow-x-hidden">
          <div className="absolute inset-0 bg-[#f8f9ff] z-0 pointer-events-none"></div>
          <div className="relative z-10">
            <Router />
          </div>
        </div>
        <MobileNavigation />
      </div>
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;
