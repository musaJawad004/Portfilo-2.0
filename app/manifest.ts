import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Muhammad Musa Portfolio",
    short_name: "Muhammad Musa",
    description: "AI engineer and product builder creating production AI systems and mobile applications.",
    start_url: "/",
    display: "standalone",
    background_color: "#f4f4f0",
    theme_color: "#151515",
    icons: [
      {
        src: "/favicon-mm-white.svg",
        sizes: "any",
        type: "image/svg+xml",
      },
    ],
  };
}
