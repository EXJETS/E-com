"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Zap, ShieldCheck, Wifi, Cpu } from "lucide-react";
import { useAuth } from "@/lib/auth";

const features = [
  { icon: ShieldCheck, text: "Secure account with encrypted storage" },
  { icon: Wifi, text: "Manage all your smart home devices" },
  { icon: Cpu, text: "Track orders and shipping in real-time" },
  { icon: Zap, text: "Save wishlists and addresses" },
];

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const res = await login(email, password);
    setLoading(false);
    if (res.success) {
      router.push("/account");
    } else {
      setError(res.error ?? "Login failed. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row pt-[var(--nav-h)]">
      {/* ── Left branding panel (desktop only) ─────────────────────── */}
      <div className="hidden md:flex md:w-1/2 lg:w-2/5 bg-[var(--dark)] flex-col justify-between p-12 xl:p-16">
        <div>
          <Link href="/" className="text-white font-bold text-2xl tracking-tight">
            Nex<span className="text-[var(--accent)]">Home</span>
          </Link>
        </div>

        <div className="space-y-8">
          <div>
            <h2 className="text-white text-3xl xl:text-4xl font-bold leading-tight">
              The future of<br />smart living.
            </h2>
            <p className="text-gray-400 mt-4 text-sm leading-relaxed">
              Sign in to manage your smart home devices, track orders, and explore the latest in home automation.
            </p>
          </div>

          <ul className="space-y-4">
            {features.map(({ icon: Icon, text }) => (
              <li key={text} className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0">
                  <Icon className="w-4 h-4 text-[var(--accent)]" />
                </div>
                <span className="text-gray-300 text-sm">{text}</span>
              </li>
            ))}
          </ul>
        </div>

        <p className="text-gray-600 text-xs">
          &copy; {new Date().getFullYear()} NexHome. All rights reserved.
        </p>
      </div>

      {/* ── Right form panel ────────────────────────────────────────── */}
      <div className="flex-1 flex items-center justify-center bg-[var(--light)] px-6 py-12">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <Link href="/" className="md:hidden block text-center mb-8 text-[var(--dark)] font-bold text-2xl tracking-tight">
            Nex<span className="text-[var(--accent)]">Home</span>
          </Link>

          <div className="bg-white rounded-xl border border-[var(--border)] p-8 shadow-sm">
            <div className="mb-6">
              <h1 className="text-xl font-bold text-[var(--dark)]">Sign in</h1>
              <p className="text-sm text-[var(--muted)] mt-1">
                Welcome back to NexHome
              </p>
            </div>

            {error && (
              <div className="mb-5 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[var(--text)] mb-1.5">
                  Email address
                </label>
                <input
                  type="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="border border-[var(--border)] rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[var(--accent)] w-full bg-white text-[var(--dark)]"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-semibold text-[var(--text)]">
                    Password
                  </label>
                  <button
                    type="button"
                    className="text-xs text-[var(--accent)] hover:underline"
                    onClick={() => {}}
                  >
                    Forgot password?
                  </button>
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="border border-[var(--border)] rounded-lg px-4 py-3 pr-11 text-sm focus:outline-none focus:border-[var(--accent)] w-full bg-white text-[var(--dark)]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--muted)] hover:text-[var(--text)] transition-colors"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[var(--dark)] text-white rounded px-6 py-3 text-sm font-medium hover:bg-[var(--accent)] transition-colors disabled:opacity-60 disabled:cursor-not-allowed mt-2"
              >
                {loading ? "Signing in…" : "Sign In"}
              </button>
            </form>

            <p className="text-center text-sm text-[var(--muted)] mt-6">
              Don&apos;t have an account?{" "}
              <Link href="/account/register" className="text-[var(--accent)] hover:underline font-medium">
                Create account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
