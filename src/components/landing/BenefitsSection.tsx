import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { 
  Store, Heart, TrendingUp, Clock, Award, 
  Users, Calendar, Package, Zap 
} from 'lucide-react';

const donorBenefits = [
  {
    icon: TrendingUp,
    title: 'Reduce Waste',
    description: 'Turn surplus into impact instead of landfill.',
  },
  {
    icon: Clock,
    title: 'Simple Posting',
    description: 'List donations in under 2 minutes.',
  },
  {
    icon: Award,
    title: 'Brand Goodwill',
    description: 'Build community reputation and trust.',
  },
  {
    icon: Package,
    title: 'Track Impact',
    description: 'See exactly how your donations help.',
  },
];

const ngoBenefits = [
  {
    icon: Zap,
    title: 'Faster Sourcing',
    description: 'Find available food in real-time, not hours.',
  },
  {
    icon: Calendar,
    title: 'Better Planning',
    description: 'Know what\'s available before dispatching teams.',
  },
  {
    icon: Users,
    title: 'Reliable Supply',
    description: 'Connect with multiple verified donors.',
  },
  {
    icon: Package,
    title: 'Less Coordination',
    description: 'No more endless calls and messages.',
  },
];

export const BenefitsSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="benefits" ref={ref} className="py-24 bg-cream-dark">
      <div className="container px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            Who Benefits from <span className="gradient-text">FoodBridge</span>?
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            A win-win platform where reducing waste meets serving communities.
          </p>
        </motion.div>

        {/* Two-column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Donors Column */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="bento-card h-full bg-gradient-to-br from-card to-primary/5 border-primary/20">
              {/* Header */}
              <div className="flex items-center gap-4 mb-8">
                <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center">
                  <Store className="w-7 h-7 text-primary" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold">For Restaurants & Donors</h3>
                  <p className="text-muted-foreground">Turn waste into impact</p>
                </div>
              </div>

              {/* Benefits grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {donorBenefits.map((benefit, index) => (
                  <motion.div
                    key={benefit.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.4, delay: 0.4 + index * 0.1 }}
                    className="p-4 rounded-2xl bg-card/50 border border-border/50"
                  >
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mb-3">
                      <benefit.icon className="w-5 h-5 text-primary" />
                    </div>
                    <h4 className="font-semibold mb-1">{benefit.title}</h4>
                    <p className="text-sm text-muted-foreground">{benefit.description}</p>
                  </motion.div>
                ))}
              </div>

              {/* Testimonial-style quote */}
              <div className="mt-6 p-4 rounded-2xl bg-primary/5 border border-primary/10">
                <p className="text-sm italic text-muted-foreground">
                  "We used to throw away 20kg of food daily. Now it feeds 50+ people through FoodBridge."
                </p>
                <p className="text-sm font-medium text-primary mt-2">— Restaurant Partner</p>
              </div>
            </div>
          </motion.div>

          {/* NGOs Column */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <div className="bento-card h-full bg-gradient-to-br from-card to-accent/5 border-accent/20">
              {/* Header */}
              <div className="flex items-center gap-4 mb-8">
                <div className="w-14 h-14 rounded-2xl bg-accent/10 flex items-center justify-center">
                  <Heart className="w-7 h-7 text-accent" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold">For NGOs & Charities</h3>
                  <p className="text-muted-foreground">Serve more, stress less</p>
                </div>
              </div>

              {/* Benefits grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {ngoBenefits.map((benefit, index) => (
                  <motion.div
                    key={benefit.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.4, delay: 0.5 + index * 0.1 }}
                    className="p-4 rounded-2xl bg-card/50 border border-border/50"
                  >
                    <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center mb-3">
                      <benefit.icon className="w-5 h-5 text-accent" />
                    </div>
                    <h4 className="font-semibold mb-1">{benefit.title}</h4>
                    <p className="text-sm text-muted-foreground">{benefit.description}</p>
                  </motion.div>
                ))}
              </div>

              {/* Testimonial-style quote */}
              <div className="mt-6 p-4 rounded-2xl bg-accent/5 border border-accent/10">
                <p className="text-sm italic text-muted-foreground">
                  "FoodBridge cut our food sourcing time by 70%. More time helping, less time coordinating."
                </p>
                <p className="text-sm font-medium text-accent mt-2">— NGO Coordinator</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
