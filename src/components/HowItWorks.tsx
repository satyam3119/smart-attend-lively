import { QrCode, UserCheck, BarChart, ArrowRight } from "lucide-react";

const HowItWorks = () => {
  const steps = [
    {
      icon: QrCode,
      title: "Generate QR Code",
      description: "Teacher creates a unique QR code for each class session with just one click.",
      step: "01"
    },
    {
      icon: UserCheck,
      title: "Students Scan",
      description: "Students use their phones to scan the QR code or teacher marks manually.",
      step: "02"
    },
    {
      icon: BarChart,
      title: "Track & Analyze",
      description: "Real-time attendance data with comprehensive analytics and reporting.",
      step: "03"
    }
  ];

  return (
    <section id="how-it-works" className="py-24 bg-gradient-to-b from-secondary/30 to-background">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 fade-in-up">
          <h2 className="text-4xl lg:text-6xl font-bold text-foreground mb-6">
            How It
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              {" "}Works
            </span>
          </h2>
          <p className="text-xl text-muted-foreground leading-relaxed">
            Simple, fast, and effective attendance management in three easy steps
          </p>
        </div>

        {/* Steps */}
        <div className="relative">
          {/* Connection Line */}
          <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-primary via-accent to-primary opacity-30 transform -translate-y-1/2"></div>
          
          <div className="grid lg:grid-cols-3 gap-8 lg:gap-12">
            {steps.map((step, index) => (
              <div key={index} className={`relative fade-in-up fade-in-up-delay-${index + 1}`}>
                {/* Step Card */}
                <div className="bg-card/80 backdrop-blur-sm border border-border/50 rounded-3xl p-8 text-center hover:shadow-[var(--shadow-elegant)] hover:scale-105 transition-all duration-500 group">
                  {/* Step Number */}
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <div className="w-12 h-12 bg-gradient-to-r from-primary to-accent rounded-2xl flex items-center justify-center text-primary-foreground font-bold text-lg shadow-lg">
                      {step.step}
                    </div>
                  </div>

                  {/* Icon */}
                  <div className="w-20 h-20 mx-auto mb-6 mt-4 rounded-3xl bg-gradient-to-r from-primary/10 to-accent/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <step.icon className="h-10 w-10 text-primary" />
                  </div>

                  {/* Content */}
                  <h3 className="text-2xl font-bold text-foreground mb-4">
                    {step.title}
                  </h3>
                  
                  <p className="text-muted-foreground leading-relaxed">
                    {step.description}
                  </p>
                </div>

                {/* Arrow for desktop */}
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-6 transform -translate-y-1/2 z-10">
                    <div className="w-12 h-12 bg-background border-2 border-primary rounded-full flex items-center justify-center">
                      <ArrowRight className="h-6 w-6 text-primary" />
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center mt-16 fade-in-up-delay-3">
          <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-primary to-accent rounded-2xl text-primary-foreground font-semibold cursor-pointer hover:scale-105 transition-transform duration-300">
            Ready to get started? 
            <ArrowRight className="ml-2 h-5 w-5" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;