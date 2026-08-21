import { createFileRoute } from "@tanstack/react-router";
import { PublicPortal } from "@/components/hivelet/public-portal";
import { HERO_PHOTO } from "@/lib/hivelet-data";

const title = "Rooms for Rent in Sambat, Tanauan City | Fe Galang Da Silva Boarding House";
const description =
  "Browse 32 clean, secure rooms and apartments for rent in Brgy. Sambat, Tanauan City, Batangas. Rates from ₱4,500/month with submetered electricity.";

export const Route = createFileRoute("/public")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:image", content: HERO_PHOTO },
      { name: "twitter:image", content: HERO_PHOTO },
    ],
  }),
  component: PublicPortal,
});
