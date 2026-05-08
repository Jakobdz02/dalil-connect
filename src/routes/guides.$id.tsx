import { createFileRoute } from "@tanstack/react-router";
import GuidePublicProfile from "@/pages/public/GuidePublicProfile";

export const Route = createFileRoute("/guides/$id")({
  component: () => {
    const { id } = Route.useParams();
    return <GuidePublicProfile id={id} />;
  },
});
