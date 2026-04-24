import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { Upload, Eye, Truck, ArrowRight, CheckCircle2 } from 'lucide-react';

const steps = [
  {
    number: '01',
    icon: Upload,
    title: 'Providers Post Surplus',
    description: 'Restaurants, caterers, and event hosts post their surplus food with expiry details, quantity, and pickup location.',
    features: ['Quick 2-minute posting', 'Photo upload option', 'Automatic expiry alerts'],
  },
  {
    number: '02',
    icon: Eye,
    title: 'NGOs View Real-Time Availability',
    description: 'NGOs browse available donations nearby, filtering by type, quantity, and urgency to find what they need.',
    features: ['Location-based search', 'Veg/Non-veg filters', 'Expiry urgency indicators'],
  },
  {
    number: '03',
    icon: Truck,
    title: 'Pickups Happen Before Expiry',
    description: 'NGOs request pickups instantly. Donors confirm, and food reaches communities before it expires.',
    features: ['One-click requests', 'Status tracking', 'Collection confirmation'],
  },
];

export const HowItWorksSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="how-it-works" ref={ref} className="py-24 bg-background">
      <div className="container px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            How <span className="gradient-text">FoodBridge</span> Works
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            A simple three-step process that connects surplus food with those who need it most,
            all in real-time.
          </p>
        </motion.div>

        {/* Steps */}
        <div className="relative">
          {/* Connecting line - hidden on mobile */}
          <div className="hidden lg:block absolute top-[151px] left-[15%] right-[15%] h-0.5 bg-gradient-to-r from-primary via-emerald-light to-accent" />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
            {steps.map((step, index) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 40 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.2 + index * 0.2 }}
                className="relative"
              >
                {/* Step card */}
                <div className="bento-card relative z-10">
                  {/* Step number badge */}
                  <div className="absolute -top-4 left-6 bg-primary text-primary-foreground px-4 py-1 rounded-full text-sm font-bold">
                    Step {step.number}
                  </div>

                  {/* Icon */}
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center mb-6 mt-4">
                    <step.icon className="w-8 h-8 text-primary" />
                  </div>

                  {/* Content */}
                  <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
                  <p className="text-muted-foreground mb-5">{step.description}</p>

                  {/* Features */}
                  <div className="space-y-2">
                    {step.features.map((feature) => (
                      <div key={feature} className="flex items-center gap-2 text-sm">
                        <CheckCircle2 className="w-4 h-4 text-primary" />
                        <span className="text-muted-foreground">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Arrow between cards - only on large screens */}
                {index < steps.length - 1 && (
                  <div className="hidden lg:flex absolute top-32 -right-6 z-20 w-12 h-12 rounded-full bg-card border-2 border-border items-center justify-center">
                    <ArrowRight className="w-5 h-5 text-primary" />
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>

        {/* Bottom CTA hint */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 1 }}
          className="text-center mt-16"
        >
          <p className="text-muted-foreground">
            Ready to make a difference?{' '}
            <button
              onClick={() => document.getElementById('join-platform')?.scrollIntoView({ behavior: 'smooth' })}
              className="text-primary font-medium hover:underline"
            >
              Join FoodBridge today →
            </button>
          </p>
        </motion.div>
      </div>
    </section>
  );
};
