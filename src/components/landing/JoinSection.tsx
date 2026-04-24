import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Store, HandHeart, ArrowRight } from 'lucide-react';

export const JoinSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const navigate = useNavigate();

  return (
    <section id="join-platform" ref={ref} className="py-24 bg-background relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent" />
      
      <div className="container px-4 md:px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            Join <span className="gradient-text">FoodBridge</span> Today
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Choose your role and become part of the solution. Whether you have food to share 
            or communities to serve, we're here to connect you.
          </p>
        </motion.div>

        {/* Role cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Donor Card */}
          <motion.button
            initial={{ opacity: 0, x: -40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            onClick={() => navigate('/login?role=donor')}
            className="group relative overflow-hidden rounded-3xl p-8 text-left transition-all duration-500 hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-4"
          >
            {/* Background gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/90 to-emerald-dark transition-all duration-500 group-hover:from-primary group-hover:to-emerald-light" />
            
            {/* Glow effect on hover */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-t from-white/10 to-transparent" />
            
            {/* Content */}
            <div className="relative z-10">
              <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center mb-6 group-hover:bg-white/30 transition-colors">
                <Store className="w-8 h-8 text-white" />
              </div>
              
              <h3 className="text-2xl font-bold text-white mb-3">
                I Want to Donate Food
              </h3>
              <p className="text-white/80 mb-6">
                For restaurants, caterers, event organizers, and anyone with surplus food to share.
              </p>
              
              <div className="flex items-center gap-2 text-white font-medium">
                <span>Get Started</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
              </div>
            </div>

            {/* Decorative circles */}
            <div className="absolute -bottom-8 -right-8 w-32 h-32 rounded-full bg-white/10 group-hover:scale-150 transition-transform duration-700" />
            <div className="absolute -top-4 -left-4 w-24 h-24 rounded-full bg-white/5 group-hover:scale-125 transition-transform duration-500" />
          </motion.button>

          {/* NGO Card */}
          <motion.button
            initial={{ opacity: 0, x: 40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
            onClick={() => navigate('/login?role=ngo')}
            className="group relative overflow-hidden rounded-3xl p-8 text-left transition-all duration-500 hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-4"
          >
            {/* Background gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-accent/90 to-amber-dark transition-all duration-500 group-hover:from-accent group-hover:to-amber-light" />
            
            {/* Glow effect on hover */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-t from-white/10 to-transparent" />
            
            {/* Content */}
            <div className="relative z-10">
              <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center mb-6 group-hover:bg-white/30 transition-colors">
                <HandHeart className="w-8 h-8 text-white" />
              </div>
              
              <h3 className="text-2xl font-bold text-white mb-3">
                I Represent an NGO
              </h3>
              <p className="text-white/80 mb-6">
                For food distribution organizations, community kitchens, and charitable foundations.
              </p>
              
              <div className="flex items-center gap-2 text-white font-medium">
                <span>Get Started</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
              </div>
            </div>

            {/* Decorative circles */}
            <div className="absolute -bottom-8 -right-8 w-32 h-32 rounded-full bg-white/10 group-hover:scale-150 transition-transform duration-700" />
            <div className="absolute -top-4 -left-4 w-24 h-24 rounded-full bg-white/5 group-hover:scale-125 transition-transform duration-500" />
          </motion.button>
        </div>

        {/* Demo credentials hint */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="text-center mt-12"
        >
          <div className="inline-block p-4 rounded-2xl bg-muted/50 border border-border">
            <p className="text-sm text-muted-foreground">
              <span className="font-medium">Demo Credentials:</span>{' '}
              <code className="bg-background px-2 py-0.5 rounded text-xs">donor1/donor123</code> or{' '}
              <code className="bg-background px-2 py-0.5 rounded text-xs">ngo1/ngo123</code>
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
