import { Button } from "@/components/ui/button";
import { QrCode, Users, BookOpen } from "lucide-react";

const Header = () => {
  return (
    <header className="fixed top-0 w-full bg-background/80 backdrop-blur-md border-b border-border/50 z-50">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-gradient-to-r from-primary to-accent rounded-xl">
            <QrCode className="h-8 w-8 text-primary-foreground" />
          </div>
          <div className="flex flex-col">
            <h1 className="text-2xl font-bold text-foreground">SmartAttend</h1>
            <p className="text-sm text-muted-foreground">Smart Attendance System</p>
          </div>
        </div>
        
        <nav className="hidden md:flex items-center space-x-8">
          <a href="#features" className="text-muted-foreground hover:text-foreground transition-colors duration-300">
            Features
          </a>
          <a href="#how-it-works" className="text-muted-foreground hover:text-foreground transition-colors duration-300">
            How It Works
          </a>
          <a href="#contact" className="text-muted-foreground hover:text-foreground transition-colors duration-300">
            Contact
          </a>
        </nav>

        <div className="flex items-center space-x-4">
          <Button variant="outline" className="hidden sm:flex" onClick={() => window.location.href = '/demo'}>
            Demo
          </Button>
          <Button className="btn-hero" onClick={() => window.location.href = '/auth'}>
            Teacher Login
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;