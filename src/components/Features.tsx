import { QrCode, ClipboardCheck, BarChart3, Shield, Clock, Users } from "lucide-react";
import qrFeature from "@/assets/qr-scan-feature.jpg";
import manualFeature from "@/assets/manual-attendance-feature.jpg";
import analyticsFeature from "@/assets/analytics-feature.jpg";

const Features = () => {
  const features = [
    {
      icon: QrCode,
      title: "QR Code Scanning",
      description: "Students scan unique QR codes for instant attendance marking. Fast, accurate, and contactless.",
      image: qrFeature,
      color: "from-primary to-primary/80"
    },
    {
      icon: ClipboardCheck,
      title: "Manual Attendance",
      description: "Traditional roll-call system with digital interface. Perfect for smaller classes or backup method.",
      image: manualFeature,
      color: "from-accent to-accent/80"
    },
    {
      icon: BarChart3,
      title: "Analytics Dashboard",
      description: "Comprehensive insights into attendance patterns, trends, and detailed reporting for administrators.",
      image: analyticsFeature,
      color: "from-primary to-accent"
    }
  ];

  const additionalFeatures = [
    {
      icon: Shield,
      title: "Secure & Reliable",
      description: "Bank-level security with encrypted data and reliable cloud infrastructure."
    },
    {
      icon: Clock,
      title: "Real-time Updates",
      description: "Instant attendance updates with live notifications to parents and administrators."
    },
    {
      icon: Users,
      title: "Multi-class Support",
      description: "Manage multiple classes and subjects with easy switching and bulk operations."
    }
  ];

  return (
    <section id="features" className="py-24 bg-gradient-to-b from-background to-secondary/30">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 fade-in-up">
          <h2 className="text-4xl lg:text-6xl font-bold text-foreground mb-6">
            Powerful
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              {" "}Features
            </span>
          </h2>
          <p className="text-xl text-muted-foreground leading-relaxed">
            Everything you need to streamline attendance management in one comprehensive platform
          </p>
        </div>

        {/* Main Features */}
        <div className="grid lg:grid-cols-3 gap-8 mb-16">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className={`feature-card group fade-in-up fade-in-up-delay-${index + 1}`}
            >
              <div className="relative mb-6 overflow-hidden rounded-xl">
                <img 
                  src={feature.image} 
                  alt={feature.title}
                  className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-20 group-hover:opacity-30 transition-opacity duration-300`}></div>
              </div>
              
              <div className="space-y-4">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${feature.color} flex items-center justify-center`}>
                  <feature.icon className="h-6 w-6 text-primary-foreground" />
                </div>
                
                <h3 className="text-2xl font-bold text-foreground">
                  {feature.title}
                </h3>
                
                <p className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Additional Features */}
        <div className="grid md:grid-cols-3 gap-8">
          {additionalFeatures.map((feature, index) => (
            <div 
              key={index} 
              className={`text-center p-8 rounded-2xl bg-card/50 border border-border/30 hover:bg-card/80 transition-all duration-300 fade-in-up fade-in-up-delay-${index + 1}`}
            >
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-r from-primary to-accent flex items-center justify-center">
                <feature.icon className="h-8 w-8 text-primary-foreground" />
              </div>
              
              <h3 className="text-xl font-bold text-foreground mb-3">
                {feature.title}
              </h3>
              
              <p className="text-muted-foreground">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;