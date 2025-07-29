import { Button } from "@/components/ui/button";
import { Play, CheckCircle, QrCode, Users } from "lucide-react";
import heroImage from "@/assets/hero-attendance.jpg";

const Hero = () => {
  return (
    <section className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-primary/5 pt-20">
      <div className="container mx-auto px-4 py-16">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8 fade-in-up">
            <div className="space-y-4">
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium fade-in-up-delay-1">
                <CheckCircle className="w-4 h-4 mr-2" />
                Trusted by 500+ Educational Institutions
              </div>
              
              <h1 className="text-5xl lg:text-7xl font-bold text-foreground leading-tight fade-in-up-delay-2">
                Smart
                <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  {" "}Attendance
                </span>
                <br />
                Made Simple
              </h1>
              
              <p className="text-xl text-muted-foreground max-w-lg leading-relaxed fade-in-up-delay-3">
                Revolutionize classroom attendance with our intelligent system. Support both manual entry and QR code scanning for seamless student tracking.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 fade-in-up-delay-3">
              <Button className="btn-hero group">
                Get Started Free
                <QrCode className="ml-2 h-5 w-5 group-hover:rotate-12 transition-transform duration-300" />
              </Button>
              <Button variant="outline" className="btn-hero-outline group">
                <Play className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform duration-300" />
                Watch Demo
              </Button>
            </div>

            <div className="flex items-center space-x-8 pt-8 fade-in-up-delay-3">
              <div className="flex items-center space-x-2">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <QrCode className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <div className="font-semibold text-foreground">QR Scanning</div>
                  <div className="text-sm text-muted-foreground">Lightning fast</div>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <div className="p-2 bg-accent/10 rounded-lg">
                  <Users className="h-6 w-6 text-accent" />
                </div>
                <div>
                  <div className="font-semibold text-foreground">Manual Entry</div>
                  <div className="text-sm text-muted-foreground">Traditional method</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Image */}
          <div className="relative fade-in-up-delay-1">
            <div className="relative">
              <img 
                src={heroImage} 
                alt="Smart Attendance System" 
                className="w-full h-auto rounded-3xl shadow-2xl float-animation"
              />
              <div className="absolute -top-4 -left-4 w-24 h-24 bg-gradient-to-r from-primary to-accent rounded-2xl flex items-center justify-center pulse-glow">
                <QrCode className="h-12 w-12 text-primary-foreground" />
              </div>
              <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-gradient-to-r from-accent to-primary rounded-2xl flex items-center justify-center pulse-glow" style={{animationDelay: '1s'}}>
                <Users className="h-12 w-12 text-primary-foreground" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;