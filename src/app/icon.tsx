import { ImageResponse } from "next/og";
import { siteConfig } from "@/config/site";

export const size = {
  width: 512,
  height: 512,
};

export const contentType = "image/png";

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
          backgroundColor: "#943209",
          color: "#fff9f4",
          border: "16px solid #c88a28",
          fontSize: 180,
          fontWeight: 700,
          borderRadius: 64,
        }}
      >
        {siteConfig.shortName}
      </div>
    ),
    {
      ...size,
    }
  );
}
