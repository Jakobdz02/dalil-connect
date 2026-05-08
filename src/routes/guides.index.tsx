import { createFileRoute } from "@tanstack/react-router";
import GuideList from "@/pages/public/GuideList";

export const Route = createFileRoute("/guides/")({ component: GuideList });
