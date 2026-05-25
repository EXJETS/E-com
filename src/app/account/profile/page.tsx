"use client";

import { useState, useEffect } from "react";
import { CheckCircle2, AlertCircle } from "lucide-react";
import { useAuth } from "@/lib/auth";

export default function ProfilePage() {
  const { user, updateProfile } = useAuth();

  // ── Personal info state ──────────────────────────────────────────────
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [profileMsg, setProfileMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [savingProfile, setSavingProfile] = useState(false);

  // ── Password state ───────────────────────────────────────────────────
  const [currentPw, setCurrentPw] = useState("");
  const [newPw, setNewPw] = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [pwMsg, setPwMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [savingPw, setSavingPw] = useState(false);

  // Populate from user on mount / user change
  useEffect(() => {
    if (user) {
      setFirstName(user.firstName);
      setLastName(user.lastName);
      setPhone(user.phone ?? "");
    }
  }, [user]);

  if (!user) return null;

  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSavingProfile(true);
    setProfileMsg(null);
    updateProfile({ firstName, lastName, phone });
    setTimeout(() => {
      setSavingProfile(false);
      setProfileMsg({ type: "success", text: "Profile updated successfully." });
    }, 500);
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPwMsg(null);

    if (!currentPw) {
      setPwMsg({ type: "error", text: "Please enter your current password." });
      return;
    }
    if (newPw.length < 6) {
      setPwMsg({ type: "error", text: "New password must be at least 6 characters." });
      return;
    }
    if (newPw !== confirmPw) {
      setPwMsg({ type: "error", text: "Passwords do not match." });
      return;
    }

    setSavingPw(true);
    setTimeout(() => {
      setSavingPw(false);
      setCurrentPw("");
      setNewPw("");
      setConfirmPw("");
      setPwMsg({ type: "success", text: "Password changed successfully." });
    }, 1500);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[var(--dark)]">Profile & Security</h1>
        <p className="text-sm text-[var(--muted)] mt-1">
          Manage your personal information and password.
        </p>
      </div>

      {/* Personal Information */}
      <div className="bg-white rounded-xl border border-[var(--border)] overflow-hidden">
        <div className="px-6 py-4 border-b border-[var(--border)]">
          <h2 className="text-base font-semibold text-[var(--dark)]">Personal Information</h2>
        </div>
        <form onSubmit={handleProfileSubmit} className="px-6 py-6 space-y-5">
          {profileMsg && (
            <div
              className={`flex items-center gap-2 rounded-lg px-4 py-3 text-sm ${
                profileMsg.type === "success"
                  ? "bg-green-50 border border-green-200 text-green-700"
                  : "bg-red-50 border border-red-200 text-red-700"
              }`}
            >
              {profileMsg.type === "success" ? (
                <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
              )}
              {profileMsg.text}
            </div>
          )}

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[var(--text)] mb-1.5">
                First Name
              </label>
              <input
                type="text"
                required
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="border border-[var(--border)] rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[var(--accent)] w-full bg-white text-[var(--dark)]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[var(--text)] mb-1.5">
                Last Name
              </label>
              <input
                type="text"
                required
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="border border-[var(--border)] rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[var(--accent)] w-full bg-white text-[var(--dark)]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[var(--text)] mb-1.5">
              Email address
              <span className="ml-2 text-[var(--muted)] font-normal">(cannot be changed)</span>
            </label>
            <input
              type="email"
              readOnly
              value={user.email}
              className="border border-[var(--border)] rounded-lg px-4 py-3 text-sm w-full bg-[var(--light)] text-[var(--muted)] cursor-not-allowed"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[var(--text)] mb-1.5">
              Phone number <span className="font-normal text-[var(--muted)]">(optional)</span>
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+1 (555) 000-0000"
              className="border border-[var(--border)] rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[var(--accent)] w-full bg-white text-[var(--dark)]"
            />
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={savingProfile}
              className="bg-[var(--dark)] text-white rounded px-6 py-3 text-sm font-medium hover:bg-[var(--accent)] transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {savingProfile ? "Saving…" : "Save Changes"}
            </button>
          </div>
        </form>
      </div>

      {/* Change Password */}
      <div className="bg-white rounded-xl border border-[var(--border)] overflow-hidden">
        <div className="px-6 py-4 border-b border-[var(--border)]">
          <h2 className="text-base font-semibold text-[var(--dark)]">Change Password</h2>
        </div>
        <form onSubmit={handlePasswordSubmit} className="px-6 py-6 space-y-5">
          {pwMsg && (
            <div
              className={`flex items-center gap-2 rounded-lg px-4 py-3 text-sm ${
                pwMsg.type === "success"
                  ? "bg-green-50 border border-green-200 text-green-700"
                  : "bg-red-50 border border-red-200 text-red-700"
              }`}
            >
              {pwMsg.type === "success" ? (
                <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
              )}
              {pwMsg.text}
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-[var(--text)] mb-1.5">
              Current Password
            </label>
            <input
              type="password"
              value={currentPw}
              onChange={(e) => setCurrentPw(e.target.value)}
              placeholder="Enter current password"
              className="border border-[var(--border)] rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[var(--accent)] w-full bg-white text-[var(--dark)]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[var(--text)] mb-1.5">
              New Password
            </label>
            <input
              type="password"
              value={newPw}
              onChange={(e) => setNewPw(e.target.value)}
              placeholder="Min. 6 characters"
              className="border border-[var(--border)] rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[var(--accent)] w-full bg-white text-[var(--dark)]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[var(--text)] mb-1.5">
              Confirm New Password
            </label>
            <input
              type="password"
              value={confirmPw}
              onChange={(e) => setConfirmPw(e.target.value)}
              placeholder="Repeat new password"
              className="border border-[var(--border)] rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[var(--accent)] w-full bg-white text-[var(--dark)]"
            />
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={savingPw}
              className="bg-[var(--dark)] text-white rounded px-6 py-3 text-sm font-medium hover:bg-[var(--accent)] transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {savingPw ? "Updating…" : "Update Password"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
