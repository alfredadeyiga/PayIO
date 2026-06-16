import { useEffect } from "react";
import Button from "../components/ui/Button";

function NotFound() {
  useEffect(() => {
    document.title = "Not Found";
  }, []);
  
  return (
    <div className="flex flex-col items-center justify-center h-[100dvh] gap-12">
      <div className="flex flex-col items-center gap-4">
        <h1 className="text-8xl text-black font-bold">404</h1>
        <p className="text-card">Page not found</p>
      </div>

      <Button route="/dashboard">Go to Dashboard</Button>
    </div>
  );
}

export default NotFound;
