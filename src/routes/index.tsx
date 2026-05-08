import { createFileRoute } from "@tanstack/react-router";
import Home from "@/pages/public/Home";

export const Route = createFileRoute("/")({
  component: Home,
});
