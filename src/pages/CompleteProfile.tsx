import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Leaf, Store, HandHeart, Phone, Building2, User, HelpCircle, Key } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth, UserRole } from '@/contexts/AuthContext';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

const CompleteProfile = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const { createProfile, needsProfile, user, isLoggedIn } = useAuth();

    const roleParam = searchParams.get('role') as UserRole;
    const [role, setRole] = useState<UserRole>(roleParam || 'donor');
    const [displayName, setDisplayName] = useState('');
    const [companyName, setCompanyName] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [securityQuestion, setSecurityQuestion] = useState('What was your first pet\'s name?');
    const [securityAnswer, setSecurityAnswer] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (isLoggedIn && !needsProfile && user) {
            navigate(user.role === 'donor' ? '/donor/dashboard' : '/ngo/dashboard');
        }
    }, [isLoggedIn, needsProfile, user, navigate]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        const result = await createProfile({
            displayName,
            role,
            companyName,
            phoneNumber,
            securityQuestion: {
                question: securityQuestion,
                answer: securityAnswer
            }
        });

        if (result.success) {
            navigate(role === 'donor' ? '/donor/dashboard' : '/ngo/dashboard');
        } else {
            setError(result.error || 'Failed to create profile');
        }
        setIsLoading(false);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-accent/5 p-4 relative">
            <div className="absolute top-4 right-4 z-50">
                <ThemeToggle />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md relative z-10"
            >
                <div className="glass rounded-3xl p-8 shadow-xl">
                    <div className="flex justify-center mb-6">
                        <div className="flex items-center gap-2">
                            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
                                <Leaf className="w-6 h-6 text-primary-foreground" />
                            </div>
                            <span className="font-bold text-xl text-foreground">FoodBridge</span>
                        </div>
                    </div>

                    <div className="text-center mb-6">
                        <h1 className="text-2xl font-bold mb-2">
                            Complete Your Profile - {role === 'donor' ? 'Donor' : 'NGO'}
                        </h1>
                        <p className="text-muted-foreground text-sm">
                            Just a few more details to get you started
                        </p>
                    </div>

                    <div className="space-y-6">
                        {!roleParam && (
                            <div className="flex rounded-2xl bg-muted p-1 mb-8">
                                <button
                                    onClick={() => setRole('donor')}
                                    className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-medium transition-all ${role === 'donor' ? 'bg-primary text-primary-foreground shadow-sm' : 'text-muted-foreground'}`}
                                >
                                    <Store className="w-4 h-4" />
                                    <span>Donor</span>
                                </button>
                                <button
                                    onClick={() => setRole('ngo')}
                                    className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-medium transition-all ${role === 'ngo' ? 'bg-accent text-accent-foreground shadow-sm' : 'text-muted-foreground'}`}
                                >
                                    <HandHeart className="w-4 h-4" />
                                    <span>NGO</span>
                                </button>
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="displayName">Your Full Name</Label>
                                <div className="relative">
                                    <Input
                                        id="displayName"
                                        value={displayName}
                                        onChange={(e) => setDisplayName(e.target.value)}
                                        className="pl-10"
                                        placeholder="John Doe"
                                        required
                                    />
                                    <User className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="companyName">
                                    {role === 'donor' ? 'Restaurant/Store Name' : 'NGO Name'}
                                </Label>
                                <div className="relative">
                                    <Input
                                        id="companyName"
                                        value={companyName}
                                        onChange={(e) => setCompanyName(e.target.value)}
                                        className="pl-10"
                                        placeholder={role === 'donor' ? 'Example Restaurant' : 'Helping Hands NGO'}
                                        required
                                    />
                                    <Building2 className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="phoneNumber">Phone Number</Label>
                                <div className="relative">
                                    <Input
                                        id="phoneNumber"
                                        type="tel"
                                        value={phoneNumber}
                                        onChange={(e) => setPhoneNumber(e.target.value)}
                                        className="pl-10"
                                        placeholder="+1 (555) 000-0000"
                                        required
                                    />
                                    <Phone className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="securityQuestion">Security Question</Label>
                                <div className="relative">
                                    <Select
                                        value={securityQuestion}
                                        onValueChange={setSecurityQuestion}
                                    >
                                        <SelectTrigger className="pl-10">
                                            <SelectValue placeholder="Select a security question" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="What was your first pet's name?">What was your first pet's name?</SelectItem>
                                            <SelectItem value="What is your mother's maiden name?">What is your mother's maiden name?</SelectItem>
                                            <SelectItem value="What city were you born in?">What city were you born in?</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <HelpCircle className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground z-10" />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="securityAnswer">Security Answer</Label>
                                <div className="relative">
                                    <Input
                                        id="securityAnswer"
                                        value={securityAnswer}
                                        onChange={(e) => setSecurityAnswer(e.target.value)}
                                        className="pl-10"
                                        placeholder="Your answer"
                                        required
                                    />
                                    <Key className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                                </div>
                            </div>

                            {error && (
                                <p className="text-destructive text-sm text-center">{error}</p>
                            )}

                            <Button type="submit" disabled={isLoading} className="w-full h-12 text-lg">
                                {isLoading ? 'Saving...' : 'Finish Setup'}
                            </Button>
                        </form>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default CompleteProfile;
