import { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ArrowRight, Check, CheckCircle2, Loader2, Quote, X } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

import { ROUTES } from '@/constants/routes';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { ApiError } from '@/lib/http';
import { cn } from '@/lib/utils';
import { Input } from '@/shared/components/common/Input';
import { StatusBanner } from '@/shared/components/common/StatusBanner';

type SubmitStatus = 'idle' | 'loading' | 'success' | 'error';

interface RegisterFormState {
    username: string;
    email: string;
    password: string;
    confirmPassword: string;
}

export function RegisterForm() {
    const navigate = useNavigate();
    const { register } = useAuth();

    const [formData, setFormData] = useState<RegisterFormState>({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    });

    const [status, setStatus] = useState<SubmitStatus>('idle');
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [avatarFailed, setAvatarFailed] = useState(false);

    const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
    opacity: 1,
    transition: {
        staggerChildren: 0.08,
        delayChildren: 0.12,
    },
    },
};

    const itemVariants = {
    hidden: { opacity: 0, y: 18 },
    visible: {
    opacity: 1,
    y: 0,
    transition: { type: 'spring' as const, damping: 24, stiffness: 110 },
    },
};

    const updateField = (field: keyof RegisterFormState, value: string) => {
    setFormData((previous) => ({ ...previous, [field]: value }));
};

    const validateForm = () => {
    if (!formData.username.trim()) {
    return 'Username is required.';
    }

    if (!formData.email.trim()) {
    return 'Email is required.';
    }

    if (!formData.password) {
    return 'Password is required.';
    }

    if (formData.password !== formData.confirmPassword) {
    return 'Password and confirm password must match.';
    }

    return null;
};

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const validationError = validateForm();

    if (validationError) {
    setStatus('error');
    setErrorMessage(validationError);
    window.setTimeout(() => setStatus('idle'), 1200);
    return;
    }

    setStatus('loading');
    setErrorMessage(null);

    try {
    await register({
        username: formData.username.trim(),
        email: formData.email.trim(),
        password: formData.password,
    });

    setStatus('success');
    window.setTimeout(() => navigate(ROUTES.onboarding), 700);
    } catch (error) {
    setStatus('error');
    setErrorMessage(error instanceof ApiError ? error.message : 'Unable to create your account right now.');
    window.setTimeout(() => setStatus('idle'), 1600);
    }
};

    return (
    <div className="min-h-screen bg-brand-surface">
    <div className="flex min-h-screen flex-col lg:flex-row">
        <motion.div
        className="z-10 flex w-full flex-1 flex-col justify-center px-6 py-12 md:px-16 lg:max-w-4xl lg:px-24"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        >
        <motion.div variants={itemVariants} className="mb-12">
            <p className="mb-8 font-serif text-2xl font-semibold text-brand-primary">Huaxia</p>

            <h1 className="mb-3 font-serif text-[40px] leading-tight text-brand-on-surface">
            Create Your Account
            </h1>

            <p className="max-w-md text-lg text-brand-on-surface/70">
            Join the Huaxia community to share experiences, ask questions, and discover student life in China.
            </p>
        </motion.div>

        <motion.form
            variants={itemVariants}
            onSubmit={handleSubmit}
            className="w-full max-w-md space-y-6"
        >
            {errorMessage ? <StatusBanner tone="error" message={errorMessage} /> : null}

            <Input
            label="Username"
            type="text"
            placeholder="Choose a username"
            autoComplete="username"
            value={formData.username}
            onChange={(event) => updateField('username', event.target.value)}
            required
            />

            <Input
            label="Email"
            type="email"
            placeholder="you@example.com"
            autoComplete="email"
            value={formData.email}
            onChange={(event) => updateField('email', event.target.value)}
            required
            />

            <Input
            label="Password"
            type="password"
            placeholder="Enter your password"
            autoComplete="new-password"
            value={formData.password}
            onChange={(event) => updateField('password', event.target.value)}
            required
            />

            <Input
            label="Confirm Password"
            type="password"
            placeholder="Re-enter your password"
            autoComplete="new-password"
            value={formData.confirmPassword}
            onChange={(event) => updateField('confirmPassword', event.target.value)}
            required
            />

            <motion.button
            type="submit"
            disabled={status === 'loading'}
            animate={status === 'error' ? { x: [0, -8, 8, -8, 8, 0] } : undefined}
            className={cn(
                'flex w-full items-center justify-center gap-2 rounded-xl py-4 text-lg font-semibold transition-all duration-300',
                status === 'idle' && 'bg-brand-primary text-white hover:bg-brand-primary-hover',
                status === 'loading' && 'cursor-wait bg-brand-primary/85 text-white',
                status === 'success' && 'bg-brand-success text-white',
                status === 'error' && 'bg-brand-danger text-white',
            )}
            >
            <AnimatePresence mode="wait">
                {status === 'idle' && (
                <motion.div
                    key="idle"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex items-center justify-center gap-2"
                >
                    <span>Join Community</span>
                    <ArrowRight className="h-5 w-5" />
                </motion.div>
                )}

                {status === 'loading' && (
                <motion.div
                    key="loading"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex items-center gap-2"
                >
                    <Loader2 className="h-5 w-5 animate-spin" />
                    <span>Creating Account...</span>
                </motion.div>
                )}

                {status === 'success' && (
                <motion.div
                    key="success"
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex items-center gap-2"
                >
                    <Check className="h-5 w-5" />
                    <span>Success</span>
                </motion.div>
                )}

                {status === 'error' && (
                <motion.div
                    key="error"
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex items-center gap-2"
                >
                    <X className="h-5 w-5" />
                    <span>Error</span>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          </motion.form>

          <motion.div
            variants={itemVariants}
            className="mt-12 flex w-full max-w-md flex-col items-center justify-between gap-4 border-t border-brand-outline/20 pt-8 sm:flex-row"
          >
            <Link
              to={ROUTES.login}
              className="text-sm font-semibold text-brand-primary transition-colors hover:text-brand-primary-hover"
            >
              Sign in instead
            </Link>

            <a
              href="#"
              className="text-sm text-brand-on-surface/65 transition-colors hover:text-brand-on-surface"
            >
              Terms of Service
            </a>
          </motion.div>
        </motion.div>

        <div className="relative hidden flex-1 items-center justify-center overflow-hidden bg-[#120607] lg:flex">
          <div
            className="absolute inset-0"
            style={{
              background: `
                radial-gradient(circle at 22% 24%, rgba(186,24,27,0.28), transparent 0 20%),
                radial-gradient(circle at 76% 30%, rgba(146,0,12,0.22), transparent 0 18%),
                radial-gradient(circle at 48% 82%, rgba(164,22,26,0.18), transparent 0 24%),
                linear-gradient(140deg, #0b0405 0%, #1a0709 45%, #120607 100%)
              `,
            }}
          />

          <div
            className="absolute inset-0 opacity-25"
            style={{
              backgroundImage:
                'repeating-linear-gradient(115deg, transparent 0 16px, rgba(186,24,27,0.18) 16px 18px, transparent 18px 48px)',
              transform: 'scale(1.5) rotate(-18deg)',
            }}
          />

          <div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage:
                'repeating-radial-gradient(circle at 30% 50%, rgba(255,180,171,0.5) 0 2px, transparent 2px 28px)',
            }}
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 28 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.45 }}
            className="relative z-10 mx-10 max-w-xl rounded-[1.75rem] border border-white/10 bg-brand-surface/95 p-10 shadow-2xl backdrop-blur-xl"
          >
            <Quote className="mb-6 h-12 w-12 text-brand-primary/80" />

            <p className="mb-8 font-serif text-[2rem] leading-[1.45] text-brand-on-surface">
              “Huaxia helped me find real advice from other international students before I arrived in China. I stopped guessing and started planning.”
            </p>

            <div className="flex items-center gap-4">
              <div className="relative">
                {avatarFailed ? (
                  <div className="flex h-14 w-14 items-center justify-center rounded-full border border-brand-outline bg-brand-neutral-soft font-semibold text-brand-primary">
                    AR
                  </div>
                ) : (
                  <img
                    src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=240&auto=format&fit=crop"
                    alt="Amina Rahman"
                    className="h-14 w-14 rounded-full border border-brand-outline object-cover"
                    onError={() => setAvatarFailed(true)}
                  />
                )}

                <div className="absolute -bottom-1 -right-1 rounded-full border-2 border-brand-surface bg-brand-primary p-1 text-white">
                  <CheckCircle2 className="h-3 w-3" />
                </div>
              </div>

              <div>
                <p className="text-xl font-semibold text-brand-on-surface">Amina Rahman</p>
                <p className="text-base text-brand-on-surface/65">
                  International Student · Wuhan
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}