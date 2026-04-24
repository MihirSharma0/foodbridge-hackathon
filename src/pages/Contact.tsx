import { motion } from 'framer-motion';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Mail, User, Sparkles } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const teamMembers = [
    { name: 'Mihir Sharma', email: 'sharmamihir012@gmail.com' },
];

const Contact = () => {
    return (
        <div className="min-h-screen bg-background flex flex-col">
            <Navbar />
            <main className="flex-grow pt-24 pb-12">
                <section className="container px-4 md:px-6">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="text-center max-w-3xl mx-auto mb-16"
                    >
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary mb-6">
                            <Sparkles className="w-4 h-4" />
                            <span className="text-sm font-medium">Meet the Team</span>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
                            Get in Touch
                        </h1>
                        <p className="text-lg text-muted-foreground">
                            FoodBridge is built by a passionate team dedicated to reducing food waste and supporting local communities.
                        </p>
                    </motion.div>

                    <div className="flex justify-center">
                        {teamMembers.map((member, index) => (
                            <motion.div
                                key={member.name}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                className="w-full max-w-md"
                            >
                                <Card className="glass overflow-hidden hover:shadow-xl transition-all duration-300 border-border/50 group">
                                    <CardContent className="p-6 text-center">
                                        <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 mx-auto group-hover:scale-110 transition-transform duration-300">
                                            <User className="w-8 h-8 text-primary" />
                                        </div>
                                        <h3 className="text-xl font-bold mb-2">{member.name}</h3>
                                        <div className="flex items-center justify-center gap-2 text-muted-foreground hover:text-primary transition-colors cursor-pointer break-all">
                                            <Mail className="w-4 h-4 flex-shrink-0" />
                                            <a href={`mailto:${member.email}`} className="text-sm">
                                                {member.email}
                                            </a>
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ))}
                    </div>
                </section>
            </main>
            <Footer />
        </div>
    );
};

export default Contact;
