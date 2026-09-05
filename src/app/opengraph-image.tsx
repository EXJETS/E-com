import { ImageResponse } from "next/og";

export const alt = "Baker Brothers Plumbing, Air & Electric — Dallas–Fort Worth HVAC";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px",
          background: "linear-gradient(140deg, #0d2942 0%, #04101d 100%)",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: 16,
              background: "#0d8fd4",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 30,
              color: "#fff",
              fontWeight: 800,
            }}
          >
            BB
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span style={{ color: "#fff", fontSize: 27, fontWeight: 700 }}>Baker Brothers</span>
            <span style={{ color: "#7cc8f2", fontSize: 15, letterSpacing: 3 }}>
              PLUMBING · AIR · ELECTRIC
            </span>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <span style={{ color: "#fff", fontSize: 62, fontWeight: 800, lineHeight: 1.08 }}>
            Dallas–Fort Worth heating
          </span>
          <span style={{ color: "#fff", fontSize: 62, fontWeight: 800, lineHeight: 1.08 }}>
            &amp; air conditioning,
          </span>
          <span style={{ color: "#ff9d4d", fontSize: 62, fontWeight: 800, lineHeight: 1.08 }}>
            done right the first time.
          </span>
        </div>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span style={{ color: "rgba(255,255,255,0.6)", fontSize: 23 }}>
            Same-day service · Flat-rate pricing · No overtime charges
          </span>
          <span style={{ color: "#fff", fontSize: 30, fontWeight: 700 }}>(214) 892-2225</span>
        </div>
      </div>
    ),
    size,
  );
}
