import { Button } from "@/components/ui/button";
import { Github } from "lucide-react";

export const Navbar = () => {
  return (
    <nav className="w-full bg-card/50 backdrop-blur-md border-b border-border sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center">
          <h1 className="text-3xl italic font-extrabold text-primary tracking-wide drop-shadow-md">
          Novira AI
         </h1>

        </div>
        
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => window.open("https://github.com/Fatumayattani/novira", "_blank")}
            className="hover:glow-magic"
          >
            <Github className="h-5 w-5" />
          </Button>
          
          <Button 
            variant="magic"
            size="sm"
            className="px-6"
          >
            Login
          </Button>
        </div>
      </div>
    </nav>
  );
};