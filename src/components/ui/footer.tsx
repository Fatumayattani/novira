import { Github, Heart } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="w-full bg-card/30 backdrop-blur-md border-t border-border mt-16">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-center md:text-left">
            <h3 className="text-lg font-bold text-primary mb-1">Novira</h3>
            <p className="text-sm text-muted-foreground">
              Transform your voice into living visual stories
            </p>
          </div>
          
          <div className="flex items-center gap-6">
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              <Github className="w-4 h-4" />
              GitHub
            </a>
            
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              Made with <Heart className="w-4 h-4 text-red-500" fill="currentColor" /> by Lovable
            </div>
          </div>
        </div>
        
        <div className="mt-6 pt-4 border-t border-border/50 text-center">
          <p className="text-xs text-muted-foreground">
            © 2024 Novira. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};