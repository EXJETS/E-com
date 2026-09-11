import Script from "next/script";

/**
 * Hosts an Avinode Web App (the embeddable search widget).
 *
 * Avinode renders the entire search experience itself — form, aircraft
 * categories, photos, estimated flight times and prices — and a visitor's
 * request arrives as a client lead on the Trips pages of your Avinode
 * Marketplace account. Nothing is fetched or rendered by this app.
 *
 * The embed is account-specific: Avinode generates it under
 * Company → Apps → (your web app) → Embed. That snippet is two parts —
 * a `<div id="avinodeApp">` mount point and a bootstrap `<script>` — which is
 * exactly what this component reproduces, with the script URL supplied by
 * NEXT_PUBLIC_AVINODE_WEBAPP_SRC so the snippet can be dropped in without a
 * code change. Paste the URL complete with any query parameters the snippet
 * carries (Avinode documents `analyticsReferrer`, for example).
 *
 * The token in an Avinode web app embed is a public, client-side credential by
 * design — unlike the Marketplace API tokens, which must stay server-side.
 * That is why this one is a NEXT_PUBLIC_ variable.
 */
export const WEBAPP_SRC = process.env.NEXT_PUBLIC_AVINODE_WEBAPP_SRC;

export function isWebAppConfigured(): boolean {
  return Boolean(WEBAPP_SRC);
}

export default function AvinodeWebApp() {
  if (!WEBAPP_SRC) return null;

  return (
    // `isolate` plus a raised z-index is deliberate. Avinode documents that the
    // web app's date picker and other expanding parts get clipped by host-site
    // styling with a higher stacking order — and this page has a sticky header
    // at z-40 that would do exactly that.
    <div className="jet-card isolate relative z-50 overflow-visible p-4 sm:p-5">
      {/* Avinode injects the web app into this element. The id is fixed by
          Avinode's embed snippet — do not rename it. */}
      <div id="avinodeApp" />
      <Script src={WEBAPP_SRC} strategy="afterInteractive" />
    </div>
  );
}

/**
 * Shown in development when no embed URL is set, so the local search form
 * standing in for the widget is never mistaken for the widget itself.
 */
export function WebAppNotConfiguredNotice() {
  if (process.env.NODE_ENV === "production" || isWebAppConfigured()) return null;

  return (
    <p className="mt-3 rounded-lg border border-[var(--jet-line)] bg-[var(--jet-gold-wash)] p-3 text-[12.5px] leading-relaxed text-[var(--jet-muted)]">
      <span className="font-medium text-[var(--jet-gold)]">
        Avinode web app not configured.
      </span>{" "}
      The form above is this app&apos;s own search, not the Avinode widget. Set{" "}
      <code>NEXT_PUBLIC_AVINODE_WEBAPP_SRC</code> to the script URL from Avinode
      (Company → Apps → your web app → Embed) to load the real one. This notice
      only appears in development.
    </p>
  );
}
