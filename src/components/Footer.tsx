import { QrCode, Mail, Phone, MapPin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-gradient-to-br from-primary/5 to-accent/5 border-t border-border/50">
      <div className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-r from-primary to-accent rounded-xl">
                <QrCode className="h-8 w-8 text-primary-foreground" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-foreground">SmartAttend</h3>
                <p className="text-sm text-muted-foreground">Smart Attendance System</p>
              </div>
            </div>
            <p className="text-muted-foreground leading-relaxed">
              Revolutionizing education with intelligent attendance management solutions for modern classrooms.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-foreground">Quick Links</h4>
            <div className="space-y-2">
              <a href="#features" className="block text-muted-foreground hover:text-primary transition-colors duration-300">Features</a>
              <a href="#how-it-works" className="block text-muted-foreground hover:text-primary transition-colors duration-300">How It Works</a>
              <a href="#pricing" className="block text-muted-foreground hover:text-primary transition-colors duration-300">Pricing</a>
              <a href="#support" className="block text-muted-foreground hover:text-primary transition-colors duration-300">Support</a>
            </div>
          </div>

          {/* Resources */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-foreground">Resources</h4>
            <div className="space-y-2">
              <a href="#" className="block text-muted-foreground hover:text-primary transition-colors duration-300">Documentation</a>
              <a href="#" className="block text-muted-foreground hover:text-primary transition-colors duration-300">API Reference</a>
              <a href="#" className="block text-muted-foreground hover:text-primary transition-colors duration-300">Help Center</a>
              <a href="#" className="block text-muted-foreground hover:text-primary transition-colors duration-300">Privacy Policy</a>
            </div>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-foreground">Contact Us</h4>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-primary" />
                <span className="text-muted-foreground">support@smartattend.com</span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-primary" />
                <span className="text-muted-foreground">+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center space-x-3">
                <MapPin className="h-5 w-5 text-primary" />
                <span className="text-muted-foreground">San Francisco, CA</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-border/50 mt-12 pt-8 text-center">
          <p className="text-muted-foreground">
            © 2024 SmartAttend. All rights reserved. Made with ❤️ for educators worldwide.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;