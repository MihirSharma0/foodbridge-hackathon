import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Leaf, Eye, EyeOff, AlertCircle, Store, HandHeart, ArrowLeft, Key, HelpCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth, UserRole } from '@/contexts/AuthContext';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { toast } from 'sonner';

const demoCredentials = [
  { role: 'donor' as UserRole, username: 'donor1', password: 'donor123', label: 'Donor Demo' },
  { role: 'ngo' as UserRole, username: 'ngo1', password: 'ngo123', label: 'NGO Demo' },
];

const Login = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const {
    login,
    loginWithGoogle,
    signUp,
    isLoggedIn,
    user,
    needsProfile,
    isLoading: authLoading,
    getSecurityQuestion,
    verifySecurityAnswer,
    resetPasswordWithSecurityQuestion
  } = useAuth();

  const modeParam = searchParams.get('mode') as 'login' | 'signup' || 'login';
  const roleParam = searchParams.get('role') as UserRole || 'donor';

  const [mode, setMode] = useState<'login' | 'signup' | 'recovery'>(modeParam);
  const [role, setRole] = useState<UserRole>(roleParam);

  // Form fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Recovery fields
  const [recoveryStep, setRecoveryStep] = useState<1 | 2 | 3>(1);
  const [recoveryEmail, setRecoveryEmail] = useState('');
  const [securityQuestion, setSecurityQuestion] = useState('');
  const [securityAnswer, setSecurityAnswer] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showSignupPrompt, setShowSignupPrompt] = useState(false);

  // Redirect if already logged in and profile is complete
  useEffect(() => {
    if (isLoggedIn && !authLoading) {
      if (needsProfile) {
        navigate(`/complete-profile?role=${role}`);
      } else if (user) {
        if (user.role === 'admin') {
          navigate('/admin/dashboard');
        } else {
          navigate(user.role === 'donor' ? '/donor/dashboard' : '/ngo/dashboard');
        }
      }
    }
  }, [isLoggedIn, user, needsProfile, authLoading, navigate, role]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setShowSignupPrompt(false);
    setIsLoading(true);

    if (mode === 'login') {
      const result = await login(email, password);
      if (result.success) {
        // Auth state listener handles redirect
      } else {
        setError(result.error || 'Login failed');
        if (result.error?.includes('Account does not exist')) {
          setShowSignupPrompt(true);
        }
      }
    } else if (mode === 'signup') {
      const result = await signUp(email, password, role);
      if (result.success) {
        setError('');
        // Auth state listener will handle redirect once user is logged in
      } else {
        setError(result.error || 'Signup failed');
      }
    }

    setIsLoading(false);
  };

  const handleRecoverySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    if (recoveryStep === 1) {
      const result = await getSecurityQuestion(recoveryEmail);
      if (result.success && result.question) {
        setSecurityQuestion(result.question);
        setRecoveryStep(2);
      } else {
        setError(result.error || 'User not found');
      }
    } else if (recoveryStep === 2) {
      if (!securityAnswer.trim()) {
        setError('Please provide an answer');
      } else {
        const result = await verifySecurityAnswer(recoveryEmail, securityAnswer);
        if (result.success) {
          setRecoveryStep(3);
        } else {
          setError(result.error || 'Incorrect answer');
        }
      }
    } else if (recoveryStep === 3) {
      if (newPassword !== confirmPassword) {
        setError('Passwords do not match');
      } else if (newPassword.length < 6) {
        setError('Password must be at least 6 characters');
      } else {
        const result = await resetPasswordWithSecurityQuestion(recoveryEmail, securityAnswer, newPassword);
        if (result.success) {
          toast.success('Password reset successfully! Please sign in with your new password.');
          setMode('login');
          setRecoveryStep(1);
          setEmail(recoveryEmail);
        } else {
          setError(result.error || 'Failed to reset password');
        }
      }
    }

    setIsLoading(false);
  };

  const handleGoogleLogin = async () => {
    setError('');
    setIsLoading(true);
    const result = await loginWithGoogle(role);

    if (result.success) {
      if (result.needsProfile) {
        navigate(`/complete-profile?role=${role}`);
      }
    } else {
      setError(result.error || 'Google login failed');
    }
    setIsLoading(false);
  };

  const switchMode = (newMode: 'login' | 'signup' | 'recovery') => {
    setMode(newMode);
    setError('');
    setShowSignupPrompt(false);
    if (newMode !== 'recovery') {
      navigate(`/login?mode=${newMode}&role=${role}`, { replace: true });
    }
  };

  const switchRole = (newRole: UserRole) => {
    setRole(newRole);
    setError('');
    if (mode !== 'recovery') {
      navigate(`/login?mode=${mode}&role=${newRole}`, { replace: true });
    }
  };

  const handleDemoLogin = (cred: typeof demoCredentials[0]) => {
    setEmail(cred.username);
    setPassword(cred.password);
    setRole(cred.role);
    toast.success(`Filled credentials for ${cred.label}`);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-accent/5 p-4 relative">
      <div className="absolute top-4 right-4 z-50">
        <ThemeToggle />
      </div>

      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-[10%] w-64 h-64 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute bottom-20 right-[10%] w-64 h-64 rounded-full bg-accent/10 blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="glass rounded-3xl p-8 shadow-xl">
          <div className="flex justify-center mb-6">
            <button onClick={() => navigate('/')} className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
                <Leaf className="w-6 h-6 text-primary-foreground" />
              </div>
              <span className="font-bold text-xl text-foreground">FoodBridge</span>
            </button>
          </div>

          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold mb-2">
              {mode === 'login' ? 'Welcome Back' : mode === 'signup' ? 'Create Account' : 'Recover Password'}
            </h1>
            <p className="text-muted-foreground text-sm">
              {mode === 'login' ? 'Sign in to your account' : mode === 'signup' ? 'Join our community to help bridge the gap' : 'Recover your account using security questions'}
            </p>
          </div>

          {mode !== 'recovery' && (
            <div className="flex rounded-2xl bg-muted p-1 mb-8">
              <button
                onClick={() => switchRole('donor')}
                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-medium transition-all ${role === 'donor' ? 'bg-primary text-primary-foreground shadow-sm' : 'text-muted-foreground'}`}
              >
                <Store className="w-4 h-4" />
                <span>Donor</span>
              </button>
              <button
                onClick={() => switchRole('ngo')}
                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-medium transition-all ${role === 'ngo' ? 'bg-accent text-accent-foreground shadow-sm' : 'text-muted-foreground'}`}
              >
                <HandHeart className="w-4 h-4" />
                <span>NGO</span>
              </button>
              {role === 'admin' && (
                <button
                  className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-medium transition-all bg-primary text-primary-foreground shadow-sm"
                  disabled
                >
                  <Key className="w-4 h-4" />
                  <span>Admin</span>
                </button>
              )}
            </div>
          )}

          {mode === 'recovery' ? (
            <div className="space-y-4">
              <button
                onClick={() => {
                  setMode('login');
                  setRecoveryStep(1);
                }}
                className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1 mb-4"
              >
                <ArrowLeft className="w-3 h-3" /> Back to Login
              </button>

              <div className="mb-4">
                <div className="flex justify-between mb-2">
                  {[1, 2, 3].map((step) => (
                    <div
                      key={step}
                      className={`h-1 flex-1 mx-1 rounded-full transition-colors ${recoveryStep >= step ? 'bg-primary' : 'bg-muted'}`}
                    />
                  ))}
                </div>
              </div>

              <form onSubmit={handleRecoverySubmit} className="space-y-4">
                <AnimatePresence mode="wait">
                  {recoveryStep === 1 && (
                    <motion.div
                      key="step1"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-4"
                    >
                      <div className="space-y-2">
                        <Label htmlFor="recoveryEmail">Email Address / Username</Label>
                        <Input
                          id="recoveryEmail"
                          value={recoveryEmail}
                          onChange={(e) => setRecoveryEmail(e.target.value)}
                          placeholder="johndoe@example.com"
                          required
                        />
                      </div>
                      <Button type="submit" disabled={isLoading} className="w-full">
                        {isLoading ? 'Verifying...' : 'Continue'}
                      </Button>
                    </motion.div>
                  )}

                  {recoveryStep === 2 && (
                    <motion.div
                      key="step2"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-4"
                    >
                      <div className="p-4 bg-muted/50 rounded-2xl border border-dashed text-sm">
                        <p className="text-muted-foreground mb-1 flex items-center gap-2">
                          <HelpCircle className="w-4 h-4" /> Security Question
                        </p>
                        <p className="font-medium">{securityQuestion}</p>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="securityAnswer">Your Answer</Label>
                        <Input
                          id="securityAnswer"
                          value={securityAnswer}
                          onChange={(e) => setSecurityAnswer(e.target.value)}
                          placeholder="Type your answer here"
                          required
                          autoFocus
                        />
                      </div>
                      <Button type="submit" disabled={isLoading} className="w-full">
                        Continue
                      </Button>
                    </motion.div>
                  )}

                  {recoveryStep === 3 && (
                    <motion.div
                      key="step3"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-4"
                    >
                      <div className="space-y-2">
                        <Label htmlFor="newPassword">New Password</Label>
                        <Input
                          id="newPassword"
                          type="password"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          required
                          autoFocus
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="confirmPassword">Confirm New Password</Label>
                        <Input
                          id="confirmPassword"
                          type="password"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          required
                        />
                      </div>
                      <Button type="submit" disabled={isLoading} className="w-full">
                        {isLoading ? 'Resetting...' : 'Reset Password'}
                      </Button>
                    </motion.div>
                  )}
                </AnimatePresence>

                {error && (
                  <div className="text-destructive text-sm flex items-center gap-2 mt-2">
                    <AlertCircle className="w-4 h-4" />
                    <span>{error}</span>
                  </div>
                )}
              </form>
            </div>
          ) : (
            <>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">{mode === 'signup' ? 'Email Address' : 'Email Address / Username'}</Label>
                  <Input
                    id="email"
                    type={mode === 'signup' ? 'email' : 'text'}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Label htmlFor="password">Password</Label>
                    {mode === 'login' && (
                      <button
                        type="button"
                        onClick={() => setMode('recovery')}
                        className="text-xs text-primary hover:underline"
                      >
                        Forgot Password?
                      </button>
                    )}
                  </div>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <AnimatePresence>
                  {error && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="text-destructive text-sm flex items-center gap-2">
                      <AlertCircle className="w-4 h-4" />
                      <span>{error}</span>
                    </motion.div>
                  )}
                </AnimatePresence>

                <Button type="submit" disabled={isLoading} className="w-full">
                  {isLoading ? 'Processing...' : (mode === 'login' ? 'Sign In' : 'Create Account')}
                </Button>

                {showSignupPrompt && (
                  <Button variant="outline" className="w-full" onClick={() => switchMode('signup')}>
                    Don't have an account? Create one
                  </Button>
                )}
              </form>

              <div className="mt-6 text-center text-sm">
                <button
                  onClick={() => switchMode(mode === 'login' ? 'signup' : 'login')}
                  className="text-primary hover:underline"
                >
                  {mode === 'login' ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}
                </button>
              </div>
            </>
          )}
        </div>

        {mode !== 'recovery' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-6 p-4 glass rounded-2xl border-dashed"
          >
            <p className="text-xs font-medium text-muted-foreground mb-3 text-center uppercase tracking-wider">Demo Credentials</p>
            <div className="flex gap-2">
              {demoCredentials.map((cred) => (
                <Button
                  key={cred.role}
                  variant="outline"
                  size="sm"
                  className="flex-1 text-xs gap-2 py-5"
                  onClick={() => {
                    handleDemoLogin(cred);
                    if (mode === 'signup') setMode('login');
                  }}
                >
                  <Key className="w-3 h-3" />
                  <div className="text-left">
                    <div className="font-semibold">{cred.label}</div>
                    <div className="opacity-60">{cred.username}</div>
                  </div>
                </Button>
              ))}
            </div>
          </motion.div>
        )}

        <div className="text-center mt-6">
          <button onClick={() => navigate('/')} className="text-sm text-muted-foreground hover:text-foreground">
            ← Back to Home
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
