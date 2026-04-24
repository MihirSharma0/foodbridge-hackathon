import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { Clock, Search, MessageSquareWarning, TrendingDown, Users, Utensils } from 'lucide-react';

const stats = [
  { value: '40%', label: 'of food produced is wasted globally' },
  { value: '8M+', label: 'tons of surplus food annually in India' },
  { value: '3hrs', label: 'average time for food to become unusable' },
];

const problems = [
  {
    icon: Clock,
    title: 'Timing Mismatch',
    description: 'Surplus food expires before it can reach those in need. The window for safe distribution is narrow.',
  },
  {
    icon: Search,
    title: 'Discovery Challenge',
    description: 'NGOs struggle to discover available food in real-time. They rely on outdated methods and guesswork.',
  },
  {
    icon: MessageSquareWarning,
    title: 'Fragmented Communication',
    description: 'Phone calls, WhatsApp groups, and spreadsheets create chaos. No single source of truth.',
  },
];

export const ProblemSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="problem" ref={ref} className="py-24 bg-cream-dark">
      <div className="container px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            The Problem Isn't Food —{' '}
            <span className="text-primary">It's Coordination</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Millions of meals are wasted while millions go hungry. The missing link? 
            A platform that connects surplus with need in real-time.
          </p>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
              className="bento-card text-center"
            >
              <div className="text-4xl md:text-5xl font-bold gradient-text mb-2">
                {stat.value}
              </div>
              <p className="text-muted-foreground">{stat.label}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Problem cards - Bento grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {problems.map((problem, index) => (
            <motion.div
              key={problem.title}
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.5 + index * 0.15 }}
              className="bento-card group"
            >
              <div className="w-14 h-14 rounded-2xl bg-destructive/10 flex items-center justify-center mb-5 group-hover:bg-destructive/20 transition-colors">
                <problem.icon className="w-7 h-7 text-destructive" />
              </div>
              <h3 className="text-xl font-semibold mb-3">{problem.title}</h3>
              <p className="text-muted-foreground">{problem.description}</p>
            </motion.div>
          ))}
        </div>

        {/* Visual separator */}
        <motion.div
          initial={{ opacity: 0, scaleX: 0 }}
          animate={isInView ? { opacity: 1, scaleX: 1 } : {}}
          transition={{ duration: 0.8, delay: 1 }}
          className="mt-16 flex items-center justify-center gap-4"
        >
          <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent flex-1 max-w-xs" />
          <div className="flex gap-2">
            <TrendingDown className="w-5 h-5 text-destructive" />
            <Users className="w-5 h-5 text-muted-foreground" />
            <Utensils className="w-5 h-5 text-primary" />
          </div>
          <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent flex-1 max-w-xs" />
        </motion.div>
      </div>
    </section>
  );
};
