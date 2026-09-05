import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

/** Brand mark used as the browser-tab icon. */
export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#071b2e",
          borderRadius: 7,
          color: "#38aeea",
          fontSize: 17,
          fontWeight: 800,
          fontFamily: "sans-serif",
          letterSpacing: -1,
        }}
      >
        BB
      </div>
    ),
    size,
  );
}
