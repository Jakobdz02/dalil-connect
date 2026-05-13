import { createFileRoute } from "@tanstack/react-router";
import AlgeriaMap from "@/pages/public/AlgeriaMap";

export const Route = createFileRoute("/map")({
  head: () => ({
    meta: [
      { title: "Algeria Live Guide Map — Discover & Book Local Guides | Dalil" },
      {
        name: "description",
        content:
          "Explore Algeria city by city: tourism, study, business, food and safety insights — and book a verified local guide in one tap.",
      },
      { property: "og:title", content: "Algeria Live Guide Map | Dalil" },
      {
        property: "og:description",
        content:
          "Interactive map of Algeria with verified local guides, live insights, and personalized recommendations.",
      },
    ],
  }),
  component: AlgeriaMap,
});
