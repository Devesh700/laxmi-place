import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteConfig.url.replace(/\/+$/, "");
  const lastModified = new Date();

  const routes = ["", "/rooms", "/restaurant", "/gallery", "/about", "/contact"];

  return routes.map((route) => ({
    url: `${base}${route}`,
    lastModified,
    changeFrequency: route === "" || route === "/rooms" ? "weekly" : "monthly",
    priority: route === "" ? 1 : 0.8,
  }));
}
