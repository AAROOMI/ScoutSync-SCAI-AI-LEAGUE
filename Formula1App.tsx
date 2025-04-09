import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import Formula1 from "@/pages/Formula1New";
import { queryClient } from "./lib/queryClient";

function Formula1App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="flex flex-col min-h-screen bg-black">
        <div className="fixed top-4 left-4 z-50">
          <a 
            href="/" 
            className="flex items-center gap-2 text-white hover:text-green-400 transition-colors duration-300"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m15 18-6-6 6-6"/>
            </svg>
            Back to Scout Sync
          </a>
        </div>
        <div className="flex-1 transition-all duration-300 relative overflow-x-hidden">
          <div className="absolute inset-0 bg-black z-0 pointer-events-none"></div>
          <div className="relative z-10">
            <Formula1 />
          </div>
        </div>
      </div>
      <Toaster />
    </QueryClientProvider>
  );
}

export default Formula1App;