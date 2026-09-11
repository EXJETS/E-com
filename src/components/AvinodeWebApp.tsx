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
 * a `<div id="avinodeApp">` mount point and a `<script>` — which is exactly
 * what this component reproduces, with the script URL supplied by
 * NEXT_PUBLIC_AVINODE_WEBAPP_SRC so the snippet can be dropped in without a
 * code change.
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
    <div className="jet-card overflow-hidden p-4 sm:p-5">
      {/* Avinode injects the web app into this element. The id is fixed by
          Avinode's embed snippet — do not rename it. */}
      <div id="avinodeApp" />
      <Script src={WEBAPP_SRC} strategy="afterInteractive" />
    </div>
  );
}
