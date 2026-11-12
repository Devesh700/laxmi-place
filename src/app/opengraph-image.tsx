import { ImageResponse } from "next/og";
import { siteConfig } from "@/config/site";

export const alt = `${siteConfig.name} — ${siteConfig.tagline}`;
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "64px",
          backgroundColor: "#faf7f2",
          color: "#1f1a17",
          border: "16px solid #8b5a2b",
        }}
      >
        <div
          style={{
            fontSize: 24,
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            color: "#8b5a2b",
            fontWeight: 600,
          }}
        >
          Hotel &amp; In-House Restaurant
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div style={{ fontSize: 68, fontWeight: 700, lineHeight: 1.1 }}>{siteConfig.name}</div>
          <div style={{ fontSize: 32, color: "#574c43" }}>{siteConfig.tagline}</div>
        </div>
        <div style={{ fontSize: 24, color: "#574c43" }}>
          {`${siteConfig.address.locality}, ${siteConfig.address.region}`}
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
