import { useState } from 'react';
import { AnimatePresence, motion, useMotionValue, useSpring, useTransform } from 'motion/react';
import { Check, Eye, EyeOff, Loader2, Sparkles, X } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

import { ROUTES } from '@/constants/routes';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { ApiError } from '@/lib/http';
import { cn } from '@/lib/utils';
import { Button } from '@/shared/components/common/Button';
import { Input } from '@/shared/components/common/Input';
import { StatusBanner } from '@/shared/components/common/StatusBanner';

type SubmitStatus = 'idle' | 'loading' | 'success' | 'error';

export function LoginForm() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [status, setStatus] = useState<SubmitStatus>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springX = useSpring(mouseX, { stiffness: 50, damping: 20 });
  const springY = useSpring(mouseY, { stiffness: 50, damping: 20 });

  const backgroundX = useTransform(springX, [-0.5, 0.5], ['-2%', '2%']);
  const backgroundY = useTransform(springY, [-0.5, 0.5], ['-2%', '2%']);
  const cardX = useTransform(springX, [-0.5, 0.5], ['-10px', '10px']);
  const cardY = useTransform(springY, [-0.5, 0.5], ['-10px', '10px']);

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    const { clientX, clientY, currentTarget } = event;
    const rect = currentTarget.getBoundingClientRect();
    const x = (clientX - rect.left) / rect.width - 0.5;
    const y = (clientY - rect.top) / rect.height - 0.5;
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus('loading');
    setErrorMessage(null);

    try {
      await login({ email, password, remember });
      setStatus('success');
      window.setTimeout(() => navigate(ROUTES.home), 700);
    } catch (error) {
      setStatus('error');
      setErrorMessage(error instanceof ApiError ? error.message : 'Unable to sign in right now.');
      window.setTimeout(() => setStatus('idle'), 1600);
    }
  };

  return (
    <div className="flex min-h-screen w-full overflow-hidden bg-brand-surface" onMouseMove={handleMouseMove}>
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="z-10 flex w-full items-center justify-center p-8 lg:w-1/2"
      >
        <div className="w-full max-w-[400px] space-y-8">
          <div className="mb-2 flex items-center gap-3 lg:hidden">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-primary text-white">
              <Sparkles size={24} />
            </div>
            <h2 className="font-serif text-2xl font-bold text-brand-primary">Huaxia</h2>
          </div>

          <div className="space-y-2 text-center lg:text-left">
            <h1 className="font-serif text-4xl tracking-tight text-brand-on-surface lg:text-5xl">Welcome</h1>
            <p className="text-lg text-brand-on-surface/60">
              Access your account and continue your journey with us
            </p>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            {errorMessage ? <StatusBanner tone="error" message={errorMessage} /> : null}

            <Input
              label="Email Address"
              placeholder="Enter your email address"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />

            <div className="relative">
              <Input
                label="Password"
                placeholder="Enter your password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
              />

              <button
                type="button"
                onClick={() => setShowPassword((previous) => !previous)}
                className="absolute right-4 top-[38px] text-brand-on-surface/40 transition-colors hover:text-brand-primary"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="group flex cursor-pointer items-center gap-2">
                <input
                  checked={remember}
                  onChange={(event) => setRemember(event.target.checked)}
                  type="checkbox"
                  className="rounded border-brand-outline text-brand-primary focus:ring-brand-primary"
                />
                <span className="text-brand-on-surface/70 transition-colors group-hover:text-brand-on-surface">
                  Keep me signed in
                </span>
              </label>

              <span className="font-semibold text-brand-primary/70">Reset password</span>
            </div>

            <motion.button
              type="submit"
              disabled={status === 'loading'}
              animate={status === 'error' ? { x: [0, -10, 10, -10, 10, 0] } : undefined}
              className={cn(
                'flex w-full items-center justify-center gap-3 rounded-xl py-4 text-lg font-semibold transition-all duration-300',
                status === 'idle' && 'bg-brand-primary text-white hover:bg-brand-primary-hover',
                status === 'loading' && 'cursor-wait bg-brand-primary/80 text-white',
                status === 'success' && 'bg-brand-success text-white shadow-lg',
                status === 'error' && 'bg-brand-danger text-white shadow-lg',
              )}
            >
              <AnimatePresence mode="wait">
                {status === 'idle' && (
                  <motion.span key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    Sign In
                  </motion.span>
                )}

                {status === 'loading' && (
                  <motion.div key="loading" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
                    <Loader2 className="animate-spin" />
                  </motion.div>
                )}

                {status === 'success' && (
                  <motion.div key="success" initial={{ scale: 0 }} animate={{ scale: 1 }} className="flex items-center gap-2">
                    <Check size={24} />
                    <span>Success</span>
                  </motion.div>
                )}

                {status === 'error' && (
                  <motion.div key="error" initial={{ scale: 0 }} animate={{ scale: 1 }} className="flex items-center gap-2">
                    <X size={24} />
                    <span>Error</span>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>

            <div className="relative flex items-center gap-4 py-2">
              <div className="h-px flex-1 bg-brand-outline/50" />
              <span className="text-sm font-medium lowercase text-brand-on-surface/40">or continue with</span>
              <div className="h-px flex-1 bg-brand-outline/50" />
            </div>

            <Button variant="outline" className="w-full gap-3 py-4" type="button" disabled>
              <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-brand-neutral-soft text-xs font-bold text-brand-primary">
                G
              </span>
              Continue with Google
            </Button>
          </form>

          <p className="text-center text-brand-on-surface/60">
            New to our platform?{' '}
            <Link
              to={ROUTES.register}
              className="font-bold text-brand-primary/70 transition-colors hover:text-brand-primary"
            >
              Create Account
            </Link>
          </p>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 1.05 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
        className="hidden h-screen p-6 lg:block lg:w-1/2"
      >
        <div className="relative h-full w-full overflow-hidden rounded-[2.5rem] shadow-2xl">
          <motion.div
            style={{ x: backgroundX, y: backgroundY, scale: 1.05 }}
            className="absolute inset-0 bg-gradient-to-br from-brand-neutral-soft via-white to-brand-outline/30"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-brand-on-surface/30 via-transparent to-transparent" />

          <motion.div
            style={{ x: cardX, y: cardY }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.8 }}
            className="glass-morphism absolute bottom-12 right-12 max-w-[340px] rounded-2xl p-6"
          >
            <div className="mb-4 flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full border border-white/20 bg-brand-primary text-sm font-bold text-white">
                SC
              </div>

              <div>
                <h4 className="text-base font-bold text-white">Sarah Chen</h4>
                <p className="text-xs text-white/60">@sarahdigital</p>
              </div>
            </div>

            <p className="font-serif text-sm leading-relaxed text-white/90 italic">
              "Amazing platform! The user experience is seamless and the features are exactly what I needed for my cultural research projects."
            </p>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}