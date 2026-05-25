"use client";

import { useState, useCallback } from "react";
import { Plus, MapPin, Star, Trash2, CheckCircle2, AlertCircle, X } from "lucide-react";
import { useAuth } from "@/lib/auth";
import type { Address } from "@/lib/auth";

const COUNTRIES = [
  "United States",
  "Canada",
  "United Kingdom",
  "Australia",
  "Germany",
  "France",
  "Japan",
  "Other",
];

const emptyForm = {
  firstName: "",
  lastName: "",
  address1: "",
  address2: "",
  city: "",
  state: "",
  zip: "",
  country: "United States",
  isDefault: false,
};

type FormData = typeof emptyForm;

export default function AddressesPage() {
  const { getAddresses, saveAddress, updateAddress, deleteAddress, setDefaultAddress } = useAuth();

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<FormData>(emptyForm);
  const [successMsg, setSuccessMsg] = useState("");
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const addresses = getAddresses();

  const openAdd = () => {
    setEditingId(null);
    setForm(emptyForm);
    setShowForm(true);
  };

  const openEdit = (addr: Address) => {
    setEditingId(addr.id);
    setForm({
      firstName: addr.firstName,
      lastName: addr.lastName,
      address1: addr.address1,
      address2: addr.address2 ?? "",
      city: addr.city,
      state: addr.state,
      zip: addr.zip,
      country: addr.country,
      isDefault: addr.isDefault,
    });
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingId(null);
    setForm(emptyForm);
  };

  const flash = useCallback((msg: string) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(""), 3000);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      updateAddress(editingId, form);
      flash("Address updated.");
    } else {
      saveAddress(form);
      flash("Address saved.");
    }
    closeForm();
  };

  const handleDelete = (id: string) => {
    deleteAddress(id);
    setConfirmDeleteId(null);
    flash("Address deleted.");
  };

  const handleSetDefault = (id: string) => {
    setDefaultAddress(id);
    flash("Default address updated.");
  };

  const field = (key: keyof FormData, value: string | boolean) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[var(--dark)]">Addresses</h1>
          <p className="text-sm text-[var(--muted)] mt-1">
            Manage your saved shipping addresses.
          </p>
        </div>
        <button
          onClick={openAdd}
          className="flex items-center gap-2 bg-[var(--dark)] text-white rounded px-5 py-2.5 text-sm font-medium hover:bg-[var(--accent)] transition-colors"
        >
          <Plus className="w-4 h-4" /> Add Address
        </button>
      </div>

      {/* Success message */}
      {successMsg && (
        <div className="flex items-center gap-2 rounded-lg bg-green-50 border border-green-200 px-4 py-3 text-sm text-green-700">
          <CheckCircle2 className="w-4 h-4 flex-shrink-0" /> {successMsg}
        </div>
      )}

      {/* Add / Edit form */}
      {showForm && (
        <div className="bg-white rounded-xl border border-[var(--border)] overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--border)]">
            <h2 className="text-base font-semibold text-[var(--dark)]">
              {editingId ? "Edit Address" : "New Address"}
            </h2>
            <button
              onClick={closeForm}
              className="text-[var(--muted)] hover:text-[var(--dark)] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <form onSubmit={handleSubmit} className="px-6 py-6 space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[var(--text)] mb-1.5">First Name</label>
                <input
                  type="text"
                  required
                  value={form.firstName}
                  onChange={(e) => field("firstName", e.target.value)}
                  className="border border-[var(--border)] rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[var(--accent)] w-full bg-white text-[var(--dark)]"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[var(--text)] mb-1.5">Last Name</label>
                <input
                  type="text"
                  required
                  value={form.lastName}
                  onChange={(e) => field("lastName", e.target.value)}
                  className="border border-[var(--border)] rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[var(--accent)] w-full bg-white text-[var(--dark)]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[var(--text)] mb-1.5">Address Line 1</label>
              <input
                type="text"
                required
                value={form.address1}
                onChange={(e) => field("address1", e.target.value)}
                placeholder="123 Main St"
                className="border border-[var(--border)] rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[var(--accent)] w-full bg-white text-[var(--dark)]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[var(--text)] mb-1.5">
                Address Line 2 <span className="font-normal text-[var(--muted)]">(optional)</span>
              </label>
              <input
                type="text"
                value={form.address2}
                onChange={(e) => field("address2", e.target.value)}
                placeholder="Apt, suite, etc."
                className="border border-[var(--border)] rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[var(--accent)] w-full bg-white text-[var(--dark)]"
              />
            </div>

            <div className="grid sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[var(--text)] mb-1.5">City</label>
                <input
                  type="text"
                  required
                  value={form.city}
                  onChange={(e) => field("city", e.target.value)}
                  className="border border-[var(--border)] rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[var(--accent)] w-full bg-white text-[var(--dark)]"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[var(--text)] mb-1.5">State / Province</label>
                <input
                  type="text"
                  required
                  value={form.state}
                  onChange={(e) => field("state", e.target.value)}
                  placeholder="CA"
                  className="border border-[var(--border)] rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[var(--accent)] w-full bg-white text-[var(--dark)]"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[var(--text)] mb-1.5">ZIP / Postal Code</label>
                <input
                  type="text"
                  required
                  value={form.zip}
                  onChange={(e) => field("zip", e.target.value)}
                  placeholder="90001"
                  className="border border-[var(--border)] rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[var(--accent)] w-full bg-white text-[var(--dark)]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[var(--text)] mb-1.5">Country</label>
              <select
                value={form.country}
                onChange={(e) => field("country", e.target.value)}
                className="border border-[var(--border)] rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[var(--accent)] w-full bg-white text-[var(--dark)]"
              >
                {COUNTRIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <label className="flex items-center gap-2.5 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={form.isDefault}
                onChange={(e) => field("isDefault", e.target.checked)}
                className="w-4 h-4 rounded border-[var(--border)] accent-[var(--dark)]"
              />
              <span className="text-sm text-[var(--text)]">Set as default address</span>
            </label>

            <div className="flex gap-3 justify-end pt-2">
              <button
                type="button"
                onClick={closeForm}
                className="px-5 py-2.5 text-sm font-medium text-[var(--text)] border border-[var(--border)] rounded hover:bg-[var(--light)] transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-[var(--dark)] text-white rounded px-6 py-2.5 text-sm font-medium hover:bg-[var(--accent)] transition-colors"
              >
                {editingId ? "Update Address" : "Save Address"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Address cards */}
      {addresses.length === 0 && !showForm ? (
        <div className="bg-white rounded-xl border border-[var(--border)] py-20 flex flex-col items-center gap-4 text-center px-6">
          <div className="w-14 h-14 rounded-full bg-[var(--light)] flex items-center justify-center">
            <MapPin className="w-6 h-6 text-[var(--muted)]" />
          </div>
          <div>
            <p className="text-base font-semibold text-[var(--dark)]">No addresses saved</p>
            <p className="text-sm text-[var(--muted)] mt-1">
              Add a shipping address to speed up checkout.
            </p>
          </div>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 gap-4">
          {addresses.map((addr) => (
            <div
              key={addr.id}
              className={`bg-white rounded-xl border overflow-hidden ${
                addr.isDefault ? "border-[var(--dark)]" : "border-[var(--border)]"
              }`}
            >
              <div className="px-5 py-4 border-b border-[var(--border)] flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-[var(--muted)]" />
                  <span className="text-sm font-semibold text-[var(--dark)]">
                    {addr.firstName} {addr.lastName}
                  </span>
                </div>
                {addr.isDefault && (
                  <span className="flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold bg-[var(--dark)] text-white">
                    <Star className="w-3 h-3" /> Default
                  </span>
                )}
              </div>

              <div className="px-5 py-4 text-sm text-[var(--text)] space-y-0.5">
                <p>{addr.address1}</p>
                {addr.address2 && <p>{addr.address2}</p>}
                <p>{addr.city}, {addr.state} {addr.zip}</p>
                <p>{addr.country}</p>
              </div>

              <div className="px-5 py-3 border-t border-[var(--border)] flex flex-wrap gap-2">
                <button
                  onClick={() => openEdit(addr)}
                  className="text-xs font-medium text-[var(--accent)] hover:underline"
                >
                  Edit
                </button>
                {!addr.isDefault && (
                  <button
                    onClick={() => handleSetDefault(addr.id)}
                    className="text-xs font-medium text-[var(--text)] hover:text-[var(--dark)] hover:underline"
                  >
                    Set as Default
                  </button>
                )}
                {confirmDeleteId === addr.id ? (
                  <span className="flex items-center gap-2 ml-auto">
                    <span className="text-xs text-[var(--muted)]">Are you sure?</span>
                    <button
                      onClick={() => handleDelete(addr.id)}
                      className="text-xs font-semibold text-red-600 hover:underline"
                    >
                      Yes, delete
                    </button>
                    <button
                      onClick={() => setConfirmDeleteId(null)}
                      className="text-xs text-[var(--muted)] hover:underline"
                    >
                      Cancel
                    </button>
                  </span>
                ) : (
                  <button
                    onClick={() => setConfirmDeleteId(addr.id)}
                    className="ml-auto text-[var(--muted)] hover:text-red-600 transition-colors"
                    aria-label="Delete address"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
